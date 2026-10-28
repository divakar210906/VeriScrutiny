import type { Document, ScrutinyAnalysisResult } from "../types";

const ML_API_BASE = "/api";
const ANALYSIS_TIMEOUT_MS = 180_000;

function isAnalysisResult(value: unknown): value is ScrutinyAnalysisResult {
  if (!value || typeof value !== "object") return false;
  const result = value as Record<string, unknown>;
  const recommendation = result.recommendation;
  const summary = result.summary;
  const aiAnalysis = result.aiAnalysis;
  return (
    Array.isArray(result.extractedFields) &&
    Array.isArray(result.findings) &&
    Array.isArray(result.checklist) &&
    (aiAnalysis === undefined ||
      (!!aiAnalysis &&
        typeof aiAnalysis === "object" &&
        typeof (aiAnalysis as Record<string, unknown>).status === "string" &&
        typeof (aiAnalysis as Record<string, unknown>).model === "string")) &&
    (recommendation === "NO ISSUES DETECTED" ||
      recommendation === "NEEDS CLARIFICATION" ||
      recommendation === "DEFICIENCY DETECTED") &&
    typeof result.recommendationReason === "string" &&
    !!summary &&
    typeof summary === "object" &&
    typeof (summary as Record<string, unknown>).total === "number" &&
    typeof (summary as Record<string, unknown>).passed === "number" &&
    typeof (summary as Record<string, unknown>).warnings === "number" &&
    typeof (summary as Record<string, unknown>).failed === "number"
  );
}

export interface BackendStatus {
  online: boolean;
  version?: string;
  capabilities?: string[];
}

export async function checkBackendStatus(): Promise<BackendStatus> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);
  try {
    const response = await fetch(`${ML_API_BASE}/health`, { signal: controller.signal });
    if (!response.ok) return { online: false };
    const data = await response.json();
    return { online: true, version: data.version, capabilities: data.capabilities };
  } catch {
    return { online: false };
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function analyzeDocumentWithML(
  file: Blob,
  filename: string,
  document: Document,
  institutionName: string,
  institutionId: string,
  applicationId: string,
  peerDocuments: Array<{
    institutionId: string;
    academicYear: string;
    documentNumber: string;
  }> = [],
): Promise<ScrutinyAnalysisResult> {
  const formData = new FormData();
  formData.append("file", file, filename);
  formData.append("doc_type", document.name);
  formData.append("institution_name", institutionName);
  formData.append("institution_id", institutionId);
  formData.append("application_id", applicationId);
  formData.append("academic_year", document.academicYear);
  formData.append("document_number", document.documentNumber);
  formData.append("issuing_authority", document.issuingAuthority);
  formData.append("issue_date", document.issueDate);
  formData.append("expiry_date", document.expiryDate);
  formData.append("cross_documents_json", JSON.stringify(peerDocuments));

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ANALYSIS_TIMEOUT_MS);
  try {
    const response = await fetch(`${ML_API_BASE}/scrutiny/analyze`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    const responseBody: unknown = await response.json().catch(() => undefined);
    if (!response.ok) {
      const detail = responseBody && typeof responseBody === "object" && "detail" in responseBody &&
        typeof responseBody.detail === "string"
        ? responseBody.detail
        : `Backend returned HTTP ${response.status}.`;
      throw new Error(detail);
    }
    if (!isAnalysisResult(responseBody)) {
      throw new Error("The analysis backend returned an invalid response.");
    }
    return responseBody;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Analysis timed out. The first local model download may take longer; check the backend and try again.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function checkFacultyCrossAnomalies(
  facultyList: Array<{ name: string; pan: string; cadre: string }>,
  institutionId = "KEC001",
) {
  const response = await fetch(`${ML_API_BASE}/faculty/cross-check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ institution_id: institutionId, faculty_list: facultyList }),
  });
  if (!response.ok) {
    throw new Error(`Faculty cross-check failed with HTTP ${response.status}.`);
  }
  return response.json();
}
