// src/pages/ReportPage.tsx
import { useParams, Link } from "react-router-dom";
import { useDocuments } from "../hooks/useDocuments";
import { institution, getScrutinyReport } from "../mockData";
import { StatusBadge, RuleResultBadge } from "../components/StatusBadge";
import { 
  Printer, 
  Download, 
  ArrowLeft, 
  ShieldCheck, 
  QrCode, 
  FileCheck2, 
  Building2 
} from "lucide-react";

export default function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const { docs, loading } = useDocuments();

  // If no ID is passed, default to doc-2 (Fire Safety Certificate)
  const currentDocId = id || "doc-2";
  const doc = docs.find((d) => d.id === currentDocId) || docs[0];

  if (loading || !doc) {
    return <div className="p-8 text-center text-slate-500 font-medium">Generating scrutiny report...</div>;
  }

  const report = getScrutinyReport(doc.id);
  const checklist = doc.checklist;
  const passedCount = checklist.filter((c) => c.result === "PASS").length;
  const warningCount = checklist.filter((c) => c.result === "WARNING").length;
  const failedCount = checklist.filter((c) => c.result === "FAIL").length;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = `VERISCRUTINY STATUTORY SCRUTINY AUDIT REPORT
============================================================
Report Number     : ${report?.reportId || `SCR-2026-TN-KEC-00${doc.id}`}
Verification Date : ${new Date(doc.lastScrutinized || doc.submissionDate).toLocaleString("en-IN")}
Institution       : ${institution.name} (ID: ${institution.aictePermanentId})
AISHE Code        : ${institution.aisheCode}
Document Title    : ${doc.name}
Document Ref No   : ${doc.documentNumber}
Issuing Authority : ${doc.issuingAuthority}
Final Status      : ${doc.status}
------------------------------------------------------------
AUDIT SUMMARY:
Total Rules Evaluated : ${checklist.length}
Passed               : ${passedCount}
Warnings             : ${warningCount}
Failed               : ${failedCount}
------------------------------------------------------------
OFFICIAL DETERMINATION:
${doc.details.scrutinySummary?.reason || "Compliant"}
============================================================
Signed by: Central Institutional Scrutiny Cell (CISC-TN)`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `Scrutiny_Report_${doc.name.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Action Navigation Bar (Hidden during print) */}
      <div className="no-print bg-white p-3.5 rounded border border-slate-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link
            to="/documents"
            className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Documents</span>
          </Link>
          <span className="text-slate-300">|</span>
          <Link
            to={`/scrutiny/${doc.id}`}
            className="text-xs text-[#0056b3] font-semibold hover:underline flex items-center gap-1"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Inspect Checklist</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 hover:bg-slate-50 rounded text-xs text-slate-700 font-medium transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download Summary</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0b2545] hover:bg-[#134074] text-white rounded text-xs font-semibold shadow-sm transition"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>Print Official Report</span>
          </button>
        </div>
      </div>

      {/* Official Institutional Report Sheet */}
      <div className="report-sheet bg-white border border-slate-300 rounded shadow-md p-6 sm:p-8 max-w-4xl mx-auto space-y-6 text-slate-900 font-sans">
        
        {/* Report Top Header */}
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
            Statutory Institutional Document Scrutiny & Verification Report
          </h2>
          <p className="text-[11px] text-slate-500">
            Formulated under Institutional Standing Scrutiny Guidelines • Academic Year 2026–2027
          </p>

          <div className="absolute right-0 top-0 hidden sm:flex flex-col items-center border border-slate-300 p-1.5 rounded bg-slate-50">
            <QrCode className="w-10 h-10 text-slate-800" />
            <span className="text-[8px] font-mono text-slate-500 uppercase mt-0.5">AUTH CERT</span>
          </div>
        </div>

        {/* Report Metadata Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Report Number:</span>
            <span className="font-mono font-bold text-slate-900">{report?.reportId || `SCR-2026-TN-KEC-00${doc.id}`}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Audit Date:</span>
            <span className="font-mono text-slate-800">
              {new Date(doc.lastScrutinized || doc.submissionDate).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Scrutiny Cell:</span>
            <span className="text-slate-800 font-medium">CISC Southern Zone</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Final Status:</span>
            <StatusBadge status={doc.status} size="sm" />
          </div>
        </div>

        {/* Institution & Document Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Institution Info */}
          <div className="border border-slate-200 rounded p-3.5 space-y-1.5">
            <h3 className="font-bold text-[#0b2545] uppercase tracking-wide text-xs border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Institution Profile</span>
            </h3>
            <div>
              <span className="text-slate-500 block text-[11px]">Institution Name:</span>
              <span className="font-bold text-slate-900">{institution.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-slate-500 block text-[11px]">AICTE Permanent ID:</span>
                <span className="font-mono font-bold text-slate-800">{institution.aictePermanentId}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">AISHE Code:</span>
                <span className="font-mono font-bold text-slate-800">{institution.aisheCode}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Affiliating Body:</span>
              <span className="text-slate-800">{institution.university}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Campus Location:</span>
              <span className="text-slate-800">{institution.address}, {institution.district}, {institution.state}</span>
            </div>
          </div>

          {/* Document Info */}
          <div className="border border-slate-200 rounded p-3.5 space-y-1.5">
            <h3 className="font-bold text-[#0b2545] uppercase tracking-wide text-xs border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Subject Document Under Scrutiny</span>
            </h3>
            <div>
              <span className="text-slate-500 block text-[11px]">Document Name:</span>
              <span className="font-bold text-slate-900">{doc.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-slate-500 block text-[11px]">Registration No:</span>
                <span className="font-mono font-bold text-slate-800">{doc.documentNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Category:</span>
                <span className="text-slate-800 font-medium">{doc.category}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Issuing Authority:</span>
              <span className="text-slate-800">{doc.issuingAuthority}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-sans">Issue Date:</span>
                <span>{new Date(doc.issueDate).toLocaleDateString("en-IN")}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-sans">Valid Until:</span>
                <span>{new Date(doc.expiryDate).toLocaleDateString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Summary Card */}
        <div className="border border-slate-300 rounded overflow-hidden">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 font-bold text-xs uppercase tracking-wider text-slate-800 flex justify-between items-center">
            <span>Verification Metric Summary</span>
            <span className="text-[11px] font-mono font-normal text-slate-500">10 Scrutiny Parameters</span>
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
            Detailed Parameter Findings & Scrutiny Audit Trail
          </h3>

          <div className="border border-slate-200 rounded overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[10px] tracking-wider">
                  <th className="px-3 py-2 w-10 text-center">#</th>
                  <th className="px-3 py-2">Check / Parameter</th>
                  <th className="px-3 py-2">Statutory Requirement</th>
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

        {/* Final Decision & Committee Recommendation Box */}
        <div className="p-4 border-2 border-slate-800 rounded bg-slate-50/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Standing Scrutiny Committee Determination:
            </span>
            <StatusBadge status={doc.status} size="lg" />
          </div>
          <p className="text-xs text-slate-800 leading-relaxed font-serif">
            {doc.details.scrutinySummary?.reason || "All statutory criteria verified."}
          </p>
        </div>

        {/* Official Endorsement & Signatures */}
        <div className="pt-6 border-t-2 border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-4 items-end text-xs">
          <div>
            <div className="w-20 h-20 rounded-full border-2 border-slate-800 flex flex-col items-center justify-center p-1 bg-slate-50 text-center mx-auto sm:mx-0">
              <ShieldCheck className="w-6 h-6 text-[#0b2545]" />
              <span className="text-[7px] font-bold text-slate-800 uppercase tracking-tighter">
                OFFICIAL SCRUTINY
              </span>
              <span className="text-[6px] text-slate-500">CISC RECORD</span>
            </div>
          </div>

          <div className="text-center sm:text-left text-slate-600">
            <span className="block font-semibold text-slate-800">Scrutiny System Reference</span>
            <span className="font-mono text-[11px] block">VERISCRUTINY-v2.4</span>
            <span className="font-mono text-[10px] text-slate-500">
              Digest: {doc.details.checksum.substring(0, 16)}...
            </span>
          </div>

          <div className="text-right">
            <div className="border-b border-slate-800 pb-1 mb-1 font-serif italic font-bold text-slate-900 text-sm">
              K. Senthil Kumar
            </div>
            <span className="font-semibold text-slate-900 block">Senior Scrutiny Officer</span>
            <span className="text-slate-600 text-[11px] block">Standing Verification Committee</span>
            <span className="text-[10px] font-mono text-slate-500">
              Time: {new Date().toLocaleDateString("en-IN")} {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>

        {/* Printable Footer Disclaimer */}
        <div className="pt-4 border-t border-slate-200 text-center text-[10px] text-slate-500">
          This report is a computer-generated statutory scrutiny audit docket. Produced by the VeriScrutiny platform for institutional compliance demonstration.
        </div>
      </div>
    </div>
  );
}
