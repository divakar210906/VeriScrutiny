// src/pages/HelpPage.tsx
import { HelpCircle, FileCheck2, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function HelpPage() {
  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#0b2545] flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-600" />
            <span>Institutional Scrutiny Manual & Demonstration Guide</span>
          </h1>
          <p className="text-xs text-slate-500">
            Standard operating procedure (SOP) for Smart India Hackathon (SIH 2026) presentation
          </p>
        </div>
      </div>

      {/* Guide Content */}
      <div className="bg-white border border-slate-300 rounded shadow-sm p-6 space-y-6 text-xs text-slate-800">
        <section className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0b2545] border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-[#0056b3]" />
            <span>Demonstration Workflow Architecture</span>
          </h2>
          <p className="leading-relaxed text-slate-600">
            VeriScrutiny automates statutory document verification for higher technical education institutions.
            Follow this recommended sequence during your demo video:
          </p>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded font-mono text-[11px] text-[#0b2545] leading-relaxed">
            1. Institutional Login → 2. Institution Dashboard → 3. Document Register → 4. Document Details with Certificate Preview → 5. Run Scrutiny (5-stage pipeline) → 6. Verification Checklist Table → 7. Scrutiny Decision → 8. Official Printable Report
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0b2545] border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Pre-Configured Demonstration Outcomes</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 border border-amber-300 bg-amber-50 rounded">
              <span className="font-bold text-amber-900 block mb-1">1. Fire Safety Certificate</span>
              <span className="font-semibold text-amber-800 bg-amber-200 px-1.5 py-0.5 rounded text-[10px] inline-block mb-1.5">
                NEEDS REVIEW
              </span>
              <p className="text-[11px] text-amber-900">
                Demonstrates external authority cross-verification requirement against state fire services live database.
              </p>
              <Link to="/scrutiny/doc-2" className="text-amber-950 font-bold hover:underline block mt-2 text-[11px]">
                Inspect doc-2 →
              </Link>
            </div>

            <div className="p-3 border border-emerald-300 bg-emerald-50 rounded">
              <span className="font-bold text-emerald-900 block mb-1">2. Affiliation Certificate</span>
              <span className="font-semibold text-emerald-800 bg-emerald-200 px-1.5 py-0.5 rounded text-[10px] inline-block mb-1.5">
                VERIFIED
              </span>
              <p className="text-[11px] text-emerald-900">
                Demonstrates 100% compliant statutory document passing all 10 inspection criteria with official seal.
              </p>
              <Link to="/scrutiny/doc-1" className="text-emerald-950 font-bold hover:underline block mt-2 text-[11px]">
                Inspect doc-1 →
              </Link>
            </div>

            <div className="p-3 border border-rose-300 bg-rose-50 rounded">
              <span className="font-bold text-rose-900 block mb-1">3. Faculty Declaration</span>
              <span className="font-semibold text-rose-800 bg-rose-200 px-1.5 py-0.5 rounded text-[10px] inline-block mb-1.5">
                REJECTED
              </span>
              <p className="text-[11px] text-rose-900">
                Demonstrates regulatory non-conformity where faculty cadre ratio violates AICTE Approval Process Handbook norms.
              </p>
              <Link to="/scrutiny/doc-4" className="text-rose-950 font-bold hover:underline block mt-2 text-[11px]">
                Inspect doc-4 →
              </Link>
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0b2545] border-b border-slate-200 pb-1.5">
            Algorithmic Decision Logic Reference
          </h2>
          <ul className="space-y-1 list-disc list-inside text-slate-700">
            <li><strong>Any FAIL:</strong> Overall determination is immediately marked as <code>REJECTED</code>.</li>
            <li><strong>Any WARNING (with zero FAIL):</strong> Overall determination is set to <code>NEEDS REVIEW</code>.</li>
            <li><strong>All 10 PASS:</strong> Overall determination is certified as <code>VERIFIED</code>.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
