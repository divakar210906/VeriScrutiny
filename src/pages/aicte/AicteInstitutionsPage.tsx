// src/pages/aicte/AicteInstitutionsPage.tsx
import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { aicteInstitutionsList } from "../../mockData";
import { StatusBadge } from "../../components/StatusBadge";
import { 
  Building2, 
  Search, 
  RotateCcw, 
  ArrowRight 
} from "lucide-react";

export default function AicteInstitutionsPage() {
  const [searchParams] = useSearchParams();
  const initialStatusFilter = searchParams.get("status") || "ALL";

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    initialStatusFilter === "pending" ? "Pending Scrutiny" : "ALL"
  );
  const [districtFilter, setDistrictFilter] = useState("ALL");

  const filteredInstitutions = useMemo(() => {
    return aicteInstitutionsList.filter((inst) => {
      const matchSearch =
        inst.name.toLowerCase().includes(search.toLowerCase()) ||
        inst.id.toLowerCase().includes(search.toLowerCase()) ||
        inst.applicationId.toLowerCase().includes(search.toLowerCase()) ||
        inst.aictePermanentId.includes(search);

      const matchStatus = statusFilter === "ALL" || inst.status === statusFilter;
      const matchDistrict = districtFilter === "ALL" || inst.district === districtFilter;

      return matchSearch && matchStatus && matchDistrict;
    });
  }, [search, statusFilter, districtFilter]);

  const handleReset = () => {
    setSearch("");
    setStatusFilter("ALL");
    setDistrictFilter("ALL");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#071a30] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-600" />
            <span>Institutions Directory</span>
          </h1>
          <p className="text-xs text-slate-500">
            Higher technical education institutions under AICTE Southern Regional Directorate
          </p>
        </div>

        <span className="text-xs font-mono text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded">
          Registered Institutions: <strong className="text-slate-900">{aicteInstitutionsList.length}</strong>
        </span>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Institution, ID, or Application No..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074]"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-500">Scrutiny Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-1.5 px-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] bg-white font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending Scrutiny">Pending Scrutiny</option>
            <option value="Under Review">Under Review</option>
            <option value="Verified">Verified</option>
            <option value="Deficient">Deficient</option>
          </select>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-1">
            <span className="font-semibold text-slate-500">District:</span>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full py-1.5 px-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] bg-white font-medium"
            >
              <option value="ALL">All Districts</option>
              <option value="Erode">Erode</option>
              <option value="Coimbatore">Coimbatore</option>
              <option value="Madurai">Madurai</option>
            </select>
          </div>

          {(search || statusFilter !== "ALL" || districtFilter !== "ALL") && (
            <button
              onClick={handleReset}
              className="p-1.5 border border-slate-300 hover:bg-slate-100 rounded text-slate-600 transition"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Institutions Table */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f1f5f9] border-b border-slate-300 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
                <th className="px-3.5 py-2.5">Institution</th>
                <th className="px-3.5 py-2.5">Institution ID</th>
                <th className="px-3.5 py-2.5">Application</th>
                <th className="px-3.5 py-2.5">Documents</th>
                <th className="px-3.5 py-2.5">Status</th>
                <th className="px-3.5 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredInstitutions.map((inst) => (
                <tr key={inst.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-3.5 py-3">
                    <div className="font-bold text-slate-900 text-sm">{inst.name}</div>
                    <div className="text-[11px] text-slate-500">{inst.district}, {inst.state} • {inst.type}</div>
                  </td>
                  <td className="px-3.5 py-3 font-mono font-semibold text-slate-700">
                    {inst.id}
                  </td>
                  <td className="px-3.5 py-3 font-mono font-bold text-[#0b2545]">
                    {inst.applicationId}
                  </td>
                  <td className="px-3.5 py-3 font-mono">
                    <span className="font-bold text-slate-900">{inst.submittedCount}</span> / {inst.totalRequired}
                  </td>
                  <td className="px-3.5 py-3">
                    <StatusBadge status={inst.status} size="sm" />
                  </td>
                  <td className="px-3.5 py-3 text-right">
                    <Link
                      to={`/aicte/institution/${inst.id}`}
                      className="px-3 py-1.5 bg-[#0b2545] hover:bg-[#134074] text-white rounded text-xs font-semibold shadow-sm transition inline-flex items-center gap-1"
                    >
                      <span>View Institution</span>
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
