// src/pages/institution/InstitutionDashboardPage.tsx
import { Link } from "react-router-dom";
import { institution, requiredDocumentsList } from "../../mockData";
import { StatusBadge } from "../../components/StatusBadge";
import { 
  Building2, 
  FileCheck2, 
  Upload, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw 
} from "lucide-react";

export default function InstitutionDashboardPage() {
  const totalRequired = requiredDocumentsList.length; // 10
  const submittedCount = requiredDocumentsList.filter((d) => d.submitted).length; // 8
  const pendingCount = totalRequired - submittedCount; // 2
  const underReviewCount = requiredDocumentsList.filter((d) => d.status === "Under Review").length;
  const needsCorrectionCount = requiredDocumentsList.filter((d) => d.status === "Needs Correction").length;

  return (
    <div className="space-y-5">
      {/* Institution Welcome Header */}
      <div className="bg-white border border-slate-300 rounded shadow-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-[#0b2545] rounded border border-blue-200">
                Autonomous Institution
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Permanent AICTE ID: {institution.aictePermanentId}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-[#0b2545] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-600" />
              <span>{institution.name}</span>
            </h1>
            <p className="text-xs text-slate-600">
              Application ID: <strong className="font-mono text-slate-800">APP-2026-00182</strong> • Academic Cycle: 2026–2027
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/institution/upload"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0b2545] hover:bg-[#134074] text-white rounded text-xs font-semibold shadow-sm transition"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>Upload Document</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Simple Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Required Documents */}
        <div className="bg-white p-4 rounded border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-[#134074] flex-shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 font-mono leading-tight">{totalRequired}</div>
            <div className="text-xs text-slate-500 font-medium">Required Documents</div>
          </div>
        </div>

        {/* Submitted */}
        <div className="bg-white p-4 rounded border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-700 font-mono leading-tight">{submittedCount}</div>
            <div className="text-xs text-slate-500 font-medium">Submitted</div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white p-4 rounded border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 flex-shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-rose-700 font-mono leading-tight">{pendingCount}</div>
            <div className="text-xs text-slate-500 font-medium">Pending Upload</div>
          </div>
        </div>

        {/* Under Review */}
        <div className="bg-white p-4 rounded border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-700 font-mono leading-tight">{underReviewCount}</div>
            <div className="text-xs text-slate-500 font-medium">Under Review</div>
          </div>
        </div>
      </div>

      {/* Action Notice if Needs Correction */}
      {needsCorrectionCount > 0 && (
        <div className="p-3 bg-amber-50 border-l-4 border-amber-600 rounded text-xs text-amber-900 flex items-start justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Attention Required:</span> Faculty Declaration has been flagged with{" "}
              <strong>Needs Correction</strong>. Faculty cadre ratio declaration must be revised to 1:2:6 as per AICTE norms.
            </div>
          </div>
          <Link
            to="/institution/upload"
            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold text-[11px] whitespace-nowrap transition flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Re-upload</span>
          </Link>
        </div>
      )}

      {/* Document Submission Status Table */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#0b2545] uppercase tracking-wide">
              Document Submission Status
            </h2>
            <p className="text-xs text-slate-500">
              Track mandatory regulatory filings submitted to AICTE for approval
            </p>
          </div>
          <Link
            to="/institution/required-documents"
            className="text-xs font-semibold text-[#0056b3] hover:underline flex items-center gap-1"
          >
            <span>View Checklist Guidelines</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f1f5f9] border-b border-slate-300 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
                <th className="px-3.5 py-2.5">Document</th>
                <th className="px-3.5 py-2.5">Requirement</th>
                <th className="px-3.5 py-2.5">Submission State</th>
                <th className="px-3.5 py-2.5">Approval Status</th>
                <th className="px-3.5 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {requiredDocumentsList.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-3.5 py-2.5">
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="text-[11px] text-slate-500">{item.category}</div>
                  </td>
                  <td className="px-3.5 py-2.5">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium border border-slate-200">
                      {item.requirement}
                    </span>
                  </td>
                  <td className="px-3.5 py-2.5">
                    {item.submitted ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Submitted</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5 text-slate-300" />
                        <span>Not Submitted</span>
                      </span>
                    )}
                  </td>
                  <td className="px-3.5 py-2.5">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="px-3.5 py-2.5 text-right">
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
                        <Link
                          to="/institution/submissions"
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-[11px] font-medium transition inline-block"
                        >
                          View Status
                        </Link>
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
    </div>
  );
}
