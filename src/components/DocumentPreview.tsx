// src/components/DocumentPreview.tsx
import { useState } from "react";
import type { Document } from "../types";
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Printer, 
  ShieldCheck, 
  FileCheck2, 
  QrCode, 
  AlertTriangle 
} from "lucide-react";

interface DocumentPreviewProps {
  document: Document;
  uploadedUrl?: string;
}

export default function DocumentPreview({ document, uploadedUrl }: DocumentPreviewProps) {
  const [zoom, setZoom] = useState<number>(100);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 15, 150));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 15, 75));
  const handleResetZoom = () => setZoom(100);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const textContent = `VERISCRUTINY OFFICIAL SCRUTINY DOCKET
Document ID: ${document.id}
Document Title: ${document.name}
Registration No: ${document.documentNumber}
Issuing Authority: ${document.issuingAuthority}
Institution: ${document.details.institution}
Status: ${document.status}
Issue Date: ${new Date(document.issueDate).toLocaleDateString()}
Expiry Date: ${new Date(document.expiryDate).toLocaleDateString()}
SHA-256 Checksum: ${document.details.checksum}
--------------------------------------------------
Certified Authentic Scrutiny Extract - SIH 2026 Portal`;

    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `${document.name.replace(/\s+/g, "_")}_Scrutiny_Record.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col border border-slate-300 rounded bg-slate-900 overflow-hidden shadow-sm">
      {/* Document Viewer Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-800 text-slate-200 border-b border-slate-700 text-xs">
        <div className="flex items-center space-x-2 font-mono">
          <FileCheck2 className="w-4 h-4 text-sky-400" />
          <span className="font-semibold text-white truncate max-w-xs">{document.details.fileName}</span>
          <span className="text-slate-400">({document.details.fileSize})</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-slate-700 rounded px-1.5 py-0.5 space-x-1">
            <button
              onClick={handleZoomOut}
              className="p-1 hover:text-white rounded hover:bg-slate-600 transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 text-[11px] font-mono min-w-[32px] text-center">{zoom}%</span>
            <button
              onClick={handleZoomIn}
              className="p-1 hover:text-white rounded hover:bg-slate-600 transition"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1 hover:text-white rounded hover:bg-slate-600 transition"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          <div className="h-4 w-px bg-slate-600 mx-1"></div>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-200 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-200 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* PDF Viewport */}
      <div className="p-4 sm:p-6 overflow-auto bg-slate-200 flex justify-center max-h-[620px] min-h-[500px]">
        {uploadedUrl ? (
          <iframe
            src={uploadedUrl}
            title={document.name}
            className="w-full h-full min-h-[500px] border-0 bg-white rounded shadow"
          />
        ) : (
          <div
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
            className="transition-transform duration-150 w-full max-w-[680px] bg-white text-slate-900 p-8 shadow-xl border-4 border-double border-slate-700 font-serif relative select-none"
          >
            {/* Background Security Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 rotate-[-35deg] text-slate-900 font-sans font-black text-6xl tracking-widest uppercase">
              INSTITUTIONAL SCRUTINY DOCKET
            </div>

            {/* Document Header */}
            <div className="text-center border-b-2 border-slate-800 pb-4 mb-4">
              <div className="flex justify-center mb-1">
                <div className="w-12 h-12 rounded-full border-2 border-slate-800 flex items-center justify-center bg-slate-50 text-slate-800 font-sans font-bold text-xs">
                  SEAL
                </div>
              </div>
              <h1 className="text-xs tracking-widest uppercase text-slate-600 font-sans font-bold mb-0.5">
                Government Regulatory Scrutiny Archive
              </h1>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 uppercase tracking-wide">
                {document.issuingAuthority}
              </h2>
              <p className="text-xs text-slate-600 font-sans mt-0.5">
                Statutory Compliance & Verification Division • Academic Year {document.academicYear}
              </p>
            </div>

            {/* Certificate Reference & Barcode bar */}
            <div className="flex justify-between items-center text-xs font-sans border-b border-slate-300 pb-2 mb-4 text-slate-600">
              <div>
                <span className="font-semibold text-slate-800">Doc Ref No: </span>
                <span className="font-mono">{document.documentNumber}</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-slate-800">Issue Date: </span>
                <span className="font-mono">{new Date(document.issueDate).toLocaleDateString("en-IN")}</span>
              </div>
            </div>

            {/* Title */}
            <div className="text-center my-4">
              <h3 className="text-base sm:text-lg font-bold text-[#0b2545] uppercase tracking-wider underline underline-offset-4 decoration-1">
                {document.name.toUpperCase()}
              </h3>
              <p className="text-xs font-sans text-slate-500 mt-1 italic">
                Issued pursuant to statutory guidelines under applicable educational & safety regulations
              </p>
            </div>

            {/* Certificate Body Paragraphs */}
            <div className="text-xs leading-relaxed text-slate-800 space-y-3 my-4 font-serif text-justify">
              <p>
                This is to officially certify that the records submitted on behalf of{" "}
                <strong className="text-slate-950 font-bold uppercase">{document.details.institution}</strong>,
                having permanent institutional identification code{" "}
                <strong className="font-mono font-bold">{document.details.institutionId}</strong>, situated at{" "}
                <em>Perundurai Railway Station Road, Erode District, Tamil Nadu - 638060</em>, have been thoroughly
                examined and inspected by the authorized regulatory division.
              </p>

              {document.id === "doc-2" && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded font-sans text-xs">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                    <span>Fire & Emergency Safety Compliance Clause</span>
                  </div>
                  <p>
                    Premises equipped with wet riser systems, automatic sprinklers, emergency exit stairwells, and fire
                    extinguishers conforming to IS:2190. <em>Note: Live verification against State Fire Registry requires periodic nodal confirmation.</em>
                  </p>
                </div>
              )}

              {document.id === "doc-1" && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded font-sans text-xs">
                  <p>
                    <strong>Affiliated Courses Granted:</strong> B.E. (CSE, EEE, ECE, Mechanical, Civil, Mechatronics,
                    AI&DS, IT) and M.E. / MBA / MCA courses for academic intake session 2026-27 under autonomous provisions.
                  </p>
                </div>
              )}

              {document.id === "doc-4" && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 rounded font-sans text-xs">
                  <p className="font-semibold">Statutory Faculty Cadre Endorsement:</p>
                  <p>
                    Declaration of approved faculty roster submitted for departmental inspection.{" "}
                    <span className="text-rose-700 font-bold">[Audit Flag: Incomplete department endorsements detected in annexure schedule IV]</span>.
                  </p>
                </div>
              )}

              <p>
                This instrument is valid from{" "}
                <span className="font-semibold underline">
                  {new Date(document.issueDate).toLocaleDateString("en-IN")}
                </span>{" "}
                up to and including{" "}
                <span className="font-semibold underline">
                  {new Date(document.expiryDate).toLocaleDateString("en-IN")}
                </span>
                , subject to continuing compliance with standard statutory undertakings.
              </p>
            </div>

            {/* Official Stamps, QR Code & Signatures */}
            <div className="border-t-2 border-slate-800 pt-4 mt-6 grid grid-cols-3 gap-2 items-end text-xs font-sans">
              {/* Digital Hash & QR */}
              <div className="flex flex-col items-center border border-slate-300 p-2 rounded bg-slate-50">
                <QrCode className="w-12 h-12 text-slate-800 mb-1" />
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">
                  DIGITAL AUTH CODE
                </span>
                <span className="text-[8px] font-mono text-slate-600 truncate max-w-[120px]">
                  {document.details.checksum.substring(0, 16)}
                </span>
              </div>

              {/* Institutional Seal Stamp */}
              <div className="flex flex-col items-center text-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#0b2545] flex flex-col items-center justify-center p-1 bg-blue-50/50">
                  <ShieldCheck className="w-5 h-5 text-[#0b2545]" />
                  <span className="text-[7px] font-bold text-[#0b2545] uppercase tracking-tight">
                    OFFICIAL SEAL
                  </span>
                  <span className="text-[6px] text-slate-500">GOVT REGULATORY</span>
                </div>
                <span className="text-[9px] text-slate-500 mt-1 font-mono">RECORD CERTIFIED</span>
              </div>

              {/* Authorized Signatory */}
              <div className="text-right flex flex-col items-end">
                <div className="border-b border-slate-800 pb-1 mb-1 w-full text-right">
                  <span className="font-serif italic text-slate-800 text-sm font-semibold">
                    K. Senthil Kumar
                  </span>
                </div>
                <span className="font-semibold text-slate-800 text-[10px]">Competent Authority</span>
                <span className="text-slate-600 text-[9px]">Scrutiny & Licensing Officer</span>
                <span className="text-slate-500 text-[8px] font-mono">
                  Signed: {new Date(document.issueDate).toLocaleDateString("en-IN")}
                </span>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="mt-4 pt-2 border-t border-slate-200 text-center text-[9px] font-sans text-slate-400">
              Generated for Institutional Scrutiny Demo. Any unauthorized alterations invalidate this record.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
