import io
import unittest
from unittest import mock
from types import SimpleNamespace

import numpy as np

try:
    import pymupdf
    from PIL import Image
    from backend.ml_engine.document_parser import DocumentParseError, extract_pdf_data
except ImportError:
    pymupdf = None
    Image = None
    DocumentParseError = ValueError
    extract_pdf_data = None

from backend.ml_engine.aicte_rules import evaluate_aicte_compliance
from backend.ml_engine import document_understanding
from backend.ml_engine import document_ocr
from backend.ml_engine.cross_document_validation import validate_cross_documents
from backend.ml_engine.faculty_detector import check_faculty_anomalies
from backend.ml_engine.nlp_extractor import extract_entities_from_text


class DocumentAnalysisTests(unittest.TestCase):
    def make_pdf(self, text: str) -> bytes:
        document = pymupdf.open()
        page = document.new_page()
        page.insert_text((72, 72), text)
        content = document.tobytes()
        document.close()
        return content

    def analyze(
        self,
        text: str,
        expected_number: str = "",
        text_extraction: str = "TEXT FOUND",
        expected_academic_year: str = "",
    ) -> dict:
        entities = extract_entities_from_text(text, "Kongu Engineering College", "Fire Safety Certificate")
        return evaluate_aicte_compliance(
            entities,
            {"seal_detected": False, "signature_detected": False, "details": []},
            {"tampering_score": 0.0, "flags": [], "suspicious_metadata": []},
            {"name": "Kongu Engineering College", "permanentId": "KEC001"},
            "Fire Safety Certificate",
            text_extraction=text_extraction,
            expected_document_number=expected_number,
            expected_academic_year=expected_academic_year,
        )

    @unittest.skipIf(pymupdf is None, "PyMuPDF is not installed")
    def test_extracts_pdf_text_and_reference(self) -> None:
        text = (
            "Kongu Engineering College\nFire Safety Certificate\n"
            "Certificate No: FSC/2026/1842\nFire and Rescue Services\n"
            "Issued on 12-06-2026\nValid until 12-06-2028\nAcademic Year 2026-2027"
        )
        parsed = extract_pdf_data(self.make_pdf(text), "certificate.pdf")
        entities = extract_entities_from_text(parsed["text"], "Kongu Engineering College", "Fire Safety Certificate")

        self.assertEqual(parsed["text_extraction"], "TEXT FOUND")
        self.assertEqual(entities["document_number"], "FSC/2026/1842")
        self.assertEqual(entities["institution_verification"], "MATCHED")
        self.assertEqual(entities["category"], "Fire & Safety")
        self.assertEqual(entities["expiry_date"], "12-06-2028")
        self.assertEqual(entities["academic_year"], "2026-2027")

    @unittest.skipIf(Image is None or extract_pdf_data is None, "Backend parsing dependencies are not installed")
    def test_scanned_image_requires_text_review_without_fabricated_findings(self) -> None:
        image_buffer = io.BytesIO()
        Image.new("RGB", (100, 100), "white").save(image_buffer, format="PNG")
        parsed = extract_pdf_data(image_buffer.getvalue(), "scan.png")
        result = self.analyze(parsed["text"], text_extraction=parsed["text_extraction"])

        self.assertEqual(parsed["text_extraction"], "NO TEXT LAYER")
        self.assertEqual(result["recommendation"], "NEEDS CLARIFICATION")
        self.assertGreater(result["summary"]["warnings"], 0)
        self.assertNotEqual(result["recommendation"], "NO ISSUES DETECTED")

    def test_mismatch_and_expiry_are_findings_not_officer_decisions(self) -> None:
        result = self.analyze(
            "Kongu Engineering College\nFire Safety Certificate\n"
            "Certificate No: FSC/2020/1234\nIssued on 12-06-2020\nValid until 12-06-2021",
            expected_number="FSC/2026/1842",
        )
        findings = {finding["field"]: finding for finding in result["findings"]}

        self.assertEqual(findings["Document reference number"]["verification"], "MISMATCH")
        self.assertEqual(findings["Validity / expiry date"]["verification"], "MISMATCH")
        self.assertEqual(result["recommendation"], "DEFICIENCY DETECTED")
        self.assertNotIn("officerDecision", result)

    def test_application_academic_year_mismatch_is_deterministic(self) -> None:
        entities = extract_entities_from_text(
            "Kongu Engineering College\nAcademic Year 2025-26\nFire Safety Certificate",
            "Kongu Engineering College",
            "Fire Safety Certificate",
        )
        result = evaluate_aicte_compliance(
            entities,
            {"seal_detected": False, "signature_detected": False, "details": []},
            {"tampering_score": 0.0, "flags": [], "suspicious_metadata": []},
            {"name": "Kongu Engineering College", "permanentId": "KEC001"},
            "Fire Safety Certificate",
            expected_academic_year="2026-2027",
        )
        findings = {item["field"]: item for item in result["findings"]}

        self.assertEqual(findings["Application academic year"]["verification"], "MISMATCH")
        self.assertEqual(result["recommendation"], "DEFICIENCY DETECTED")

    def test_semantic_model_ranks_document_type_and_sections(self) -> None:
        class FakeEmbeddingModel:
            def embed(self, inputs: list[str]):
                for value in inputs:
                    yield np.array(
                        [1.0, 0.0] if "fire safety" in value.lower() else [0.0, 1.0],
                        dtype=np.float32,
                    )

        with (
            mock.patch.object(document_understanding, "_get_model", return_value=FakeEmbeddingModel()),
            mock.patch.object(
                document_understanding,
                "get_ai_model_status",
                return_value={"provider": "test", "model": "test-model", "status": "ready"},
            ),
        ):
            result = document_understanding.analyze_document_understanding(
                "Fire safety certificate issued by Fire and Rescue Services.",
                "Fire & Safety",
            )

        self.assertEqual(result["status"], "complete")
        self.assertEqual(result["predictedDocumentType"], "Fire safety certificate")
        self.assertTrue(result["expectedCategoryMatch"])
        self.assertTrue(result["relevantSections"])

    def test_unavailable_semantic_model_is_explicit(self) -> None:
        with mock.patch.object(document_understanding, "_get_model", side_effect=RuntimeError("model missing")):
            result = document_understanding.analyze_document_understanding("Readable document text", "Other")

        self.assertEqual(result["status"], "unavailable")
        self.assertIn("Rule-based checks continue", result["message"])

    def test_cross_document_metadata_conflicts_are_findings(self) -> None:
        findings = validate_cross_documents(
            {"institutionId": "KEC001", "academicYear": "2026-2027", "documentNumber": "FSC/2026/1"},
            [
                {"institutionId": "OTHER", "academicYear": "2025-2026", "documentNumber": "FSC/2026/1"}
            ],
        )
        verification = {item["field"]: item["verification"] for item in findings}

        self.assertEqual(verification["Cross-document institution consistency"], "MISMATCH")
        self.assertEqual(verification["Cross-document academic year"], "MISMATCH")
        self.assertEqual(verification["Cross-document reference uniqueness"], "MISMATCH")

    @unittest.skipIf(Image is None, "Pillow is not installed")
    def test_ocr_extracts_recognized_image_text(self) -> None:
        class FakeOcrEngine:
            def __call__(self, _image):
                return SimpleNamespace(txts=("Fire Safety Certificate",), scores=(0.99,))

        with mock.patch.object(document_ocr, "_get_ocr_engine", return_value=FakeOcrEngine()):
            recognized_text = document_ocr._recognize_page(Image.new("RGB", (100, 100), "white"))

        self.assertEqual(recognized_text, "Fire Safety Certificate")

    @unittest.skipIf(extract_pdf_data is None, "PyMuPDF is not installed")
    def test_invalid_upload_is_rejected(self) -> None:
        with self.assertRaises(DocumentParseError):
            extract_pdf_data(b"not a supported document", "document.bin")

    def test_extracted_reference_conflict_becomes_advisory_finding(self) -> None:
        result = self.analyze(
            "Kongu Engineering College\nFire Safety Certificate\nCertificate No: FSC/2020/1234",
            expected_number="FSC/2026/1842",
        )
        findings = {finding["field"]: finding for finding in result["findings"]}

        self.assertEqual(findings["Document reference number"]["verification"], "MISMATCH")
        self.assertEqual(result["recommendation"], "DEFICIENCY DETECTED")
        self.assertNotIn("officerDecision", result)

    def test_faculty_checks_disclose_missing_registry(self) -> None:
        result = check_faculty_anomalies([{"name": "Example Faculty", "pan": "ABCDE1234F", "cadre": "Professor"}], "KEC001")

        self.assertFalse(result["registry_available"])
        self.assertEqual(result["reviewed_faculty"][0]["status"], "REVIEW REQUIRED")
        self.assertIsNone(result["cadre_analysis"]["compliant"])


if __name__ == "__main__":
    unittest.main()
