// src/pages/VerificationHistoryPage.tsx
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { loadVerificationHistory } from "../utils/storage";
import { StatusBadge } from "../components/StatusBadge";
import { 
  History, 
  Search, 
  RotateCcw, 
  FileText 
} from "lucide-react";

export default function VerificationHistoryPage() {
  const [historyList] = useState(() => loadVerificationHistory());
  const [search, setSearch] = useState("");
  const [filterResult, setFilterResult] = useState("ALL");

  const results = ["ALL", "Verified", "Needs Review", "Rejected"];

  const filteredHistory = useMemo(() => {
    return historyList.filter((item) => {
      const matchSearch =
        item.documentName.toLowerCase().includes(search.toLowerCase()) ||
        item.documentNumber.toLowerCase().includes(search.toLowerCase()) ||
        item.reportId.toLowerCase().includes(search.toLowerCase()) ||
        item.scrutinizedBy.toLowerCase().includes(search.toLowerCase());

      const matchResult = filterResult === "ALL" || item.result === filterResult;
      return matchSearch && matchResult;
    });
  }, [historyList, search, filterResult]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#0b2545] flex items-center gap-2">
            <History className="w-5 h-5 text-amber-600" />
            <span>Institutional Verification & Scrutiny History Register</span>
          </h1>
          <p className="text-xs text-slate-500">
            Immutable audit trail of all automated rule determinations and committee reviews
          </p>
        </div>

        <div className="text-xs text-slate-600 font-mono bg-slate-50 px-3 py-1.5 rounded border border-slate-200">
          Total Logged Sessions: <span className="font-bold text-[#0b2545]">{historyList.length}</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex-1 w-full sm:w-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Document, Report ID, or Scrutinizer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600 whitespace-nowrap">Filter Status:</span>
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
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded transition"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Audit History Table */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f1f5f9] border-b border-slate-300 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
                <th className="px-3.5 py-2.5">Audit Report ID</th>
                <th className="px-3.5 py-2.5">Document Name & Ref</th>
                <th className="px-3.5 py-2.5">Scrutiny Date & Time</th>
                <th className="px-3.5 py-2.5">Scrutinizer / Engine</th>
                <th className="px-3.5 py-2.5">Determination</th>
                <th className="px-3.5 py-2.5">Rules Metric</th>
                <th className="px-3.5 py-2.5">Audit Remarks</th>
                <th className="px-3.5 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No verification audit records matching the specified criteria.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-3.5 py-2.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {item.reportId}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <div className="flex flex-col">
                        <Link
                          to={`/documents/${item.documentId}`}
                          className="font-bold text-slate-900 hover:text-[#0056b3] hover:underline"
                        >
                          {item.documentName}
                        </Link>
                        <span className="text-[11px] font-mono text-slate-500">
                          {item.documentNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5 text-slate-600 font-mono whitespace-nowrap">
                      {new Date(item.scrutinyDate).toLocaleDateString("en-IN")}{" "}
                      <span className="text-slate-400 text-[10px]">
                        {new Date(item.scrutinyDate).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-slate-700 font-medium max-w-[150px] truncate" title={item.scrutinizedBy}>
                      {item.scrutinizedBy}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <StatusBadge status={item.result} size="sm" />
                    </td>
                    <td className="px-3.5 py-2.5 font-mono text-[11px] whitespace-nowrap">
                      <span className="text-emerald-700 font-semibold">{item.passedCount}P</span> /{" "}
                      <span className="text-amber-700 font-semibold">{item.warningCount}W</span> /{" "}
                      <span className="text-rose-700 font-semibold">{item.failedCount}F</span>
                    </td>
                    <td className="px-3.5 py-2.5 text-slate-600 max-w-xs truncate" title={item.remarks}>
                      {item.remarks}
                    </td>
                    <td className="px-3.5 py-2.5 text-right whitespace-nowrap">
                      <Link
                        to={`/report/${item.documentId}`}
                        className="px-2.5 py-1 bg-[#0b2545] hover:bg-[#134074] text-white rounded text-xs font-medium transition inline-flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3 text-amber-400" />
                        <span>Docket</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
          <span>Showing {filteredHistory.length} institutional audit events</span>
          <span className="font-mono text-slate-400">Security Signature Verified</span>
        </div>
      </div>
    </div>
  );
}
