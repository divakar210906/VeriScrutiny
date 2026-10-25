// src/components/Header.tsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  ShieldCheck, 
  Bell, 
  LogOut, 
  Building2, 
  UserCheck 
} from "lucide-react";

export default function Header() {
  const { logout, institutionName, userRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-[#0b2545] text-white shadow-md">
      {/* Top National Portal Style Micro Stripe */}
      <div className="h-1 bg-gradient-to-r from-amber-500 via-white to-emerald-600"></div>

      {/* Main Institutional Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Brand Identity & Title */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            {/* Custom Institutional Emblem Crest */}
            <div className="w-11 h-11 rounded border-2 border-amber-400/80 bg-[#071a30] flex items-center justify-center shadow-inner flex-shrink-0 group-hover:border-amber-300 transition">
              <ShieldCheck className="w-7 h-7 text-amber-400" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-xl sm:text-2xl tracking-wider text-white uppercase">
                  VERISCRUTINY
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider bg-amber-400 text-slate-950 rounded">
                  PORTAL
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium tracking-tight">
                Institutional Document Verification & Scrutiny System
              </p>
            </div>
          </Link>

          {/* Right Institutional Context & User Meta */}
          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-700/60">
            {/* Active Institution Badge */}
            <div className="hidden md:flex flex-col text-right">
              <div className="flex items-center gap-1.5 justify-end text-slate-200 font-semibold">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="truncate max-w-[220px]">{institutionName}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                AICTE ID: KEC001
              </span>
            </div>

            <div className="h-8 w-px bg-slate-700 hidden md:block"></div>

            {/* Notification Bell */}
            <Link
              to="/notifications"
              className="relative p-2 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
            </Link>

            {/* User Role Tag */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/90 border border-slate-700 rounded text-slate-300">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium text-[11px] hidden sm:inline">{userRole}</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-900/40 hover:bg-rose-900/70 border border-rose-700/60 text-rose-200 rounded font-medium transition text-xs"
              title="End Institutional Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
