import re
from datetime import date, datetime


def _parse_date(value: str | None) -> date | None:
    if not value:
        return None
    cleaned = re.sub(r"(?<=\d)(st|nd|rd|th)\b", "", value.strip(), flags=re.IGNORECASE)
    for date_format in (
        "%d-%m-%Y", "%d/%m/%Y", "%d.%m.%Y", "%m-%d-%Y",
        "%Y-%m-%d", "%d-%m-%y", "%d/%m/%y", "%d.%m.%y",
        "%d %B %Y", "%d %b %Y", "%B %d, %Y", "%b %d, %Y",
    ):
        try:
            parsed = datetime.strptime(cleaned, date_format).date()
            if parsed.year < 100:
                return parsed.replace(year=parsed.year + (2000 if parsed.year < 50 else 1900))
            return parsed
        except ValueError:
            continue
    return None


def _normalize(value: str | None) -> str:
    return re.sub(r"[^a-z0-9]+", "", (value or "").lower())


def _normalize_academic_year(value: str | None) -> str:
    if not value:
        return ""
    normalized = re.sub(r"\s+", "", value).replace("\u2013", "-").replace("/", "-")
    match = re.fullmatch(r"(20\d{2})-(20\d{2}|\d{2})", normalized)
    if not match:
        return normalized
    start_year, end_year = match.groups()
    if len(end_year) == 2:
        end_year = f"{start_year[:2]}{end_year}"
    return f"{start_year}-{end_year}"


def evaluate_aicte_compliance(
    entities: dict,
    vision: dict,
    forensics: dict,
    institution_context: dict,
    doc_name: str,
    *,
    text_extraction: str = "TEXT FOUND",
    expected_document_number: str = "",
    expected_issuing_authority: str = "",
    expected_issue_date: str = "",
    expected_expiry_date: str = "",
    expected_academic_year: str = "",
    text_truncated: bool = False,
    ai_analysis: dict | None = None,
    additional_findings: list[dict[str, str]] | None = None,
) -> dict:
    """Run evidence-based checks; this produces review guidance, not a decision."""
    extracted_fields = []
    checklist = []

    def add_finding(field: str, value: str, verification: str, details: str) -> None:
        extracted_fields.append({"field": field, "value": value or "Not found in available text", "verification": verification})
        result = "PASS" if verification in {"FOUND", "MATCHED"} else "FAIL" if verification == "MISMATCH" else "WARNING"
        checklist.append({
            "id": f"CHECK-{len(checklist) + 1:02}",
            "order": len(checklist) + 1,
            "parameter": field,
            "requirement": "Evidence check only; confirm against the applicable authoritative requirement.",
            "extractedValue": value or "Not found in available text",
            "result": result,
            "remarks": details,
        })

    text_available = text_extraction in {"TEXT FOUND", "OCR TEXT FOUND", "TEXT + OCR FOUND"}
    detected_category = entities.get("category")
    expected_category = entities.get("expected_category")
    if not text_available:
        add_finding(
            "Readable document text",
            text_extraction,
            "REVIEW REQUIRED",
            "OCR did not produce readable text. Visual heuristics cannot verify text fields; review the source manually.",
        )
    else:
        if text_truncated:
            add_finding(
                "Text extraction coverage",
                "Text truncated at the configured processing limit",
                "REVIEW REQUIRED",
                "Some document text was omitted from analysis. Review the complete source manually.",
            )
        if detected_category and expected_category:
            category_status = "MATCHED" if detected_category == expected_category else "MISMATCH"
            category_details = (
                "Text keywords are consistent with the submitted document category."
                if category_status == "MATCHED"
                else f"Text keywords suggest {detected_category}, while the submitted type is categorized as {expected_category}."
            )
        else:
            category_status = "REVIEW REQUIRED"
            category_details = "Document type could not be classified reliably from the available text."
        add_finding("Document type", detected_category or "Not identified", category_status, category_details)

        academic_year = entities.get("academic_year")
        if academic_year or expected_academic_year:
            if not academic_year:
                academic_year_status = "REVIEW REQUIRED"
                academic_year_details = "An academic year was submitted but could not be found in the document text."
            elif expected_academic_year and _normalize_academic_year(academic_year) != _normalize_academic_year(expected_academic_year):
                academic_year_status = "MISMATCH"
                academic_year_details = "The academic year found in the document differs from the submitted application year."
            elif expected_academic_year:
                academic_year_status = "MATCHED"
                academic_year_details = "The academic year found in the document matches the submitted application year."
            else:
                academic_year_status = "FOUND"
                academic_year_details = "An academic year was found; no submitted application year was available for comparison."
            add_finding("Application academic year", academic_year, academic_year_status, academic_year_details)

        add_finding(
            "Institution name",
            entities.get("institution_evidence") or "Not found in available text",
            entities.get("institution_verification", "REVIEW REQUIRED"),
            "Institution name tokens were compared with the extracted text. This does not verify identity against an external registry.",
        )

        document_number = entities.get("document_number")
        number_status = "FOUND" if document_number else "NOT FOUND"
        number_details = "A reference-number pattern was found in the document text." if document_number else "No reference-number pattern was found in the document text."
        if document_number and expected_document_number:
            if _normalize(document_number) != _normalize(expected_document_number):
                number_status = "MISMATCH"
                number_details = "The number extracted from the file differs from the number entered at submission."
            else:
                number_status = "MATCHED"
                number_details = "The extracted number matches the number entered at submission."
        elif not document_number and expected_document_number:
            number_status = "REVIEW REQUIRED"
            number_details = "A number was entered at submission, but it could not be confirmed in the document text."
        add_finding("Document reference number", document_number or expected_document_number, number_status, number_details)

        authority = entities.get("issuing_authority")
        authority_status = "FOUND" if authority else "NOT FOUND"
        authority_details = "Authority-related keywords were found; authority authorization is not externally verified." if authority else "No recognized authority keywords were found."
        if expected_issuing_authority and authority:
            if _normalize(authority) in _normalize(expected_issuing_authority):
                authority_status = "MATCHED"
                authority_details = "The detected authority category is consistent with the submitted authority text; authorization is not externally verified."
            else:
                authority_status = "REVIEW REQUIRED"
                authority_details = "The extracted authority category differs from the submitted authority description; confirm manually."
        elif expected_issuing_authority:
            authority_details = "An authority was entered at submission but could not be identified in the document text."
            authority_status = "REVIEW REQUIRED"
        add_finding("Issuing authority", authority or expected_issuing_authority, authority_status, authority_details)

        issue_date = entities.get("issue_date")
        issue_status = "FOUND" if issue_date else "NOT FOUND"
        issue_value = _parse_date(issue_date)
        if issue_date and not issue_value:
            issue_status = "REVIEW REQUIRED"
        elif issue_value and issue_value > date.today():
            issue_status = "MISMATCH"
        if expected_issue_date and issue_value:
            expected_date = _parse_date(expected_issue_date)
            if expected_date and expected_date != issue_value:
                issue_status = "MISMATCH"
            elif expected_date and issue_status != "MISMATCH":
                issue_status = "MATCHED"
        add_finding(
            "Issue date",
            issue_date or expected_issue_date,
            issue_status,
            "Date parsed from document text; compare with the original and applicable filing requirements."
            if issue_date else "No issue date was found in the document text.",
        )

        expiry_date = entities.get("expiry_date")
        expiry_value = _parse_date(expiry_date)
        expiry_status = "FOUND" if expiry_date else "NOT FOUND"
        expiry_details = "Validity date found; applicability and required validity period need officer confirmation."
        if expiry_date and not expiry_value:
            expiry_status = "REVIEW REQUIRED"
        elif expiry_value and expiry_value < date.today():
            expiry_status = "MISMATCH"
            expiry_details = "The parsed validity date is in the past; confirm the date and applicable requirements."
        if expected_expiry_date and expiry_value:
            expected_date = _parse_date(expected_expiry_date)
            if expected_date and expected_date != expiry_value:
                expiry_status = "MISMATCH"
                expiry_details = "The validity date in the file differs from the date entered at submission."
            elif expected_date and expiry_status != "MISMATCH":
                expiry_status = "MATCHED"
        elif not expiry_date and expected_expiry_date:
            expiry_status = "REVIEW REQUIRED"
            expiry_details = "A validity date was entered at submission but could not be confirmed in the document text."
        add_finding("Validity / expiry date", expiry_date or expected_expiry_date, expiry_status, expiry_details)

        address_status = "FOUND" if entities.get("address_verification") == "MATCHED" else "REVIEW REQUIRED"
        add_finding(
            "Location reference",
            "Location keyword found" if address_status == "FOUND" else "Not confirmed",
            address_status,
            "A location keyword was found; no address registry comparison is available."
            if address_status == "FOUND" else "No registered address context or matching location was available for comparison.",
        )

    for label, key in (("Visible seal/stamp", "seal_detected"), ("Visible signature-like mark", "signature_detected")):
        detected = bool(vision.get(key))
        add_finding(
            label,
            "Visual mark detected" if detected else "No visual mark detected",
            "FOUND" if detected else "REVIEW REQUIRED",
            "A basic computer-vision heuristic detected a visual mark; this is not authentication."
            if detected else "The heuristic did not detect a mark. Confirm visually; absence may reflect scan quality or layout.",
        )

    tampering_score = float(forensics.get("tampering_score", 0.0))
    forensic_flags = forensics.get("flags", [])
    ela_applicable = forensics.get("ela_applicable", True)
    add_finding(
        "Image-compression anomaly indicator",
        f"Heuristic score {tampering_score:.1f}/100" if ela_applicable else "Not analyzed for this file format",
        "REVIEW REQUIRED" if not ela_applicable or tampering_score >= 30 or forensic_flags else "FOUND",
        "ELA is an image-compression heuristic. A flag is not proof of editing; an unflagged image is not proof of authenticity."
        + (f" ELA was not run because {forensics.get('ela_not_applicable_reason', 'the source format is not supported')}." if not ela_applicable else "")
        + (f" Indicators: {'; '.join(forensic_flags)}" if forensic_flags else ""),
    )
    metadata_flags = forensics.get("suspicious_metadata", [])
    add_finding(
        "PDF metadata",
        "Metadata indicator present" if metadata_flags else "No listed editor indicator found",
        "REVIEW REQUIRED" if metadata_flags else "FOUND",
        "Metadata can be changed or absent and cannot establish authenticity."
        + (f" Indicators: {'; '.join(metadata_flags)}" if metadata_flags else ""),
    )

    if ai_analysis:
        ai_status = (
            "MATCHED"
            if ai_analysis.get("status") == "complete"
            and ai_analysis.get("expectedCategoryMatch") is True
            else "REVIEW REQUIRED"
        )
        ai_value = ai_analysis.get("predictedDocumentType") or ai_analysis.get("message", "AI analysis unavailable")
        ai_details = ai_analysis.get("message", "Semantic document understanding was not available.")
        if ai_analysis.get("status") == "complete":
            ai_details = (
                f"The {ai_analysis.get('model')} model ranked this label by semantic similarity "
                f"(score {ai_analysis.get('similarity')}). Similarity is not a calibrated probability. "
                f"{ai_details}"
            )
        add_finding("AI document-type understanding", ai_value, ai_status, ai_details)

    for item in additional_findings or []:
        add_finding(
            item["field"],
            item["value"],
            item["verification"],
            item["details"],
        )

    passed = sum(item["result"] == "PASS" for item in checklist)
    warnings = sum(item["result"] == "WARNING" for item in checklist)
    failed = sum(item["result"] == "FAIL" for item in checklist)
    if failed:
        recommendation = "DEFICIENCY DETECTED"
        recommendation_reason = "One or more submitted values conflict with evidence in the document. Confirm the discrepancy before making an officer decision."
    elif warnings:
        recommendation = "NEEDS CLARIFICATION"
        recommendation_reason = "Some requested evidence could not be extracted or needs manual confirmation. This is not an approval or authenticity determination."
    else:
        recommendation = "NO ISSUES DETECTED"
        recommendation_reason = "No issues were identified by the available checks. This is not an approval or authenticity determination; officer review remains required."

    return {
        "extractedFields": extracted_fields,
        "findings": extracted_fields,
        "checklist": checklist,
        "recommendation": recommendation,
        "recommendationReason": recommendation_reason,
        "suggestedOfficerRemark": "",
        "tamperingScore": tampering_score,
        "sealDetected": bool(vision.get("seal_detected")),
        "signatureDetected": bool(vision.get("signature_detected")),
        "forensicFlags": forensic_flags,
        "summary": {"total": len(checklist), "passed": passed, "warnings": warnings, "failed": failed},
        "meta": {"documentType": doc_name, "textExtraction": text_extraction},
    }
