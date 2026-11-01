// src/pages/aicte/AicteInstitutionDetailPage.tsx
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { aicteInstitutionsList, institution } from "../../mockData";
import { useDocuments } from "../../hooks/useDocuments";
import { StatusBadge } from "../../components/StatusBadge";
import { 
  Building2, 
  FileCheck2, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  FileText,
  Eye,
  X
} from "lucide-react";
import type { Document } from "../../types";

export default function AicteInstitutionDetailPage() {
  const { id = "KEC001" } = useParams<{ id: string }>();
  const { docs } = useDocuments();
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<Document | null>(null);

  const inst = aicteInstitutionsList.find((i) => i.id === id);
  if (!inst) {
    return (
      <section className="rounded border border-slate-300 bg-white p-6">
        <h1 className="text-lg font-semibold text-slate-900">Institution not found</h1>
        <p className="mt-2 text-sm text-slate-600">The institution reference in this link is not present in the demonstration data.</p>
        <Link to="/aicte/institutions" className="mt-4 inline-flex text-sm font-semibold text-blue-800 hover:underline">
          Return to institutions
        </Link>
      </section>
    );
  }

  // For Kongu Engineering College, use active docs from useDocuments() for real-time reactivity
  const isKEC = inst.id === "KEC001";
  const submittedDocs = isKEC ? docs : inst.documents;

  const verifiedCount = submittedDocs.filter((d) => d.status === "Verified").length;
  const underScrutinyCount = submittedDocs.filter((d) => ["Under Scrutiny", "Under Review", "Re-submitted"].includes(d.status)).length;
  const allVerified = submittedDocs.length > 0 && verifiedCount === submittedDocs.length;
  const deficientCount = submittedDocs.filter((d) => d.status === "Deficiency Raised" || d.status === "Needs Correction").length;
  const currentStatus = isKEC
    ? allVerified
      ? "Verified"
      : deficientCount > 0
      ? "Deficient"
      : underScrutinyCount > 0
      ? "Under Review"
      : "Pending Scrutiny"
    : inst.status;

  return (
    <div className="space-y-5">
      {/* Back Link & Header */}
      <div id="application-summary" className="bg-white border border-slate-300 rounded shadow-sm p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Link
            to="/aicte/institutions"
            className="text-xs text-[#0056b3] font-semibold hover:underline flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Institutions Directory</span>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-amber-400 rounded">
                Demonstration application
              </span>
              <span className="text-xs font-mono text-slate-600">
                AICTE ID: <strong className="text-slate-900">{inst.aictePermanentId}</strong>
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="text-xs font-mono text-slate-600">
                Application ID: <strong className="text-slate-900">{inst.applicationId}</strong>
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="text-xs text-slate-600">
                Academic Year: <strong className="text-slate-900">2026–27</strong>
              </span>
            </div>

            <h1 className="text-lg sm:text-xl font-bold text-[#071a30] flex items-center gap-2 pt-1">
              <Building2 className="w-5 h-5 text-amber-600" />
              <span>{inst.name}</span>
            </h1>

            <p className="text-xs text-slate-600">
              {institution.address}, {inst.district}, {inst.state} • {inst.type}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={currentStatus} size="lg" />
          </div>
        </div>
      </div>

      {/* Compliance / Submission Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex items-center gap-2.5">
          <FileCheck2 className="w-5 h-5 text-slate-700" />
          <div>
            <div className="text-xl font-bold font-mono text-slate-900">
              {submittedDocs.length}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Document records</div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex items-center gap-2.5">
          <Clock className="w-5 h-5 text-blue-700" />
          <div>
            <div className="text-xl font-bold font-mono text-blue-800">{underScrutinyCount}</div>
            <div className="text-[11px] text-slate-500 font-medium">Under review</div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <div>
            <div className="text-xl font-bold font-mono text-emerald-800">{verifiedCount}</div>
            <div className="text-[11px] text-slate-500 font-medium">Verified documents</div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex items-center gap-2.5">
          <FileText className="w-5 h-5 text-rose-600" />
          <div>
            <div className="text-xl font-bold font-mono text-rose-800">{deficientCount}</div>
            <div className="text-[11px] text-slate-500 font-medium">Deficiencies Raised</div>
          </div>
        </div>
      </div>

      {/* Submitted Documents Table - Matching Section 10 */}
      <div id="submitted-documents" className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#071a30]">
              SUBMITTED DOCUMENTS
            </h2>
            <p className="text-[11px] text-slate-500">
              Select a document to run the available evidence checks and review advisory findings.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-700">
            {submittedDocs.length} document records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f1f5f9] border-b border-slate-300 text-slate-700 uppercase font-semibold text-[10px] tracking-wider">
                <th className="px-3.5 py-2.5">Document</th>
                <th className="px-3.5 py-2.5 w-36">Tracking ID</th>
                <th className="px-3.5 py-2.5 w-28">Uploaded Date</th>
                <th className="px-3.5 py-2.5 w-36">Scrutiny Status</th>
                <th className="px-3.5 py-2.5 text-right w-40">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {submittedDocs.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">No document records are available for this application.</td></tr>
              ) : submittedDocs.map((doc) => {
                const trackingCode = doc.trackingId || doc.details?.trackingId || "Not assigned";

                return (
                  <tr
                    key={doc.id}
                    className="transition-colors hover:bg-blue-50/30"
                  >
                    <td className="px-3.5 py-3">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{doc.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {doc.documentNumber} • {doc.category}
                      </div>
                    </td>

                    <td className="px-3.5 py-3 font-mono font-bold text-slate-800 text-[11px]">
                      {trackingCode}
                    </td>

                    <td className="px-3.5 py-3 text-slate-600 font-mono text-[11px]">
                      {new Date(doc.submissionDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>

                    <td className="px-3.5 py-3">
                      <StatusBadge status={doc.status} size="sm" />
                    </td>

                    <td className="px-3.5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedPreviewDoc(doc)}
                          className="px-2 py-1 text-slate-700 hover:bg-slate-100 border border-slate-300 rounded text-[11px] font-medium transition inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3 text-slate-500" />
                          <span>View</span>
                        </button>

                        <Link
                          to={`/aicte/review/${inst.id}/${doc.id}`}
                          className="px-3 py-1 rounded bg-[#0b2545] text-white text-xs font-bold transition hover:bg-slate-800 inline-flex items-center gap-1 shadow-xs"
                        >
                          <span>Open review</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick View Modal */}
      {selectedPreviewDoc && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="document-docket-title" className="bg-white rounded border border-slate-300 shadow-xl max-h-[85vh] max-w-lg w-full overflow-y-auto p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-sm text-[#071a30] flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-amber-600" />
                <span id="document-docket-title">Document Docket: {selectedPreviewDoc.name}</span>
              </h3>
              <button
                onClick={() => setSelectedPreviewDoc(null)}
                aria-label="Close document details"
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Tracking Ref:</span>
                <span className="font-mono font-bold text-[#071a30]">{selectedPreviewDoc.trackingId || "Not assigned"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Issuing Authority:</span>
                <span className="font-medium text-slate-900">{selectedPreviewDoc.issuingAuthority}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Document Number:</span>
                <span className="font-mono">{selectedPreviewDoc.documentNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Status:</span>
                <StatusBadge status={selectedPreviewDoc.status} size="sm" />
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">SHA-256 Checksum:</span>
                <span className="font-mono text-[11px] break-all">{selectedPreviewDoc.details.checksum}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
              <button
                onClick={() => setSelectedPreviewDoc(null)}
                className="px-3.5 py-1.5 border border-slate-300 rounded text-xs font-semibold hover:bg-slate-50"
              >
                Close
              </button>
              <Link
                to={`/aicte/review/${inst.id}/${selectedPreviewDoc.id}`}
                onClick={() => setSelectedPreviewDoc(null)}
                className="px-3.5 py-1.5 bg-[#071a30] hover:bg-[#134074] text-white rounded text-xs font-bold inline-flex items-center gap-1"
              >
                <span>Launch Scrutiny</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
