// src/pages/aicte/AicteInstitutionsPage.tsx
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { aicteInstitutionsList } from "../../mockData";
import { useDocuments } from "../../hooks/useDocuments";
import { StatusBadge } from "../../components/StatusBadge";
import { 
  Building, 
  Search, 
  ArrowRight,
  Filter
} from "lucide-react";

export default function AicteInstitutionsPage() {
  const { docs } = useDocuments();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = searchParams.get("filter") === "pending" ? "Pending Scrutiny" : "All";

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(initialFilter);

  const hasDeficiency = docs.some((doc) => doc.status === "Deficiency Raised" || doc.status === "Needs Correction");
  const hasReview = docs.some((doc) => ["Under Scrutiny", "Under Review", "Re-submitted"].includes(doc.status));
  const allVerified = docs.length > 0 && docs.every((doc) => doc.status === "Verified");
  const institutions = aicteInstitutionsList.map((item) => item.id === "KEC001"
    ? {
        ...item,
        documents: docs,
        documentRecordCount: docs.length,
        status: hasDeficiency ? "Deficient" : allVerified ? "Verified" : hasReview ? "Under Review" : "Pending Scrutiny",
      }
    : item);
  const filterOptions = ["All", "Pending Scrutiny", "Under Review", "Deficient", "Verified"];

  const filtered = institutions.filter((inst) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      inst.name.toLowerCase().includes(q) ||
      inst.aictePermanentId.toLowerCase().includes(q) ||
      inst.state.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (statusFilter === "All") return true;
    if (statusFilter === "Pending Scrutiny") return inst.status === "Pending Scrutiny";
    if (statusFilter === "Under Review") return inst.status === "Under Review";
    return inst.status === statusFilter;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#071a30] flex items-center gap-2">
            <Building className="w-5 h-5 text-amber-600" />
            <span>Demonstration application directory</span>
          </h1>
          <p className="text-xs text-slate-500">
            One illustrative Kongu Engineering College application. Application data is stored in this browser.
          </p>
        </div>

        {/* Search by Name, AICTE Permanent ID, State */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, AICTE ID, or state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#071a30] w-72"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-2.5 rounded border border-slate-300 shadow-sm flex items-center gap-2 overflow-x-auto text-xs">
        <div className="flex items-center gap-1 text-slate-500 font-bold px-2">
          <Filter className="w-3.5 h-3.5" />
          <span>Status:</span>
        </div>
        {filterOptions.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => {
              setStatusFilter(opt);
              setSearchParams(opt === "Pending Scrutiny" ? { filter: "pending" } : {}, { replace: true });
            }}
            aria-pressed={statusFilter === opt}
            className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap transition ${
              statusFilter === opt
                ? "bg-[#071a30] text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Institutions Table */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f1f5f9] border-b border-slate-300 text-slate-700 uppercase font-semibold text-[10px] tracking-wider">
                <th className="px-3.5 py-2.5">Institution</th>
                <th className="px-3.5 py-2.5">AICTE ID</th>
                <th className="px-3.5 py-2.5">State</th>
                <th className="px-3.5 py-2.5">Application ID</th>
                <th className="px-3.5 py-2.5 text-center">Document Records</th>
                <th className="px-3.5 py-2.5">Scrutiny Status</th>
                <th className="px-3.5 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">No applications match this search or status filter.</td></tr>
              ) : filtered.map((inst) => (
                <tr
                  key={inst.id}
                  className="transition-colors hover:bg-blue-50/30"
                >
                  <td className="px-3.5 py-3">
                    <div className="font-bold text-slate-900">{inst.name}</div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {inst.district} • {inst.type}
                    </div>
                  </td>
                  <td className="px-3.5 py-3 font-mono font-bold text-slate-800">
                    {inst.aictePermanentId}
                  </td>
                  <td className="px-3.5 py-3 text-slate-700">
                    {inst.state}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
