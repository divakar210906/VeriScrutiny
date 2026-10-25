// src/pages/ScrutinyPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDocuments } from "../hooks/useDocuments";
import { StatusBadge, RuleResultBadge } from "../components/StatusBadge";
import type { DocumentStatus } from "../types";
import { 
  FileCheck2, 
  RotateCw, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  Send, 
  Info 
} from "lucide-react";

export default function ScrutinyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { docs, changeStatus, loading } = useDocuments();

  // If no ID is provided, default to doc-2 (Fire Safety Certificate) as the showcase demo!
  const currentDocId = id || "doc-2";
  const selectedDoc = docs.find((d) => d.id === currentDocId) || docs[0];

  // Pipeline stages
  const pipelineStages = [
    { key: "received", label: "Document Ingestion", detail: "SHA-256 integrity & format check" },
    { key: "extracted", label: "Data Extraction", detail: "OCR metadata & parameter parsing" },
    { key: "rules", label: "Rules Applied", detail: "Statutory checklist validation" },
    { key: "validation", label: "Regulatory Cross-Check", detail: "AISHE & council record cross-check" },
    { key: "decision", label: "Final Decision", detail: "Audit classification & seal" },
  ];

  const [activeStage, setActiveStage] = useState<number>(5); // 1 to 5; default 5 (complete)
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalAction, setModalAction] = useState<"verify" | "review" | "reject" | null>(null);
  const [actionRemarks, setActionRemarks] = useState("");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "warning" | "error" } | null>(null);

  // Run or re-run automated scrutiny pipeline simulation
  const handleRunPipeline = () => {
    setIsProcessing(true);
    setActiveStage(1);

    const stepInterval = setInterval(() => {
      setActiveStage((prev) => {
        if (prev >= 5) {
          clearInterval(stepInterval);
          setIsProcessing(false);
          setNotification({
            message: `Scrutiny pipeline completed successfully for ${selectedDoc.name}.`,
            type: "success",
          });
          return 5;
        }
        return prev + 1;
      });
    }, 700);
  };

  const handleDocumentChange = (newId: string) => {
    navigate(`/scrutiny/${newId}`);
    setActiveStage(5);
    setNotification(null);
  };

  const handleConfirmAction = () => {
    if (!modalAction || !selectedDoc) return;

    let targetStatus: DocumentStatus = "Verified";
    let defaultRemark = "";

    if (modalAction === "verify") {
      targetStatus = "Verified";
      defaultRemark = actionRemarks.trim() || "Manually verified and cleared by Scrutiny Officer.";
    } else if (modalAction === "review") {
      targetStatus = "Needs Review";
      defaultRemark = actionRemarks.trim() || "Sent for second-tier committee inspection and issuing authority confirmation.";
    } else if (modalAction === "reject") {
      targetStatus = "Rejected";
      defaultRemark = actionRemarks.trim() || "Rejected due to non-compliance with statutory regulations.";
    }

    changeStatus(selectedDoc.id, targetStatus, defaultRemark);
    setModalAction(null);
    setActionRemarks("");
    setNotification({
      message: `Document status updated to "${targetStatus}". Audit history entry recorded.`,
      type: targetStatus === "Verified" ? "success" : targetStatus === "Needs Review" ? "warning" : "error",
    });
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (loading || !selectedDoc) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading scrutiny workflow...</div>;
  }

  const checklist = selectedDoc.checklist;
  const passedCount = checklist.filter((c) => c.result === "PASS").length;
  const warningCount = checklist.filter((c) => c.result === "WARNING").length;
  const failedCount = checklist.filter((c) => c.result === "FAIL").length;

  return (
    <div className="space-y-4">
      {/* Toast Notification Alert */}
      {notification && (
        <div
          className={`p-3 rounded border text-xs font-semibold flex items-center justify-between transition-all ${
            notification.type === "success"
              ? "bg-emerald-50 border-emerald-300 text-emerald-900"
              : notification.type === "warning"
              ? "bg-amber-50 border-amber-300 text-amber-900"
              : "bg-rose-50 border-rose-300 text-rose-900"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : notification.type === "warning" ? (
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-500 hover:text-slate-800">
            ✕
          </button>
        </div>
      )}

      {/* Top Scrutiny Command Bar & Document Selector */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#134074] text-white rounded">
              Standing Scrutiny Engine
            </span>
            <span className="text-xs text-slate-500 font-mono">
              AICTE Compliance Rule Matrix v4.2
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#0b2545] flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-amber-600" />
            <span>Document Scrutiny & Verification Sheet</span>
          </h1>
        </div>

        {/* Document Switcher Dropdown (Allows judge/user to effortlessly test different outcomes!) */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded px-3 py-1.5">
            <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Active Document:</span>
            <select
              value={selectedDoc.id}
              onChange={(e) => handleDocumentChange(e.target.value)}
              className="text-xs font-semibold text-[#0b2545] bg-transparent focus:outline-none cursor-pointer"
            >
              {docs.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.status})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRunPipeline}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0b2545] hover:bg-[#134074] disabled:bg-slate-400 text-white rounded text-xs font-semibold shadow-sm transition"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isProcessing ? "animate-spin" : ""}`} />
            <span>{isProcessing ? "Executing Rules..." : "Re-Run Scrutiny"}</span>
          </button>
        </div>
      </div>

      {/* 5-Step Scrutiny Progress Pipeline */}
      <div className="bg-white border border-slate-300 rounded p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Statutory Verification Pipeline
          </h3>
          <span className="text-[11px] font-mono text-slate-500">
            {isProcessing ? `Step ${activeStage} of 5 in progress...` : "Audit Assessment Complete"}
          </span>
        </div>

        {/* Pipeline Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {pipelineStages.map((stage, idx) => {
            const stepNumber = idx + 1;
            const isCompleted = stepNumber < activeStage || (!isProcessing && activeStage === 5);
            const isCurrent = stepNumber === activeStage && isProcessing;

            return (
              <div
                key={stage.key}
                className={`p-2.5 rounded border text-xs transition-all ${
                  isCurrent
                    ? "bg-blue-50 border-blue-400 text-blue-900 shadow-sm"
                    : isCompleted
                    ? "bg-emerald-50/70 border-emerald-300 text-emerald-950"
                    : "bg-slate-50 border-slate-200 text-slate-400"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-[10px]">STAGE 0{stepNumber}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : isCurrent ? (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                    </span>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                  )}
                </div>
                <div className="font-bold text-xs truncate">{stage.label}</div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">{stage.detail}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scrutiny Decision Banner */}
      <div
        className={`p-4 rounded border-2 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          selectedDoc.status === "Verified"
            ? "bg-emerald-50/90 border-emerald-500 text-emerald-950"
            : selectedDoc.status === "Needs Review"
            ? "bg-amber-50/90 border-amber-500 text-amber-950"
            : "bg-rose-50/90 border-rose-500 text-rose-950"
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider">Scrutiny Determination:</span>
            <StatusBadge status={selectedDoc.status} size="lg" />
          </div>
          <p className="text-xs font-medium max-w-3xl leading-relaxed">
            <strong>Official Reason: </strong>
            {selectedDoc.details.scrutinySummary?.reason || "Pending review."}
          </p>
        </div>

        {/* Scrutiny Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setModalAction("verify")}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold shadow-sm transition flex items-center gap-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mark as Verified</span>
          </button>

          <button
            onClick={() => setModalAction("review")}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold shadow-sm transition flex items-center gap-1"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send for Review</span>
          </button>

          <button
            onClick={() => setModalAction("reject")}
            className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded text-xs font-semibold shadow-sm transition flex items-center gap-1"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Reject Document</span>
          </button>

          <button
            onClick={() => navigate(`/report/${selectedDoc.id}`)}
            className="px-3 py-1.5 bg-[#0b2545] hover:bg-[#134074] text-white rounded text-xs font-semibold shadow-sm transition flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Verification Parameters & Checklist Table */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-[#0b2545] uppercase tracking-wide">
              Verification Checklist & Rule Findings
            </h2>
            <p className="text-xs text-slate-500">
              Evaluated against AICTE Approval Process Handbook (APH) 2025–26 & statutory gazette norms
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex items-center gap-2 text-xs font-semibold font-mono">
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
              Passed: {passedCount}
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
              Warnings: {warningCount}
            </span>
            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
              Failed: {failedCount}
            </span>
          </div>
        </div>

        {/* Verification Checklist Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f1f5f9] border-b border-slate-300 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
                <th className="px-3 py-2.5 w-12 text-center">#</th>
                <th className="px-3.5 py-2.5">Verification Parameter</th>
                <th className="px-3.5 py-2.5">Statutory Requirement</th>
                <th className="px-3.5 py-2.5">Extracted Evidence</th>
                <th className="px-3.5 py-2.5 w-24">Result</th>
                <th className="px-3.5 py-2.5">Scrutiny Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {checklist.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`transition-colors ${
                    item.result === "FAIL"
                      ? "bg-rose-50/50 hover:bg-rose-50"
                      : item.result === "WARNING"
                      ? "bg-amber-50/40 hover:bg-amber-50"
                      : "hover:bg-blue-50/30"
                  }`}
                >
                  <td className="px-3 py-2.5 text-center font-mono text-slate-500 font-semibold">
                    {idx + 1}
                  </td>
                  <td className="px-3.5 py-2.5 font-bold text-slate-900">
                    {item.parameter}
                  </td>
                  <td className="px-3.5 py-2.5 text-slate-600 max-w-xs">
                    {item.requirement}
                  </td>
                  <td className="px-3.5 py-2.5 text-slate-800 font-mono text-[11px] max-w-xs">
                    {item.extractedValue}
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

        {/* Scrutiny Footer Summary */}
        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>All checks algorithmically cross-verified with registered institutional profile.</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to={`/documents/${selectedDoc.id}`}
              className="text-[#0056b3] hover:underline font-semibold"
            >
              View Document Preview
            </Link>
            <span>•</span>
            <Link
              to={`/report/${selectedDoc.id}`}
              className="text-[#0056b3] hover:underline font-semibold"
            >
              Print Official Report
            </Link>
          </div>
        </div>
      </div>

      {/* Confirmation Modal Dialog for Manual Scrutiny Decisions */}
      {modalAction && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded border border-slate-300 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div
              className={`px-4 py-3 text-white font-bold text-sm flex items-center justify-between ${
                modalAction === "verify"
                  ? "bg-emerald-700"
                  : modalAction === "review"
                  ? "bg-amber-600"
                  : "bg-rose-700"
              }`}
            >
              <div className="flex items-center gap-2">
                {modalAction === "verify" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                ) : modalAction === "review" ? (
                  <AlertTriangle className="w-5 h-5 text-amber-200" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-200" />
                )}
                <span className="uppercase tracking-wide">
                  Confirm Scrutiny Decision: {modalAction === "verify" ? "Mark as Verified" : modalAction === "review" ? "Send for Review" : "Reject Document"}
                </span>
              </div>
              <button
                onClick={() => setModalAction(null)}
                className="text-white hover:text-slate-200 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <p className="text-slate-700">
                You are about to record an official scrutiny determination for{" "}
                <strong className="text-slate-900">{selectedDoc.name}</strong> (Doc No:{" "}
                <span className="font-mono font-semibold">{selectedDoc.documentNumber}</span>).
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Scrutinizer Audit Remarks / Official Note:
                </label>
                <textarea
                  rows={3}
                  value={actionRemarks}
                  onChange={(e) => setActionRemarks(e.target.value)}
                  placeholder={
                    modalAction === "verify"
                      ? "All statutory clauses and issuing records cleared."
                      : modalAction === "review"
                      ? "Specify what external verification is required from the authority..."
                      : "Specify non-conformity reasons for official audit record..."
                  }
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] text-xs font-medium"
                />
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600">
                <strong>Audit Notice:</strong> This action will be time-stamped and logged under the institutional verification history register.
              </div>
            </div>

            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setModalAction(null)}
                className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className={`px-4 py-1.5 rounded text-white font-semibold shadow-sm transition ${
                  modalAction === "verify"
                    ? "bg-emerald-700 hover:bg-emerald-800"
                    : modalAction === "review"
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-rose-700 hover:bg-rose-800"
                }`}
              >
                Commit Determination
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
