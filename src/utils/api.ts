import type { DocumentDetails } from "../types";
import { runScrutinyEngine } from "./ruleEngine";

const BACKEND_URL = (import.meta as any).env?.VITE_API_URL || "http://127.0.0.1:8000";

/**
 * Submits a document for AICTE scrutiny.
 *
 * If the FastAPI backend is running / accessible, it calls the ML scrutiny pipeline.
 * If the request fails (e.g., when hosted on Vercel without a connected backend URL),
 * it seamlessly falls back to the client-side AICTE Statutory Rule Engine.
 */
export async function submitDocument(
  details: DocumentDetails,
  file: File | null
): Promise<any> {
  const formData = new FormData();
  if (file) {
    formData.append("file", file);
  }
  formData.append("institution_name", details.institution);
  formData.append("institution_id", details.institutionId ?? "");
  formData.append("doc_type", details.type);
  formData.append("document_number", details.documentNumber);
  formData.append("issuing_authority", details.issuingAuthority);
  formData.append("issue_date", details.issueDate);
  formData.append("expiry_date", details.expiryDate);
  formData.append("academic_year", details.academicYear);
  formData.append("uploaded_by", details.uploadedBy);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const response = await fetch(`${BACKEND_URL}/api/scrutiny/analyze`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      return await response.json();
    }
  } catch {
    // If backend is not hosted/reachable, fallback smoothly to built-in rule engine
  }

  // Graceful Fallback: client-side statutory rule engine
  const engineResult = runScrutinyEngine(details);
  return {
    status: engineResult.status,
    checklist: engineResult.checklist,
    scrutinySummary: {
      lastScrutinized: new Date().toISOString(),
      scrutinizedBy: "Central Institutional Scrutiny Cell (CISC-TN)",
      status: engineResult.status,
      reason: engineResult.reason,
      totalChecks: engineResult.summary.total,
      passed: engineResult.summary.passed,
      warnings: engineResult.summary.warnings,
      failed: engineResult.summary.failed,
    },
    meta: {
      fallback: true,
      note: "Analyzed via Client Statutory Rule Engine (Backend microservice offline)",
    },
  };
}

