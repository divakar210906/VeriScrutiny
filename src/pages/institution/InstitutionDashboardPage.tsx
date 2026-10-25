// src/pages/institution/InstitutionDashboardPage.tsx
import { Link } from "react-router-dom";
import { institution } from "../../mockData";
import { useDocuments } from "../../hooks/useDocuments";
import { StatusBadge } from "../../components/StatusBadge";
import { 
  Building2, 
  FileCheck2, 
  Upload, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw,
  ClipboardList
} from "lucide-react";

export default function InstitutionDashboardPage() {
  const { docs, loading } = useDocuments();

  const totalRequired = 10;
  const submittedCount = Math.min(docs.length, totalRequired);
  const pendingCount = Math.max(0, totalRequired - submittedCount);

  const deficiencyDocs = docs.filter((d) => d.status === "Deficiency Raised");
  const needsCorrectionDocs = docs.filter((d) => d.status === "Needs Correction");
  const underScrutinyCount = docs.filter(
    (d) => d.status === "Under Scrutiny" || d.status === "Submitted" || d.status === "Re-submitted" || d.status === "Under Review"
  ).length;
  const verifiedCount = docs.filter((d) => d.status === "Verified").length;

  // Determine Overall Application Status
  let overallStatus: "DEFICIENCY RAISED" | "ACTION REQUIRED" | "UNDER SCRUTINY" | "APPROVED" = "UNDER SCRUTINY";
  if (deficiencyDocs.length > 0) {
    overallStatus = "DEFICIENCY RAISED";
  } else if (needsCorrectionDocs.length > 0 || pendingCount > 0) {
    overallStatus = "ACTION REQUIRED";
  } else if (verifiedCount === totalRequired) {
    overallStatus = "APPROVED";
  }

  const overallStatusStyles = {
    "DEFICIENCY RAISED": "bg-rose-100 text-rose-900 border-rose-300",
    "ACTION REQUIRED": "bg-amber-100 text-amber-900 border-amber-300",
    "UNDER SCRUTINY": "bg-blue-100 text-blue-900 border-blue-300",
    "APPROVED": "bg-emerald-100 text-emerald-900 border-emerald-300",
  }[overallStatus];

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading institution dashboard...</div>;
  }

  return (
    <div className="space-y-5">
      {/* Institution Identity Header */}
      <div className="bg-white border border-slate-300 rounded shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-amber-400 rounded">
                AICTE Regulatory Portal
              </span>
              <span className="text-xs text-slate-600 font-mono">
                AICTE Permanent ID: <strong className="text-slate-900">{institution.aictePermanentId}</strong>
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="text-xs text-slate-600 font-mono">
                AISHE Code: <strong className="text-slate-900">{institution.aisheCode}</strong>
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="text-xs text-slate-600">
                Approval Year: <strong className="text-slate-900">2026–27</strong>
              </span>
            </div>

            <h1 className="text-lg sm:text-xl font-bold text-[#0b2545] flex items-center gap-2 pt-1">
              <Building2 className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>{institution.name}</span>
            </h1>

            <p className="text-xs text-slate-600">
              Application ID: <strong className="font-mono text-slate-900">APP-2026-00182</strong> • Category: Extension of Approval (EoA)
            </p>
          </div>

          {/* Overall Application Status Badge */}
          <div className="flex flex-col sm:items-end justify-center gap-1.5 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              Overall Application Status
            </span>
            <span className={`px-3 py-1.5 rounded font-black text-xs tracking-wider border shadow-xs ${overallStatusStyles}`}>
              {overallStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar & Summary Stats */}
      <div className="bg-white border border-slate-300 rounded shadow-sm p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div>
            <span className="font-bold text-slate-800 text-sm">Mandatory Documents Progress</span>
            <span className="text-slate-500 ml-2">({submittedCount} / {totalRequired} Submitted)</span>
          </div>
          <span className="font-mono font-bold text-[#0b2545]">
            {Math.round((submittedCount / totalRequired) * 100)}% Complete
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
          <div 
            className="bg-[#0b2545] h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${(submittedCount / totalRequired) * 100}%` }}
          ></div>
        </div>

        {/* 4 Quick Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center gap-2.5">
            <FileCheck2 className="w-4 h-4 text-slate-700" />
            <div>
              <div className="font-bold text-slate-900">{totalRequired}</div>
              <div className="text-[11px] text-slate-500">Required Documents</div>
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded border border-blue-200 flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-[#134074]" />
            <div>
              <div className="font-bold text-[#134074]">{underScrutinyCount}</div>
              <div className="text-[11px] text-slate-600">Under Scrutiny</div>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded border border-emerald-200 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <div>
              <div className="font-bold text-emerald-800">{verifiedCount}</div>
              <div className="text-[11px] text-emerald-700">Verified</div>
            </div>
          </div>

          <div className="p-3 bg-rose-50 rounded border border-rose-200 flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <div>
              <div className="font-bold text-rose-800">{deficiencyDocs.length + needsCorrectionDocs.length}</div>
              <div className="text-[11px] text-rose-700">Deficiency / Action Req</div>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Action Banner for Deficiencies */}
      {deficiencyDocs.length > 0 && (
        <div className="p-4 bg-rose-50 border-2 border-rose-500 rounded shadow-sm text-xs text-rose-950 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-sm text-rose-900 uppercase tracking-wide">
                  Attention Required: Regulatory Deficiency Raised by AICTE In-Charge
                </span>
                {deficiencyDocs.map((doc) => (
                  <div key={doc.id} className="text-xs text-rose-800">
                    <strong>{doc.name}:</strong> Status is <span className="font-bold">DEFICIENCY RAISED</span>.{" "}
                    Remark: <em>"{doc.details.rejectionReason || doc.details.officerRemarks || doc.details.scrutinySummary?.reason || 'Clarification required.'}"</em>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to={`/institution/upload?replace=${deficiencyDocs[0]?.id}`}
              className="px-3.5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded font-bold text-xs whitespace-nowrap shadow-sm transition flex items-center gap-1.5 flex-shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replace / Re-upload Document</span>
            </Link>
          </div>
        </div>
      )}

      {/* Action Banner for Needs Correction (e.g. Faculty Declaration) */}
      {deficiencyDocs.length === 0 && needsCorrectionDocs.length > 0 && (
        <div className="p-3.5 bg-amber-50 border-l-4 border-amber-600 rounded text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Action Required:</span> {needsCorrectionDocs[0]?.name} requires revision:{" "}
              <span>{needsCorrectionDocs[0]?.details?.rejectionReason || "Faculty cadre ratio declaration must be revised to 1:2:6 as per AICTE norms."}</span>
            </div>
          </div>
          <Link
            to={`/institution/upload?replace=${needsCorrectionDocs[0]?.id}`}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold text-xs whitespace-nowrap transition flex items-center gap-1 self-start sm:self-auto"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Re-upload</span>
          </Link>
        </div>
      )}

      {/* Quick Action Navigation Buttons */}
      <div className="bg-white border border-slate-300 rounded shadow-sm p-4">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
          Quick Actions
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            to="/institution/required-documents"
            className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded transition flex items-center justify-between text-xs font-semibold text-[#0b2545]"
          >
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-amber-600" />
              <span>View Required Documents</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <Link
            to="/institution/upload"
            className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded transition flex items-center justify-between text-xs font-semibold text-[#0b2545]"
          >
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#134074]" />
              <span>Upload Document</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <Link
            to="/institution/submissions"
            className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded transition flex items-center justify-between text-xs font-semibold text-[#0b2545]"
          >
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-700" />
              <span>View Submissions</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* Recent Submissions Table */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-[#0b2545] uppercase tracking-wider">
              Recent Document Submissions
            </h2>
            <p className="text-[11px] text-slate-500">
              Regulatory documents submitted for scrutiny in Approval Cycle 2026–27
            </p>
          </div>
          <Link
            to="/institution/submissions"
            className="text-xs font-semibold text-[#0056b3] hover:underline flex items-center gap-1"
          >
            <span>View All ({docs.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-slate-200 text-slate-700 uppercase font-semibold text-[10px] tracking-wider">
                <th className="px-3.5 py-2.5">Document</th>
                <th className="px-3.5 py-2.5">Submitted Date</th>
                <th className="px-3.5 py-2.5">Tracking ID</th>
                <th className="px-3.5 py-2.5">Scrutiny Status</th>
                <th className="px-3.5 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {docs.slice(0, 6).map((doc) => {
                const isDeficient = doc.status === "Deficiency Raised" || doc.status === "Needs Correction";
                const trackingCode = doc.trackingId || doc.details?.trackingId || `VS-2026-KEC-${doc.id.replace("doc-", "100")}`;

                return (
                  <tr 
                    key={doc.id} 
                    className={`transition-colors ${
                      isDeficient ? "bg-rose-50/50 hover:bg-rose-50" : "hover:bg-blue-50/20"
                    }`}
                  >
                    <td className="px-3.5 py-3">
                      <div className="font-bold text-slate-900">{doc.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{doc.documentNumber}</div>
                    </td>
                    <td className="px-3.5 py-3 text-slate-600 font-mono text-[11px]">
                      {new Date(doc.submissionDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>
                    <td className="px-3.5 py-3 font-mono font-semibold text-slate-800 text-[11px]">
                      {trackingCode}
                    </td>
                    <td className="px-3.5 py-3">
                      <StatusBadge status={doc.status} size="sm" />
                    </td>
                    <td className="px-3.5 py-3 text-right">
                      {isDeficient ? (
                        <Link
                          to={`/institution/upload?replace=${doc.id}`}
                          className="px-2.5 py-1 bg-rose-700 hover:bg-rose-800 text-white rounded text-[11px] font-semibold transition inline-flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Replace / Re-upload</span>
                        </Link>
                      ) : (
                        <Link
                          to="/institution/submissions"
                          className="text-[#0056b3] hover:underline font-semibold text-[11px]"
                        >
                          View Submission
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
    </div>
  );
}
