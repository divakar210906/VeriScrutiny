import type { DocumentScrutinyResult } from "./documentScrutinyEngine";

const ML_API_BASE = "http://localhost:8000";

export interface BackendStatus {
  online: boolean;
  version?: string;
  capabilities?: string[];
}

export async function checkBackendStatus(): Promise<BackendStatus> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${ML_API_BASE}/api/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      return { online: true, version: data.version, capabilities: data.capabilities };
    }
    return { online: false };
  } catch {
    return { online: false };
  }
}

export async function analyzeDocumentWithML(
  file: File | Blob,
  docType: string,
  institutionName: string = "Kongu Engineering College",
  institutionId: string = "KEC001"
): Promise<DocumentScrutinyResult | null> {
  try {
    const formData = new FormData();
    formData.append("file", file, file instanceof File ? file.name : "document.pdf");
    formData.append("doc_type", docType);
    formData.append("institution_name", institutionName);
    formData.append("institution_id", institutionId);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(`${ML_API_BASE}/api/scrutiny/analyze`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`ML backend returned HTTP ${res.status}`);
      return null;
    }

    const data: DocumentScrutinyResult = await res.json();
    return data;
  } catch (err) {
    console.warn("ML backend request error, falling back to local engine:", err);
    return null;
  }
}

export async function checkFacultyCrossAnomalies(
  facultyList: Array<{ name: string; pan: string; cadre: string }>,
  institutionId: string = "KEC001"
) {
  try {
    const res = await fetch(`${ML_API_BASE}/api/faculty/cross-check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ institution_id: institutionId, faculty_list: facultyList }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Faculty cross check API error:", err);
  }
  return null;
}
