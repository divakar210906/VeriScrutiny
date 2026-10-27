import re
from datetime import datetime

# Regex pattern collections for Indian statutory certificates
DATE_PATTERNS = [
    r"\b(\d{1,2}[-/\.]\d{1,2}[-/\.]\d{2,4})\b",
    r"\b(\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s,]+\d{4})\b",
    r"\b((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}[\s,]+\d{4})\b"
]

AUTHORITY_KEYWORDS = {
    "Fire and Rescue Services": ["fire and rescue", "fire department", "director of fire", "station officer", "divisional fire officer"],
    "Directorate of Town & Country Planning (DTCP)": ["town and country planning", "dtcp", "member secretary", "planning authority", "cmda"],
    "Public Works Department (PWD)": ["public works department", "pwd", "executive engineer", "superintending engineer"],
    "Affiliating University": ["anna university", "vtu", "jntu", "aktu", "university of madras", "affiliating university", "registrar"],
    "Revenue / Tahsildar": ["revenue divisional officer", "tahsildar", "district collector", "taluk office", "revenue department"],
    "AICTE / Regulatory": ["all india council for technical education", "aicte", "regional officer", "approval bureau"]
}

def extract_entities_from_text(text: str, institution_name: str = "") -> dict:
    """
    Extracts structured fields from parsed document text using contextual NLP & pattern extraction.
    """
    text_lower = text.lower()
    
    # 1. Document Category & Classification
    doc_category = "General Statutory Document"
    if "fire" in text_lower or "fsc" in text_lower or "rescue services" in text_lower:
        doc_category = "Fire & Safety"
    elif "affiliation" in text_lower or "provisional affiliation" in text_lower or "university" in text_lower:
        doc_category = "Academic / Affiliation"
    elif "land" in text_lower or "patta" in text_lower or "deed" in text_lower or "survey no" in text_lower or "dtcp" in text_lower or "pwd" in text_lower or "building" in text_lower:
        doc_category = "Infrastructure"
    elif "faculty" in text_lower or "declaration" in text_lower or "cadre ratio" in text_lower or "pay scale" in text_lower:
        doc_category = "Governance & Finance"

    # 2. Document / Certificate Serial Number
    doc_number = None
    num_matches = re.findall(
        r"(?:Certificate\s*No\.?|Ref\s*No\.?|Doc(?:ument)?\s*No\.?|Rc\.?\s*No\.?|Order\s*No\.?|Dispatch\s*No\.?)[:\s]*([A-Z0-9\-\./]{4,30})",
        text,
        re.IGNORECASE
    )
    if num_matches:
        doc_number = num_matches[0].strip()
    else:
        # Fallback to search standard serial masks like FSC/2026/1842 or AU/AFF/2026/8921
        standard_mask = re.findall(r"\b([A-Z]{2,6}[/-][0-9]{4}[/-][0-9A-Z]{3,10})\b", text)
        if standard_mask:
            doc_number = standard_mask[0]

    # 3. Issuing Statutory Authority
    issuing_authority = None
    for auth_name, keywords in AUTHORITY_KEYWORDS.items():
        if any(kw in text_lower for kw in keywords):
            issuing_authority = auth_name
            break

    # 4. Dates: Issue Date & Expiry / Validity Date
    dates_found = []
    for pat in DATE_PATTERNS:
        matches = re.findall(pat, text, re.IGNORECASE)
        for m in matches:
            if m not in dates_found:
                dates_found.append(m)

    issue_date = None
    expiry_date = None

    # Search for contextual date anchors
    issue_match = re.search(r"(?:dated|date of issue|issued on)[:\s]*([A-Za-z0-9\s,/\.\-]{6,25})", text, re.IGNORECASE)
    if issue_match:
        issue_date = issue_match.group(1).strip()
    elif dates_found:
        issue_date = dates_found[0]

    expiry_match = re.search(r"(?:valid up to|valid until|expires on|validity)[:\s]*([A-Za-z0-9\s,/\.\-]{6,25})", text, re.IGNORECASE)
    if expiry_match:
        expiry_date = expiry_match.group(1).strip()
    elif len(dates_found) > 1:
        expiry_date = dates_found[-1]

    # 5. Institution Name Verification
    inst_match = "NOT FOUND"
    if institution_name:
        # Check exact or partial tokens
        inst_tokens = [t.lower() for t in institution_name.split() if len(t) > 3]
        matches_count = sum(1 for tok in inst_tokens if tok in text_lower)
        if institution_name.lower() in text_lower:
            inst_match = "MATCHED"
        elif inst_tokens and (matches_count / len(inst_tokens)) >= 0.7:
            inst_match = "MATCHED"
        elif matches_count > 0:
            inst_match = "REVIEW REQUIRED"
        else:
            inst_match = "MISMATCH"

    # 6. Address / Location
    address_match = "REVIEW REQUIRED"
    for district in ["erode", "perundurai", "coimbatore", "chennai", "salem", "madurai", "bengaluru", "delhi"]:
        if district in text_lower:
            address_match = "MATCHED"
            break

    return {
        "category": doc_category,
        "document_number": doc_number,
        "issuing_authority": issuing_authority,
        "issue_date": issue_date,
        "expiry_date": expiry_date,
        "institution_verification": inst_match,
        "address_verification": address_match,
        "raw_dates": dates_found
    }
