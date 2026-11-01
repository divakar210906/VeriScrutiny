import json
import logging
from datetime import datetime, timezone
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from starlette.concurrency import run_in_threadpool

from ml_engine.document_parser import DocumentParseError, extract_pdf_data
from ml_engine.forensics import compute_ela
from ml_engine.vision_detector import analyze_stamps_and_signatures
from ml_engine.nlp_extractor import extract_entities_from_text
from ml_engine.aicte_rules import evaluate_aicte_compliance
from ml_engine.faculty_detector import check_faculty_anomalies
from ml_engine.cross_document_validation import validate_cross_documents
from ml_engine.document_ocr import (
    OCRUnavailableError,
    extract_document_ocr,
    get_ocr_status,
)
from ml_engine.document_understanding import (
    AI_MODEL_NAME,
    analyze_document_understanding,
    get_ai_model_status,
)

logger = logging.getLogger(__name__)
MAX_UPLOAD_BYTES = 25 * 1024 * 1024
MAX_EXTRACTED_TEXT_CHARS = 2_000_000

app = FastAPI(
    title="VeriScrutiny Document Analysis Backend",
    description="Human-reviewed document scrutiny using local OCR, semantic embeddings, deterministic rules, and visual heuristics.",
    version="1.2.0"
)

# Enable CORS for React frontend (Vite port 5173 and preview port 4173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "VeriScrutiny Document Analysis",
        "version": "1.2.0",
        "capabilities": [
            "PDF embedded text extraction and RapidOCR for scanned PDF pages and PNG/JPEG files",
            f"Local semantic document-type ranking and evidence-section retrieval ({AI_MODEL_NAME})",
            "Deterministic document metadata and compliance rules",
            "Cross-document checks against peer submission metadata supplied by the browser",
            "PNG/JPEG visual heuristics",
            "ELA compression anomaly indicator (not proof of tampering)",
            "Faculty comparison only against optional caller-supplied records; no authoritative registry is configured"
        ],
        "analysisModel": get_ai_model_status(),
        "ocr": get_ocr_status(),
    }

@app.post("/api/scrutiny/analyze")
async def analyze_document(
    file: UploadFile = File(...),
    institution_name: str = Form("Kongu Engineering College"),
    institution_id: str = Form("KEC001"),
    doc_type: str = Form("Fire Safety Certificate"),
    application_id: str = Form(""),
    academic_year: str = Form(""),
    document_number: str = Form(""),
    issuing_authority: str = Form(""),
    issue_date: str = Form(""),
    expiry_date: str = Form(""),
    cross_documents_json: str = Form("[]"),
):
    """
    Run OCR, local semantic analysis, deterministic rules, cross-document checks,
    and visual heuristics. The response is advisory, never an officer decision.
    """
    try:
        try:
            peer_documents = json.loads(cross_documents_json)
        except json.JSONDecodeError as exc:
            raise HTTPException(status_code=422, detail="Peer document metadata must be valid JSON.") from exc
        if not isinstance(peer_documents, list) or len(peer_documents) > 100:
            raise HTTPException(status_code=422, detail="Provide at most 100 peer document records.")
        if any(not isinstance(item, dict) for item in peer_documents):
            raise HTTPException(status_code=422, detail="Each peer document record must be a JSON object.")

        file_bytes = await file.read(MAX_UPLOAD_BYTES + 1)
        if len(file_bytes) > MAX_UPLOAD_BYTES:
            raise HTTPException(status_code=413, detail="Document exceeds the 25 MB upload limit.")
        filename = file.filename or "uploaded_doc.pdf"

        # Parse supported binary formats and extract any embedded text.
        parsed = await run_in_threadpool(extract_pdf_data, file_bytes, filename)
        text_content = parsed["text"]
        text_extraction = parsed["text_extraction"]
        try:
            ocr_text, ocr_info = await run_in_threadpool(
                extract_document_ocr,
                file_bytes,
                parsed,
            )
        except OCRUnavailableError as exc:
            logger.exception("OCR could not be completed for %s", filename)
            ocr_text = ""
            ocr_info = {
                **get_ocr_status(),
                "status": "unavailable",
                "message": str(exc),
                "pagesProcessed": 0,
                "pagesTotal": parsed["page_count"],
                "truncated": False,
            }
        if ocr_text:
            text_content = "\n\n".join(part for part in (text_content, ocr_text) if part)
            text_extraction = "TEXT + OCR FOUND" if parsed["text"] else "OCR TEXT FOUND"
        elif not parsed["text"] and ocr_info.get("status") == "unavailable":
            text_extraction = "NO TEXT LAYER; OCR UNAVAILABLE"
        elif not parsed["text"]:
            text_extraction = "NO TEXT LAYER; OCR FOUND NO TEXT"
        text_truncated = (
            parsed["text_truncated"]
            or ocr_info.get("truncated", False)
            or len(text_content) > MAX_EXTRACTED_TEXT_CHARS
        )
        if len(text_content) > MAX_EXTRACTED_TEXT_CHARS:
            text_content = text_content[:MAX_EXTRACTED_TEXT_CHARS]

        rendered_image = parsed["rendered_image"]

        if parsed["file_type"] == "IMAGE" and parsed["image_format"] == "JPEG":
            tampering_score, ela_flags = compute_ela(rendered_image)
            ela_applicable = True
        else:
            tampering_score, ela_flags = 0.0, []
            ela_applicable = False
        forensic_info = {
            "tampering_score": tampering_score,
            "flags": ela_flags,
            "ela_applicable": ela_applicable,
            "ela_not_applicable_reason": f"The uploaded file is {parsed['file_type']}"
            + (f" ({parsed['image_format']})" if parsed["image_format"] else ""),
            "suspicious_metadata": parsed["suspicious_metadata"]
        }

        vision_info = analyze_stamps_and_signatures(rendered_image)
        entities = extract_entities_from_text(text_content, institution_name, doc_type)
        ai_analysis = await run_in_threadpool(
            analyze_document_understanding,
            text_content,
            entities.get("expected_category"),
        )
        institution_context = {
            "name": institution_name,
            "permanentId": institution_id,
            "applicationId": application_id,
            "academicYear": academic_year,
        }
        scrutiny_result = evaluate_aicte_compliance(
            entities=entities,
            vision=vision_info,
            forensics=forensic_info,
            institution_context=institution_context,
            doc_name=doc_type or filename,
            text_extraction=text_extraction,
            expected_document_number=document_number,
            expected_issuing_authority=issuing_authority,
            expected_issue_date=issue_date,
            expected_expiry_date=expiry_date,
            expected_academic_year=academic_year,
            text_truncated=text_truncated,
            ai_analysis=ai_analysis,
            additional_findings=validate_cross_documents(
                {
                    "institutionId": institution_id,
                    "academicYear": academic_year,
                    "documentNumber": document_number,
                },
                peer_documents,
            ),
        )

        scrutiny_result["meta"].update({
            "filename": filename,
            "pageCount": parsed["page_count"],
            "fileType": parsed["file_type"],
            "imageFormat": parsed["image_format"],
            "textTruncated": text_truncated,
            "ocr": ocr_info,
            "aiAnalysis": ai_analysis,
            "applicationId": application_id,
            "academicYear": academic_year,
            "analyzedAt": datetime.now(timezone.utc).isoformat(),
            "visionDetails": vision_info["details"],
            "forensics": forensic_info
        })
        scrutiny_result["aiAnalysis"] = ai_analysis

        return scrutiny_result

    except HTTPException:
        raise
    except DocumentParseError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Document analysis failed for %s", file.filename or "unnamed upload")
        raise HTTPException(status_code=500, detail="Document analysis failed. Check backend logs for details.") from exc

class FacultyCheckRequest(BaseModel):
    institution_id: str
    faculty_list: list[dict]
    registry_records: list[dict] | None = None

@app.post("/api/faculty/cross-check")
def verify_faculty_cross_check(payload: FacultyCheckRequest):
    """
    Compare supplied faculty data only against optional caller-provided records.
    No authoritative registry or cadre-ratio rules are configured.
    """
    return check_faculty_anomalies(
        payload.faculty_list,
        payload.institution_id,
        payload.registry_records,
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
