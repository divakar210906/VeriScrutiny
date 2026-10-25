// src/components/Footer.tsx
import { ShieldCheck, ExternalLink, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#0b2545] text-slate-300 text-xs border-t border-slate-700 mt-auto no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-slate-700/60">
          {/* Col 1: Platform Overview */}
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-serif font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>VERISCRUTINY • INSTITUTIONAL VERIFICATION SYSTEM</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-lg">
              Automated institutional document verification, regulatory extraction, and statutory scrutiny engine.
              Designed for SIH 2026 Institutional Verification Workflow Demonstration. Inspired by the AICTE
              Approval Process Handbook regulatory standards.
            </p>
            <p className="text-[11px] text-amber-300/80 font-medium italic">
              Notice: Prototype demonstration platform. Not the official AICTE portal.
            </p>
          </div>

          {/* Col 2: Institutional Workflows */}
          <div>
            <h4 className="text-white font-semibold mb-2 uppercase tracking-wider text-[11px]">
              Verification Workflows
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <Link to="/documents" className="hover:text-amber-400 transition">
                  Document Repository
                </Link>
              </li>
              <li>
                <Link to="/scrutiny" className="hover:text-amber-400 transition">
                  Statutory Rule Scrutiny
                </Link>
              </li>
              <li>
                <Link to="/reports" className="hover:text-amber-400 transition">
                  Audit Scrutiny Reports
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-amber-400 transition">
                  Verification Audit Logs
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal Support & Compliance */}
          <div>
            <h4 className="text-white font-semibold mb-2 uppercase tracking-wider text-[11px]">
              Support & Regulatory Desk
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-slate-400" />
                <Link to="/help" className="hover:text-amber-400 transition">
                  Helpdesk & User Manual
                </Link>
              </li>
              <li>
                <span className="text-slate-400">Institutional Nodal Helpline: </span>
                <span className="text-slate-200 font-mono">+91 4294 226555</span>
              </li>
              <li>
                <span className="text-slate-400">Scrutiny Window: </span>
                <span className="text-emerald-400 font-semibold">AY 2026–27 Active</span>
              </li>
              <li className="flex items-center gap-1 text-[11px] text-slate-400 pt-1">
                <span>National Portal Guidelines</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-400 text-[11px]">
          <div>
            © 2026 VeriScrutiny Platform • Institutional Compliance & Scrutiny Engine. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Server: IN-SOUTH-CHN</span>
            <span>•</span>
            <span>Security Hash Verified</span>
            <span>•</span>
            <span>SHA-256 Validated</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
