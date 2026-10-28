import { useParams, Link } from "react-router-dom";
import { Download, ArrowLeft, Printer, FileText } from "lucide-react";
import { StatusBadge } from "../../components/StatusBadge";
import { useDocuments } from "../../hooks/useDocuments";
import { aicteInstitutionsList } from "../../mockData";

export default function AicteReportPage() {
  const { institutionId = "KEC001", docId, id } = useParams<{ institutionId?: string; docId?: string; id?: string }>();
  const reference = docId ?? id ?? "";
  const { docs, loading } = useDocuments();
  const institution = aicteInstitutionsList.find((item) => item.id === institutionId);
  const document = docs.find((item) => item.id === reference || item.id === `doc-${reference}`);

  if (loading) {
    return <p role="status" className="rounded border border-slate-200 bg-white p-6 text-sm text-slate-600">Loading workflow record…</p>;
  }

  if (!institution || !document) {
    return (
      <section className="rounded border border-slate-300 bg-white p-6">
        <h1 className="text-lg font-semibold text-slate-900">Workflow record not found</h1>
        <p className="mt-2 text-sm text-slate-600">The institution or document reference in this link is unavailable.</p>
        <Link to="/aicte/institutions" className="mt-4 inline-flex text-sm font-semibold text-blue-800 hover:underline">
          Return to institutions
        </Link>
      </section>
    );
  }

  const recordTime = document.lastScrutinized ?? document.submissionDate;
  const remarks = document.details.officerRemarks ?? document.details.rejectionReason ?? "No officer remarks recorded.";
  const analysis = document.details.analysisResult;
  const reportText = [
    "VERISCRUTINY — DEMONSTRATION WORKFLOW RECORD",
    "This is an internal demonstration record, not an official AICTE certificate or decision.",
    "",
    `Institution: ${institution.name}`,
    `Institution ID: ${institution.id}`,
    `Application reference: ${institution.applicationId}`,
    `Document: ${document.name}`,
    `Document reference: ${document.documentNumber || "Not provided"}`,
    `Tracking reference: ${document.trackingId ?? "Not assigned"}`,
    `Category: ${document.category}`,
    `Current workflow status: ${document.status}`,
    `Submitted: ${new Date(document.submissionDate).toLocaleString("en-IN")}`,
    `Last status activity: ${new Date(recordTime).toLocaleString("en-IN")}`,
    `Officer remarks: ${remarks}`,
    "",
    analysis
      ? `VeriScrutiny recommendation (advisory): ${analysis.recommendation}\n${analysis.recommendationReason}\nFindings: ${analysis.findings.map((item) => `${item.field}: ${item.verification} — ${item.value}`).join("; ")}`
      : "VeriScrutiny recommendation: No analysis has been run for this document.",
    analysis?.aiAnalysis
      ? `Analysis used ${analysis.aiAnalysis.provider} with ${analysis.aiAnalysis.model} for semantic document-type ranking and section retrieval, plus OCR, deterministic rules, and visual heuristics. AI similarity scores are not probabilities or authenticity determinations.`
      : "Analysis was not run or AI document understanding was unavailable. Any displayed rule-based results remain advisory.",
    analysis?.aiAnalysis?.predictedDocumentType
      ? `AI document type suggestion: ${analysis.aiAnalysis.predictedDocumentType} (similarity ${analysis.aiAnalysis.similarity ?? "unavailable"}).`
      : "",
    "Final application decisions remain with the responsible human officer.",
  ].join("\n");

  const downloadRecord = () => {
    const url = URL.createObjectURL(new Blob([reportText], { type: "text/plain;charset=utf-8" }));
    const link = window.document.createElement("a");
    link.href = url;
    link.download = `VeriScrutiny-record-${document.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded border border-slate-300 bg-white p-3">
        <Link
          to={`/aicte/review/${institution.id}/${document.id}`}
          className="inline-flex items-center gap-2 rounded px-2 py-2 text-sm font-semibold text-blue-800 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Return to application review
        </Link>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={downloadRecord}
            className="inline-flex items-center gap-2 rounded border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Download text record
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded bg-[#0b2545] px-3 py-2 text-sm font-semibold text-white hover:bg-[#134074]"
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            Print
          </button>
        </div>
      </div>

      <article className="report-sheet space-y-6 border border-slate-300 bg-white p-6 shadow-sm sm:p-9">
        <header className="border-b border-slate-300 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded border border-slate-300 bg-slate-50">
              <FileText className="h-5 w-5 text-[#0b2545]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">VeriScrutiny · Demonstration environment</p>
              <h1 className="mt-1 text-xl font-bold text-[#0b2545]">Application workflow record</h1>
            </div>
          </div>
          <p className="mt-4 border-l-4 border-amber-500 bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-950">
            This record is for workflow demonstration only. It is not an official AICTE report, approval, or certificate.
          </p>
        </header>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Application and document</h2>
          <dl className="mt-3 grid gap-x-6 gap-y-4 border-y border-slate-200 py-4 text-sm sm:grid-cols-2">
            <div><dt className="text-xs text-slate-500">Institution</dt><dd className="mt-1 font-medium text-slate-900">{institution.name}</dd></div>
            <div><dt className="text-xs text-slate-500">Institution ID</dt><dd className="mt-1 font-mono text-slate-900">{institution.id}</dd></div>
            <div><dt className="text-xs text-slate-500">Application reference</dt><dd className="mt-1 font-mono text-slate-900">{institution.applicationId}</dd></div>
            <div><dt className="text-xs text-slate-500">Approval cycle</dt><dd className="mt-1 text-slate-900">2026–27</dd></div>
            <div><dt className="text-xs text-slate-500">Document</dt><dd className="mt-1 font-medium text-slate-900">{document.name}</dd></div>
            <div><dt className="text-xs text-slate-500">Document reference</dt><dd className="mt-1 font-mono text-slate-900">{document.documentNumber || "Not provided"}</dd></div>
            <div><dt className="text-xs text-slate-500">Tracking reference</dt><dd className="mt-1 font-mono text-slate-900">{document.trackingId ?? "Not assigned"}</dd></div>
            <div><dt className="text-xs text-slate-500">Submitted</dt><dd className="mt-1 text-slate-900">{new Date(document.submissionDate).toLocaleString("en-IN")}</dd></div>
          </dl>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Workflow record</h2>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="text-sm text-slate-600">Current document status</span>
            <StatusBadge status={document.status} />
          </div>
          <p className="mt-3 text-sm text-slate-600">Last recorded status activity: {new Date(recordTime).toLocaleString("en-IN")}</p>
          <div className="mt-3 rounded border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600">Officer remarks</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-800">{remarks}</p>
          </div>
        </section>

        <section className="rounded border border-amber-300 bg-amber-50 p-4">
          <h2 className="text-sm font-semibold text-amber-950">VeriScrutiny Recommendation</h2>
          <p className="mt-1 text-sm leading-6 text-amber-900">
            Analysis may include local OCR and semantic document understanding alongside deterministic rules and visual heuristics. Findings are advisory and do not authenticate the document or make an officer decision.
          </p>
          {analysis ? (
            <div className="mt-3 space-y-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{analysis.recommendation}</p>
                <p className="mt-1 text-sm text-slate-800">{analysis.recommendationReason}</p>
                <p className="mt-1 text-xs text-slate-700">
                  Checks: {analysis.summary.passed} found/matched · {analysis.summary.warnings} require review · {analysis.summary.failed} mismatches
                  {document.details.analysisDate ? ` · ${new Date(document.details.analysisDate).toLocaleString("en-IN")}` : ""}
                </p>
              </div>
              <ul className="divide-y divide-amber-200 border-y border-amber-200">
                {analysis.findings.map((finding) => (
                  <li key={finding.field} className="py-2 text-sm">
                    <span className="font-semibold">{finding.verification} · {finding.field}:</span> {finding.value}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-2 text-sm text-amber-900">No analysis has been run for this document.</p>
          )}
        </section>

        <footer className="border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">
          This printable workflow record reflects the current browser-stored demonstration data. It is not an official regulatory determination.
        </footer>
      </article>
    </div>
  );
}
