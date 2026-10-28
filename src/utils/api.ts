import type { DocumentDetails, ScrutinyAnalysisResult } from "../types";

/**
 * Submits a document for AICTE scrutiny to the FastAPI backend.
 *
 * The backend expects a multipart/form-data document file and metadata.
 * It responds with a JSON object containing the full scrutiny result.
 */
export async function submitDocument(
  details: DocumentDetails,
  file: File | null
): Promise<ScrutinyAnalysisResult> {
  if (!file) {
    throw new Error("A document file is required for analysis.");
  }
  const formData = new FormData();
  formData.append("file", file);
  formData.append("institution_name", details.institution);
  formData.append("institution_id", details.institutionId ?? "");
  formData.append("doc_type", details.type);
  formData.append("document_number", details.documentNumber);
  formData.append("issuing_authority", details.issuingAuthority);
  formData.append("issue_date", details.issueDate);
  formData.append("expiry_date", details.expiryDate);
  formData.append("academic_year", details.academicYear);
  formData.append("uploaded_by", details.uploadedBy);

  const response = await fetch("/api/scrutiny/analyze", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to submit document: ${response.status} ${errorText}`);
  }

  return response.json() as Promise<ScrutinyAnalysisResult>;
}
