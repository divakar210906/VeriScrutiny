import re
import unicodedata


DATE_PATTERNS = (
    r"\b\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}\b",
    r"\b\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s,]+\d{4}\b",
    r"\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}[\s,]+\d{4}\b",
)

AUTHORITY_KEYWORDS = {
    "Fire and Rescue Services": ("fire and rescue", "fire department", "director of fire", "station officer", "divisional fire officer"),
    "Directorate of Town & Country Planning (DTCP)": ("town and country planning", "dtcp", "planning authority", "cmda"),
    "Public Works Department (PWD)": ("public works department", "pwd", "executive engineer", "superintending engineer"),
    "Affiliating University": ("anna university", "vtu", "jntu", "aktu", "university of madras", "affiliating university", "registrar"),
    "Revenue / Tahsildar": ("revenue divisional officer", "tahsildar", "district collector", "taluk office", "revenue department"),
    "AICTE / Regulatory": ("all india council for technical education", "aicte", "regional officer", "approval bureau"),
}

DOCUMENT_CATEGORIES = {
    "Fire & Safety": ("fire", "fire safety", "fire and rescue", "fsc"),
    "Academic / Affiliation": ("affiliation", "university", "approval letter", "extension of approval", "eoa"),
    "Infrastructure": ("land", "patta", "deed", "survey no", "dtcp", "pwd", "building", "occupancy"),
    "Governance & Finance": ("faculty", "fee", "finance", "declaration", "anti-ragging", "governance"),
}


def _normalize(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9]+", " ", normalized.lower()).strip()


def extract_entities_from_text(
    text: str,
    institution_name: str = "",
    expected_doc_type: str = "",
) -> dict:
    """Extract evidence from an embedded text layer using patterns, not an ML model."""
    text_lower = text.lower()

    doc_category = None
    for category, keywords in DOCUMENT_CATEGORIES.items():
        if any(keyword in text_lower for keyword in keywords):
            doc_category = category
            break
    if doc_category is None and text.strip():
        doc_category = "General Statutory Document"

    number_match = re.search(
        r"\b(?:certificate|ref(?:erence)?|document|doc|rc|order|dispatch)\s*"
        r"(?:serial\s*)?no\.?\s*[:#-]?\s*([A-Z0-9][A-Z0-9./_-]{2,39})",
        text,
        re.IGNORECASE,
    )
    if not number_match:
        number_match = re.search(r"\b[A-Z]{2,8}[/-][A-Z0-9/-]{3,30}\b", text)
    document_number = number_match.group(1).strip(" .,:;") if number_match and number_match.lastindex else (
        number_match.group(0).strip(" .,:;") if number_match else None
    )

    issuing_authority = next(
        (authority for authority, keywords in AUTHORITY_KEYWORDS.items() if any(keyword in text_lower for keyword in keywords)),
        None,
    )

    dates_found = []
    for pattern in DATE_PATTERNS:
        for match in re.findall(pattern, text, re.IGNORECASE):
            if match not in dates_found:
                dates_found.append(match)

    issue_match = re.search(
        r"(?:date\s+of\s+issue|issued\s+on|dated)\s*[:#-]?\s*("
        + "|".join(DATE_PATTERNS)
        + r")",
        text,
        re.IGNORECASE,
    )
    expiry_match = re.search(
        r"(?:valid\s+(?:up\s+to|until|through)|expires?\s+on|expiry\s+date|validity\s+up\s+to)"
        r"\s*[:#-]?\s*("
        + "|".join(DATE_PATTERNS)
        + r")",
        text,
        re.IGNORECASE,
    )
    academic_year_match = re.search(
        r"(?:academic\s+(?:year|session)|session|approval\s+period)\s*[:#-]?\s*"
        r"(20\d{2}\s*[-\u2013/]\s*(?:20)?\d{2})",
        text,
        re.IGNORECASE,
    )
    issue_date = issue_match.group(1) if issue_match else (dates_found[0] if dates_found else None)
    expiry_date = expiry_match.group(1) if expiry_match else (dates_found[-1] if len(dates_found) > 1 else None)
    academic_year = academic_year_match.group(1) if academic_year_match else None

    institution_verification = "REVIEW REQUIRED"
    institution_evidence = None
    if institution_name and text.strip():
        expected = _normalize(institution_name)
        extracted = _normalize(text)
        expected_tokens = [token for token in expected.split() if len(token) > 2]
        matched_tokens = sum(token in extracted.split() for token in expected_tokens)
        ratio = matched_tokens / len(expected_tokens) if expected_tokens else 0
        if expected and expected in extracted:
            institution_verification = "MATCHED"
            institution_evidence = institution_name
        elif ratio >= 0.7:
            institution_verification = "MATCHED"
            institution_evidence = institution_name
        elif matched_tokens:
            institution_verification = "REVIEW REQUIRED"
        else:
            candidate = next(
                (line.strip() for line in text.splitlines()
                 if re.search(r"\b(college|institute|institution|university)\b", line, re.IGNORECASE)),
                None,
            )
            institution_verification = "MISMATCH" if candidate else "NOT FOUND"
            institution_evidence = candidate

    return {
        "category": doc_category,
        "expected_category": next(
            (category for category, keywords in DOCUMENT_CATEGORIES.items()
             if any(keyword in expected_doc_type.lower() for keyword in keywords)),
            None,
        ),
        "document_number": document_number,
        "issuing_authority": issuing_authority,
        "issue_date": issue_date,
        "expiry_date": expiry_date,
        "academic_year": academic_year,
        "institution_verification": institution_verification,
        "institution_evidence": institution_evidence,
        "raw_dates": dates_found,
    }
