// src/pages/DocumentsPage.tsx
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDocuments } from "../hooks/useDocuments";
import { StatusBadge } from "../components/StatusBadge";
import { 
  Search, 
  RotateCcw, 
  Upload, 
  FileText, 
  Download 
} from "lucide-react";

export default function DocumentsPage() {
  const { docs, loading } = useDocuments();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedYear, setSelectedYear] = useState("ALL");

  const categories = useMemo(() => {
    const set = new Set(docs.map((d) => d.category));
    return ["ALL", ...Array.from(set)];
  }, [docs]);

  const statuses = ["ALL", "Verified", "Needs Review", "Rejected", "Under Scrutiny", "Pending"];

  const filteredDocs = useMemo(() => {
    return docs.filter((doc) => {
      const matchSearch =
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.id.toLowerCase().includes(search.toLowerCase()) ||
        doc.documentNumber.toLowerCase().includes(search.toLowerCase()) ||
        doc.issuingAuthority.toLowerCase().includes(search.toLowerCase());

      const matchCategory = selectedCategory === "ALL" || doc.category === selectedCategory;
      const matchStatus = selectedStatus === "ALL" || doc.status === selectedStatus;
      const matchYear = selectedYear === "ALL" || doc.academicYear === selectedYear;

      return matchSearch && matchCategory && matchStatus && matchYear;
    });
  }, [docs, search, selectedCategory, selectedStatus, selectedYear]);

  const handleReset = () => {
    setSearch("");
    setSelectedCategory("ALL");
    setSelectedStatus("ALL");
    setSelectedYear("ALL");
  };

  const handleExportCSV = () => {
    const headers = "Document ID,Document Name,Document No,Category,Issuing Authority,Issue Date,Valid Until,Status\n";
    const rows = filteredDocs
      .map(
        (d) =>
          `"${d.id}","${d.name}","${d.documentNumber}","${d.category}","${d.issuingAuthority}","${d.issueDate}","${d.expiryDate}","${d.status}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `VeriScrutiny_Document_Register_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading document registry...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded border border-slate-300 shadow-sm">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#0b2545] flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            <span>Institutional Document Management System</span>
          </h1>
          <p className="text-xs text-slate-500">
            Official statutory repository for Kongu Engineering College (AICTE Permanent ID: 1-3512345671)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 hover:bg-slate-50 rounded text-xs text-slate-700 font-medium transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Register (CSV)</span>
          </button>
          <Link
            to="/submit"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0b2545] hover:bg-[#134074] text-white rounded text-xs font-semibold shadow-sm transition"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>Upload Document</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Control Bar */}
      <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, doc ID, or authority..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] font-medium"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-1.5 px-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] bg-white font-medium"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "ALL" ? "All Categories" : c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-1.5 px-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] bg-white font-medium"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s === "ALL" ? "All Statuses" : s}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Action */}
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-xs font-medium transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {/* Applied Filter Chips Strip */}
        {(search || selectedCategory !== "ALL" || selectedStatus !== "ALL" || selectedYear !== "ALL") && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Active Filters:</span>
            {search && (
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-mono text-[11px]">
                Search: "{search}"
              </span>
            )}
            {selectedCategory !== "ALL" && (
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 text-[11px]">
                Category: {selectedCategory}
              </span>
            )}
            {selectedStatus !== "ALL" && (
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 text-[11px]">
                Status: {selectedStatus}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main Document Table */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f1f5f9] border-b border-slate-300 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
                <th className="px-3.5 py-2.5">Document ID</th>
                <th className="px-3.5 py-2.5">Document Title & Number</th>
                <th className="px-3.5 py-2.5">Category</th>
                <th className="px-3.5 py-2.5">Issuing Authority</th>
                <th className="px-3.5 py-2.5">Issue Date</th>
                <th className="px-3.5 py-2.5">Valid Until</th>
                <th className="px-3.5 py-2.5">Status</th>
                <th className="px-3.5 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No documents matching the specified criteria. Try clearing filters.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-3.5 py-2.5 font-mono text-slate-600 font-semibold">
                      {doc.id}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <div className="flex flex-col">
                        <Link
                          to={`/documents/${doc.id}`}
                          className="font-bold text-slate-900 hover:text-[#0056b3] hover:underline"
                        >
                          {doc.name}
                        </Link>
                        <span className="text-[11px] font-mono text-slate-500">
                          {doc.documentNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200 text-[11px] font-medium">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-slate-700 max-w-[180px] truncate" title={doc.issuingAuthority}>
                      {doc.issuingAuthority}
                    </td>
                    <td className="px-3.5 py-2.5 text-slate-600 font-mono">
                      {new Date(doc.issueDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-3.5 py-2.5 text-slate-600 font-mono">
                      {new Date(doc.expiryDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <StatusBadge status={doc.status} size="sm" />
                    </td>
                    <td className="px-3.5 py-2.5 text-right space-x-1 whitespace-nowrap">
                      <Link
                        to={`/documents/${doc.id}`}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-[11px] font-medium transition inline-block"
                        title="View Document Details & Certificate"
                      >
                        View
                      </Link>
                      <Link
                        to={`/scrutiny/${doc.id}`}
                        className="px-2 py-1 bg-[#134074] hover:bg-[#0b2545] text-white rounded text-[11px] font-medium transition inline-block"
                        title="Run Rule Scrutiny"
                      >
                        Scrutinize
                      </Link>
                      <Link
                        to={`/report/${doc.id}`}
                        className="px-2 py-1 bg-white hover:bg-slate-100 text-[#0056b3] border border-blue-200 rounded text-[11px] font-medium transition inline-block"
                        title="View Official Scrutiny Report"
                      >
                        Report
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination & Count Strip */}
        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Showing <span className="font-semibold text-slate-900">{filteredDocs.length}</span> of{" "}
            <span className="font-semibold text-slate-900">{docs.length}</span> institutional records
          </div>
          <div className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
            <span>Official Register</span> • <span>State Code: TN-33</span> • <span>Academic Cycle: 2026-27</span>
          </div>
        </div>
      </div>
    </div>
  );
}
