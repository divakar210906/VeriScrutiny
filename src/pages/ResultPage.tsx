// src/pages/ResultPage.tsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDocuments } from "../hooks/useDocuments";
import { StatusBadge, RuleResultBadge } from "../components/StatusBadge";
import { 
  FileCheck2, 
  FileText, 
  RotateCw 
} from "lucide-react";

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { docs, loading } = useDocuments();

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading verification result...</div>;
  }

  const doc = docs.find((d) => d.id === id) || docs[0];

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-slate-500">Document Ref: {doc.documentNumber}</span>
          <h1 className="text-lg sm:text-xl font-bold text-[#0b2545] flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-amber-600" />
            <span>Verification Result: {doc.name}</span>
          </h1>
        </div>

        <StatusBadge status={doc.status} size="lg" />
      </div>

      {/* Decision Summary */}
      <div className="bg-white border border-slate-300 rounded shadow-sm p-6 space-y-4 text-xs">
        <div>
          <h3 className="font-bold text-slate-700 uppercase tracking-wider mb-1">
            Standing Scrutiny Determination:
          </h3>
          <p className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-800 leading-relaxed font-serif">
            {doc.details.scrutinySummary?.reason || "All statutory criteria validated."}
          </p>
        </div>

        <div>
          <h3 className="font-bold text-slate-700 uppercase tracking-wider mb-2">
            Rule Checklist Findings ({doc.checklist.length} Parameters Evaluated):
          </h3>
          <div className="border border-slate-200 rounded overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[10px]">
                  <th className="px-3 py-2 w-10 text-center">#</th>
                  <th className="px-3 py-2">Parameter</th>
                  <th className="px-3 py-2 w-24">Result</th>
                  <th className="px-3 py-2">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {doc.checklist.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2 text-center font-mono text-slate-500">{idx + 1}</td>
                    <td className="px-3 py-2 font-bold text-slate-800">{item.parameter}</td>
                    <td className="px-3 py-2">
                      <RuleResultBadge result={item.result} />
                    </td>
                    <td className="px-3 py-2 text-slate-600">{item.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
          <Link
            to={`/scrutiny/${doc.id}`}
            className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 font-semibold transition flex items-center gap-1"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Interactive Scrutiny</span>
          </Link>
          <button
            onClick={() => navigate(`/report/${doc.id}`)}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0b2545] hover:bg-[#134074] text-white rounded font-semibold shadow-sm transition"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>View Full Scrutiny Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}
