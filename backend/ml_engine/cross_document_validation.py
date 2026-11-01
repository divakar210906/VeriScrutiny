import re
from typing import Any


def _normalize(value: Any) -> str:
    return re.sub(r"[^a-z0-9]+", "", str(value or "").lower())


def validate_cross_documents(
    current_document: dict[str, Any],
    peer_documents: list[dict[str, Any]],
) -> list[dict[str, str]]:
    """Compare the active submission with peer metadata supplied by the same browser."""
    if not peer_documents:
        return [
            {
                "field": "Cross-document consistency",
                "value": "No peer submissions were provided",
                "verification": "REVIEW REQUIRED",
                "details": "Only this document's metadata was supplied; cross-document checks could not be completed.",
            }
        ]

    findings = []
    current_institution = _normalize(current_document.get("institutionId"))
    has_missing_institution = any(
        not _normalize(item.get("institutionId")) for item in peer_documents
    )
    peer_institutions = {
        _normalize(item.get("institutionId"))
        for item in peer_documents
        if _normalize(item.get("institutionId"))
    }
    if not current_institution or not peer_institutions or has_missing_institution:
        institution_status = "REVIEW REQUIRED"
        institution_details = "Institution identifiers are missing from the current or peer submission metadata."
    elif peer_institutions == {current_institution}:
        institution_status = "MATCHED"
        institution_details = "The institution identifier matches the identifiers in the supplied peer metadata."
    else:
        institution_status = "MISMATCH"
        institution_details = "One or more supplied peer records have a different institution identifier."
    findings.append(
        {
            "field": "Cross-document institution consistency",
            "value": current_document.get("institutionId") or "Not provided",
            "verification": institution_status,
            "details": institution_details,
        }
    )

    current_year = _normalize(current_document.get("academicYear"))
    has_missing_year = any(not _normalize(item.get("academicYear")) for item in peer_documents)
    peer_years = {
        _normalize(item.get("academicYear"))
        for item in peer_documents
        if _normalize(item.get("academicYear"))
    }
    if not current_year or not peer_years or has_missing_year:
        year_status = "REVIEW REQUIRED"
        year_details = "Academic-year metadata is missing from the current or peer submissions."
    elif peer_years == {current_year}:
        year_status = "MATCHED"
        year_details = "The academic year matches the supplied peer submission metadata."
    else:
        year_status = "MISMATCH"
        year_details = "The supplied peer documents contain a different academic year; confirm the application scope."
    findings.append(
        {
            "field": "Cross-document academic year",
            "value": current_document.get("academicYear") or "Not provided",
            "verification": year_status,
            "details": year_details,
        }
    )

    current_reference = _normalize(current_document.get("documentNumber"))
    has_missing_reference = any(
        not _normalize(item.get("documentNumber")) for item in peer_documents
    )
    peer_references = {
        _normalize(item.get("documentNumber"))
        for item in peer_documents
        if _normalize(item.get("documentNumber"))
    }
    if not current_reference or has_missing_reference:
        reference_status = "REVIEW REQUIRED"
        reference_details = "The active document has no reference number to compare."
    elif current_reference in peer_references:
        reference_status = "MISMATCH"
        reference_details = "The active document reference number also appears in supplied peer metadata."
    else:
        reference_status = "MATCHED"
        reference_details = "The active reference number is distinct within the supplied peer metadata."
    findings.append(
        {
            "field": "Cross-document reference uniqueness",
            "value": current_document.get("documentNumber") or "Not provided",
            "verification": reference_status,
            "details": reference_details,
        }
    )
    return findings
