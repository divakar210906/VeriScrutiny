import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, FileText, ShieldCheck } from "lucide-react";
import { StatusBadge } from "../../components/StatusBadge";
import DocumentPreview from "../../components/DocumentPreview";
import { useAuth } from "../../context/AuthContext";
import { useDocuments } from "../../hooks/useDocuments";
import { useDocumentFile } from "../../hooks/useDocumentFile";
import { aicteInstitutionsList } from "../../mockData";
import { loadDocumentFile } from "../../utils/storage";
import { analyzeDocumentWithML } from "../../utils/mlApiClient";
import type { DocumentStatus, ExtractedField, ScrutinyAnalysisResult } from "../../types";

const decisions: Array<{ status: DocumentStatus; title: string; style: string }> = [
  { status: "Verified", title: "Record officer decision: approve", style: "bg-emerald-700 hover:bg-emerald-800" },
  { status: "Deficiency Raised", title: "Record officer decision: raise deficiency", style: "bg-amber-700 hover:bg-amber-800" },
  { status: "Rejected", title: "Record officer decision: reject", style: "bg-rose-700 hover:bg-rose-800" },
];

export default function AicteDocumentReviewPage() {
  const { institutionId = "KEC001", docId, id } = useParams<{ institutionId?: string; docId?: string; id?: string }>();
  const requestedDocId = docId ?? id ?? "";
  const navigate = useNavigate();
  const { officerId } = useAuth();
  const { docs, setDocs, changeStatus, loading } = useDocuments();
  const institutionData = aicteInstitutionsList.find((item) => item.id === institutionId);
  const document = docs.find((item) => item.id === requestedDocId || item.id === `doc-${requestedDocId}`);
  const { url: previewUrl, error: fileLoadError } = useDocumentFile(document?.id ?? "");
  const [remarks, setRemarks] = useState("");
  const [analysisMessage, setAnalysisMessage] = useState("");
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [pendingDecision, setPendingDecision] = useState<DocumentStatus | null>(null);

  const runAnalysis = async () => {
    if (!document || !institutionData) return;
    setAnalysisLoading(true);
    setAnalysisMessage("");
    try {
      const file = await loadDocumentFile(document.id);
      if (!file) {
        throw new Error("The original uploaded file is not available in this browser. Ask the institution to upload it before running analysis.");
      }
      const peerDocuments = docs
        .filter((item) => item.id !== document.id && item.details.institutionId === institutionData.id)
        .map((item) => ({
          institutionId: item.details.institutionId,
          academicYear: item.academicYear,
          documentNumber: item.documentNumber,
        }));
      const result = await analyzeDocumentWithML(
        file,
        document.details.fileName || "uploaded-document",
        document,
        institutionData.name,
        institutionData.id,
        institutionData.applicationId,
        peerDocuments,
      );
      setDocs(docs.map((item) => item.id !== document.id ? item : {
        ...item,
        checklist: result.checklist,
        details: {
          ...item.details,
          extractedFields: result.extractedFields,
          recommendation: result.recommendation,
          recommendationReason: result.recommendationReason,
          analysisResult: result,
          analysisDate: typeof result.meta?.analyzedAt === "string" ? result.meta.analyzedAt : undefined,
        },
      }));
      window.dispatchEvent(new Event("veriscrutiny_update"));
      setAnalysisMessage("Analysis complete. Findings are advisory and do not change document status or officer decision.");
    } catch (error) {
      setAnalysisMessage(error instanceof Error ? error.message : "Analysis failed for an unexpected reason.");
    } finally {
      setAnalysisLoading(false);
    }
  };

  const recordDecision = (status: DocumentStatus) => {
    if (!document) return;
    const officerRemarks = remarks.trim();
    if (officerRemarks.length < 5) {
      setFormError("Enter officer remarks (at least 5 characters) before recording a decision.");
      return;
    }
    setPendingDecision(status);
  };

  const confirmDecision = () => {
    if (!document || !pendingDecision) return;
    const status = pendingDecision;
    changeStatus(document.id, status, remarks.trim(), officerId);
    setFormError("");
    setActionMessage(`Officer decision recorded: ${status}. The institution submission record has been updated.`);
    setPendingDecision(null);
  };

  if (loading) {
    return <p role="status" className="rounded border border-slate-200 bg-white p-6 text-sm text-slate-600">Loading application documents…</p>;
  }

  if (!institutionData || !document) {
    return (
      <section className="rounded border border-slate-300 bg-white p-6">
        <h1 className="text-lg font-semibold text-slate-900">Application document not found</h1>
        <p className="mt-2 text-sm text-slate-600">The institution or document reference in this link is unavailable.</p>
        <Link to="/aicte/institutions" className="mt-4 inline-flex text-sm font-semibold text-blue-800 hover:underline">
          Return to institutions
        </Link>
      </section>
    );
  }

  const currentTrackingId = document.trackingId ?? "Not assigned";

  return (
    <div className="space-y-5">
      <header className="rounded border border-slate-300 bg-white p-4">
        <Link
          to={`/aicte/institution/${institutionId}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-800 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {institutionData.name}
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Application scrutiny workspace</p>
            <h1 className="mt-1 text-xl font-bold text-[#0b2545]">{document.name}</h1>
            <p className="mt-1 text-sm text-slate-600">
              {institutionData.name} · Application {institutionData.applicationId} · {institutionData.id}
            </p>
          </div>
          <StatusBadge status={document.status} />
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-200 pt-4 text-sm sm:grid-cols-4">
          <div><dt className="text-xs text-slate-500">Document reference</dt><dd className="mt-1 font-mono font-medium text-slate-800">{document.documentNumber || "Not provided"}</dd></div>
          <div><dt className="text-xs text-slate-500">Submitted</dt><dd className="mt-1 text-slate-800">{new Date(document.submissionDate).toLocaleString("en-IN")}</dd></div>
          <div><dt className="text-xs text-slate-500">Tracking reference</dt><dd className="mt-1 font-mono text-slate-800">{currentTrackingId}</dd></div>
          <div><dt className="text-xs text-slate-500">Category</dt><dd className="mt-1 text-slate-800">{document.category}</dd></div>
        </dl>
      </header>

      <nav className="scrutiny-section-nav" aria-label="Application review sections">
        <a href="#submitted-document">Submitted document</a>
        <a href="#veriscrutiny-analysis">VeriScrutiny findings</a>
        <a href="#officer-decision">Officer decision</a>
      </nav>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <section className="min-w-0 space-y-3">
          <div id="submitted-document" className="scroll-mt-4 rounded border border-slate-300 bg-white p-4">
            <h2 className="text-sm font-semibold text-slate-900">Application documents</h2>
            <ul className="mt-3 divide-y divide-slate-200 border-y border-slate-200">
              {docs.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => navigate(`/aicte/review/${institutionId}/${item.id}`)}
                    aria-current={item.id === document.id ? "page" : undefined}
                    className={`flex w-full items-center justify-between gap-3 px-3 py-3 text-left text-sm hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-blue-700 ${
                      item.id === document.id ? "bg-blue-50" : "bg-white"
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <FileText className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
                      <span className="truncate font-medium text-slate-800">{item.name}</span>
                    </span>
                    <StatusBadge status={item.status} size="sm" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <DocumentPreview document={document} uploadedUrl={previewUrl} fileLoadError={fileLoadError} />
          <div className="rounded border border-slate-200 bg-white p-4 text-sm">
            <h2 className="font-semibold text-slate-900">Document record</h2>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <div><dt className="text-xs text-slate-500">File name</dt><dd className="mt-1 break-all text-slate-800">{document.details.fileName}</dd></div>
              <div><dt className="text-xs text-slate-500">Uploaded by</dt><dd className="mt-1 text-slate-800">{document.details.uploadedBy || "Not recorded"}</dd></div>
              <div><dt className="text-xs text-slate-500">Issuing authority</dt><dd className="mt-1 text-slate-800">{document.issuingAuthority || "Not provided"}</dd></div>
              <div><dt className="text-xs text-slate-500">Integrity checksum</dt><dd className="mt-1 break-all font-mono text-xs text-slate-700">{document.details.checksum || "Not available"}</dd></div>
            </dl>
          </div>
        </section>

        <aside className="space-y-4">
          <section id="veriscrutiny-analysis" className="scroll-mt-4 rounded border border-slate-300 bg-white p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" aria-hidden="true" />
              <div>
                <h2 className="text-sm font-semibold text-slate-900">VeriScrutiny Recommendation</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Runs local OCR, pretrained semantic document understanding, deterministic rules, cross-document checks, and visual heuristics. Results are advisory and never authenticate a document or make the final decision.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={runAnalysis}
              disabled={analysisLoading}
              className="mt-4 w-full rounded border border-[#0b2545] bg-[#0b2545] px-3 py-2.5 text-sm font-semibold text-white hover:bg-[#134074] disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              {analysisLoading ? "Analyzing document…" : "Run VeriScrutiny"}
            </button>
            {analysisMessage && (
              <p role={analysisMessage.includes("complete") ? "status" : "alert"} className="mt-3 rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">
                {analysisMessage}
              </p>
            )}
            {document.details.analysisResult && (
              <AnalysisFindings result={document.details.analysisResult} analyzedAt={document.details.analysisDate} />
            )}
          </section>

          <section id="officer-decision" className="scroll-mt-4 rounded border-2 border-slate-400 bg-white p-4">
            <h2 className="text-sm font-semibold text-slate-900">Officer decision — system recommends, officer decides</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Review the submitted source and VeriScrutiny recommendation, then record your independent reasoned decision. Analysis never changes this decision automatically.
            </p>
            <label htmlFor="officer-remarks" className="mt-4 block text-sm font-medium text-slate-800">
              Officer remarks <span className="text-rose-700">(required)</span>
            </label>
            <textarea
              id="officer-remarks"
              rows={5}
              value={remarks}
              onChange={(event) => {
                setRemarks(event.target.value);
                setFormError("");
              }}
              maxLength={2000}
              placeholder="Record the basis for the decision or specify the deficiency to be addressed."
              className="mt-1.5 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
            />
            <p className="mt-1 text-right text-xs text-slate-500">{remarks.length}/2000</p>
            {formError && (
              <p role="alert" className="mt-2 flex items-start gap-2 text-sm text-rose-800">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {formError}
              </p>
            )}
            {actionMessage && (
              <p role="status" className="mt-3 rounded border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900">
                {actionMessage}
              </p>
            )}
            <div className="mt-4 grid gap-2">
              {decisions.map((decision) => (
                <button
                  key={decision.status}
                  type="button"
                  onClick={() => recordDecision(decision.status)}
                  className={`rounded px-3 py-2.5 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800 ${decision.style}`}
                >
                  {decision.title}
                </button>
              ))}
            </div>
            <Link
              to={`/aicte/report/${institutionId}/${document.id}`}
              className="mt-4 inline-flex text-sm font-semibold text-blue-800 hover:underline"
            >
              View scrutiny report
            </Link>
          </section>
        </aside>
      </div>
      {pendingDecision && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4"
          onKeyDown={(event) => {
            if (event.key === "Escape") setPendingDecision(null);
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="decision-confirm-title"
            aria-describedby="decision-confirm-description"
            tabIndex={-1}
            className="w-full max-w-lg border border-slate-300 bg-white p-5 shadow-xl"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Officer action confirmation</p>
            <h2 id="decision-confirm-title" className="mt-1 text-lg font-bold text-slate-900">
              Record {pendingDecision === "Verified" ? "approval" : pendingDecision === "Rejected" ? "rejection" : "deficiency"}?
            </h2>
            <p id="decision-confirm-description" className="mt-2 text-sm leading-6 text-slate-700">
              This will record your decision for <strong>{document.name}</strong> at {institutionData.name} and update this browser’s workflow record.
              VeriScrutiny’s advisory recommendation does not determine this action.
            </p>
            <div className="mt-4 border-l-2 border-slate-300 bg-slate-50 p-3 text-sm text-slate-700">
              <span className="font-semibold">Officer remarks:</span>
              <p className="mt-1 whitespace-pre-wrap">{remarks.trim()}</p>
            </div>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDecision(null)}
                className="border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Review again
              </button>
              <button
                type="button"
                autoFocus
                onClick={confirmDecision}
                className={`px-4 py-2 text-sm font-semibold text-white ${
                  pendingDecision === "Verified"
                    ? "bg-emerald-800 hover:bg-emerald-900"
                    : pendingDecision === "Rejected"
                    ? "bg-rose-800 hover:bg-rose-900"
                    : "bg-amber-800 hover:bg-amber-900"
                }`}
              >
                Confirm officer decision
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function AnalysisFindings({ result, analyzedAt }: { result: ScrutinyAnalysisResult; analyzedAt?: string }) {
  const checklistByParameter = new Map(result.checklist.map((item) => [item.parameter, item]));
  const statusClass: Record<ExtractedField["verification"], string> = {
    FOUND: "text-emerald-800",
    MATCHED: "text-emerald-800",
    MISMATCH: "text-rose-800",
    "NOT FOUND": "text-amber-800",
    "REVIEW REQUIRED": "text-amber-800",
  };

  return (
    <div className="mt-4 space-y-3 border-t border-slate-200 pt-4">
      <div className="rounded border border-blue-200 bg-blue-50 p-3">
        <p className="text-xs font-bold uppercase tracking-wide text-blue-900">VeriScrutiny Analysis · Advisory findings for officer review</p>
        <p className="mt-1 text-sm font-semibold text-slate-900">{result.recommendation}</p>
        <p className="mt-1 text-sm text-slate-700">{result.recommendationReason}</p>
        <p className="mt-2 border-t border-blue-200 pt-2 text-xs font-semibold text-blue-950">
          Decision-support only. Final scrutiny and decision remain with the authorised AICTE officer.
        </p>
        <p className="mt-2 text-xs text-slate-600">
          Checks: {result.summary.passed} found/matched · {result.summary.warnings} require review · {result.summary.failed} mismatches
          {analyzedAt ? ` · ${new Date(analyzedAt).toLocaleString("en-IN")}` : ""}
        </p>
      </div>
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-700">Findings and validation checks</h3>
        <ul className="mt-2 divide-y divide-slate-200 border-y border-slate-200">
          {result.findings.map((finding) => (
            <li key={finding.field} className={`border-l-2 px-3 py-3 ${finding.verification === "MISMATCH" ? "border-l-rose-600 bg-rose-50/40" : finding.verification === "REVIEW REQUIRED" || finding.verification === "NOT FOUND" ? "border-l-amber-500" : "border-l-transparent"}`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <span className="font-semibold text-slate-900">{finding.field}</span>
                <span className={`text-xs font-bold ${statusClass[finding.verification]}`}>{finding.verification}</span>
              </div>
              <p className="mt-1 break-words text-sm text-slate-700">{finding.value}</p>
              {checklistByParameter.get(finding.field)?.remarks && (
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  <span className="font-semibold">Evidence / observation:</span> {checklistByParameter.get(finding.field)?.remarks}
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2 text-[11px] text-slate-500">
                <span>Source: {finding.field.startsWith("Cross-document") ? "Peer submission metadata in this browser" : finding.field.startsWith("AI ") ? "Semantic analysis of available document text" : "Document text, submitted metadata, or visual review"}</span>
                <span className="font-medium text-slate-700">
                  {finding.verification === "MATCHED" || finding.verification === "FOUND"
                    ? "Officer: confirm against the source document."
                    : "Officer: inspect the source and verify against applicable requirements."}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {result.aiAnalysis && (
        <section className="rounded border border-indigo-200 bg-indigo-50 p-3">
          <h3 className="text-xs font-bold uppercase tracking-wide text-indigo-950">AI document understanding</h3>
          <p className="mt-1 text-sm text-indigo-950">
            {result.aiAnalysis.status === "complete"
              ? `Predicted type: ${result.aiAnalysis.predictedDocumentType ?? "Not identified"} · semantic similarity ${result.aiAnalysis.similarity ?? "not available"}`
              : result.aiAnalysis.message}
          </p>
          <p className="mt-1 text-xs text-indigo-900">
            {result.aiAnalysis.model} · similarity scores are not probabilities or authenticity determinations.
          </p>
          {result.aiAnalysis.relevantSections.slice(0, 3).map((section) => (
            <p key={section.field} className="mt-2 break-words text-xs text-slate-700">
              <span className="font-semibold">{section.field}:</span> {section.text}
            </p>
          ))}
        </section>
      )}
      {typeof result.meta?.textExtraction === "string" && result.meta.textExtraction.startsWith("NO TEXT LAYER") && (
        <p className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">
          {result.meta.textExtraction.includes("UNAVAILABLE")
            ? "OCR could not run for this upload. Text-field checks require manual review."
            : "OCR did not find readable text in this upload. Text-field checks require manual review."}
        </p>
      )}
    </div>
  );
}
