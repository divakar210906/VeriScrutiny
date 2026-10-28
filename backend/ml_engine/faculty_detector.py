def check_faculty_anomalies(
    submitted_faculty_list: list[dict],
    current_institution_id: str,
    registry_records: list[dict] | None = None,
) -> dict:
    """Compare faculty only with records explicitly supplied by an authorized caller.

    The application has no configured authoritative faculty registry. Without
    supplied records, identity, duplicate-affiliation, and compliance checks
    remain unverified rather than treating an absent match as proof of validity.
    """
    records = registry_records or []
    registry_available = bool(records)
    anomalies = []
    reviewed_faculty = []
    pan_matches: dict[str, int] = {}
    professors = 0
    associate_professors = 0
    assistant_professors = 0

    for faculty in submitted_faculty_list:
        name = str(faculty.get("name", "")).strip()
        pan = str(faculty.get("pan", "")).strip().upper()
        cadre = str(faculty.get("cadre", "")).strip().lower()

        if "associate" in cadre:
            associate_professors += 1
        elif "assistant" in cadre:
            assistant_professors += 1
        elif "professor" in cadre:
            professors += 1

        if pan:
            pan_matches[pan] = pan_matches.get(pan, 0) + 1
        registry_match = next(
            (record for record in records if str(record.get("pan", "")).strip().upper() == pan),
            None,
        ) if pan else None

        if registry_match:
            same_institution = str(registry_match.get("registered_institution_id", "")) == current_institution_id
            status = "MATCHED_IN_SUPPLIED_RECORDS" if same_institution else "DUPLICATE_REFERENCE_MATCH"
            if not same_institution:
                anomalies.append({
                    "faculty_name": name,
                    "pan": pan,
                    "issue": "REFERENCE_MATCH_OTHER_INSTITUTION",
                    "severity": "REVIEW REQUIRED",
                    "details": "A matching PAN appears in caller-supplied records for another institution. This is not independently verified evidence of employment or misconduct.",
                })
        else:
            status = "REVIEW REQUIRED" if not registry_available else "NO_MATCH_IN_SUPPLIED_RECORDS"

        reviewed_faculty.append({"name": name, "pan": pan, "status": status})

    duplicate_submissions = [
        {"pan": pan, "count": count, "status": "REVIEW REQUIRED"}
        for pan, count in pan_matches.items()
        if count > 1
    ]

    return {
        "anomalies_detected": bool(anomalies or duplicate_submissions),
        "anomaly_count": len(anomalies) + len(duplicate_submissions),
        "anomalies": anomalies,
        "duplicate_submissions": duplicate_submissions,
        "reviewed_count": len(reviewed_faculty),
        "reviewed_faculty": reviewed_faculty,
        "registry_available": registry_available,
        "registry_status": (
            "Caller-supplied records used; source and authority are not independently verified."
            if registry_available else
            "No authoritative faculty registry is configured; matches cannot be checked."
        ),
        "cadre_analysis": {
            "professors": professors,
            "associate_professors": associate_professors,
            "assistant_professors": assistant_professors,
            "compliant": None,
            "remarks": "Cadre totals are counted from the submission only. No authoritative ratio rule or programme-specific requirements are configured.",
        },
    }
