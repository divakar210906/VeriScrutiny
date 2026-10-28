// src/pages/DocumentDetailPage.tsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDocuments } from "../hooks/useDocuments";
import { useDocumentFile } from "../hooks/useDocumentFile";
import { StatusBadge } from "../components/StatusBadge";
import DocumentPreview from "../components/DocumentPreview";
import { 
  FileText, 
  ArrowLeft, 
  FileCheck2 
} from "lucide-react";

export default function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { docs, loading } = useDocuments();
  const { url: previewUrl, error: fileLoadError } = useDocumentFile(id ?? "");

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading document details...</div>;
  }

  const doc = docs.find((d) => d.id === id);

  if (!doc) {
    return (
      <div className="bg-white p-8 rounded border border-slate-300 shadow-sm text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Document Not Found</h2>
        <p className="text-sm text-slate-500">
          The requested document identifier (ID: <span className="font-mono">{id}</span>) could not be located in the institutional repository.
        </p>
        <Link
          to="/documents"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0b2545] text-white rounded text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Documents Register</span>
        </Link>
      </div>
    );
  }

  const { details } = doc;

  return (
    <div className="space-y-4">
      {/* Top Header Bar */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {doc.id}
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-600 font-medium">{doc.category} Document</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#0b2545] flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            <span>{doc.name}</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/documents"
            className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Register</span>
          </Link>
          <button
            onClick={() => navigate(`/scrutiny/${doc.id}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0b2545] hover:bg-[#134074] text-white rounded text-xs font-semibold shadow-sm transition"
          >
            <FileCheck2 className="w-4 h-4 text-amber-400" />
            <span>Run Scrutiny</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Document Metadata & Preview + Scrutiny Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left 2 Columns: Metadata Card + Document Preview Viewer */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Metadata Card */}
          <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Document Metadata
              </h3>
              <StatusBadge status={doc.status} size="sm" />
            </div>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px] font-semibold">Document Title:</span>
                <span className="font-semibold text-slate-900">{doc.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-semibold">Document / Certificate No:</span>
                <span className="font-mono font-bold text-slate-900">{doc.documentNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-semibold">Institution Name:</span>
                <span className="text-slate-800">{details.institution}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-semibold">AICTE Permanent ID:</span>
                <span className="font-mono font-bold text-slate-800">{details.institutionId}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-semibold">Issuing Authority:</span>
                <span className="text-slate-800">{details.issuingAuthority}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-semibold">Academic Year:</span>
                <span className="font-medium text-slate-800">{details.academicYear}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-semibold">Issue Date:</span>
                <span className="font-mono text-slate-800">
                  {new Date(details.issueDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-semibold">Validity / Expiry Date:</span>
                <span className="font-mono text-slate-800">
                  {new Date(details.expiryDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-semibold">Uploaded By:</span>
                <span className="text-slate-800">{details.uploadedBy}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-semibold">Uploaded Timestamp:</span>
                <span className="font-mono text-slate-800">
                  {new Date(details.submissionDate).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 font-mono text-slate-500 truncate">
                  <span className="font-semibold text-slate-700">SHA-256 Checksum:</span>
                    <span className="truncate max-w-[280px]">{previewUrl ? details.checksum : "Not available — no source file is attached"}</span>
                </div>
                  <span className="text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {previewUrl ? "Checksum recorded" : "No source file"}
                </span>
              </div>
            </div>
          </div>

          {/* Realistic Document Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Uploaded Source Document
              </h3>
              <span className="text-[11px] text-slate-500">Original uploaded file only</span>
            </div>
            <DocumentPreview document={doc} uploadedUrl={previewUrl} fileLoadError={fileLoadError} />
          </div>
        </div>

        {/* Right Column: Scrutiny Summary & Action Panel */}
        <div className="space-y-4">
          
          {/* Scrutiny Status Summary Panel */}
          <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
            <div className="bg-[#134074] text-white px-4 py-3">
              <h3 className="font-bold text-xs uppercase tracking-wider">
                Scrutiny Assessment Summary
              </h3>
              <p className="text-[11px] text-slate-200 mt-0.5">
                Current workflow status
              </p>
            </div>

            <div className="p-4 space-y-4 text-xs">
              {/* Status Banner */}
              <div className="flex items-center justify-between p-3 rounded border border-slate-200 bg-slate-50">
                <div>
                  <span className="text-slate-500 block text-[11px] font-semibold">Document Status:</span>
                  <span className="text-sm font-bold text-slate-900">{doc.status}</span>
                </div>
                <StatusBadge status={doc.status} size="lg" />
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">Officer Remarks:</span>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-800 leading-relaxed text-xs">
                  {details.officerRemarks || details.rejectionReason || "No officer remarks recorded. Automated analysis is not connected."}
                </div>
              </div>

              <p className="border-t border-slate-200 pt-3 text-xs leading-5 text-slate-500">
                No automated extraction or compliance findings are available for this demonstration record.
              </p>

              {/* Action Buttons */}
              <div className="space-y-2 pt-3 border-t border-slate-200">
                <button
                  onClick={() => navigate(`/scrutiny/${doc.id}`)}
                  className="w-full py-2.5 px-3 bg-[#0b2545] hover:bg-[#134074] text-white font-semibold rounded text-xs shadow-sm transition flex items-center justify-center gap-1.5"
                >
                  <FileCheck2 className="w-4 h-4 text-amber-400" />
                  <span>Execute Scrutiny Workflow</span>
                </button>

                <button
                  onClick={() => navigate(`/report/${doc.id}`)}
                  className="w-full py-2 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold rounded text-xs transition flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-4 h-4 text-[#0056b3]" />
                  <span>View Official Scrutiny Report</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Regulatory Reference Card */}
          <div className="bg-white border border-slate-300 rounded shadow-sm p-4 text-xs space-y-2.5">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1.5">
              Statutory Guidelines Reference
            </h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Under Regulation 4.2 of AICTE Approval Norms, institutions must verify that all submitted clearances are
              valid on the physical or digital inspection date.
            </p>
            <div className="text-[11px] font-mono text-slate-500 bg-slate-50 p-2 rounded border border-slate-200">
              Scrutiny Session ID: SESS-{doc.id.toUpperCase()}-2026
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
