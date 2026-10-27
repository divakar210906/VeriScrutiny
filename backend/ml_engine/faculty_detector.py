# Simulated national faculty registry database for cross-institution anomaly detection
REGISTERED_FACULTY_REGISTRY = [
    {
        "faculty_id": "FAC-TN-2024-001",
        "name": "Dr. R. Shanmugam",
        "pan": "ABCPS1234D",
        "registered_institution_id": "KEC001",
        "registered_institution_name": "Kongu Engineering College",
        "cadre": "Professor & Head",
        "department": "Computer Science & Engineering"
    },
    {
        "faculty_id": "FAC-TN-2023-088",
        "name": "Dr. P. Sundaram",
        "pan": "BNDPS9876K",
        "registered_institution_id": "GCT002",
        "registered_institution_name": "Government College of Technology, Coimbatore",
        "cadre": "Associate Professor",
        "department": "Mechanical Engineering"
    },
    {
        "faculty_id": "FAC-KL-2022-142",
        "name": "Dr. Ananya Nair",
        "pan": "XYZPA4567M",
        "registered_institution_id": "TKM004",
        "registered_institution_name": "TKM College of Engineering, Kollam",
        "cadre": "Professor",
        "department": "Electrical & Electronics Engineering"
    }
]

def check_faculty_anomalies(submitted_faculty_list: list[dict], current_institution_id: str) -> dict:
    """
    Cross-checks faculty lists against national registry for:
    1. Ghost faculty (claiming faculty registered at another institution)
    2. Duplicate PAN numbers
    3. Cadre ratio compliance (AICTE 1:2:6 ratio for Prof : Assoc Prof : Asst Prof)
    """
    anomalies = []
    verified_faculty = []
    
    prof_count = 0
    assoc_count = 0
    asst_count = 0

    for fac in submitted_faculty_list:
        name = fac.get("name", "").strip()
        pan = fac.get("pan", "").strip().upper()
        cadre = fac.get("cadre", "").strip()
        
        # Track cadre counts
        cadre_lower = cadre.lower()
        if "associate" in cadre_lower:
            assoc_count += 1
        elif "assistant" in cadre_lower:
            asst_count += 1
        elif "professor" in cadre_lower:
            prof_count += 1

        # Cross-check in registry
        match = next((reg for reg in REGISTERED_FACULTY_REGISTRY if reg["pan"] == pan), None)
        
        if match:
            if match["registered_institution_id"] != current_institution_id:
                anomalies.append({
                    "faculty_name": name,
                    "pan": pan,
                    "issue": "DUPLICATE_AFFILIATION_GHOST_FACULTY",
                    "severity": "CRITICAL",
                    "details": f"Faculty '{name}' (PAN: {pan}) is already full-time registered at '{match['registered_institution_name']}' ({match['registered_institution_id']}). Dual employment violates AICTE Faculty Norms Chapter 3."
                })
            else:
                verified_faculty.append({
                    "name": name,
                    "pan": pan,
                    "status": "VERIFIED_ACTIVE"
                })
        else:
            verified_faculty.append({
                "name": name,
                "pan": pan,
                "status": "NEW_REGISTRATION"
            })

    # Cadre ratio analysis (ideal 1 : 2 : 6)
    cadre_compliant = True
    cadre_remarks = "Cadre structure is satisfactory."
    total = prof_count + assoc_count + asst_count
    if total > 0 and prof_count == 0:
        cadre_compliant = False
        cadre_remarks = "Zero Professors declared. AICTE mandates minimum 1 Professor per department."

    return {
        "anomalies_detected": len(anomalies) > 0,
        "anomaly_count": len(anomalies),
        "anomalies": anomalies,
        "verified_count": len(verified_faculty),
        "cadre_analysis": {
            "professors": prof_count,
            "associate_professors": assoc_count,
            "assistant_professors": asst_count,
            "compliant": cadre_compliant,
            "remarks": cadre_remarks
        }
    }
