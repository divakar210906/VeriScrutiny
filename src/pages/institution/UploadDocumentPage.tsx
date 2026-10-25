// src/pages/institution/UploadDocumentPage.tsx
import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDocuments } from "../../hooks/useDocuments";
import { institution } from "../../mockData";
import { saveFileUrl } from "../../utils/storage";
import type { Document, DocumentDetails } from "../../types";
import { 
  Upload, 
  CheckCircle2, 
  ArrowLeft 
} from "lucide-react";

export default function UploadDocumentPage() {
  const navigate = useNavigate();
  const { docs, setDocs } = useDocuments();

  const [form, setForm] = useState({
    type: "Fire Safety Certificate",
    category: "Safety",
    documentNumber: "",
    issuingAuthority: "",
    issueDate: new Date().toISOString().split("T")[0],
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    file: null as File | null,
    fileName: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [createdDocId, setCreatedDocId] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, files } = target;

    if (files && files[0]) {
      const file = files[0];
      setForm((prev) => ({
        ...prev,
        file,
        fileName: file.name,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newId = `doc-${docs.length + 1}`;
    const fileName = form.fileName || `${form.type.replace(/\s+/g, "_")}.pdf`;

    const details: DocumentDetails = {
      type: form.type,
      category: form.category,
      institution: institution.name,
      institutionId: institution.aictePermanentId,
      academicYear: "2026-2027",
      documentNumber: form.documentNumber.trim(),
      issuingAuthority: form.issuingAuthority.trim(),
      issueDate: new Date(form.issueDate).toISOString(),
      expiryDate: new Date(form.expiryDate).toISOString(),
      submissionDate: new Date().toISOString(),
      uploadedBy: "Registrar / Institutional Nodal Officer",
      fileName,
      fileSize: form.file ? `${(form.file.size / (1024 * 1024)).toFixed(1)} MB` : "2.1 MB",
      checksum: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      status: "Submitted",
      scrutinySummary: {
        lastScrutinized: new Date().toISOString(),
        scrutinizedBy: "AICTE Central Standing Scrutiny Committee",
        status: "Submitted",
        reason: "Document successfully ingested. Pending verification by AICTE In-charge.",
        totalChecks: 10,
        passed: 10,
        warnings: 0,
        failed: 0,
      },
    };

    const newDoc: Document = {
      id: newId,
      name: form.type,
      category: form.category,
      academicYear: "2026-2027",
      documentNumber: form.documentNumber.trim(),
      issuingAuthority: form.issuingAuthority.trim(),
      issueDate: details.issueDate,
      expiryDate: details.expiryDate,
      submissionDate: details.submissionDate,
      status: "Submitted",
      details,
      checklist: [],
    };

    if (form.file) {
      const url = URL.createObjectURL(form.file);
      saveFileUrl(newId, url);
    }

    setDocs([newDoc, ...docs]);
    setCreatedDocId(newId);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white border border-slate-300 rounded shadow-sm p-8 max-w-xl mx-auto text-center space-y-4 my-6">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#0b2545]">Document Submitted Successfully</h2>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 space-y-1">
          <div>Document Type: <strong>{form.type}</strong></div>
          <div>Registration No: <span className="font-mono font-semibold">{form.documentNumber}</span></div>
          <div>Tracking Ref: <span className="font-mono font-semibold text-slate-900">{createdDocId}</span></div>
          <div>Submission State: <span className="text-emerald-700 font-bold">Submitted / Under Review</span></div>
        </div>
        <p className="text-xs text-slate-500">
          The document has been securely received by the AICTE Scrutiny Division and queued for inspection.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={() => navigate("/institution/submissions")}
            className="px-4 py-2 bg-[#0b2545] hover:bg-[#134074] text-white rounded text-xs font-semibold shadow-sm transition"
          >
            View in My Submissions
          </button>
          <button
            onClick={() => {
              setSubmitted(false);
              setForm({
                type: "Building Stability Certificate",
                category: "Infrastructure",
                documentNumber: "",
                issuingAuthority: "",
                issueDate: new Date().toISOString().split("T")[0],
                expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                file: null,
                fileName: "",
              });
            }}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold transition"
          >
            Upload Another Document
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#0b2545] flex items-center gap-2">
            <Upload className="w-5 h-5 text-amber-600" />
            <span>Upload Document</span>
          </h1>
          <p className="text-xs text-slate-500">
            Submit required statutory approval certificates and affidavits for AICTE scrutiny
          </p>
        </div>

        <Link
          to="/institution/required-documents"
          className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Checklist</span>
        </Link>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-300 rounded shadow-sm p-6 space-y-4 text-xs">
        
        {/* Document Type */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">
            Document Type <span className="text-rose-600">*</span>
          </label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] bg-white font-medium"
            required
          >
            <option value="Fire Safety Certificate">Fire Safety Certificate (Mandatory)</option>
            <option value="Affiliation Certificate">Affiliation Certificate (Mandatory)</option>
            <option value="Faculty Declaration">Faculty Declaration (Mandatory)</option>
            <option value="Building Stability Certificate">Building Stability Certificate (Mandatory)</option>
            <option value="AICTE Approval Letter (EoA)">AICTE Approval Letter (EoA)</option>
            <option value="Fee Structure Declaration">Fee Structure Declaration</option>
            <option value="Land Ownership & Registered Title Deed">Land Ownership & Registered Title Deed</option>
            <option value="Campus Occupancy Certificate">Campus Occupancy Certificate</option>
            <option value="Pollution Control Board (PCB) NOC">Pollution Control Board (PCB) NOC</option>
            <option value="Barrier-Free Environment (Divyangjan) Clearance">Barrier-Free Environment (Divyangjan) Clearance</option>
          </select>
        </div>

        {/* Document Number */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">
            Document / Certificate Number <span className="text-rose-600">*</span>
          </label>
          <input
            type="text"
            name="documentNumber"
            value={form.documentNumber}
            onChange={handleChange}
            placeholder="e.g. TN-FRS/ED-ERD/NOC-2025/1192"
            className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] font-mono font-medium"
            required
          />
        </div>

        {/* Issuing Authority */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">
            Issuing Authority <span className="text-rose-600">*</span>
          </label>
          <input
            type="text"
            name="issuingAuthority"
            value={form.issuingAuthority}
            onChange={handleChange}
            placeholder="e.g. Tamil Nadu Fire and Rescue Services Department"
            className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] font-medium"
            required
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-bold mb-1">
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
            <label className="block text-slate-700 font-bold mb-1">
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

        {/* File Upload Box */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">
            Upload Document File (PDF) <span className="text-rose-600">*</span>
          </label>
          <div className="border-2 border-dashed border-slate-300 hover:border-[#134074] rounded p-6 text-center space-y-2 bg-slate-50 transition cursor-pointer">
            <Upload className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="text-xs font-semibold text-slate-700">
              Drag & Drop institutional PDF file or click to browse
            </div>
            <p className="text-[11px] text-slate-500">Only PDF format accepted. Max file size: 25 MB.</p>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleChange}
              className="block mx-auto text-xs text-slate-600 file:mr-2 file:py-1 file:px-3 file:rounded file:border file:border-slate-300 file:text-xs file:font-semibold file:bg-white file:text-slate-700 hover:file:bg-slate-100"
            />
            {form.fileName && (
              <div className="pt-2 text-xs font-mono text-emerald-700 font-semibold">
                ✓ Ready for submission: {form.fileName}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
          <Link
            to="/institution/dashboard"
            className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 font-semibold transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2 bg-[#0b2545] hover:bg-[#134074] text-white rounded font-semibold shadow-sm transition"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>Submit Document</span>
          </button>
        </div>
      </form>
    </div>
  );
}
