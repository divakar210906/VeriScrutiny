// src/pages/institution/MySubmissionsPage.tsx
import { Link } from "react-router-dom";
import { useDocuments } from "../../hooks/useDocuments";
import { StatusBadge } from "../../components/StatusBadge";
import { 
  FileCheck, 
  RotateCcw, 
  Upload, 
  AlertTriangle, 
  Search 
} from "lucide-react";
import { useState } from "react";

export default function MySubmissionsPage() {
  const { docs, loading } = useDocuments();
  const [search, setSearch] = useState("");

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading submissions...</div>;
  }

  const filtered = docs.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.documentNumber.toLowerCase().includes(search.toLowerCase())
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
            Audit register of regulatory documents filed by Kongu Engineering College
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search submissions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074]"
            />
          </div>
          <Link
            to="/institution/upload"
            className="flex items-center gap-1 px-3 py-1.5 bg-[#0b2545] hover:bg-[#134074] text-white rounded text-xs font-semibold shadow-sm transition"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>New Upload</span>
          </Link>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f1f5f9] border-b border-slate-300 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
                <th className="px-3.5 py-2.5">Document Title & Number</th>
                <th className="px-3.5 py-2.5">Category</th>
                <th className="px-3.5 py-2.5">Submitted On</th>
                <th className="px-3.5 py-2.5">Approval Status</th>
                <th className="px-3.5 py-2.5">AICTE Scrutiny Remarks</th>
                <th className="px-3.5 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((doc) => {
                const isCorrection = doc.status === "Needs Correction" || doc.status === "Rejected";
                const remarkText =
                  doc.details.rejectionReason ||
                  doc.details.scrutinySummary?.reason ||
                  "Under formal scrutiny by AICTE regional committee.";

                return (
                  <tr
                    key={doc.id}
                    className={`transition-colors ${
                      isCorrection ? "bg-amber-50/40 hover:bg-amber-50" : "hover:bg-blue-50/30"
                    }`}
                  >
                    <td className="px-3.5 py-3">
                      <div className="font-bold text-slate-900">{doc.name}</div>
                      <div className="text-[11px] font-mono text-slate-500">{doc.documentNumber}</div>
                    </td>
                    <td className="px-3.5 py-3 text-slate-600">
                      {doc.category}
                    </td>
                    <td className="px-3.5 py-3 text-slate-600 font-mono">
                      {new Date(doc.submissionDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-3.5 py-3">
                      <StatusBadge status={doc.status} size="sm" />
                    </td>
                    <td className="px-3.5 py-3 max-w-sm">
                      {isCorrection ? (
                        <div className="text-amber-950 font-medium bg-amber-100/70 p-2 rounded border border-amber-300 text-[11px] flex items-start gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                          <span>{remarkText}</span>
                        </div>
                      ) : (
                        <span className="text-slate-600 text-[11px]">{remarkText}</span>
                      )}
                    </td>
                    <td className="px-3.5 py-3 text-right whitespace-nowrap">
                      {isCorrection ? (
                        <Link
                          to="/institution/upload"
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-semibold transition inline-flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Re-upload</span>
                        </Link>
                      ) : (
                        <span className="text-slate-400 font-medium text-[11px]">
                          Under Review
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
          <span>Showing {filtered.length} submitted documents on record</span>
          <span className="font-mono text-slate-400">Application: APP-2026-00182</span>
        </div>
      </div>
    </div>
  );
}
