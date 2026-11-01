// src/hooks/useDocuments.ts
import { useState, useEffect, useCallback } from "react";
import type { Document, DocumentStatus } from "../types";
import { loadDocuments, saveDocuments, updateDocumentStatus } from "../utils/storage";

export function useDocuments() {
  const [docs, setDocs] = useState<Document[]>(() => loadDocuments());
  const [loading, setLoading] = useState(false);

  const refreshDocs = useCallback(() => {
    const loaded = loadDocuments();
    setDocs(loaded);
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleUpdate = () => refreshDocs();
    window.addEventListener("veriscrutiny_update", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("veriscrutiny_update", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [refreshDocs]);

  const updateDocs = (newDocs: Document[]) => {
    setDocs(newDocs);
    saveDocuments(newDocs);
  };

  const changeStatus = (id: string, status: DocumentStatus, remarks?: string, officerId?: string) => {
    const updated = updateDocumentStatus(id, status, remarks, officerId);
    setDocs(updated);
  };

  return { docs, setDocs: updateDocs, changeStatus, refreshDocs, loading };
}
