// src/pages/institution/UploadDocumentPage.tsx
import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useDocuments } from "../../hooks/useDocuments";
import { institution } from "../../mockData";
import { saveDocumentFile } from "../../utils/storage";
import type { Document, DocumentDetails, DocumentStatus } from "../../types";
import { 
  Upload, 
  CheckCircle2, 
  ArrowLeft,
  FileText,
  AlertTriangle,
} from "lucide-react";

const todayIsoDate = () => new Date().toISOString().split("T")[0];
const oneYearLaterIsoDate = () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

export default function UploadDocumentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const replaceId = searchParams.get("replace");
  const queryType = searchParams.get("type");
  const queryCategory = searchParams.get("category");

  const { docs, setDocs } = useDocuments();

  const existingDoc = replaceId ? docs.find((d) => d.id === replaceId) : undefined;

  const [form, setForm] = useState(() => ({
    type: existingDoc?.name ?? queryType ?? "Fire Safety Certificate",
    category: existingDoc?.category ?? queryCategory ?? "Fire & Safety",
    documentNumber: existingDoc?.documentNumber ?? "",
    issuingAuthority: existingDoc?.issuingAuthority ?? "",
    issueDate: existingDoc?.issueDate?.split("T")[0] ?? todayIsoDate(),
    expiryDate: existingDoc?.expiryDate?.split("T")[0] ?? oneYearLaterIsoDate(),
    file: null as File | null,
    fileName: "",
    fileSize: "",
    checksum: "",
  }));

  const [submitted, setSubmitted] = useState(false);
  const [trackingReference, setTrackingReference] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState<"Submitted for Scrutiny" | "Re-submitted">("Submitted for Scrutiny");

  const [fileError, setFileError] = useState("");
  const [submissionError, setSubmissionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, files } = target;

    if (target.type === "file") {
      const file = files?.[0];
      if (!file) return;
      const acceptedTypes = ["application/pdf", "image/jpeg", "image/png"];
      const acceptedExtensions = /\.(pdf|jpe?g|png)$/i;
      if (!acceptedTypes.includes(file.type) || !acceptedExtensions.test(file.name)) {
        setFileError("Choose a PDF, JPG, or PNG file.");
        target.value = "";
        return;
      }
      if (file.size === 0 || file.size > 25 * 1024 * 1024) {
        setFileError("The file must be greater than 0 bytes and no larger than 25 MB.");
        target.value = "";
        return;
      }
      if (!window.crypto?.subtle) {
        setFileError("This browser cannot calculate a SHA-256 checksum. Use a current browser over HTTPS or localhost.");
        target.value = "";
        return;
      }

      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setFileError("");
      setSubmissionError("");
      void file.arrayBuffer()
        .then((buffer) => window.crypto.subtle.digest("SHA-256", buffer))
        .then((hash) => {
          const checksum = Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
          setForm((prev) => ({
            ...prev,
            file,
            fileName: file.name,
            fileSize: `${sizeMB} MB`,
            checksum,
          }));
        })
        .catch(() => {
          setFileError("The selected file could not be read. Choose it again or use a different file.");
          target.value = "";
        });
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSubmissionError("");
    if (!form.file || !form.checksum) {
      setSubmissionError("Select a valid document file before submitting.");
      return;
    }

    if (new Date(form.expiryDate) < new Date(form.issueDate)) {
      setSubmissionError("The expiry date cannot be earlier than the issue date.");
      return;
    }

    const isReplacing = Boolean(existingDoc);
    if (existingDoc && !window.confirm(`Replace the current file for ${existingDoc.name}? The new file will be recorded as a re-submission.`)) {
      return;
    }
    const trackingCode = existingDoc?.trackingId || `VS-LOCAL-${Date.now()}`;
    const newId = existingDoc?.id ?? `doc-${crypto.randomUUID()}`;
    setIsSubmitting(true);
    try {
      await saveDocumentFile(newId, form.file);
    } catch {
      setIsSubmitting(false);
      setSubmissionError("The document could not be saved in this browser. Check available storage and try again.");
      return;
    }

    if (isReplacing && existingDoc) {
      // Update existing document
      const updatedDocs: Document[] = docs.map((doc): Document => {
        if (doc.id === existingDoc.id) {
          const updatedDetails: DocumentDetails = {
            ...doc.details,
            documentNumber: form.documentNumber.trim() || doc.documentNumber,
            issuingAuthority: form.issuingAuthority.trim() || doc.issuingAuthority,
            issueDate: new Date(form.issueDate).toISOString(),
            expiryDate: new Date(form.expiryDate).toISOString(),
            submissionDate: new Date().toISOString(),
            fileName: form.fileName || doc.details.fileName,
            fileSize: form.fileSize || doc.details.fileSize,
            checksum: form.checksum || doc.details.checksum,
            status: "Re-submitted",
            trackingId: trackingCode,
            rejectionReason: undefined,
            officerRemarks: "Revised document uploaded by institution. Ready for re-scrutiny.",
            scrutinySummary: doc.details.scrutinySummary
              ? {
                  ...doc.details.scrutinySummary,
                  status: "Re-submitted",
                  reason: "Revised document uploaded by institution. Ready for re-scrutiny.",
                  lastScrutinized: new Date().toISOString(),
                }
              : undefined,
          };

          return {
            ...doc,
            documentNumber: form.documentNumber.trim() || doc.documentNumber,
            issuingAuthority: form.issuingAuthority.trim() || doc.issuingAuthority,
            issueDate: new Date(form.issueDate).toISOString(),
            expiryDate: new Date(form.expiryDate).toISOString(),
            submissionDate: new Date().toISOString(),
            status: "Re-submitted" as DocumentStatus,
            trackingId: trackingCode,
            details: updatedDetails,
          };
        }
        return doc;
      });

      setDocs(updatedDocs);
      setTrackingReference(trackingCode);
      setSubmissionStatus("Re-submitted");
      setSubmitted(true);
      setIsSubmitting(false);
      window.dispatchEvent(new Event("veriscrutiny_update"));
      return;
    }

    // New Document upload
    const fileName = form.fileName;

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
      fileSize: form.fileSize,
      checksum: form.checksum,
      status: "Submitted",
      trackingId: trackingCode,
      scrutinySummary: {
        lastScrutinized: new Date().toISOString(),
        scrutinizedBy: "Not yet assigned",
        status: "Submitted",
        reason: "Submitted to the browser-local demonstration workflow. Officer analysis has not been run.",
        totalChecks: 0,
        passed: 0,
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
      trackingId: trackingCode,
      details,
      checklist: [],
    };

    setDocs([newDoc, ...docs]);
    setTrackingReference(trackingCode);
    setSubmissionStatus("Submitted for Scrutiny");
    setSubmitted(true);
    setIsSubmitting(false);
    window.dispatchEvent(new Event("veriscrutiny_update"));
  };

  if (submitted) {
    return (
      <div className="bg-white border border-slate-300 rounded shadow-sm p-8 max-w-xl mx-auto text-center space-y-4 my-6">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-bold text-[#0b2545] tracking-wide">
          DOCUMENT SUBMITTED SUCCESSFULLY
        </h2>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 space-y-2 text-left">
          <div className="flex justify-between border-b border-slate-200 pb-1.5">
            <span className="text-slate-500">Document Name:</span>
            <span className="font-bold">{form.type}</span>
          </div>

          <div className="flex justify-between border-b border-slate-200 pb-1.5">
            <span className="text-slate-500">Tracking Reference:</span>
            <span className="font-mono font-bold text-[#0b2545] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {trackingReference}
            </span>
          </div>

          <div className="flex justify-between border-b border-slate-200 pb-1.5">
            <span className="text-slate-500">Registration / Cert No:</span>
            <span className="font-mono font-semibold">{form.documentNumber}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Status:</span>
            <span className="text-emerald-700 font-black tracking-wide uppercase">
              {submissionStatus}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          The document and its SHA-256 checksum have been saved in this browser's demonstration workspace. This does not transmit the file to AICTE or a remote server.
        </p>

        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={() => navigate("/institution/submissions")}
            className="px-5 py-2.5 bg-[#0b2545] hover:bg-[#134074] text-white rounded text-xs font-bold shadow-sm transition"
          >
            View Submission
          </button>
          <button
            onClick={() => navigate("/institution/required-documents")}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold transition"
          >
            Back to required documents
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Page Header */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link
              to="/institution/required-documents"
              className="text-xs text-[#0056b3] font-semibold hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Checklist</span>
            </Link>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#0b2545] flex items-center gap-2 mt-1">
            <Upload className="w-5 h-5 text-amber-600" />
            <span>
              {existingDoc ? `Re-upload / Replace: ${existingDoc.name}` : "Upload Institutional Document"}
            </span>
          </h1>
        </div>

        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
          AY 2026–27
        </span>
      </div>

      {/* Replacement banner if replacing a deficiency document */}
      {existingDoc && (
        <div className="p-3.5 bg-amber-50 border-l-4 border-amber-600 rounded text-xs text-amber-950 flex items-start gap-2.5 shadow-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">Replacing an existing submission:</span>
            <p>
              A replacement file for <strong className="text-slate-900">{existingDoc.name}</strong> will be saved as a new re-submission. Previous file versions are not currently retained.
            </p>
          </div>
        </div>
      )}

      {/* Main Upload Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-300 rounded shadow-sm p-6 space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Document Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Document Type <span className="text-rose-600">*</span>
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              disabled={Boolean(existingDoc)}
              className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] bg-white disabled:bg-slate-100 font-medium text-slate-800"
              required
            >
              <option value="Fire Safety Certificate">Fire Safety Certificate</option>
              <option value="Affiliation Order">Affiliation Order</option>
              <option value="Faculty Declaration">Faculty Declaration</option>
              <option value="Building Stability Certificate">Building Stability Certificate</option>
              <option value="AICTE Approval Letter (EoA)">AICTE Approval Letter (EoA)</option>
              <option value="Fee Structure Declaration">Fee Structure Declaration</option>
              <option value="Land Ownership & Registered Title Deed">Land Ownership & Registered Title Deed</option>
              <option value="Campus Occupancy Certificate">Campus Occupancy Certificate</option>
              <option value="Barrier-Free Environment Clearance">Barrier-Free Environment Clearance</option>
              <option value="Anti-Ragging Committee Constitution Order">Anti-Ragging Committee Constitution Order</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Statutory Category <span className="text-rose-600">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] bg-white font-medium text-slate-800"
              required
            >
              <option value="Fire & Safety">Fire & Safety</option>
              <option value="Academic / Affiliation">Academic / Affiliation</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Governance & Finance">Governance & Finance</option>
            </select>
          </div>

          {/* Registration / Reference Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Registration / Certificate / Reference No <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              name="documentNumber"
              value={form.documentNumber}
              onChange={handleChange}
              placeholder="e.g. FSC/2026/1842 or AU/CAC/AFF/2026/0824"
              className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] font-medium"
              required
            />
          </div>

          {/* Issuing Authority */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Issuing Authority <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              name="issuingAuthority"
              value={form.issuingAuthority}
              onChange={handleChange}
              placeholder="e.g. Fire and Rescue Services Department, Erode"
              className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] font-medium"
              required
            />
          </div>

          {/* Issue Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Issue Date <span className="text-rose-600">*</span>
            </label>
            <input
              type="date"
              name="issueDate"
              value={form.issueDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] font-medium"
              required
            />
          </div>

          {/* Expiry Date / Valid Until */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Expiry Date / Valid Until <span className="text-rose-600">*</span>
            </label>
            <input
              type="date"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] font-medium"
              required
            />
          </div>
        </div>

        {/* File Upload Box supporting PDF, JPG, PNG */}
        <div className="pt-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Upload Document File (PDF, JPG, PNG) <span className="text-rose-600">*</span>
          </label>
          <div className="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded p-6 text-center bg-slate-50/50 transition">
            <input
              type="file"
              id="file-input"
              accept=".pdf,.jpg,.jpeg,.png"
              required
              onChange={handleChange}
              className="sr-only"
            />
            <label htmlFor="file-input" className="cursor-pointer space-y-2 block">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#134074] flex items-center justify-center mx-auto">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-800">
                {form.file ? form.file.name : "Select a document file"}
              </div>
            </label>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">PDF, JPG, or PNG · Maximum 25 MB. Files are stored in this browser only.</p>
          {fileError && <p role="alert" className="mt-2 text-sm text-rose-800">{fileError}</p>}
        </div>

        {/* Display File Metadata: Name, Size, Checksum */}
        {form.fileName && (
          <div className="p-3 bg-slate-100 rounded border border-slate-200 text-xs space-y-1.5 font-mono text-slate-700">
            <div className="flex items-center gap-2 font-sans font-bold text-slate-900">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>File Selected: {form.fileName}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
              <div>File Size: <strong className="text-slate-900">{form.fileSize}</strong></div>
              <div className="truncate">SHA-256: <strong className="text-slate-900">{form.checksum || "Calculating…"}</strong></div>
            </div>
          </div>
        )}

        {submissionError && <p role="alert" className="rounded border border-rose-300 bg-rose-50 p-3 text-sm text-rose-900">{submissionError}</p>}

        {/* Form Actions */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/institution/required-documents")}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-[#0b2545] hover:bg-[#134074] disabled:cursor-wait disabled:opacity-60 text-white rounded text-xs font-bold tracking-wider uppercase shadow-sm transition flex items-center gap-2"
          >
            <Upload className="w-4 h-4 text-amber-400" />
            <span>{isSubmitting ? "Saving document…" : existingDoc ? "Submit Revised Document" : "Submit Document for Scrutiny"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
