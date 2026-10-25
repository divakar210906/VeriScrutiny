import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDocuments } from "../../hooks/useDocuments";
import { aicteInstitutionsList } from "../../mockData";
import { StatusBadge, RuleResultBadge } from "../../components/StatusBadge";
import DocumentPreview from "../../components/DocumentPreview";
import { loadFileUrl } from "../../utils/storage";
import type { DocumentStatus } from "../../types";
import { 
  FileCheck2, 
  ArrowLeft, 
  RotateCw, 
  CheckCircle2, 
  XCircle, 
  FileText 
} from "lucide-react";

export default function AicteDocumentReviewPage() {
  const { institutionId = "KEC001", docId = "doc-2" } = useParams<{ institutionId: string; docId: string }>();
  const navigate = useNavigate();
  const { docs, changeStatus, loading } = useDocuments();

  const institutionData =
    aicteInstitutionsList.find((i) => i.id === institutionId) || aicteInstitutionsList[0];

  const doc = docs.find((d) => d.id === docId) || docs[0];
  const previewUrl = doc ? loadFileUrl(doc.id) : undefined;

  // Analysis workflow state:
  // "idle" | "running" | "completed"
  const [analysisState, setAnalysisState] = useState<"idle" | "running" | "completed">("idle");
  const [pipelineStep, setPipelineStep] = useState(0);

  const pipelineStages = [
    "Document received & SHA-256 validated",
    "Information & metadata extracted",
    "10 statutory checklist rules applied",
    "External registry cross-validation performed",
    "Scrutiny determination result generated",
  ];

  const runVeriScrutiny = () => {
    setAnalysisState("running");
    setPipelineStep(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setPipelineStep(step);
      if (step >= pipelineStages.length) {
        clearInterval(interval);
        setAnalysisState("completed");
      }
    }, 600);
  };

  const handleDocumentSwitch = (newDocId: string) => {
    navigate(`/aicte/review/${institutionId}/${newDocId}`);
    setAnalysisState("idle");
    setPipelineStep(0);
  };

  const handleManualAction = (newStatus: DocumentStatus) => {
    if (!doc) return;
    const remark =
      newStatus === "Verified"
        ? "Manually certified and cleared by AICTE Senior Scrutiny Officer."
        : "Rejected due to regulatory non-conformity with AICTE Approval Process Handbook norms.";
    changeStatus(doc.id, newStatus, remark);
  };

  if (loading || !doc) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading document review...</div>;
  }

  // Pre-configured outcomes
  const isFireSafety = doc.id === "doc-2" || doc.name.toLowerCase().includes("fire");
  const isAffiliation = doc.id === "doc-1" || doc.name.toLowerCase().includes("affiliation");
  const isFaculty = doc.id === "doc-4" || doc.name.toLowerCase().includes("faculty");

  const determinationStatus: DocumentStatus = isAffiliation
    ? "Verified"
    : isFireSafety
    ? "Needs Review"
    : isFaculty
    ? "Rejected"
    : doc.status;

  const determinationReason = isAffiliation
    ? "All statutory verification parameters and university affiliation criteria successfully validated."
    : isFireSafety
    ? "All mandatory fields are available, but certificate validity requires confirmation against issuing authority live record."
    : isFaculty
    ? "Required institutional declaration details are incomplete; faculty cadre ratio declaration is non-compliant with AICTE approval norms (1:2.4 vs mandated 1:2:6)."
    : doc.details.scrutinySummary?.reason || "Verified against guidelines.";

  return (
    <div className="space-y-5">
      {/* Top Header & Fast Switcher */}
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
            <span>AICTE Document Review: {doc.name}</span>
          </h1>
        </div>

        {/* Demo Document Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Switch Doc:</span>
          <select
            value={doc.id}
            onChange={(e) => handleDocumentSwitch(e.target.value)}
            className="py-1.5 px-2.5 border border-slate-300 rounded text-xs font-semibold text-[#071a30] bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#071a30]"
          >
            <option value="doc-2">Fire Safety Certificate (Demo: Needs Review)</option>
            <option value="doc-1">Affiliation Certificate (Demo: Verified)</option>
            <option value="doc-4">Faculty Declaration (Demo: Rejected)</option>
            <option value="doc-3">Building Stability Certificate</option>
            <option value="doc-5">AICTE Approval Letter (EoA)</option>
          </select>
        </div>
      </div>

      {/* Main Review Section: Metadata + Document Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Document Information Card */}
        <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Document Information & Institutional Metadata
              </h2>
              <StatusBadge status={doc.status} size="sm" />
            </div>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px] font-semibold">Institution:</span>
                <span className="font-bold text-slate-900">{institutionData.name}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px] font-semibold">Certificate / Doc Number:</span>
                <span className="font-mono font-bold text-slate-900">{doc.documentNumber}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px] font-semibold">Issuing Authority:</span>
                <span className="text-slate-800 font-medium">{doc.issuingAuthority}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px] font-semibold">Statutory Category:</span>
                <span className="text-slate-800">{doc.category}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px] font-semibold">Date of Issue:</span>
                <span className="font-mono text-slate-800">
                  {new Date(doc.issueDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px] font-semibold">Valid Until / Expiry:</span>
                <span className="font-mono text-slate-800">
                  {new Date(doc.expiryDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="sm:col-span-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="font-mono text-slate-500 truncate max-w-xs">
                  Checksum: {doc.details.checksum.substring(0, 20)}...
                </span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  PDF Format Validated
                </span>
              </div>
            </div>
          </div>

          {/* Big RUN VERISCRUTINY Action Button */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
            <button
              onClick={runVeriScrutiny}
              disabled={analysisState === "running"}
              className="w-full py-3 px-4 bg-[#071a30] hover:bg-[#134074] disabled:bg-slate-400 text-white font-bold text-sm rounded shadow-md transition flex items-center justify-center gap-2"
            >
              <RotateCw className={`w-4 h-4 text-amber-400 ${analysisState === "running" ? "animate-spin" : ""}`} />
              <span>
                {analysisState === "running"
                  ? "VeriScrutiny Analysis in Progress..."
                  : analysisState === "completed"
                  ? "Re-Run VeriScrutiny Analysis"
                  : "Run VeriScrutiny Analysis"}
              </span>
            </button>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Applies AI optical extraction, statutory cross-reference, and AICTE rule verification
            </p>
          </div>
        </div>

        {/* Document Preview Card */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 uppercase tracking-wider">Submitted Document Preview</span>
            <span className="text-slate-500 font-mono text-[11px]">Docket View</span>
          </div>
          <DocumentPreview document={doc} uploadedUrl={previewUrl} />
        </div>
      </div>

      {/* Analysis Running Progress Box */}
      {analysisState === "running" && (
        <div className="bg-white border-2 border-blue-400 rounded shadow-md p-6 text-center space-y-4 animate-in fade-in">
          <div className="flex justify-center items-center gap-2 text-[#071a30] font-bold text-sm">
            <RotateCw className="w-5 h-5 text-amber-500 animate-spin" />
            <span>VeriScrutiny Automated Inspection Engine Running</span>
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#134074] h-2 transition-all duration-300"
                style={{ width: `${(pipelineStep / pipelineStages.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-600 font-mono">
              {pipelineStages[Math.min(pipelineStep, pipelineStages.length - 1)]}
            </p>
          </div>
        </div>
      )}

      {/* Analysis Results Section (Shown immediately after clicking Run VeriScrutiny or if already completed) */}
      {(analysisState === "completed" || analysisState === "idle") && (
        <div className="space-y-5 pt-2">
          
          {/* FINAL RESULT BANNER */}
          <div
            className={`p-4 rounded border-2 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              determinationStatus === "Verified"
                ? "bg-emerald-50 border-emerald-500 text-emerald-950"
                : determinationStatus === "Needs Review"
                ? "bg-amber-50 border-amber-500 text-amber-950"
                : "bg-rose-50 border-rose-500 text-rose-950"
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider">
                  VeriScrutiny Decision:
                </span>
                <StatusBadge status={determinationStatus} size="lg" />
              </div>
              <p className="text-xs font-medium max-w-2xl leading-relaxed">
                <strong>Reason: </strong>{determinationReason}
              </p>
            </div>

            {/* Final Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to={`/aicte/report/${institutionId}/${doc.id}`}
                className="px-3.5 py-2 bg-[#071a30] hover:bg-slate-800 text-white rounded text-xs font-bold shadow-sm transition flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Generate Report</span>
              </Link>

              <button
                onClick={() => handleManualAction("Verified")}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold shadow-sm transition flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark as Verified</span>
              </button>

              <button
                onClick={() => handleManualAction("Rejected")}
                className="px-3.5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded text-xs font-bold shadow-sm transition flex items-center gap-1"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            </div>
          </div>

          {/* Verification Checklist Table */}
          <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Verification Checklist & Audit Parameters
                </h3>
                <p className="text-[11px] text-slate-500">
                  Evaluated against AICTE Approval Process Handbook (APH) guidelines
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono font-bold">
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  PASS: {doc.checklist.filter((c) => c.result === "PASS").length}
                </span>
                <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  WARN: {doc.checklist.filter((c) => c.result === "WARNING").length}
                </span>
                <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  FAIL: {doc.checklist.filter((c) => c.result === "FAIL").length}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f1f5f9] border-b border-slate-300 text-slate-700 uppercase font-semibold text-[10px] tracking-wider">
                    <th className="px-3.5 py-2.5 w-10 text-center">#</th>
                    <th className="px-3.5 py-2.5">Parameter</th>
                    <th className="px-3.5 py-2.5">Requirement</th>
                    <th className="px-3.5 py-2.5 w-24">Result</th>
                    <th className="px-3.5 py-2.5">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {doc.checklist.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={`transition-colors ${
                        item.result === "FAIL"
                          ? "bg-rose-50/50 hover:bg-rose-50"
                          : item.result === "WARNING"
                          ? "bg-amber-50/40 hover:bg-amber-50"
                          : "hover:bg-blue-50/20"
                      }`}
                    >
                      <td className="px-3.5 py-2.5 text-center font-mono text-slate-500 font-semibold">
                        {idx + 1}
                      </td>
                      <td className="px-3.5 py-2.5 font-bold text-slate-900">
                        {item.parameter}
                      </td>
                      <td className="px-3.5 py-2.5 text-slate-600">
                        {item.requirement}
                      </td>
                      <td className="px-3.5 py-2.5">
                        <RuleResultBadge result={item.result} />
                      </td>
                      <td className="px-3.5 py-2.5 text-slate-700">
                        {item.remarks}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
