// src/components/Navbar.tsx
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Files, 
  FileCheck, 
  History, 
  FileText, 
  Landmark, 
  Settings2, 
  HelpCircle 
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Documents", path: "/documents", icon: Files },
  { name: "Scrutiny", path: "/scrutiny", icon: FileCheck },
  { name: "Verification History", path: "/history", icon: History },
  { name: "Reports", path: "/reports", icon: FileText },
  { name: "Institution Profile", path: "/institution", icon: Landmark },
  { name: "Settings", path: "/settings", icon: Settings2 },
  { name: "Help", path: "/help", icon: HelpCircle },
];

export default function Navbar() {
  return (
    <nav className="bg-[#134074] border-b border-[#0b2545] text-slate-100 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center overflow-x-auto scrollbar-none py-1 space-x-1 sm:space-x-2">
          {navItems.map((item) => {
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
  );
}
