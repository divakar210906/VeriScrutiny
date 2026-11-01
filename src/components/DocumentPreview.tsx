import { useState } from "react";
import { Download, ExternalLink, FileText, ZoomIn, ZoomOut } from "lucide-react";
import type { Document } from "../types";

interface DocumentPreviewProps {
  document: Document;
  uploadedUrl?: string;
  fileLoadError?: boolean;
}

export default function DocumentPreview({ document, uploadedUrl, fileLoadError = false }: DocumentPreviewProps) {
  const [zoom, setZoom] = useState(100);

  return (
    <section className="flex min-h-[420px] flex-col overflow-hidden rounded border border-slate-300 bg-slate-800">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100">
        <div className="flex min-w-0 items-center gap-2">
          <FileText className="h-4 w-4 shrink-0 text-slate-300" aria-hidden="true" />
          <span className="truncate font-medium">{document.details.fileName}</span>
          <span className="shrink-0 text-xs text-slate-400">{document.details.fileSize}</span>
        </div>
        {uploadedUrl && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded border border-slate-700 px-1">
              <button
                type="button"
                onClick={() => setZoom((current) => Math.max(75, current - 10))}
                aria-label="Zoom out"
                className="rounded p-1.5 text-slate-200 hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="min-w-10 text-center text-xs tabular-nums" aria-live="polite">{zoom}%</span>
              <button
                type="button"
                onClick={() => setZoom((current) => Math.min(150, current + 10))}
                aria-label="Zoom in"
                className="rounded p-1.5 text-slate-200 hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>
            <a
              href={uploadedUrl}
              download={document.details.fileName}
              className="inline-flex items-center gap-1.5 rounded border border-slate-600 px-2.5 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Download
            </a>
            <a
              href={uploadedUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded border border-slate-600 px-2.5 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              Open
            </a>
          </div>
        )}
      </header>

      <div className="flex min-h-[380px] flex-1 items-center justify-center overflow-auto bg-slate-200 p-4">
        {uploadedUrl ? (
          <iframe
            src={uploadedUrl}
            title={`Document preview: ${document.name}`}
            className="min-h-[520px] w-full border-0 bg-white shadow-sm"
            style={{ height: `${Math.round(520 * zoom / 100)}px` }}
          />
        ) : (
          <div className="max-w-md rounded border border-slate-300 bg-white px-6 py-8 text-center shadow-sm">
            <FileText className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
            <h2 className="mt-3 text-sm font-semibold text-slate-800">
              {fileLoadError ? "Unable to load source file" : "Source file is not available"}
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {fileLoadError
                ? "The stored document could not be opened. Try refreshing the page; if the problem continues, upload the document again."
                : "This record has document metadata, but no original file is attached. No document image or certificate has been generated."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
