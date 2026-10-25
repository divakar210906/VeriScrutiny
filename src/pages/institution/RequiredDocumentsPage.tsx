// src/pages/institution/RequiredDocumentsPage.tsx
import { Link } from "react-router-dom";
import { requiredDocumentsList } from "../../mockData";
import { useDocuments } from "../../hooks/useDocuments";
import { StatusBadge } from "../../components/StatusBadge";
import { 
  ClipboardList, 
  Upload, 
  RotateCcw,
  FileCheck2,
  AlertTriangle,
  Info
} from "lucide-react";

export default function RequiredDocumentsPage() {
  const { docs } = useDocuments();

  const categories = [
    "Fire & Safety",
    "Academic / Affiliation",
    "Infrastructure",
    "Governance & Finance",
  ] as const;

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#0b2545] flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-amber-600" />
            <span>Documents Required for Selected Application / Approval Category</span>
          </h1>
          <p className="text-xs text-slate-500">
            Regulatory documentation checklist mapped to institutional application classification
          </p>
        </div>

        <Link
          to="/institution/upload"
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0b2545] hover:bg-[#134074] text-white rounded text-xs font-semibold shadow-sm transition"
        >
          <Upload className="w-3.5 h-3.5 text-amber-400" />
          <span>Upload Document</span>
        </Link>
      </div>

      {/* Application Context Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded p-3.5 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">Application Type</span>
            <span className="font-bold text-[#0b2545]">Extension of Approval (EoA) / Approval Process</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">Academic Year</span>
            <span className="font-bold text-[#0b2545]">2026–27</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">Regulatory Body</span>
            <span className="font-bold text-[#0b2545]">AICTE Southern Regional Office</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">Configuration</span>
            <span className="font-mono text-xs bg-slate-200 px-1.5 py-0.5 rounded text-slate-800">Sample / Demo Set</span>
          </div>
        </div>
      </div>

      {/* Explanatory Note regarding applicability */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900 flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
        <p>
          Document requirements vary by institution type, program category (Engineering, Management, Pharmacy, Architecture), and application level (New Institution vs. Extension of Approval). The items displayed below represent the required filings for this specific application docket.
        </p>
      </div>

      {/* Grouped by Categories */}
      <div className="space-y-5">
        {categories.map((category) => {
          const items = requiredDocumentsList.filter((d) => d.category === category);
          if (items.length === 0) return null;

          return (
            <div key={category} className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-xs font-bold text-[#0b2545] uppercase tracking-wider flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-amber-600" />
                  <span>{category}</span>
                </h2>
                <span className="text-[11px] text-slate-500 font-mono">
                  {items.length} Required Parameters
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#f8fafc] border-b border-slate-200 text-slate-700 uppercase font-semibold text-[10px] tracking-wider">
                      <th className="px-3.5 py-2">Document Name</th>
                      <th className="px-3.5 py-2 w-36">Category</th>
                      <th className="px-3.5 py-2 w-28">Requirement</th>
                      <th className="px-3.5 py-2 w-52">Validity Requirement</th>
                      <th className="px-3.5 py-2 w-36">Submission Status</th>
                      <th className="px-3.5 py-2 w-40 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item) => {
                      // Find live matching doc in docs array
                      const matchedDoc = docs.find(
                        (d) => d.id === item.docId || d.name.toLowerCase().includes(item.name.toLowerCase())
                      );
                      const currentStatus = matchedDoc ? matchedDoc.status : item.status;
                      const hasDeficiency = currentStatus === "Deficiency Raised" || currentStatus === "Needs Correction";
                      const remarkText = matchedDoc?.details?.rejectionReason || matchedDoc?.details?.officerRemarks || item.remarks;

                      return (
                        <tr 
                          key={item.id} 
                          className={`transition-colors ${
                            hasDeficiency ? "bg-rose-50/40 hover:bg-rose-50" : "hover:bg-blue-50/20"
                          }`}
                        >
                          <td className="px-3.5 py-3">
                            <div className="font-bold text-slate-900">{item.name}</div>
                            <p className="text-[11px] text-slate-500 mt-0.5 max-w-xl">{item.guidelines}</p>
                            {hasDeficiency && remarkText && (
                              <div className="mt-1.5 text-[11px] text-rose-800 bg-rose-50 p-1.5 rounded border border-rose-200 flex items-start gap-1">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <strong>AICTE Officer Remark:</strong> {remarkText}
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="px-3.5 py-3 text-slate-600 font-medium text-xs">
                            {item.category}
                          </td>
                          <td className="px-3.5 py-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                item.requirement === "Mandatory"
                                  ? "bg-red-50 text-red-700 border border-red-200"
                                  : "bg-slate-100 text-slate-600 border border-slate-200"
                              }`}
                            >
                              {item.requirement}
                            </span>
                          </td>
                          <td className="px-3.5 py-3 text-slate-600 text-[11px]">
                            {item.validityRequirement || "Validity / applicable validity requirement"}
                          </td>
                          <td className="px-3.5 py-3">
                            <StatusBadge status={currentStatus} size="sm" />
                          </td>
                          <td className="px-3.5 py-3 text-right">
                            {hasDeficiency ? (
                              <Link
                                to={`/institution/upload?replace=${matchedDoc?.id || item.docId || 'doc-2'}`}
                                className="px-2.5 py-1 bg-rose-700 hover:bg-rose-800 text-white rounded text-[11px] font-semibold transition inline-flex items-center gap-1 shadow-xs"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Replace / Re-upload</span>
                              </Link>
                            ) : matchedDoc ? (
                              <div className="flex items-center justify-end gap-2">
                                <Link
                                  to="/institution/submissions"
                                  className="text-[#0056b3] hover:underline font-semibold text-[11px]"
                                >
                                  View
                                </Link>
                                <span className="text-slate-300">•</span>
                                <Link
                                  to={`/institution/upload?replace=${matchedDoc.id}`}
                                  className="text-slate-600 hover:text-slate-900 font-medium text-[11px]"
                                >
                                  Replace
                                </Link>
                              </div>
                            ) : (
                              <Link
                                to={`/institution/upload?type=${encodeURIComponent(item.name)}&category=${encodeURIComponent(item.category)}`}
                                className="px-2.5 py-1 bg-[#0b2545] hover:bg-[#134074] text-white rounded text-[11px] font-semibold transition inline-flex items-center gap-1"
                              >
                                <Upload className="w-3 h-3 text-amber-400" />
                                <span>Upload</span>
                              </Link>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
