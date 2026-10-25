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

  const inst = aicteInstitutionsList.find((i) => i.id === id) || aicteInstitutionsList[0];

  // For Kongu Engineering College, use active docs from useDocuments() for real-time reactivity
  const isKEC = id === "KEC001" || id === "1" || inst.id === "KEC001";
  const submittedDocs = isKEC ? docs : inst.documents;

  const verifiedCount = submittedDocs.filter((d) => d.status === "Verified").length;
  const underScrutinyCount = submittedDocs.filter((d) => d.status === "Under Scrutiny" || d.status === "Submitted" || d.status === "Re-submitted").length;
  const deficientCount = submittedDocs.filter((d) => d.status === "Deficiency Raised" || d.status === "Needs Correction").length;

  return (
    <div className="space-y-5">
      {/* Back Link & Header */}
      <div className="bg-white border border-slate-300 rounded shadow-sm p-4 space-y-2">
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
                AICTE Official Review
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
            <StatusBadge status={inst.status} size="lg" />
          </div>
        </div>
      </div>

      {/* Compliance / Submission Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex items-center gap-2.5">
          <FileCheck2 className="w-5 h-5 text-slate-700" />
          <div>
            <div className="text-xl font-bold font-mono text-slate-900">
              {submittedDocs.length} / {inst.totalRequired}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Documents Submitted</div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex items-center gap-2.5">
          <Clock className="w-5 h-5 text-blue-700" />
          <div>
            <div className="text-xl font-bold font-mono text-blue-800">{underScrutinyCount}</div>
            <div className="text-[11px] text-slate-500 font-medium">Pending Review</div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <div>
            <div className="text-xl font-bold font-mono text-emerald-800">{verifiedCount}</div>
            <div className="text-[11px] text-slate-500 font-medium">Verified Clean</div>
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
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#071a30]">
              SUBMITTED DOCUMENTS
            </h2>
            <p className="text-[11px] text-slate-500">
              Institutional filings queued for verification against AICTE statutory standards
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-700">
            {submittedDocs.length} Documents Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f1f5f9] border-b border-slate-300 text-slate-700 uppercase font-semibold text-[10px] tracking-wider">
                <th className="px-3.5 py-2.5">Document</th>
                <th className="px-3.5 py-2.5 w-36">Tracking ID</th>
                <th className="px-3.5 py-2.5 w-28">Uploaded Date</th>
                <th className="px-3.5 py-2.5 w-44">File Checksum</th>
                <th className="px-3.5 py-2.5 w-36">Scrutiny Status</th>
                <th className="px-3.5 py-2.5 text-right w-40">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {submittedDocs.map((doc) => {
                const trackingCode = doc.trackingId || doc.details?.trackingId || `VS-2026-KEC-${doc.id.replace("doc-", "100")}`;
                const checksumShort = doc.details?.checksum ? `${doc.details.checksum.substring(0, 14)}...` : "e3b0c44298fc...";

                return (
                  <tr
                    key={doc.id}
                    className={`transition-colors ${
                      doc.id === "doc-2"
                        ? "bg-amber-50/40 hover:bg-amber-50/70"
                        : "hover:bg-blue-50/20"
                    }`}
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

                    <td className="px-3.5 py-3 font-mono text-slate-500 text-[11px]" title={doc.details?.checksum}>
                      {checksumShort}
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
                          className={`px-3 py-1 rounded text-xs font-bold transition inline-flex items-center gap-1 shadow-xs ${
                            doc.id === "doc-2"
                              ? "bg-[#071a30] hover:bg-[#134074] text-white"
                              : "bg-[#0b2545] hover:bg-slate-800 text-white"
                          }`}
                        >
                          <span>Start Scrutiny</span>
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
          <div className="bg-white rounded border border-slate-300 shadow-xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-sm text-[#071a30] flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-amber-600" />
                <span>Document Docket: {selectedPreviewDoc.name}</span>
              </h3>
              <button
                onClick={() => setSelectedPreviewDoc(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Tracking Ref:</span>
                <span className="font-mono font-bold text-[#071a30]">{selectedPreviewDoc.trackingId || `VS-2026-KEC-${selectedPreviewDoc.id.replace("doc-", "100")}`}</span>
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
