// src/pages/aicte/AicteHistoryPage.tsx
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { loadVerificationHistory } from "../../utils/storage";
import { StatusBadge } from "../../components/StatusBadge";
import { 
  History, 
  Search, 
  RotateCcw, 
  FileText 
} from "lucide-react";

export default function AicteHistoryPage() {
  const [historyList] = useState(() => loadVerificationHistory());
  const [search, setSearch] = useState("");
  const [filterResult, setFilterResult] = useState("ALL");

  const results = ["ALL", "Verified", "Needs Review", "Rejected"];

  const filtered = useMemo(() => {
    return historyList.filter((item) => {
      const matchSearch =
        item.documentName.toLowerCase().includes(search.toLowerCase()) ||
        item.institutionName.toLowerCase().includes(search.toLowerCase()) ||
        item.reportId.toLowerCase().includes(search.toLowerCase()) ||
        item.documentNumber.toLowerCase().includes(search.toLowerCase());

      const matchResult = filterResult === "ALL" || item.result === filterResult;
      return matchSearch && matchResult;
    });
  }, [historyList, search, filterResult]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#071a30] flex items-center gap-2">
            <History className="w-5 h-5 text-amber-600" />
            <span>AICTE Verification Audit Logs</span>
          </h1>
          <p className="text-xs text-slate-500">
            Immutable regional log of all automated rule determinations and committee reviews
          </p>
        </div>

        <span className="text-xs font-mono text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded">
          Logged Sessions: <strong className="text-slate-900">{historyList.length}</strong>
        </span>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex-1 w-full sm:w-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Institution, Document, or Report ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Determination:</span>
            <select
              value={filterResult}
              onChange={(e) => setFilterResult(e.target.value)}
              className="py-1.5 px-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] bg-white font-medium"
            >
              {results.map((r) => (
                <option key={r} value={r}>
                  {r === "ALL" ? "All Determinations" : r}
                </option>
              ))}
            </select>
          </div>

          {(search || filterResult !== "ALL") && (
            <button
              onClick={() => {
                setSearch("");
                setFilterResult("ALL");
              }}
              className="p-1.5 border border-slate-300 hover:bg-slate-100 rounded text-slate-600 transition"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f1f5f9] border-b border-slate-300 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
                <th className="px-3.5 py-2.5">Report ID</th>
                <th className="px-3.5 py-2.5">Institution</th>
                <th className="px-3.5 py-2.5">Document Title & Ref</th>
                <th className="px-3.5 py-2.5">Scrutiny Date</th>
                <th className="px-3.5 py-2.5">Determination</th>
                <th className="px-3.5 py-2.5">Checklist Metric</th>
                <th className="px-3.5 py-2.5">Audit Remarks</th>
                <th className="px-3.5 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-3.5 py-2.5 font-mono font-bold text-slate-900">
                    {item.reportId}
                  </td>
                  <td className="px-3.5 py-2.5 font-bold text-slate-900">
                    {item.institutionName}
                  </td>
                  <td className="px-3.5 py-2.5">
                    <div className="font-semibold text-slate-800">{item.documentName}</div>
                    <div className="text-[11px] font-mono text-slate-500">{item.documentNumber}</div>
                  </td>
                  <td className="px-3.5 py-2.5 text-slate-600 font-mono">
                    {new Date(item.scrutinyDate).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-3.5 py-2.5">
                    <StatusBadge status={item.result} size="sm" />
                  </td>
                  <td className="px-3.5 py-2.5 font-mono text-[11px]">
                    <span className="text-emerald-700 font-semibold">{item.passedCount}P</span> /{" "}
                    <span className="text-amber-700 font-semibold">{item.warningCount}W</span> /{" "}
                    <span className="text-rose-700 font-semibold">{item.failedCount}F</span>
                  </td>
                  <td className="px-3.5 py-2.5 text-slate-600 max-w-xs truncate" title={item.remarks}>
                    {item.remarks}
                  </td>
                  <td className="px-3.5 py-2.5 text-right">
                    <Link
                      to={`/aicte/report/${item.institutionId || "KEC001"}/${item.documentId}`}
                      className="px-2.5 py-1 bg-[#071a30] hover:bg-slate-800 text-white rounded text-xs font-semibold transition inline-flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3 text-amber-400" />
                      <span>Report</span>
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
