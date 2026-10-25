// src/pages/NotFoundPage.tsx
import { Link } from "react-router-dom";
import { ShieldAlert, Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="bg-white border border-slate-300 rounded shadow-sm p-12 max-w-lg mx-auto text-center space-y-4 my-8">
      <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-300 text-slate-700 flex items-center justify-center mx-auto">
        <ShieldAlert className="w-6 h-6 text-amber-600" />
      </div>
      <h1 className="text-2xl font-bold text-[#0b2545] font-serif">404 • Resource Not Located</h1>
      <p className="text-xs text-slate-600 leading-relaxed">
        The requested institutional portal URL does not correspond to an authorized verification endpoint or active document docket.
      </p>
      <div className="pt-2 flex justify-center gap-3 text-xs">
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 px-4 py-2 bg-[#0b2545] hover:bg-[#134074] text-white rounded font-semibold shadow-sm transition"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Institutional Dashboard</span>
        </Link>
        <Link
          to="/documents"
          className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded font-semibold transition"
        >
          Document Register
        </Link>
      </div>
    </div>
  );
}
