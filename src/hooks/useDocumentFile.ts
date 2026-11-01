import { useEffect, useState } from "react";
import { loadDocumentFile } from "../utils/storage";

export function useDocumentFile(documentId: string) {
  const [fileState, setFileState] = useState<{ documentId: string; url?: string; error: boolean }>({
    documentId: "",
    error: false,
  });

  useEffect(() => {
    let active = true;
    let objectUrl: string | undefined;

    loadDocumentFile(documentId)
      .then((file) => {
        if (!active) return;
        if (file) {
          objectUrl = URL.createObjectURL(file);
          setFileState({ documentId, url: objectUrl, error: false });
        }
      })
      .catch(() => {
        if (active) setFileState({ documentId, error: true });
      });

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [documentId]);

  return {
    url: fileState.documentId === documentId ? fileState.url : undefined,
    error: fileState.documentId === documentId && fileState.error,
  };
}
