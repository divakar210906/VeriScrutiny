// src/pages/aicte/AicteReportPage.tsx
import { useParams, Link } from "react-router-dom";
import { useDocuments } from "../../hooks/useDocuments";
import { aicteInstitutionsList, getScrutinyReport } from "../../mockData";
import { StatusBadge, RuleResultBadge } from "../../components/StatusBadge";
import { 
  Printer, 
  Download, 
  ArrowLeft, 
  ShieldCheck, 
  QrCode, 
  FileCheck2 
} from "lucide-react";

export default function AicteReportPage() {
  const { institutionId = "KEC001", docId = "doc-2" } = useParams<{ institutionId: string; docId: string }>();
  const { docs, loading } = useDocuments();

  const institutionData =
    aicteInstitutionsList.find((i) => i.id === institutionId) || aicteInstitutionsList[0];

  const doc = docs.find((d) => d.id === docId) || docs[0];

  if (loading || !doc) {
    return <div className="p-8 text-center text-slate-500 font-medium">Generating official scrutiny report...</div>;
  }

  const report = getScrutinyReport(doc.id, institutionData.id);
  const checklist = doc.checklist;
  const passedCount = checklist.filter((c) => c.result === "PASS").length;
  const warningCount = checklist.filter((c) => c.result === "WARNING").length;
  const failedCount = checklist.filter((c) => c.result === "FAIL").length;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = `VERISCRUTINY - AICTE OFFICIAL DOCUMENT SCRUTINY REPORT
============================================================
Report Number     : ${report?.reportId || `SCR-2026-TN-KEC-00${doc.id}`}
Verification Date : ${new Date(doc.lastScrutinized || doc.submissionDate).toLocaleString("en-IN")}
Institution       : ${institutionData.name} (AICTE Perm ID: ${institutionData.aictePermanentId})
Application ID    : ${institutionData.applicationId}
Subject Document  : ${doc.name} (Ref No: ${doc.documentNumber})
Issuing Authority : ${doc.issuingAuthority}
Final Status      : ${doc.status}
------------------------------------------------------------
VERIFICATION SUMMARY:
Total Checks Evaluated : ${checklist.length}
Passed                 : ${passedCount}
Warnings               : ${warningCount}
Failed                 : ${failedCount}
------------------------------------------------------------
OFFICIAL DETERMINATION & FINDINGS:
${doc.details.scrutinySummary?.reason || "Compliant"}
============================================================
Signed: AICTE Standing Scrutiny Directorate (Southern Region)`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `Scrutiny_Report_${institutionData.id}_${doc.name.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Navigation action bar */}
      <div className="no-print bg-white p-3.5 rounded border border-slate-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <Link
            to={`/aicte/institution/${institutionData.id}`}
            className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 font-semibold transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Institution</span>
          </Link>
          <span className="text-slate-300">|</span>
          <Link
            to={`/aicte/review/${institutionData.id}/${doc.id}`}
            className="text-[#0056b3] font-semibold hover:underline flex items-center gap-1"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Review Workspace</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 hover:bg-slate-50 rounded text-xs text-slate-700 font-semibold transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download Report</span>
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

      {/* Official Institutional Report Sheet */}
      <div className="report-sheet bg-white border border-slate-300 rounded shadow-md p-6 sm:p-8 max-w-4xl mx-auto space-y-6 text-slate-900 font-sans">
        
        {/* Header */}
        <div className="border-b-2 border-slate-900 pb-4 text-center relative">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-10 h-10 rounded border border-slate-900 bg-slate-50 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#0b2545]" />
            </div>
          </div>
          <span className="font-serif font-black text-xl sm:text-2xl tracking-wider text-[#0b2545] uppercase">
            VERISCRUTINY
          </span>
          <h2 className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-widest mt-0.5">
            Document Scrutiny Report
          </h2>
          <p className="text-[11px] text-slate-500">
            Formulated under AICTE Approval Process Handbook (APH) Guidelines • Academic Year 2026–2027
          </p>

          <div className="absolute right-0 top-0 hidden sm:flex flex-col items-center border border-slate-300 p-1.5 rounded bg-slate-50">
            <QrCode className="w-10 h-10 text-slate-800" />
            <span className="text-[8px] font-mono text-slate-500 uppercase mt-0.5">AUTH CERT</span>
          </div>
        </div>

        {/* Institution & Application Meta Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Institution:</span>
            <span className="font-bold text-slate-900">{institutionData.name}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Application ID:</span>
            <span className="font-mono font-bold text-slate-900">{institutionData.applicationId}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Document:</span>
            <span className="font-bold text-slate-900">{doc.name}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Final Status:</span>
            <StatusBadge status={doc.status} size="sm" />
          </div>
        </div>

        {/* Verification Summary */}
        <div className="border border-slate-300 rounded overflow-hidden">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 font-bold text-xs uppercase tracking-wider text-slate-800 flex justify-between items-center">
            <span>Verification Summary</span>
            <span className="text-[11px] font-mono font-normal text-slate-500">10 Scrutiny Checks</span>
          </div>
          <div className="grid grid-cols-4 p-4 text-center divide-x divide-slate-200 text-xs">
            <div>
              <span className="text-2xl font-bold text-slate-900 font-mono block">{checklist.length}</span>
              <span className="text-slate-500 font-medium text-[11px]">Total Checks</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-emerald-700 font-mono block">{passedCount}</span>
              <span className="text-emerald-700 font-semibold text-[11px]">Passed</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-amber-600 font-mono block">{warningCount}</span>
              <span className="text-amber-700 font-semibold text-[11px]">Warnings</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-rose-700 font-mono block">{failedCount}</span>
              <span className="text-rose-700 font-semibold text-[11px]">Failed</span>
            </div>
          </div>
        </div>

        {/* Detailed Findings Table */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
            Detailed Findings
          </h3>

          <div className="border border-slate-200 rounded overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[10px] tracking-wider">
                  <th className="px-3 py-2 w-10 text-center">#</th>
                  <th className="px-3 py-2">Check / Parameter</th>
                  <th className="px-3 py-2">Requirement</th>
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
                    <td className="px-3 py-2 font-bold text-slate-800">
                      {item.parameter}
                    </td>
                    <td className="px-3 py-2 text-slate-600">
                      {item.requirement}
                    </td>
                    <td className="px-3 py-2">
                      <RuleResultBadge result={item.result} />
                    </td>
                    <td className="px-3 py-2 text-slate-700">
                      {item.remarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Final Decision */}
        <div className="p-4 border-2 border-slate-800 rounded bg-slate-50/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Final Decision:
            </span>
            <StatusBadge status={doc.status} size="lg" />
          </div>
          <p className="text-xs text-slate-800 leading-relaxed font-serif">
            {doc.details.scrutinySummary?.reason || "All statutory criteria validated."}
          </p>
        </div>

        {/* Signatures & Seal */}
        <div className="pt-6 border-t-2 border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-4 items-end text-xs">
          <div>
            <div className="w-16 h-16 rounded-full border-2 border-slate-800 flex flex-col items-center justify-center p-1 bg-slate-50 text-center">
              <ShieldCheck className="w-5 h-5 text-[#0b2545]" />
              <span className="text-[7px] font-bold text-slate-800 uppercase">OFFICIAL SEAL</span>
              <span className="text-[6px] text-slate-500">AICTE CISC</span>
            </div>
          </div>

          <div className="text-slate-600">
            <span className="block font-semibold text-slate-800">Scrutiny System Reference</span>
            <span className="font-mono text-[11px] block">VERISCRUTINY-AICTE-v2.4</span>
            <span className="font-mono text-[10px] text-slate-500">
              Digest: {doc.details.checksum.substring(0, 16)}...
            </span>
          </div>

          <div className="text-right">
            <div className="border-b border-slate-800 pb-1 mb-1 font-serif italic font-bold text-slate-900 text-sm">
              Dr. K. Senthil Kumar
            </div>
            <span className="font-semibold text-slate-900 block">Senior Scrutiny Officer</span>
            <span className="text-slate-600 text-[11px] block">AICTE Standing Verification Directorate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
