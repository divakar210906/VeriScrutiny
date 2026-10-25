// src/components/AicteLayout.tsx
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Building, 
  Clock, 
  History, 
  FileText, 
  LogOut 
} from "lucide-react";
import Footer from "./Footer";
import Breadcrumb from "./Breadcrumb";

const aicteNavItems = [
  { name: "Dashboard", path: "/aicte/dashboard", icon: LayoutDashboard },
  { name: "Institutions", path: "/aicte/institutions", icon: Building },
  { name: "Pending Scrutiny", path: "/aicte/institutions?filter=pending", icon: Clock },
  { name: "Scrutiny History", path: "/aicte/history", icon: History },
  { name: "Reports", path: "/aicte/report/KEC001/doc-2", icon: FileText },
];

export default function AicteLayout() {
  const { officerId, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f9] text-slate-800 font-sans">
      {/* Top Tri-colour National Band */}
      <div className="h-1 bg-gradient-to-r from-amber-500 via-white to-emerald-600"></div>

      {/* AICTE Portal Header */}
      <header className="bg-[#071a30] text-white shadow-md border-b-2 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Identity & Portal Branding */}
            <Link to="/aicte/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded border border-amber-400 bg-[#0b2545] flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-black text-xl tracking-wider text-white uppercase">
                    VERISCRUTINY
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 rounded">
                    AICTE IN-CHARGE PORTAL
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Standing Scrutiny & Regulatory Document Verification Directorate
                </p>
              </div>
            </Link>

            {/* Officer Metadata & Switcher */}
            <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
              <div className="hidden md:flex flex-col text-right">
                <span className="font-bold text-slate-100">Dr. K. Senthil Kumar (Senior Officer)</span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Officer ID: {officerId} • Southern Regional Office (Chennai)
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-900 border border-rose-700/60 text-rose-200 rounded text-xs font-medium transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* AICTE Horizontal Navigation Menu */}
      <nav className="bg-[#0b2545] border-b border-[#071a30] text-slate-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center overflow-x-auto scrollbar-none py-1 space-x-1 sm:space-x-2">
            {aicteNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors rounded-t border-b-2 ${
                      isActive
                        ? "bg-white text-[#071a30] border-amber-400 font-bold shadow-sm"
                        : "text-slate-200 border-transparent hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <Breadcrumb />
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
