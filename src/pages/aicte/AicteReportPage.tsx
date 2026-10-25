// src/pages/aicte/AicteReportPage.tsx
import { useParams, Link } from "react-router-dom";
import { useDocuments } from "../../hooks/useDocuments";
import { aicteInstitutionsList } from "../../mockData";
import { StatusBadge, RuleResultBadge } from "../../components/StatusBadge";
import { evaluateDocumentScrutiny } from "../../utils/documentScrutinyEngine";
import { 
  Printer, 
  Download, 
  ArrowLeft, 
  ShieldCheck, 
  QrCode, 
  FileCheck2 
} from "lucide-react";

export default function AicteReportPage() {
  const params = useParams<{ institutionId?: string; docId?: string; id?: string }>();
  const institutionId = params.institutionId || "KEC001";
  const docId = params.docId || params.id || "doc-2";

  const { docs, loading } = useDocuments();

  const institutionData =
    aicteInstitutionsList.find((i) => i.id === institutionId) || aicteInstitutionsList[0];

  const doc = docs.find((d) => d.id === docId || d.id === `doc-${docId}` || d.id.replace("doc-", "") === docId) || docs[0];

  if (loading || !doc) {
    return <div className="p-8 text-center text-slate-500 font-medium">Generating administrative scrutiny report...</div>;
  }

  const scrutinyResult = evaluateDocumentScrutiny(doc);
  const checklist = scrutinyResult.checklist;
  const passedItems = checklist.filter((c) => c.result === "PASS");
  const warningItems = checklist.filter((c) => c.result === "WARNING");
  const failedItems = checklist.filter((c) => c.result === "FAIL");

  const reportId = `SCR-2026-SR-KEC-${doc.id.replace("doc-", "00")}`;
  const trackingCode = doc.trackingId || doc.details?.trackingId || `VS-2026-KEC-${doc.id.replace("doc-", "100")}`;
  const scrutinyDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const officerRemarks = doc.details?.officerRemarks || doc.details?.rejectionReason || doc.details?.scrutinySummary?.reason || scrutinyResult.suggestedOfficerRemark;

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = () => {
    // Standard administrative text export
    const content = `VERISCRUTINY - INSTITUTIONAL DOCUMENT SCRUTINY REPORT
(Demo / Scrutiny Assistance Report — Internal Regulatory Workflow Aid)
================================================================================
Report ID             : ${reportId}
Scrutiny Date & Time  : ${scrutinyDate}
Institution Name      : ${institutionData.name}
AICTE Permanent ID    : ${institutionData.aictePermanentId}
Application ID        : ${institutionData.applicationId}
Document Name         : ${doc.name}
Tracking ID           : ${trackingCode}
Document Number       : ${doc.documentNumber}
Issuing Authority     : ${doc.issuingAuthority}
================================================================================
VERISCRUTINY RECOMMENDATION:
Recommendation        : ${scrutinyResult.recommendation}
Grounds / Reason      : ${scrutinyResult.recommendationReason}
--------------------------------------------------------------------------------
OFFICER DECISION & REMARKS:
Officer Decision      : ${doc.status}
Officer Remarks       : ${officerRemarks}
Scrutinized By        : AICTE-SR-9042 (Senior Scrutiny Officer, Southern Region)
================================================================================
SUMMARY:
Total Parameters      : ${checklist.length}
Passed Parameters     : ${passedItems.length}
Warnings              : ${warningItems.length}
Failed Parameters     : ${failedItems.length}
================================================================================
Notice: This document is produced by the VeriScrutiny system for internal technical scrutiny assistance.`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `VeriScrutiny_Report_${trackingCode}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar (Hidden during Print) */}
      <div className="no-print bg-white p-3.5 rounded border border-slate-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <Link
            to={`/aicte/institution/${institutionData.id}`}
            className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 font-semibold transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Institution Docket</span>
          </Link>
          <span className="text-slate-300">|</span>
          <Link
            to={`/aicte/review/${institutionData.id}/${doc.id}`}
            className="text-[#0056b3] font-semibold hover:underline flex items-center gap-1"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Return to Scrutiny Screen</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-300 hover:bg-slate-50 rounded text-xs text-slate-700 font-semibold transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Text / PDF</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#071a30] hover:bg-slate-800 text-white rounded text-xs font-bold shadow-sm transition"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Formal Administrative Scrutiny Report Sheet */}
      <div className="report-sheet bg-white border border-slate-400 rounded shadow-sm p-8 max-w-4xl mx-auto space-y-6 text-slate-900 font-sans">
        
        {/* Header Block */}
        <div className="border-b-2 border-slate-900 pb-4 text-center relative">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <div className="w-10 h-10 rounded border border-slate-900 bg-slate-50 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#0b2545]" />
            </div>
          </div>

          <h1 className="font-serif font-black text-2xl tracking-wider text-[#0b2545] uppercase">
            VERISCRUTINY
          </h1>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest mt-0.5">
            Institutional Document Scrutiny Report
          </h2>

          <p className="text-[11px] text-slate-500 mt-1">
            DEMO / Scrutiny Assistance Report — Internal Regulatory Workflow Aid
          </p>

          <div className="absolute right-0 top-0 hidden sm:flex flex-col items-center border border-slate-300 p-1.5 rounded bg-slate-50">
            <QrCode className="w-10 h-10 text-slate-800" />
            <span className="text-[8px] font-mono text-slate-500 uppercase mt-0.5">VERI-AUTH</span>
          </div>
        </div>

        {/* Administrative Metadata Box (Section 17) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 border border-slate-300 rounded text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Report ID:</span>
            <span className="font-mono font-bold text-slate-900">{reportId}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Institution Name:</span>
            <span className="font-bold text-slate-900">{institutionData.name}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">AICTE Permanent ID:</span>
            <span className="font-mono font-bold text-slate-900">{institutionData.aictePermanentId}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Application ID:</span>
            <span className="font-mono font-bold text-slate-900">{institutionData.applicationId}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Document Name:</span>
            <span className="font-bold text-slate-900">{doc.name}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Tracking ID:</span>
            <span className="font-mono font-bold text-[#071a30]">{trackingCode}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Scrutiny Date:</span>
            <span className="font-mono text-slate-800">{scrutinyDate}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Officer Status:</span>
            <StatusBadge status={doc.status} size="sm" />
          </div>
        </div>

        {/* DOCUMENT INFORMATION SECTION */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            1. DOCUMENT INFORMATION & EXTRACTED DATA
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs p-3 bg-white border border-slate-200 rounded">
            <div>
              <span className="text-slate-500 block text-[10px]">Certificate Number:</span>
              <span className="font-mono font-bold text-slate-900">{doc.documentNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Issuing Authority:</span>
              <span className="font-medium text-slate-900">{doc.issuingAuthority}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Statutory Category:</span>
              <span className="font-medium text-slate-900">{doc.category}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Issue Date:</span>
              <span className="font-mono text-slate-800">{new Date(doc.issueDate).toLocaleDateString("en-IN")}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Validity / Expiry Date:</span>
              <span className="font-mono text-slate-800">{new Date(doc.expiryDate).toLocaleDateString("en-IN")}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">SHA-256 Checksum:</span>
              <span className="font-mono text-[10px] text-slate-600 truncate block">{doc.details?.checksum}</span>
            </div>
          </div>
        </div>

        {/* SCRUTINY CHECKLIST SECTION */}
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              2. SCRUTINY CHECKLIST & VERIFICATION PARAMETERS
            </h3>
            <span className="text-[11px] font-mono text-slate-600">
              Passed: {passedItems.length} | Warnings: {warningItems.length} | Failed: {failedItems.length}
            </span>
          </div>

          <div className="border border-slate-300 rounded overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 uppercase font-semibold text-[10px] tracking-wider">
                  <th className="px-3 py-2 w-8 text-center">#</th>
                  <th className="px-3 py-2 w-36">Parameter</th>
                  <th className="px-3 py-2">Requirement</th>
                  <th className="px-3 py-2">Extracted / Observed Value</th>
                  <th className="px-3 py-2 w-20">Result</th>
                  <th className="px-3 py-2">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {checklist.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2 text-center font-mono text-slate-500 font-semibold">
                      {idx + 1}
                    </td>
                    <td className="px-3 py-2 font-bold text-slate-900">
                      {item.parameter}
                    </td>
                    <td className="px-3 py-2 text-slate-600 text-[11px]">
                      {item.requirement}
                    </td>
                    <td className="px-3 py-2 font-mono text-slate-800 text-[11px]">
                      {item.extractedValue}
                    </td>
                    <td className="px-3 py-2">
                      <RuleResultBadge result={item.result} />
                    </td>
                    <td className="px-3 py-2 text-slate-700 text-[11px]">
                      {item.remarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PARAMETER BREAKDOWN */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-emerald-50/70 border border-emerald-300 rounded space-y-1">
            <span className="font-bold text-emerald-900 uppercase text-[10px] block">Passed Parameters ({passedItems.length})</span>
            <ul className="list-disc list-inside text-[11px] text-emerald-800 space-y-0.5">
              {passedItems.slice(0, 4).map((p) => (
                <li key={p.id} className="truncate">{p.parameter}</li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-300 rounded space-y-1">
            <span className="font-bold text-amber-900 uppercase text-[10px] block">Warnings ({warningItems.length})</span>
            {warningItems.length > 0 ? (
              <ul className="list-disc list-inside text-[11px] text-amber-800 space-y-0.5">
                {warningItems.map((w) => (
                  <li key={w.id} className="truncate">{w.parameter}</li>
                ))}
              </ul>
            ) : (
              <span className="text-[11px] text-slate-500">None detected</span>
            )}
          </div>

          <div className="p-3 bg-rose-50/70 border border-rose-300 rounded space-y-1">
            <span className="font-bold text-rose-900 uppercase text-[10px] block">Failed Parameters ({failedItems.length})</span>
            {failedItems.length > 0 ? (
              <ul className="list-disc list-inside text-[11px] text-rose-800 space-y-0.5">
                {failedItems.map((f) => (
                  <li key={f.id} className="truncate">{f.parameter}</li>
                ))}
              </ul>
            ) : (
              <span className="text-[11px] text-slate-500">None detected</span>
            )}
          </div>
        </div>

        {/* VERISCRUTINY RECOMMENDATION */}
        <div className="p-3.5 bg-slate-50 border border-slate-300 rounded space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
              3. VERISCRUTINY RECOMMENDATION
            </span>
            <span className="font-black text-xs font-mono uppercase text-[#071a30]">
              {scrutinyResult.recommendation}
            </span>
          </div>
          <p className="text-slate-800 leading-relaxed">
            {scrutinyResult.recommendationReason}
          </p>
        </div>

        {/* OFFICER DECISION & REMARKS */}
        <div className="p-4 border-2 border-slate-800 rounded bg-slate-50/80 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold uppercase tracking-wider text-slate-900 text-sm">
              4. OFFICER FINAL DECISION & ACTION
            </span>
            <StatusBadge status={doc.status} size="lg" />
          </div>

          <div>
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">Officer Remarks:</span>
            <p className="text-slate-900 font-medium text-xs mt-0.5 bg-white p-2 rounded border border-slate-300">
              "{officerRemarks}"
            </p>
          </div>
        </div>

        {/* Signatures & Audit Stamp */}
        <div className="pt-6 border-t-2 border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-4 items-end text-xs">
          <div>
            <div className="w-16 h-16 rounded-full border-2 border-slate-800 flex flex-col items-center justify-center p-1 bg-slate-50 text-center">
              <ShieldCheck className="w-5 h-5 text-[#0b2545]" />
              <span className="text-[7px] font-bold text-slate-800 uppercase mt-0.5">OFFICIAL SEAL</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 font-mono">
              AICTE Southern Regional Scrutiny Cell
            </p>
          </div>

          <div className="text-center sm:text-left">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Scrutinized By:</span>
            <span className="font-bold text-slate-900 block">AICTE-SR-9042</span>
            <span className="text-[11px] text-slate-600">Senior Scrutiny Officer</span>
          </div>

          <div className="text-right">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Date & Time:</span>
            <span className="font-mono text-slate-900 text-[11px] block">{scrutinyDate}</span>
            <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">Audit Log Recorded</span>
          </div>
        </div>
      </div>
    </div>
  );
}
