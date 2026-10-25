// src/pages/institution/RequiredDocumentsPage.tsx
import { Link } from "react-router-dom";
import { requiredDocumentsList } from "../../mockData";
import { StatusBadge } from "../../components/StatusBadge";
import { 
  ClipboardList, 
  Upload, 
  CheckCircle2, 
  FileCheck2, 
  RotateCcw 
} from "lucide-react";

export default function RequiredDocumentsPage() {
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
            <span>Required Documents & Compliance Checklist</span>
          </h1>
          <p className="text-xs text-slate-500">
            Mandatory institutional submissions specified under AICTE Approval Process Handbook (APH) 2025–2026
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
                  {items.filter((i) => i.submitted).length} of {items.length} Submitted
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#f8fafc] border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px] tracking-wider">
                      <th className="px-3.5 py-2 w-28">Doc Code</th>
                      <th className="px-3.5 py-2">Document Name & Guidelines</th>
                      <th className="px-3.5 py-2 w-28">Requirement</th>
                      <th className="px-3.5 py-2 w-32">Status</th>
                      <th className="px-3.5 py-2 w-28 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-blue-50/20 transition-colors">
                        <td className="px-3.5 py-3 font-mono font-bold text-slate-700">
                          {item.code}
                        </td>
                        <td className="px-3.5 py-3">
                          <div className="font-bold text-slate-900">{item.name}</div>
                          <p className="text-[11px] text-slate-500 mt-0.5 max-w-xl">{item.guidelines}</p>
                          {item.remarks && (
                            <div className="mt-1 text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200">
                              <strong>Note:</strong> {item.remarks}
                            </div>
                          )}
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
                        <td className="px-3.5 py-3">
                          <StatusBadge status={item.status} size="sm" />
                        </td>
                        <td className="px-3.5 py-3 text-right">
                          {item.submitted ? (
                            item.status === "Needs Correction" ? (
                              <Link
                                to="/institution/upload"
                                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-semibold transition inline-flex items-center gap-1"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Re-upload</span>
                              </Link>
                            ) : (
                              <span className="text-emerald-700 font-semibold text-[11px] inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Filed</span>
                              </span>
                            )
                          ) : (
                            <Link
                              to="/institution/upload"
                              className="px-2.5 py-1 bg-[#0b2545] hover:bg-[#134074] text-white rounded text-[11px] font-semibold transition inline-flex items-center gap-1"
                            >
                              <Upload className="w-3 h-3 text-amber-400" />
                              <span>Upload</span>
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
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
