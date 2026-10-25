// src/pages/aicte/AicteDashboardPage.tsx
import { Link } from "react-router-dom";
import { aicteInstitutionsList } from "../../mockData";
import { StatusBadge } from "../../components/StatusBadge";
import { 
  Building2, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  ShieldCheck 
} from "lucide-react";

export default function AicteDashboardPage() {
  const pendingInstitutions = aicteInstitutionsList;

  return (
    <div className="space-y-5">
      {/* AICTE Directorate Header */}
      <div className="bg-white border border-slate-300 rounded shadow-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-amber-400 rounded">
                AICTE Official Portal
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Southern Regional Office (SRO) • Chennai
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-[#071a30] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <span>AICTE Scrutiny & Verification Dashboard</span>
            </h1>
            <p className="text-xs text-slate-600">
              Standing Regulatory Inspection & Approval Process Handbook (APH) Compliance Directorate
            </p>
          </div>

          <Link
            to="/aicte/institutions"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#071a30] hover:bg-slate-800 text-white rounded text-xs font-semibold shadow-sm transition"
          >
            <span>All Institutions (128)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Five High-Level Metric Cards requested by user */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Total Institutions */}
        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0b2545] flex-shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 font-mono leading-tight">128</div>
            <div className="text-xs text-slate-500 font-medium">Institutions</div>
          </div>
        </div>

        {/* Pending Scrutiny */}
        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-700 font-mono leading-tight">24</div>
            <div className="text-xs text-slate-500 font-medium">Pending Scrutiny</div>
          </div>
        </div>

        {/* Verified */}
        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-700 font-mono leading-tight">91</div>
            <div className="text-xs text-slate-500 font-medium">Verified</div>
          </div>
        </div>

        {/* Needs Review */}
        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-700 flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-700 font-mono leading-tight">9</div>
            <div className="text-xs text-slate-500 font-medium">Needs Review</div>
          </div>
        </div>

        {/* Deficient */}
        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 flex-shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-rose-700 font-mono leading-tight">4</div>
            <div className="text-xs text-slate-500 font-medium">Deficient</div>
          </div>
        </div>
      </div>

      {/* Institutions Awaiting Scrutiny Table */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#071a30] uppercase tracking-wide">
              Institutions Awaiting Scrutiny
            </h2>
            <p className="text-xs text-slate-500">
              Applications queued for algorithmic verification and standing committee inspection
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">AY 2026–27 Cycle</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f1f5f9] border-b border-slate-300 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
                <th className="px-3.5 py-2.5">Institution</th>
                <th className="px-3.5 py-2.5">Application</th>
                <th className="px-3.5 py-2.5">Documents Filed</th>
                <th className="px-3.5 py-2.5">Scrutiny Status</th>
                <th className="px-3.5 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {pendingInstitutions.map((inst) => (
                <tr key={inst.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-3.5 py-3">
                    <div className="font-bold text-slate-900 text-sm">{inst.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      ID: {inst.id} • AICTE ID: {inst.aictePermanentId} • {inst.district}, {inst.state}
                    </div>
                  </td>
                  <td className="px-3.5 py-3 font-mono font-bold text-[#0b2545]">
                    {inst.applicationId}
                  </td>
                  <td className="px-3.5 py-3">
                    <span className="font-mono font-semibold text-slate-800">
                      {inst.submittedCount} / {inst.totalRequired} documents
                    </span>
                    <div className="w-24 bg-slate-200 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-[#134074] h-1.5 rounded-full"
                        style={{ width: `${(inst.submittedCount / inst.totalRequired) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-3.5 py-3">
                    <StatusBadge status={inst.status} size="sm" />
                  </td>
                  <td className="px-3.5 py-3 text-right">
                    <Link
                      to={`/aicte/institution/${inst.id}`}
                      className="px-3 py-1.5 bg-[#0b2545] hover:bg-[#134074] text-white rounded text-xs font-semibold shadow-sm transition inline-flex items-center gap-1"
                    >
                      <span>Open</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
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
