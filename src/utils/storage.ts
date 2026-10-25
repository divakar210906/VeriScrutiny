// src/utils/storage.ts
import type { Document, ScrutinySettings, VerificationHistoryItem, DocumentStatus } from "../types";
import { documents as initialDocuments, defaultSettings, verificationHistory as initialHistory } from "../mockData";

export const STORAGE_KEY_DOCS = "veriscrutiny_documents_v2";
export const STORAGE_KEY_SETTINGS = "veriscrutiny_settings_v2";
export const STORAGE_KEY_HISTORY = "veriscrutiny_history_v2";
export const FILE_URL_STORAGE_KEY = "veriscrutiny_document_files_v2";

export function loadDocuments(): Document[] {
  const stored = localStorage.getItem(STORAGE_KEY_DOCS);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // fallback
    }
  }
  return initialDocuments;
}

export function saveDocuments(docs: Document[]): void {
  localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(docs));
}

export function updateDocumentStatus(
  id: string,
  newStatus: DocumentStatus,
  scrutinizerRemarks?: string
): Document[] {
  const currentDocs = loadDocuments();
  const updated = currentDocs.map((doc) => {
    if (doc.id === id) {
      const updatedSummary = doc.details.scrutinySummary
        ? {
            ...doc.details.scrutinySummary,
            status: newStatus,
            lastScrutinized: new Date().toISOString(),
            reason: scrutinizerRemarks || doc.details.scrutinySummary.reason,
            officerRemarks: scrutinizerRemarks || doc.details.scrutinySummary.officerRemarks,
            officerDecision: newStatus,
          }
        : undefined;

      return {
        ...doc,
        status: newStatus,
        lastScrutinized: new Date().toISOString(),
        details: {
          ...doc.details,
          status: newStatus,
          rejectionReason:
            newStatus === "Deficiency Raised" || newStatus === "Needs Correction" || newStatus === "Rejected"
              ? scrutinizerRemarks || doc.details.rejectionReason
              : doc.details.rejectionReason,
          officerRemarks: scrutinizerRemarks || doc.details.officerRemarks,
          scrutinySummary: updatedSummary,
        },
      };
    }
    return doc;
  });

  saveDocuments(updated);

  // Also log into verification history
  const targetDoc = updated.find((d) => d.id === id);
  if (targetDoc) {
    const historyList = loadVerificationHistory();
    const nowFormatted = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const actionName =
      newStatus === "Verified"
        ? "Document Approved"
        : newStatus === "Deficiency Raised"
        ? "Deficiency Raised"
        : newStatus === "Rejected"
        ? "Document Rejected"
        : newStatus === "Re-submitted"
        ? "Re-submission Received"
        : "Scrutiny Executed";

    const resultLabel =
      newStatus === "Deficiency Raised"
        ? "Awaiting Institution Response"
        : newStatus;

    const newHistoryItem: VerificationHistoryItem = {
      id: "hist-" + Date.now(),
      reportId: `SCR-2026-TN-KEC-${Math.floor(1000 + Math.random() * 9000)}`,
      institutionId: "KEC001",
      institutionName: "Kongu Engineering College",
      applicationId: "APP-2026-00182",
      documentId: targetDoc.id,
      documentName: targetDoc.name,
      documentNumber: targetDoc.documentNumber,
      category: targetDoc.category,
      scrutinyDate: nowFormatted,
      scrutinizedBy: "AICTE-SR-9042",
      action: actionName,
      result: resultLabel,
      passedCount: targetDoc.checklist.filter((c) => c.result === "PASS").length,
      warningCount: targetDoc.checklist.filter((c) => c.result === "WARNING").length,
      failedCount: targetDoc.checklist.filter((c) => c.result === "FAIL").length,
      remarks: scrutinizerRemarks || `Status updated to ${newStatus}.`,
    };
    saveVerificationHistory([newHistoryItem, ...historyList]);
  }

  try {
    window.dispatchEvent(new Event("veriscrutiny_update"));
  } catch {
    // window not available in non-browser context
  }

  return updated;
}

export function loadVerificationHistory(): VerificationHistoryItem[] {
  const stored = localStorage.getItem(STORAGE_KEY_HISTORY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // fallback
    }
  }
  return initialHistory;
}

export function saveVerificationHistory(history: VerificationHistoryItem[]): void {
  localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
}

export function loadSettings(): ScrutinySettings {
  const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
  if (stored) {
    try {
      return { ...defaultSettings, ...JSON.parse(stored) };
    } catch {
      // fallback
    }
  }
  return defaultSettings;
}

export function saveSettings(settings: ScrutinySettings): void {
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
}

export function saveFileUrl(id: string, url: string): void {
  const map = JSON.parse(localStorage.getItem(FILE_URL_STORAGE_KEY) ?? "{}") as Record<string, string>;
  map[id] = url;
  localStorage.setItem(FILE_URL_STORAGE_KEY, JSON.stringify(map));
}

export function loadFileUrl(id: string): string | undefined {
  const map = JSON.parse(localStorage.getItem(FILE_URL_STORAGE_KEY) ?? "{}") as Record<string, string>;
  return map[id];
}
