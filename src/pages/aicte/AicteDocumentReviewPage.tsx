// src/pages/aicte/AicteDocumentReviewPage.tsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDocuments } from "../../hooks/useDocuments";
import { aicteInstitutionsList } from "../../mockData";
import { StatusBadge, RuleResultBadge, VerificationTagBadge } from "../../components/StatusBadge";
import DocumentPreview from "../../components/DocumentPreview";
import { loadFileUrl } from "../../utils/storage";
import { evaluateDocumentScrutiny } from "../../utils/documentScrutinyEngine";
import type { DocumentStatus } from "../../types";
import { 
  FileCheck2, 
  ArrowLeft, 
  RotateCw, 
  CheckCircle2, 
  XCircle, 
  FileText,
  AlertTriangle,
  ShieldCheck 
} from "lucide-react";

export default function AicteDocumentReviewPage() {
  const params = useParams<{ institutionId?: string; docId?: string; id?: string }>();
  const institutionId = params.institutionId || "KEC001";
  const docId = params.docId || params.id || "doc-2";

  const navigate = useNavigate();
  const { docs, changeStatus, loading } = useDocuments();

  const institutionData =
    aicteInstitutionsList.find((i) => i.id === institutionId) || aicteInstitutionsList[0];

  const doc = docs.find((d) => d.id === docId || d.id === `doc-${docId}` || d.id.replace("doc-", "") === docId) || docs[0];
  const previewUrl = doc ? loadFileUrl(doc.id) : undefined;

  // Analysis workflow states: "idle" | "running" | "completed"
  const [analysisState, setAnalysisState] = useState<"idle" | "running" | "completed">("idle");
  const [pipelineStep, setPipelineStep] = useState(0);

  // Believable 7-stage scrutiny pipeline requested in Section 12
  const pipelineStages = [
    "Reading submitted document...",
    "Extracting document information & optical tokens...",
    "Identifying statutory document type & classification...",
    "Loading applicable regulatory scrutiny rules...",
    "Validating extracted information against institutional database...",
    "Detecting discrepancies & validity conditions...",
    "Preparing VeriScrutiny recommendation...",
  ];

  // Document-specific evaluation results
  const scrutinyResult = doc ? evaluateDocumentScrutiny(doc) : null;

  // Officer remarks state (pre-filled with recommended remarks)
  const [officerRemarks, setOfficerRemarks] = useState("");
  const [actionSuccessMsg, setActionSuccessMsg] = useState("");

  useEffect(() => {
    if (!scrutinyResult || !doc) {
      return;
    }

    const nextRemarks = doc.details?.officerRemarks || doc.details?.rejectionReason || scrutinyResult.suggestedOfficerRemark || "";
    setOfficerRemarks((current) => (current && current !== nextRemarks ? current : nextRemarks));
  }, [doc, scrutinyResult]);

  useEffect(() => {
    if (scrutinyResult) {
      const nextRemarks = doc?.details?.officerRemarks || doc?.details?.rejectionReason || scrutinyResult.suggestedOfficerRemark || "";
      setOfficerRemarks((current) => (current === "" ? nextRemarks : current));
    }
  }, [doc, scrutinyResult]);

  const runVeriScrutiny = () => {
    setAnalysisState("running");
    setPipelineStep(0);
    setActionSuccessMsg("");

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setPipelineStep(step);
      if (step >= pipelineStages.length) {
        clearInterval(interval);
        setAnalysisState("completed");
      }
    }, 450);
  };

  const handleDocumentSwitch = (newDocId: string) => {
    navigate(`/aicte/review/${institutionId}/${newDocId}`);
    setAnalysisState("idle");
    setPipelineStep(0);
    setActionSuccessMsg("");
  };

  const handleOfficerDecision = (decisionStatus: DocumentStatus) => {
    if (!doc) return;
    const remarks = officerRemarks.trim() || 
      (decisionStatus === "Verified" 
        ? "Document approved by AICTE Scrutiny Officer." 
        : decisionStatus === "Deficiency Raised"
        ? "Deficiency raised: requires clarification from institution."
        : "Document rejected due to non-compliance.");

    changeStatus(doc.id, decisionStatus, remarks);

    if (decisionStatus === "Deficiency Raised") {
      setActionSuccessMsg(`Deficiency successfully raised for ${doc.name}. The Institution portal has been updated.`);
    } else if (decisionStatus === "Verified") {
      setActionSuccessMsg(`Document certified and approved by AICTE Officer.`);
    } else if (decisionStatus === "Rejected") {
      setActionSuccessMsg(`Document rejected by AICTE Officer.`);
    }
  };

  if (loading || !doc || !scrutinyResult) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading document scrutiny interface...</div>;
  }

  const trackingCode = doc.trackingId || doc.details?.trackingId || `VS-2026-KEC-${doc.id.replace("doc-", "100")}`;

  return (
    <div className="space-y-5">
      {/* Top Header & Switcher */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              to={`/aicte/institution/${institutionId}`}
              className="text-xs text-[#0056b3] font-semibold hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{institutionData.name}</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {institutionData.applicationId}
            </span>
          </div>

          <h1 className="text-lg sm:text-xl font-bold text-[#071a30] flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-amber-600" />
            <span>Document Scrutiny: {doc.name}</span>
          </h1>
        </div>

        {/* Document Fast Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Switch Document:</span>
          <select
            value={doc.id}
            onChange={(e) => handleDocumentSwitch(e.target.value)}
            className="py-1.5 px-2.5 border border-slate-300 rounded text-xs font-semibold text-[#071a30] bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#071a30]"
          >
            {docs.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Top Metadata Bar */}
      <div className="bg-white border border-slate-300 rounded shadow-sm p-3.5 text-xs text-slate-700">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block uppercase">Document Name</span>
            <span className="font-bold text-slate-900">{doc.name}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block uppercase">Institution</span>
            <span className="font-bold text-slate-900">{institutionData.name}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block uppercase">Tracking ID</span>
            <span className="font-mono font-bold text-[#071a30]">{trackingCode}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block uppercase">Uploaded Date</span>
            <span className="font-mono text-slate-800">
              {new Date(doc.submissionDate).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
              })}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block uppercase">Current Status</span>
            <StatusBadge status={doc.status} size="sm" />
          </div>
        </div>
      </div>

      {/* Success Notification if action was taken */}
      {actionSuccessMsg && (
        <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 rounded text-xs text-emerald-950 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">{actionSuccessMsg}</span>
          </div>
          <Link
            to={`/aicte/report/${institutionId}/${doc.id}`}
            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-bold"
          >
            Generate Report
          </Link>
        </div>
      )}

      {/* 2-COLUMN LAYOUT: LEFT = PREVIEW, RIGHT = ANALYSIS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT SIDE: Document Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 uppercase tracking-wider">
                Submitted Document Preview
              </span>
              <span className="font-mono text-[11px] text-slate-500">Docket View</span>
            </div>
            <div className="p-3">
              <DocumentPreview document={doc} uploadedUrl={previewUrl} />
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-600 flex justify-between">
              <span>File: <strong className="font-mono">{doc.details?.fileName}</strong></span>
              <span>SHA-256: <strong className="font-mono">{doc.details?.checksum?.substring(0, 10)}...</strong></span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: VeriScrutiny Analysis (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* RUN VERISCRUTINY Primary Button Card */}
          <div className="bg-white border border-slate-300 rounded shadow-sm p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-[#071a30] uppercase tracking-wide">
                  Automated Scrutiny Assistance Engine
                </h2>
                <p className="text-[11px] text-slate-500">
                  Selectively loads document-specific scrutiny rules for <strong className="text-slate-800">{doc.name}</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={runVeriScrutiny}
                disabled={analysisState === "running"}
                className="py-2.5 px-5 bg-[#071a30] hover:bg-[#134074] disabled:bg-slate-400 text-white font-bold text-xs uppercase tracking-wider rounded shadow-sm transition flex items-center justify-center gap-2 flex-shrink-0"
              >
                <RotateCw className={`w-3.5 h-3.5 text-amber-400 ${analysisState === "running" ? "animate-spin" : ""}`} />
                <span>
                  {analysisState === "running"
                    ? "Running Analysis..."
                    : analysisState === "completed"
                    ? "Re-Run VeriScrutiny"
                    : "RUN VERISCRUTINY"}
                </span>
              </button>
            </div>

            {/* Believable Progress Animation */}
            {analysisState === "running" && (
              <div className="mt-4 pt-3 border-t border-slate-200 space-y-2">
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                  <div
                    className="bg-[#0b2545] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((pipelineStep + 1) / pipelineStages.length) * 100}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 font-mono">
                  <span>Step {pipelineStep + 1} of {pipelineStages.length}:</span>
                  <span className="font-semibold text-[#071a30]">
                    {pipelineStages[Math.min(pipelineStep, pipelineStages.length - 1)]}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* EXTRACTED INFORMATION TABLE (Section 13) */}
          <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#071a30]">
                Extracted Information
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">Field OCR & Identity Mapping</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-slate-200 text-slate-700 uppercase font-semibold text-[10px] tracking-wider">
                    <th className="px-3.5 py-2 w-48">Field</th>
                    <th className="px-3.5 py-2">Extracted Value</th>
                    <th className="px-3.5 py-2 w-36 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scrutinyResult.extractedFields.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-3.5 py-2 font-bold text-slate-800">
                        {item.field}
                      </td>
                      <td className="px-3.5 py-2 font-mono text-slate-800">
                        {item.value}
                      </td>
                      <td className="px-3.5 py-2 text-right">
                        <VerificationTagBadge tag={item.verification} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* DOCUMENT-SPECIFIC SCRUTINY CHECKLIST (Section 14) */}
          <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#071a30]">
                  Scrutiny Checklist ({doc.name})
                </h3>
                <p className="text-[11px] text-slate-500">
                  Document-specific compliance checks evaluated against statutory handbook norms
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold">
                <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  PASS: {scrutinyResult.summary.passed}
                </span>
                <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  WARN: {scrutinyResult.summary.warnings}
                </span>
                <span className="text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  FAIL: {scrutinyResult.summary.failed}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-slate-200 text-slate-700 uppercase font-semibold text-[10px] tracking-wider">
                    <th className="px-3 py-2 w-32">Parameter</th>
                    <th className="px-3 py-2">Requirement</th>
                    <th className="px-3 py-2">Extracted / Observed Value</th>
                    <th className="px-3 py-2 w-24">Result</th>
                    <th className="px-3 py-2">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scrutinyResult.checklist.map((item) => (
                    <tr
                      key={item.id}
                      className={`transition-colors ${
                        item.result === "FAIL"
                          ? "bg-rose-50/60"
                          : item.result === "WARNING"
                          ? "bg-amber-50/50"
                          : "hover:bg-slate-50/50"
                      }`}
                    >
                      <td className="px-3 py-2.5 font-bold text-slate-900">
                        {item.parameter}
                      </td>
                      <td className="px-3 py-2.5 text-slate-600 text-[11px]">
                        {item.requirement}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-slate-800 text-[11px]">
                        {item.extractedValue}
                      </td>
                      <td className="px-3 py-2.5">
                        <RuleResultBadge result={item.result} />
                      </td>
                      <td className="px-3 py-2.5 text-slate-700 text-[11px]">
                        {item.remarks}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 1: VERISCRUTINY RECOMMENDATION (Section 15) */}
          <div
            className={`p-4 rounded border-2 shadow-sm space-y-2 ${
              scrutinyResult.recommendation === "VERIFICATION PASSED"
                ? "bg-emerald-50/80 border-emerald-500 text-emerald-950"
                : scrutinyResult.recommendation === "NEEDS CLARIFICATION"
                ? "bg-amber-50/90 border-amber-500 text-amber-950"
                : "bg-rose-50/90 border-rose-500 text-rose-950"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                VeriScrutiny Recommendation
              </span>
              <span
                className={`px-2.5 py-1 rounded text-xs font-black tracking-wide border uppercase ${
                  scrutinyResult.recommendation === "VERIFICATION PASSED"
                    ? "bg-emerald-100 text-emerald-900 border-emerald-400"
                    : scrutinyResult.recommendation === "NEEDS CLARIFICATION"
                    ? "bg-amber-100 text-amber-900 border-amber-400"
                    : "bg-rose-100 text-rose-900 border-rose-400"
                }`}
              >
                {scrutinyResult.recommendation}
              </span>
            </div>

            <p className="text-xs font-semibold leading-relaxed">
              <strong>Reason:</strong> {scrutinyResult.recommendationReason}
            </p>

            <div className="pt-1 text-[11px] text-slate-600 border-t border-slate-200/60 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span>
                VeriScrutiny functions as a scrutiny assistance and recommendation tool. The AICTE Scrutiny Officer remains the final statutory decision-maker.
              </span>
            </div>
          </div>

          {/* SECTION 2: OFFICER DECISION (HUMAN IN THE LOOP) (Section 15 & 16) */}
          <div className="bg-white border-2 border-slate-400 rounded shadow-sm p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#071a30]">
                  OFFICER DECISION & SCRUTINY DETERMINATION
                </h3>
                <p className="text-[11px] text-slate-500">
                  Officer in-charge certification, deficiency issuance, or final rejection
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                AICTE-SR-9042
              </span>
            </div>

            {/* Officer Remarks Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Officer Remarks / Deficiency Notification to Institution:
              </label>
              <textarea
                rows={3}
                value={officerRemarks}
                onChange={(e) => setOfficerRemarks(e.target.value)}
                placeholder="Enter remarks or statutory grounds for deficiency..."
                className="w-full p-2.5 border border-slate-300 rounded text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#071a30]"
              />
              <span className="text-[11px] text-slate-500 block mt-1">
                * These remarks will be instantly communicated to the institution in their dashboard and submissions view.
              </span>
            </div>

            {/* Decision Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOfficerDecision("Verified")}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Document</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOfficerDecision("Deficiency Raised")}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Raise Deficiency / Request Clarification</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOfficerDecision("Rejected")}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Document</span>
                </button>
              </div>

              <Link
                to={`/aicte/report/${institutionId}/${doc.id}`}
                className="px-3.5 py-2 border border-[#071a30] text-[#071a30] hover:bg-slate-50 rounded text-xs font-bold transition flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                <span>Generate Scrutiny Report</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
