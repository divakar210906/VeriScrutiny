// src/components/InstitutionLayout.tsx
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  Building2, 
  LayoutDashboard, 
  ClipboardList, 
  Upload, 
  FileCheck, 
  Bell, 
  LogOut 
} from "lucide-react";
import Footer from "./Footer";
import Breadcrumb from "./Breadcrumb";

const institutionNavItems = [
  { name: "Dashboard", path: "/institution/dashboard", icon: LayoutDashboard },
  { name: "Required Documents", path: "/institution/required-documents", icon: ClipboardList },
  { name: "Upload Document", path: "/institution/upload", icon: Upload },
  { name: "My Submissions", path: "/institution/submissions", icon: FileCheck },
  { name: "Notifications", path: "/institution/notifications", icon: Bell },
];

export default function InstitutionLayout() {
  const { institutionName, institutionId, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f9] text-slate-800 font-sans">
      {/* Top Tri-colour National Band */}
      <div className="h-1 bg-gradient-to-r from-amber-500 via-white to-emerald-600"></div>

      {/* Institution Portal Header */}
      <header className="bg-[#0b2545] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Identity & Portal Branding */}
            <Link to="/institution/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded border border-amber-400/80 bg-[#071a30] flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-black text-xl tracking-wider text-white uppercase">
                    VERISCRUTINY
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 rounded">
                    INSTITUTION PORTAL
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Institutional Document Submission & Regulatory Compliance
                </p>
              </div>
            </Link>

            {/* Institution Metadata & Switcher */}
            <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
              <div className="hidden md:flex flex-col text-right">
                <span className="font-bold text-slate-100 truncate max-w-xs">{institutionName}</span>
                <span className="text-[11px] text-slate-400 font-mono">
                  AICTE ID: {institutionId}
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

      {/* Institution Horizontal Navigation Menu */}
      <nav className="bg-[#134074] border-b border-[#0b2545] text-slate-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center overflow-x-auto scrollbar-none py-1 space-x-1 sm:space-x-2">
            {institutionNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors rounded-t border-b-2 ${
                      isActive
                        ? "bg-white text-[#0b2545] border-amber-400 font-bold shadow-sm"
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
