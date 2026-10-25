// src/hooks/useDocuments.ts
import { useState, useEffect, useCallback } from "react";
import type { Document, DocumentStatus } from "../types";
import { loadDocuments, saveDocuments, updateDocumentStatus } from "../utils/storage";

export function useDocuments() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshDocs = useCallback(() => {
    const loaded = loadDocuments();
    setDocs(loaded);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshDocs();
  }, [refreshDocs]);

  const updateDocs = (newDocs: Document[]) => {
    setDocs(newDocs);
    saveDocuments(newDocs);
  };

  const changeStatus = (id: string, status: DocumentStatus, remarks?: string) => {
    const updated = updateDocumentStatus(id, status, remarks);
    setDocs(updated);
  };

  return { docs, setDocs: updateDocs, changeStatus, refreshDocs, loading };
}
