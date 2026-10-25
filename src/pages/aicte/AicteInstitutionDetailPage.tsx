// src/pages/aicte/AicteInstitutionDetailPage.tsx
import { useParams, Link } from "react-router-dom";
import { aicteInstitutionsList, requiredDocumentsList } from "../../mockData";
import { StatusBadge } from "../../components/StatusBadge";
import { 
  Building2, 
  ArrowLeft, 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  ArrowRight 
} from "lucide-react";

export default function AicteInstitutionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const institutionData =
    aicteInstitutionsList.find((i) => i.id === id) || aicteInstitutionsList[0];

  return (
    <div className="space-y-5">
      {/* Institution Application Header Strip */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Institution ID: {institutionData.id}
            </span>
            <span className="font-mono text-xs font-bold text-[#0b2545] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Application ID: {institutionData.applicationId}
            </span>
            <StatusBadge status={institutionData.status} size="sm" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#071a30] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-600" />
            <span>{institutionData.name}</span>
          </h1>
          <p className="text-xs text-slate-600">
            {institutionData.district}, {institutionData.state} • Permanent AICTE ID: {institutionData.aictePermanentId} • {institutionData.type}
          </p>
        </div>

        <Link
          to="/aicte/institutions"
          className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Institutions</span>
        </Link>
      </div>

      {/* Submitted Documents Inspection Table */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#071a30] uppercase tracking-wide">
              Submitted Documents for Scrutiny
            </h2>
            <p className="text-xs text-slate-500">
              Select a statutory filing to inspect parameters, run automated analysis, and record committee determination
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-700">
            {institutionData.submittedCount} of {institutionData.totalRequired} Filed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f1f5f9] border-b border-slate-300 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
                <th className="px-3.5 py-2.5">Document Title</th>
                <th className="px-3.5 py-2.5">Category</th>
                <th className="px-3.5 py-2.5">Filing Status</th>
                <th className="px-3.5 py-2.5">Scrutiny State</th>
                <th className="px-3.5 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {requiredDocumentsList.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-3.5 py-3">
                    <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                    <div className="text-[11px] font-mono text-slate-500">{item.code} • {item.requirement}</div>
                  </td>
                  <td className="px-3.5 py-3 text-slate-600">
                    {item.category}
                  </td>
                  <td className="px-3.5 py-3">
                    {item.submitted ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Submitted</span>
                      </span>
                    ) : (
                      <span className="text-rose-600 font-semibold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5 text-rose-500" />
                        <span>Not Submitted (Deficient)</span>
                      </span>
                    )}
                  </td>
                  <td className="px-3.5 py-3">
                    <StatusBadge
                      status={item.submitted ? (item.docId === "doc-4" ? "Rejected" : item.status) : "Not Submitted"}
                      size="sm"
                    />
                  </td>
                  <td className="px-3.5 py-3 text-right">
                    {item.submitted && item.docId ? (
                      <Link
                        to={`/aicte/review/${institutionData.id}/${item.docId}`}
                        className="px-3 py-1.5 bg-[#0b2545] hover:bg-[#134074] text-white rounded text-xs font-semibold shadow-sm transition inline-flex items-center gap-1"
                      >
                        <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Review & Scrutinize</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <span className="text-slate-400 text-xs font-mono italic">
                        Pending Filing
                      </span>
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
