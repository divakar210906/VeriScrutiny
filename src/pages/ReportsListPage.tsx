// src/pages/ReportsListPage.tsx
import { Link } from "react-router-dom";
import { useDocuments } from "../hooks/useDocuments";
import { StatusBadge } from "../components/StatusBadge";
import { 
  FileText, 
  ArrowRight, 
  Search 
} from "lucide-react";
import { useState } from "react";

export default function ReportsListPage() {
  const { docs, loading } = useDocuments();
  const [search, setSearch] = useState("");

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading reports directory...</div>;
  }

  const filtered = docs.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.documentNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#0b2545] flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            <span>Official Scrutiny Reports Directory</span>
          </h1>
          <p className="text-xs text-slate-500">
            Certified compliance and statutory verification dockets for academic cycle 2026–2027
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search report by document..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] font-medium"
          />
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f1f5f9] border-b border-slate-300 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
                <th className="px-3.5 py-2.5">Report ID</th>
                <th className="px-3.5 py-2.5">Document Title & Number</th>
                <th className="px-3.5 py-2.5">Category</th>
                <th className="px-3.5 py-2.5">Scrutiny Date</th>
                <th className="px-3.5 py-2.5">Scrutinized By</th>
                <th className="px-3.5 py-2.5">Final Status</th>
                <th className="px-3.5 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="px-3.5 py-2.5 font-mono font-bold text-slate-800">
                    SCR-2026-TN-KEC-00{d.id.replace("doc-", "")}
                  </td>
                  <td className="px-3.5 py-2.5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{d.name}</span>
                      <span className="text-[11px] font-mono text-slate-500">{d.documentNumber}</span>
                    </div>
                  </td>
                  <td className="px-3.5 py-2.5 text-slate-600">
                    {d.category}
                  </td>
                  <td className="px-3.5 py-2.5 text-slate-600 font-mono">
                    {new Date(d.lastScrutinized || d.submissionDate).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-3.5 py-2.5 text-slate-700">
                    Central Scrutiny Cell (CISC)
                  </td>
                  <td className="px-3.5 py-2.5">
                    <StatusBadge status={d.status} size="sm" />
                  </td>
                  <td className="px-3.5 py-2.5 text-right space-x-1.5 whitespace-nowrap">
                    <Link
                      to={`/report/${d.id}`}
                      className="px-2.5 py-1 bg-[#0b2545] hover:bg-[#134074] text-white rounded text-xs font-medium transition inline-flex items-center gap-1"
                    >
                      <span>View Report</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
          <span>Showing {filtered.length} generated statutory audit reports</span>
          <span className="font-mono text-slate-400">VeriScrutiny Registry v2.4</span>
        </div>
      </div>
    </div>
  );
}
