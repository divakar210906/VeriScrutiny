// src/pages/institution/MySubmissionsPage.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDocuments } from "../../hooks/useDocuments";
import { StatusBadge } from "../../components/StatusBadge";
import { 
  FileCheck, 
  RotateCcw, 
  Upload, 
  AlertTriangle, 
  Search,
  Eye,
  X
} from "lucide-react";
import type { Document } from "../../types";

export default function MySubmissionsPage() {
  const { docs, loading } = useDocuments();
  const [search, setSearch] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading submissions...</div>;
  }

  const filtered = docs.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.documentNumber.toLowerCase().includes(search.toLowerCase()) ||
      (d.trackingId && d.trackingId.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#0b2545] flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-amber-600" />
            <span>My Submitted Documents</span>
          </h1>
          <p className="text-xs text-slate-500">
            Institutional regulatory repository and AICTE scrutiny tracking register
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by title, number, or tracking ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] w-64"
            />
          </div>
          <Link
            to="/institution/upload"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0b2545] hover:bg-[#134074] text-white rounded text-xs font-semibold shadow-sm transition"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>New Upload</span>
          </Link>
        </div>
      </div>

      {/* Submissions Table with Exact Columns Requested in Section 6 */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f1f5f9] border-b border-slate-300 text-slate-700 uppercase font-semibold text-[10px] tracking-wider">
                <th className="px-3.5 py-2.5">Document</th>
                <th className="px-3.5 py-2.5 w-36">Tracking ID</th>
                <th className="px-3.5 py-2.5 w-28">Submitted Date</th>
                <th className="px-3.5 py-2.5 w-36">Current Status</th>
                <th className="px-3.5 py-2.5">AICTE Remark</th>
                <th className="px-3.5 py-2.5 text-right w-44">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((doc) => {
                const isDeficient = doc.status === "Deficiency Raised" || doc.status === "Needs Correction";
                const trackingCode = doc.trackingId || doc.details?.trackingId || `VS-2026-KEC-${doc.id.replace("doc-", "100")}`;
                const remarkText =
                  doc.details.rejectionReason ||
                  doc.details.officerRemarks ||
                  doc.details.scrutinySummary?.reason ||
                  (doc.status === "Verified" ? "Certified compliant by AICTE Scrutiny Cell." : "Queued for standing scrutiny.");

                return (
                  <tr
                    key={doc.id}
                    className={`transition-colors ${
                      isDeficient 
                        ? "bg-rose-50/70 border-l-4 border-l-rose-600 hover:bg-rose-100/50" 
                        : doc.status === "Re-submitted"
                        ? "bg-indigo-50/30 hover:bg-indigo-50/60"
                        : "hover:bg-blue-50/30"
                    }`}
                  >
                    {/* Document */}
                    <td className="px-3.5 py-3">
                      <div className="font-bold text-slate-900">{doc.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {doc.documentNumber} • {doc.category}
                      </div>
                    </td>

                    {/* Tracking ID */}
                    <td className="px-3.5 py-3 font-mono font-bold text-slate-800 text-[11px]">
                      {trackingCode}
                    </td>

                    {/* Submitted Date */}
                    <td className="px-3.5 py-3 text-slate-600 font-mono text-[11px]">
                      {new Date(doc.submissionDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>

                    {/* Current Status */}
                    <td className="px-3.5 py-3">
                      <StatusBadge status={doc.status} size="sm" />
                    </td>

                    {/* AICTE Remark */}
                    <td className="px-3.5 py-3">
                      {isDeficient ? (
                        <div className="text-rose-900 font-medium text-[11px] flex items-start gap-1.5 bg-rose-100/80 p-1.5 rounded border border-rose-300">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
                          <span>{remarkText}</span>
                        </div>
                      ) : (
                        <span className="text-slate-600 text-[11px]">{remarkText}</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-3.5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedDoc(doc)}
                          className="px-2 py-1 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded text-[11px] font-medium transition inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3 text-slate-500" />
                          <span>Details</span>
                        </button>

                        {isDeficient ? (
                          <Link
                            to={`/institution/upload?replace=${doc.id}`}
                            className="px-2.5 py-1 bg-rose-700 hover:bg-rose-800 text-white rounded text-[11px] font-semibold transition inline-flex items-center gap-1 shadow-xs"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Replace / Re-upload</span>
                          </Link>
                        ) : (
                          <Link
                            to={`/institution/upload?replace=${doc.id}`}
                            className="px-2 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded text-[11px] font-medium transition"
                          >
                            Replace
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded border border-slate-300 shadow-xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-sm text-[#0b2545] flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber-600" />
                <span>Document Details: {selectedDoc.name}</span>
              </h3>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Tracking Reference:</span>
                <span className="font-mono font-bold text-[#0b2545]">{selectedDoc.trackingId || `VS-2026-KEC-${selectedDoc.id.replace("doc-", "100")}`}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Registration / Certificate No:</span>
                <span className="font-mono font-bold">{selectedDoc.documentNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Issuing Authority:</span>
                <span className="font-medium text-slate-900">{selectedDoc.issuingAuthority}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Current Scrutiny Status:</span>
                <StatusBadge status={selectedDoc.status} size="sm" />
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Date of Submission:</span>
                <span className="font-mono">{new Date(selectedDoc.submissionDate).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">File Details:</span>
                <span className="font-mono">{selectedDoc.details.fileName} ({selectedDoc.details.fileSize})</span>
              </div>

              {selectedDoc.details.rejectionReason && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-900 text-xs mt-2">
                  <div className="font-bold flex items-center gap-1 mb-0.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>AICTE Officer Scrutiny Remark:</span>
                  </div>
                  <div>{selectedDoc.details.rejectionReason}</div>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-3.5 py-1.5 border border-slate-300 rounded text-xs font-semibold hover:bg-slate-50"
              >
                Close
              </button>
              {(selectedDoc.status === "Deficiency Raised" || selectedDoc.status === "Needs Correction") && (
                <Link
                  to={`/institution/upload?replace=${selectedDoc.id}`}
                  onClick={() => setSelectedDoc(null)}
                  className="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded text-xs font-bold inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replace / Re-upload</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
