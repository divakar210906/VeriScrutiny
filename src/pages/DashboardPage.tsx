// src/pages/DashboardPage.tsx
import { Link } from "react-router-dom";
import { useDocuments } from "../hooks/useDocuments";
import { institution } from "../mockData";
import { StatusBadge } from "../components/StatusBadge";
import { 
  FileCheck2, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Upload, 
  ArrowRight, 
  Building2, 
  Clock 
} from "lucide-react";

export default function DashboardPage() {
  const { docs, loading } = useDocuments();

  const total = docs.length;
  const verifiedCount = docs.filter((d) => d.status === "Verified").length;
  const reviewCount = docs.filter((d) => d.status === "Needs Review").length;
  const rejectedCount = docs.filter((d) => d.status === "Rejected").length;

  const complianceRate = total > 0 ? Math.round((verifiedCount / total) * 100) : 0;

  // Recent documents sorted by submission date
  const recentDocs = [...docs]
    .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime())
    .slice(0, 6);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Loading institutional dashboard data...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Institution Information Strip */}
      <div className="bg-white border border-slate-300 rounded shadow-sm p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-[#0b2545] rounded border border-blue-200">
                Autonomous Institution
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded border border-emerald-200">
                NAAC A++ Accredited
              </span>
              <span className="text-xs text-slate-500 font-mono">
                AISHE: {institution.aisheCode}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-[#0b2545] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>{institution.name}</span>
            </h1>
            <p className="text-xs text-slate-600">
              {institution.address}, {institution.district}, {institution.state} – {institution.pinCode} • Affiliated to {institution.university}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-200 text-xs">
            <div className="bg-slate-50 border border-slate-200 rounded px-3 py-1.5">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">AICTE Permanent ID</span>
              <span className="font-mono font-bold text-[#0b2545]">{institution.aictePermanentId}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded px-3 py-1.5">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Scrutiny Window</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                AY 2026–27 Open
              </span>
            </div>
            <Link
              to="/submit"
              className="flex items-center gap-1.5 px-3 py-2 bg-[#0b2545] hover:bg-[#134074] text-white rounded font-medium shadow-sm transition"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Summary Statistics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Total Documents */}
        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-[#134074] flex-shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 leading-tight font-mono">{total}</div>
            <div className="text-xs text-slate-500 font-medium">Total Documents</div>
          </div>
        </div>

        {/* Verified */}
        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-700 leading-tight font-mono">{verifiedCount}</div>
            <div className="text-xs text-slate-500 font-medium">Verified (Passed)</div>
          </div>
        </div>

        {/* Needs Review */}
        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-700 leading-tight font-mono">{reviewCount}</div>
            <div className="text-xs text-slate-500 font-medium">Needs Review</div>
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 flex-shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-rose-700 leading-tight font-mono">{rejectedCount}</div>
            <div className="text-xs text-slate-500 font-medium">Rejected</div>
          </div>
        </div>

        {/* Compliance Rate */}
        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm col-span-2 sm:col-span-1 flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 flex-shrink-0">
            <span className="font-bold text-sm">%</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-indigo-800 leading-tight font-mono">{complianceRate}%</div>
            <div className="text-xs text-slate-500 font-medium">Scrutiny Compliance</div>
          </div>
        </div>
      </div>

      {/* Statutory Alerts & Inspection Notices */}
      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
              Statutory Verification Action Items & Alerts
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">3 Pending Notices</span>
        </div>
        <div className="p-3 text-xs divide-y divide-slate-100">
          <div className="py-2 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300 mt-0.5">
                Action Required
              </span>
              <div>
                <span className="font-semibold text-slate-800">
                  Fire Safety Certificate (TN-FRS/ED-ERD/NOC-2025/1192):
                </span>{" "}
                <span className="text-slate-600">
                  Certificate validity requires external confirmation against Fire & Rescue Services departmental records.
                </span>
              </div>
            </div>
            <Link
              to="/scrutiny/doc-2"
              className="text-[#0056b3] font-semibold hover:underline flex items-center gap-0.5 whitespace-nowrap"
            >
              <span>Inspect</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="py-2 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-rose-800 border border-rose-300 mt-0.5">
                Compliance Non-Conformity
              </span>
              <div>
                <span className="font-semibold text-slate-800">
                  Faculty Declaration (KEC/REG-FAC/DEC-2026-V1):
                </span>{" "}
                <span className="text-slate-600">
                  Cadre ratio non-compliant (1:2.4 vs mandated 1:2:6). Re-upload signed affidavit before final committee approval.
                </span>
              </div>
            </div>
            <Link
              to="/scrutiny/doc-4"
              className="text-rose-700 font-semibold hover:underline flex items-center gap-0.5 whitespace-nowrap"
            >
              <span>View Reason</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="py-2 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800 border border-blue-300 mt-0.5">
                Statutory Window
              </span>
              <div>
                <span className="font-semibold text-slate-800">
                  Annual Extension of Approval (EoA) Scrutiny Cycle:
                </span>{" "}
                <span className="text-slate-600">
                  Final verification cutoff date for Southern Region is 15 November 2026, 17:00 IST.
                </span>
              </div>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">Active</span>
          </div>
        </div>
      </div>

      {/* Recent Documents Table */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-[#0b2545] uppercase tracking-wide">
              Recent Institutional Documents
            </h2>
            <p className="text-xs text-slate-500">
              Audit log of submitted statutory certificates and regulatory declarations
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/documents"
              className="text-xs font-semibold text-[#0056b3] hover:underline flex items-center gap-1"
            >
              <span>View Full Document Register</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Official Administrative Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f1f5f9] border-b border-slate-300 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
                <th className="px-3.5 py-2.5">Document ID</th>
                <th className="px-3.5 py-2.5">Document Title</th>
                <th className="px-3.5 py-2.5">Category</th>
                <th className="px-3.5 py-2.5">Submitted On</th>
                <th className="px-3.5 py-2.5">Valid Until</th>
                <th className="px-3.5 py-2.5">Scrutiny Status</th>
                <th className="px-3.5 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {recentDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="px-3.5 py-2.5 font-mono text-slate-600 font-medium">
                    {doc.id}
                  </td>
                  <td className="px-3.5 py-2.5 font-semibold text-slate-900">
                    <div className="flex flex-col">
                      <Link
                        to={`/documents/${doc.id}`}
                        className="hover:text-[#0056b3] transition hover:underline"
                      >
                        {doc.name}
                      </Link>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {doc.documentNumber}
                      </span>
                    </div>
                  </td>
                  <td className="px-3.5 py-2.5">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200 text-[11px]">
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-3.5 py-2.5 text-slate-600 font-mono">
                    {new Date(doc.submissionDate).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-3.5 py-2.5 text-slate-600 font-mono">
                    {new Date(doc.expiryDate).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-3.5 py-2.5">
                    <StatusBadge status={doc.status} size="sm" />
                  </td>
                  <td className="px-3.5 py-2.5 text-right space-x-1.5 whitespace-nowrap">
                    <Link
                      to={`/documents/${doc.id}`}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-[11px] font-medium transition inline-block"
                    >
                      Details
                    </Link>
                    <Link
                      to={`/scrutiny/${doc.id}`}
                      className="px-2 py-1 bg-[#134074] hover:bg-[#0b2545] text-white rounded text-[11px] font-medium transition inline-block"
                    >
                      Scrutinize
                    </Link>
                    <Link
                      to={`/report/${doc.id}`}
                      className="px-2 py-1 bg-white hover:bg-slate-100 text-[#0056b3] border border-blue-200 rounded text-[11px] font-medium transition inline-block"
                    >
                      Report
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 text-slate-500 text-[11px] flex justify-between items-center">
          <span>Showing latest {recentDocs.length} of {total} institutional filings</span>
          <span className="font-mono text-slate-400">VeriScrutiny Live Registry</span>
        </div>
      </div>
    </div>
  );
}
