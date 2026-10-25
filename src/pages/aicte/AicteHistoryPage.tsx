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
  const [actionFilter, setActionFilter] = useState("ALL");

  const actionOptions = ["ALL", "Scrutiny Executed", "Deficiency Raised", "Document Approved", "Re-submission Received"];

  const filtered = useMemo(() => {
    return historyList.filter((item) => {
      const q = search.toLowerCase();
      const matchSearch =
        item.documentName.toLowerCase().includes(q) ||
        item.institutionName.toLowerCase().includes(q) ||
        (item.scrutinizedBy || "").toLowerCase().includes(q) ||
        (item.action || "").toLowerCase().includes(q) ||
        (item.result || "").toLowerCase().includes(q);

      const matchAction = actionFilter === "ALL" || (item.action && item.action.toLowerCase() === actionFilter.toLowerCase());
      return matchSearch && matchAction;
    });
  }, [historyList, search, actionFilter]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#071a30] flex items-center gap-2">
            <History className="w-5 h-5 text-amber-600" />
            <span>AICTE Scrutiny History & Audit Trail</span>
          </h1>
          <p className="text-xs text-slate-500">
            Chronological audit trail of automated determinations and officer regulatory decisions
          </p>
        </div>

        <span className="text-xs font-mono text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded">
          Total Logged Actions: <strong className="text-slate-900">{historyList.length}</strong>
        </span>
      </div>

      {/* Search & Action Filter */}
      <div className="bg-white p-3 rounded border border-slate-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex-1 w-full sm:w-auto relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Institution, Document, Action, or Officer ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#071a30]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600 text-[11px] uppercase">Action Filter:</span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="py-1.5 px-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#071a30] bg-white font-medium"
            >
              {actionOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "ALL" ? "All Actions" : opt}
                </option>
              ))}
            </select>
          </div>

          {(search || actionFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearch("");
                setActionFilter("ALL");
              }}
              className="p-1.5 border border-slate-300 hover:bg-slate-100 rounded text-slate-600 transition"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Audit Trail Table - Columns requested in Section 18 */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f1f5f9] border-b border-slate-300 text-slate-700 uppercase font-semibold text-[10px] tracking-wider">
                <th className="px-3.5 py-2.5 w-36">Date & Time</th>
                <th className="px-3.5 py-2.5">Institution</th>
                <th className="px-3.5 py-2.5">Document</th>
                <th className="px-3.5 py-2.5 w-40">Action</th>
                <th className="px-3.5 py-2.5 w-32">Performed By</th>
                <th className="px-3.5 py-2.5 w-48">Result</th>
                <th className="px-3.5 py-2.5 text-right w-24">Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((item) => {
                const actionLabel = item.action || (item.result === "Verified" ? "Document Approved" : "Scrutiny Executed");
                const officerLabel = item.scrutinizedBy || "AICTE-SR-9042";

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Date & Time */}
                    <td className="px-3.5 py-3 font-mono font-medium text-slate-700 text-[11px] whitespace-nowrap">
                      {item.scrutinyDate}
                    </td>

                    {/* Institution */}
                    <td className="px-3.5 py-3">
                      <div className="font-bold text-slate-900">{item.institutionName}</div>
                      <div className="text-[11px] font-mono text-slate-500">{item.institutionId}</div>
                    </td>

                    {/* Document */}
                    <td className="px-3.5 py-3">
                      <div className="font-semibold text-slate-900">{item.documentName}</div>
                      <div className="text-[11px] font-mono text-slate-500">{item.documentNumber}</div>
                    </td>

                    {/* Action */}
                    <td className="px-3.5 py-3">
                      <span className="font-semibold text-[#071a30] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                        {actionLabel}
                      </span>
                    </td>

                    {/* Performed By */}
                    <td className="px-3.5 py-3 font-mono font-bold text-slate-800 text-[11px]">
                      {officerLabel}
                    </td>

                    {/* Result */}
                    <td className="px-3.5 py-3">
                      <div className="space-y-0.5">
                        <StatusBadge status={item.result} size="sm" />
                        {item.remarks && (
                          <div className="text-[11px] text-slate-500 truncate max-w-xs" title={item.remarks}>
                            {item.remarks}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Report link */}
                    <td className="px-3.5 py-3 text-right">
                      <Link
                        to={`/aicte/report/${item.institutionId || "KEC001"}/${item.documentId || "doc-2"}`}
                        className="px-2 py-1 bg-[#071a30] hover:bg-slate-800 text-white rounded text-[11px] font-semibold transition inline-flex items-center gap-1 shadow-xs"
                      >
                        <FileText className="w-3 h-3 text-amber-400" />
                        <span>View</span>
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
