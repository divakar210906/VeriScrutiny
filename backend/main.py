import os
import json
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ml_engine.document_parser import extract_pdf_data
from ml_engine.forensics import compute_ela
from ml_engine.vision_detector import analyze_stamps_and_signatures
from ml_engine.nlp_extractor import extract_entities_from_text
from ml_engine.aicte_rules import evaluate_aicte_compliance
from ml_engine.faculty_detector import check_faculty_anomalies

app = FastAPI(
    title="VeriScrutiny ML Intelligence Backend",
    description="Intelligent Document Verification, Forensics & AICTE Statutory Rule Engine",
    version="1.0.0"
)

# Enable CORS for React frontend (Vite port 5173 and preview port 4173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "VeriScrutiny ML Engine",
        "version": "1.0.0",
        "capabilities": [
            "PDF Layout & Text Extraction (PyMuPDF)",
            "Error Level Analysis - ELA Tampering & Forgery Detection",
            "OpenCV Departmental Stamp & Seal Detection",
            "Signatory Stroke Verification",
            "AICTE Approval Process Handbook (APH) 10-Parameter Audit",
            "Cross-Institution Ghost Faculty Deduplication"
        ]
    }

@app.post("/api/scrutiny/analyze")
async def analyze_document(
    file: UploadFile = File(...),
    institution_name: str = Form("Kongu Engineering College"),
    institution_id: str = Form("KEC001"),
    doc_type: str = Form("Fire Safety Certificate")
):
    """
    Full AICTE Scrutiny Pipeline:
    1. Ingestion: Reads binary stream of PDF/image.
    2. Document Parsing: Extracts text, metadata, page render.
    3. Forensics: ELA tampering analysis & editing tool metadata inspection.
    4. Computer Vision: Official seal & signature detection via OpenCV.
    5. NLP Extraction: Entity recognition for statutory serials, authorities, dates.
    6. Compliance Audit: Evaluates against 10 AICTE Approval Process Handbook rules.
    """
    try:
        file_bytes = await file.read()
        filename = file.filename or "uploaded_doc.pdf"

        # 1. Document Parsing & Render
        parsed = extract_pdf_data(file_bytes, filename)
        text_content = parsed["text"]
        rendered_image = parsed["rendered_image"]
        
        # 2. Forensic Analysis (ELA)
        tampering_score, ela_flags = compute_ela(rendered_image)
        forensic_info = {
            "tampering_score": tampering_score,
            "flags": ela_flags,
            "suspicious_metadata": parsed["suspicious_metadata"]
        }

        # 3. Vision Detection (Stamps and Signatures)
        vision_info = analyze_stamps_and_signatures(rendered_image)

        # 4. Contextual NLP Extraction
        entities = extract_entities_from_text(text_content, institution_name)

        # 5. AICTE Statutory Rule Compliance Evaluation
        institution_context = {
            "name": institution_name,
            "permanentId": institution_id
        }

        scrutiny_result = evaluate_aicte_compliance(
            entities=entities,
            vision=vision_info,
            forensics=forensic_info,
            institution_context=institution_context,
            doc_name=doc_type or filename
        )

        # Include raw extraction details for inspectability
        scrutiny_result["meta"] = {
            "filename": filename,
            "pageCount": parsed["page_count"],
            "textSample": text_content[:500] if text_content else "Binary scan without embedded text layer",
            "visionDetails": vision_info["details"],
            "forensics": forensic_info
        }

        return scrutiny_result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scrutiny ML pipeline failure: {str(e)}")

class FacultyCheckRequest(BaseModel):
    institution_id: str
    faculty_list: list[dict]

@app.post("/api/faculty/cross-check")
def verify_faculty_cross_check(payload: FacultyCheckRequest):
    """
    Detects duplicate faculty, ghost faculty affiliations, and AICTE cadre ratio compliance.
    """
    return check_faculty_anomalies(payload.faculty_list, payload.institution_id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
