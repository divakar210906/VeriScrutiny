// src/pages/aicte/AicteDashboardPage.tsx
import { Link } from "react-router-dom";
import { aicteInstitutionsList } from "../../mockData";
import { useDocuments } from "../../hooks/useDocuments";
import { StatusBadge } from "../../components/StatusBadge";
import { 
  Building2, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck,
  FileCheck2
} from "lucide-react";

export default function AicteDashboardPage() {
  const { docs } = useDocuments();
  const primaryHasDeficiency = docs.some((doc) => doc.status === "Deficiency Raised" || doc.status === "Needs Correction");
  const primaryHasReview = docs.some((doc) => ["Under Scrutiny", "Under Review", "Re-submitted"].includes(doc.status));
  const allRecordsVerified = docs.length > 0 && docs.every((doc) => doc.status === "Verified");
  const primaryStatus = primaryHasDeficiency
    ? "Deficient"
    : allRecordsVerified
    ? "Verified"
    : primaryHasReview
    ? "Under Review"
    : "Pending Scrutiny";
  const institutions = aicteInstitutionsList.map((item) => item.id === "KEC001"
    ? {
        ...item,
        documents: docs,
        documentRecordCount: docs.length,
        status: primaryStatus,
      }
    : item);
  const pendingCount = docs.filter((doc) => ["Submitted", "Pending"].includes(doc.status)).length;
  const underReviewCount = docs.filter((doc) => ["Under Scrutiny", "Under Review", "Re-submitted"].includes(doc.status)).length;
  const deficiencyCount = docs.filter((doc) => ["Deficiency Raised", "Needs Correction"].includes(doc.status)).length;
  const completedCount = docs.filter((doc) => doc.status === "Verified").length;
  const recentAnalyses = docs
    .filter((doc) => doc.details.analysisResult)
    .sort((left, right) => (right.details.analysisDate ?? "").localeCompare(left.details.analysisDate ?? ""))
    .slice(0, 5);

  return (
    <div className="space-y-5">
      {/* Directorate Header */}
      <div className="bg-white border border-slate-300 rounded shadow-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-amber-400 rounded">
                Scrutiny Portal
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Southern Region • Officer workload
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-[#071a30] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <span>Southern Region – Scrutiny Dashboard</span>
            </h1>
            <p className="text-xs text-slate-600">
              Demonstration application queue · Approval cycle 2026–27
            </p>
          </div>

          <Link
            to="/aicte/institutions"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#071a30] hover:bg-slate-800 text-white rounded text-xs font-semibold shadow-sm transition"
          >
            <span>Open application queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Current browser-local workload counts */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Demo records */}
        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0b2545] flex-shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 font-mono leading-tight">{docs.length}</div>
            <div className="text-xs text-slate-500 font-medium">Document records</div>
          </div>
        </div>

        {/* Pending Scrutiny */}
        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-700 font-mono leading-tight">{pendingCount}</div>
            <div className="text-xs text-slate-500 font-medium">Pending review</div>
          </div>
        </div>

        {/* Under Scrutiny */}
        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 flex-shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-700 font-mono leading-tight">{underReviewCount}</div>
            <div className="text-xs text-slate-500 font-medium">Under scrutiny</div>
          </div>
        </div>

        {/* Deficiencies Raised */}
        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-rose-700 font-mono leading-tight">{deficiencyCount}</div>
            <div className="text-xs text-slate-500 font-medium">Action required</div>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-700 font-mono leading-tight">{completedCount}</div>
            <div className="text-xs text-slate-500 font-medium">Verified records</div>
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded border border-slate-300 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[#071a30]">Recent VeriScrutiny recommendations</h2>
          <p className="mt-1 text-xs text-slate-600">Advisory analysis only; officers make all workflow decisions.</p>
        </div>
        {recentAnalyses.length === 0 ? (
          <p className="px-4 py-5 text-sm text-slate-600">No document analyses have been run in this browser session.</p>
        ) : (
          <ul className="divide-y divide-slate-200">
            {recentAnalyses.map((doc) => (
              <li key={doc.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{doc.name}</p>
                  <p className="mt-1 text-xs text-slate-600">
                    {doc.details.analysisResult?.recommendation} · {doc.details.analysisResult?.summary.failed} mismatches · {doc.details.analysisResult?.summary.warnings} require review
                  </p>
                </div>
                <Link
                  to={`/aicte/review/${doc.details.institutionId || "KEC001"}/${doc.id}`}
                  className="text-sm font-semibold text-blue-800 hover:underline"
                >
                  Review findings
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Institutions Awaiting Scrutiny Table */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#071a30] uppercase tracking-wide">
              Applications in the demonstration queue
            </h2>
            <p className="text-xs text-slate-500">
              One illustrative application; its document records reflect the current browser workflow state.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">AY 2026–27 Cycle</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f1f5f9] border-b border-slate-300 text-slate-700 uppercase font-semibold text-[10px] tracking-wider">
                <th className="px-3.5 py-2.5">Institution</th>
                <th className="px-3.5 py-2.5">AICTE ID</th>
                <th className="px-3.5 py-2.5">Application</th>
                <th className="px-3.5 py-2.5 text-center">Document Records</th>
                <th className="px-3.5 py-2.5">Scrutiny Status</th>
                <th className="px-3.5 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {institutions.map((inst) => {
                return (
                  <tr
                    key={inst.id}
                    className="transition-colors hover:bg-blue-50/30"
                  >
                    <td className="px-3.5 py-3">
                      <div className="font-bold text-slate-900">{inst.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {inst.district}, {inst.state} • {inst.type}
                      </div>
                    </td>
                    <td className="px-3.5 py-3 font-mono font-semibold text-slate-800">
                      {inst.aictePermanentId}
                    </td>
                    <td className="px-3.5 py-3 font-mono text-slate-700">
                      {inst.applicationId}
                    </td>
                    <td className="px-3.5 py-3 text-center font-mono font-bold text-slate-900">
                      {inst.documentRecordCount}
                    </td>
                    <td className="px-3.5 py-3">
                      <StatusBadge status={inst.status} size="sm" />
                    </td>
                    <td className="px-3.5 py-3 text-right">
                      <Link
                        to={`/aicte/institution/${inst.id}`}
                        className="px-3 py-1.5 bg-[#071a30] hover:bg-slate-800 text-white rounded text-xs font-bold transition inline-flex items-center gap-1 shadow-xs"
                      >
                        <span>Open Institution</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
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
