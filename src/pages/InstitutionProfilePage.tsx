// src/pages/InstitutionProfilePage.tsx
import { useState } from "react";
import { institution as defaultInstitution } from "../mockData";
import { 
  Building2, 
  Save, 
  CheckCircle2 
} from "lucide-react";

export default function InstitutionProfilePage() {
  const [formData, setFormData] = useState({ ...defaultInstitution });
  const [activeTab, setActiveTab] = useState<"general" | "statutory" | "infrastructure">("general");
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded border border-emerald-200">
              Active Registered Institution
            </span>
            <span className="font-mono text-xs text-slate-500">
              Permanent ID: {formData.aictePermanentId}
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#0b2545] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-600" />
            <span>Institution Master Profile</span>
          </h1>
        </div>

        {isSaved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile records updated successfully.</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("general")}
          className={`py-2 px-4 border-b-2 transition ${
            activeTab === "general"
              ? "border-[#0b2545] text-[#0b2545] bg-white rounded-t"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          General & Administration
        </button>
        <button
          onClick={() => setActiveTab("statutory")}
          className={`py-2 px-4 border-b-2 transition ${
            activeTab === "statutory"
              ? "border-[#0b2545] text-[#0b2545] bg-white rounded-t"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Statutory Approvals & Accreditation
        </button>
        <button
          onClick={() => setActiveTab("infrastructure")}
          className={`py-2 px-4 border-b-2 transition ${
            activeTab === "infrastructure"
              ? "border-[#0b2545] text-[#0b2545] bg-white rounded-t"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Campus Land & Infrastructure
        </button>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-300 rounded shadow-sm p-6 space-y-6">
        
        {activeTab === "general" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0b2545] border-b border-slate-200 pb-2">
              Institutional Nomenclature & Registry Identifiers
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Institution Full Legal Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] font-semibold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Institution Type / Autonomy Status <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074]"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  AICTE Permanent Institutional ID <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="aictePermanentId"
                  value={formData.aictePermanentId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded font-mono font-bold bg-slate-50"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  All India Survey on Higher Education (AISHE) Code <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="aisheCode"
                  value={formData.aisheCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded font-mono font-bold bg-slate-50"
                  readOnly
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">
                  Registered Campus Address <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074]"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  District <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074]"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  State / Postal PIN <span className="text-rose-600">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074]"
                    required
                  />
                  <input
                    type="text"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Head of Institution / Principal <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="principalName"
                  value={formData.principalName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074]"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Year of Establishment <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  name="establishmentYear"
                  value={formData.establishmentYear}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Official Institutional Email <span className="text-rose-600">*</span>
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074]"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Official Contact Telephone <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded font-mono"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "statutory" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0b2545] border-b border-slate-200 pb-2">
              University Affiliation, Accreditation & Approvals
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Affiliating University <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Statutory Approval Status <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="affiliation"
                  value={formData.affiliation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074]"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">
                  National Accreditation Credentials (NBA / NAAC)
                </label>
                <textarea
                  rows={2}
                  name="accreditation"
                  value={formData.accreditation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Institutional Portal Website
                </label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Approval Handbook Compliance
                </label>
                <input
                  type="text"
                  value="AICTE APH 2025–26 & Anna University Autonomous Regulations"
                  readOnly
                  className="w-full px-3 py-2 border border-slate-300 rounded bg-slate-50 font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "infrastructure" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0b2545] border-b border-slate-200 pb-2">
              Statutory Land, Campus & Built-up Area
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Contiguous Land Parcel Area (Acres)
                </label>
                <input
                  type="text"
                  name="landArea"
                  value={formData.landArea}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Total Approved Built-up Area (Sq. Meters)
                </label>
                <input
                  type="text"
                  name="builtUpArea"
                  value={formData.builtUpArea}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded font-semibold"
                />
              </div>
            </div>
          </div>
        )}

        {/* Form Submission Actions */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Last Synced with AICTE National Database: Today, 14:32 IST
          </span>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0b2545] hover:bg-[#134074] text-white font-semibold text-xs rounded shadow-sm transition"
          >
            <Save className="w-3.5 h-3.5 text-amber-400" />
            <span>Save Profile Updates</span>
          </button>
        </div>
      </form>
    </div>
  );
}
