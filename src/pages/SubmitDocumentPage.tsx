// src/pages/SubmitDocumentPage.tsx
import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDocuments } from "../hooks/useDocuments";
import { institution } from "../mockData";
import { runScrutinyEngine } from "../utils/ruleEngine";
import { saveFileUrl } from "../utils/storage";
import type { Document, DocumentDetails } from "../types";
import { 
  Upload, 
  CheckCircle2, 
  ArrowLeft, 
  FileCheck2, 
  ShieldCheck 
} from "lucide-react";

const todayIsoDate = () => new Date().toISOString().split("T")[0];
const oneYearLaterIsoDate = () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

export default function SubmitDocumentPage() {
  const navigate = useNavigate();
  const { docs, setDocs } = useDocuments();

  const [form, setForm] = useState({
    name: "",
    category: "Statutory",
    type: "Affiliation",
    academicYear: "2026-2027",
    documentNumber: "",
    issuingAuthority: "",
    issueDate: todayIsoDate(),
    expiryDate: oneYearLaterIsoDate(),
    uploadedBy: "Registrar / Institutional Nodal Officer",
    declarationConfirmed: false,
    file: null as File | null,
  });

  const [createdDocId, setCreatedDocId] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked, files } = target;

    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file" && files) {
      const file = files[0];
      setForm((prev) => ({
        ...prev,
        file,
        name: prev.name || file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!form.declarationConfirmed) {
      alert("Please confirm the statutory declaration undertaking before submitting.");
      return;
    }

    const docIndex = docs.length + 1;
    const newId = `doc-${docIndex}`;
    const fileName = form.file ? form.file.name : `${form.name.replace(/\s+/g, "_")}.pdf`;
    const fileSize = form.file ? `${(form.file.size / (1024 * 1024)).toFixed(1)} MB` : "1.8 MB";

    const details: DocumentDetails = {
      type: form.type,
      category: form.category,
      institution: institution.name,
      institutionId: institution.aictePermanentId,
      academicYear: form.academicYear,
      documentNumber: form.documentNumber.trim(),
      issuingAuthority: form.issuingAuthority.trim(),
      issueDate: new Date(form.issueDate).toISOString(),
      expiryDate: new Date(form.expiryDate).toISOString(),
      submissionDate: new Date().toISOString(),
      uploadedBy: form.uploadedBy,
      fileName,
      fileSize,
      checksum: "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
      status: "Under Scrutiny",
    };

    // Run rule engine
    const engineResult = runScrutinyEngine(details);

    const fullDetails: DocumentDetails = {
      ...details,
      status: engineResult.status,
      scrutinySummary: {
        lastScrutinized: new Date().toISOString(),
        scrutinizedBy: "Central Institutional Scrutiny Cell (CISC-TN)",
        status: engineResult.status,
        reason: engineResult.reason,
        totalChecks: engineResult.summary.total,
        passed: engineResult.summary.passed,
        warnings: engineResult.summary.warnings,
        failed: engineResult.summary.failed,
      },
    };

    const newDocument: Document = {
      id: newId,
      name: form.name.trim(),
      category: form.category,
      academicYear: form.academicYear,
      documentNumber: form.documentNumber.trim(),
      issuingAuthority: form.issuingAuthority.trim(),
      issueDate: details.issueDate,
      expiryDate: details.expiryDate,
      submissionDate: details.submissionDate,
      status: engineResult.status,
      lastScrutinized: new Date().toISOString(),
      details: fullDetails,
      checklist: engineResult.checklist,
    };

    // Save preview URL if file provided
    if (form.file) {
      const url = URL.createObjectURL(form.file);
      saveFileUrl(newId, url);
    }

    setDocs([newDocument, ...docs]);
    setCreatedDocId(newId);
  };

  if (createdDocId) {
    return (
      <div className="bg-white border border-slate-300 rounded shadow-sm p-8 max-w-2xl mx-auto text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-[#0b2545]">Document Successfully Filed & Ingested</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          The document has been securely uploaded to the institutional repository with Document ID:{" "}
          <strong className="font-mono">{createdDocId}</strong>. Automated statutory rules have been initiated.
        </p>
        <div className="pt-4 flex justify-center gap-3">
          <button
            onClick={() => navigate(`/scrutiny/${createdDocId}`)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0b2545] hover:bg-[#134074] text-white rounded text-xs font-semibold shadow-sm transition"
          >
            <FileCheck2 className="w-4 h-4 text-amber-400" />
            <span>Launch Immediate Scrutiny</span>
          </button>
          <button
            onClick={() => navigate("/documents")}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold transition"
          >
            Return to Documents Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#0b2545] flex items-center gap-2">
            <Upload className="w-5 h-5 text-amber-600" />
            <span>Submit Institutional Document for Scrutiny</span>
          </h1>
          <p className="text-xs text-slate-500">
            Mandatory filing portal for statutory approvals, NOCs, and regulatory compliance declarations
          </p>
        </div>

        <Link
          to="/documents"
          className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </Link>
      </div>

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-300 rounded shadow-sm p-6 space-y-6">
        
        {/* Section 1: Classification */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0b2545] border-b border-slate-200 pb-2">
            Document Nomenclature & Statutory Classification
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Document Title / Nomenclature <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. AICTE Extension of Approval / Fire Safety Clearance"
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Document Category <span className="text-rose-600">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] bg-white font-medium"
                required
              >
                <option value="Statutory">Statutory Clearances</option>
                <option value="Safety">Fire & Emergency Safety</option>
                <option value="Infrastructure">Building & Structural Stability</option>
                <option value="Staff">Faculty Cadre & Staff Declarations</option>
                <option value="Financial">Fee Regulatory & Audited Accounts</option>
                <option value="Accreditation">NBA / NAAC Accreditation</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Academic Year Applicable <span className="text-rose-600">*</span>
              </label>
              <select
                name="academicYear"
                value={form.academicYear}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] bg-white font-medium"
                required
              >
                <option value="2026-2027">2026–2027 (Active Cycle)</option>
                <option value="2025-2026">2025–2026</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Document Registration / Certificate No. <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                name="documentNumber"
                value={form.documentNumber}
                onChange={handleChange}
                placeholder="e.g. F.No. Southern/1-3512345671/2026/EOA"
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] font-mono font-medium"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Issuing Authority & Dates */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0b2545] border-b border-slate-200 pb-2">
            Issuing Authority & Validity Timeframe
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="md:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">
                Issuing Authority / Statutory Department <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                name="issuingAuthority"
                value={form.issuingAuthority}
                onChange={handleChange}
                placeholder="e.g. All India Council for Technical Education, New Delhi"
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Date of Issue <span className="text-rose-600">*</span>
              </label>
              <input
                type="date"
                name="issueDate"
                value={form.issueDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Valid Until / Expiry Date <span className="text-rose-600">*</span>
              </label>
              <input
                type="date"
                name="expiryDate"
                value={form.expiryDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] font-mono"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: File Attachment */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0b2545] border-b border-slate-200 pb-2">
            Document File Attachment (PDF Format)
          </h3>

          <div className="border-2 border-dashed border-slate-300 hover:border-[#134074] rounded p-6 text-center space-y-2 bg-slate-50 transition cursor-pointer">
            <Upload className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="text-xs text-slate-700 font-semibold">
              Select or Drag Institutional PDF Document
            </div>
            <p className="text-[11px] text-slate-500">
              Only authenticated PDF documents up to 25 MB permitted. Scanned copies must be at 200+ DPI.
            </p>
            <input
              type="file"
              name="file"
              accept=".pdf,application/pdf"
              onChange={handleChange}
              className="block mx-auto text-xs text-slate-600 file:mr-2 file:py-1 file:px-3 file:rounded file:border file:border-slate-300 file:text-xs file:font-semibold file:bg-white file:text-slate-700 hover:file:bg-slate-100"
            />
            {form.file && (
              <div className="pt-2 text-xs font-mono text-emerald-700 font-semibold">
                ✓ Attached: {form.file.name} ({(form.file.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Statutory Declaration */}
        <div className="p-3.5 bg-amber-50 border border-amber-300 rounded text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-amber-950 uppercase tracking-wide">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>Statutory Declaration Undertaking</span>
          </div>
          <p className="text-amber-900 leading-relaxed text-[11px]">
            I hereby declare and affirm on behalf of <strong>{institution.name}</strong> that the document submitted
            herein is true, complete, and issued by the competent statutory authority. Any misrepresentation will attract
            immediate penal action under Section 10 of AICTE Approval Regulations.
          </p>
          <label className="flex items-center gap-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              name="declarationConfirmed"
              checked={form.declarationConfirmed}
              onChange={handleChange}
              className="w-4 h-4 text-[#134074] border-slate-300 rounded"
              required
            />
            <span className="font-bold text-slate-900 text-xs">
              I accept the statutory undertaking and endorse this submission.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/documents")}
            className="px-4 py-2 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2 bg-[#0b2545] hover:bg-[#134074] text-white font-semibold text-xs rounded shadow-sm transition"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>Submit & Initiate Scrutiny</span>
          </button>
        </div>
      </form>
    </div>
  );
}
