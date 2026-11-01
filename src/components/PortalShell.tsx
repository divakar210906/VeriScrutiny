import type { ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  Building2,
  ClipboardList,
  FileCheck2,
  FileClock,
  FileText,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Breadcrumb from "./Breadcrumb";
import Footer from "./Footer";

type PortalRole = "institution" | "aicte";

const navigation: Record<PortalRole, Array<{ label: string; path: string; icon: typeof LayoutDashboard }>> = {
  institution: [
    { label: "Dashboard", path: "/institution/dashboard", icon: LayoutDashboard },
    { label: "Required documents", path: "/institution/required-documents", icon: ClipboardList },
    { label: "My submissions", path: "/institution/submissions", icon: FileCheck2 },
    { label: "Notifications", path: "/institution/notifications", icon: Bell },
    { label: "Institution profile", path: "/institution/profile", icon: Building2 },
  ],
  aicte: [
    { label: "Dashboard", path: "/aicte/dashboard", icon: LayoutDashboard },
    { label: "Institutions", path: "/aicte/institutions", icon: Building2 },
    { label: "Pending scrutiny", path: "/aicte/institutions?filter=pending", icon: FileClock },
    { label: "Scrutiny history", path: "/aicte/history", icon: FileCheck2 },
    { label: "Demo report", path: "/aicte/report/KEC001/doc-2", icon: FileText },
    { label: "Profile", path: "/aicte/profile", icon: Users },
  ],
};

interface PortalShellProps {
  role: PortalRole;
  children: ReactNode;
}

export default function PortalShell({ role, children }: PortalShellProps) {
  const { institutionName, institutionId, officerId, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isOfficer = role === "aicte";
  const identity = isOfficer ? "AICTE — Southern Region" : institutionName;
  const identifier = isOfficer ? officerId : institutionId;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={`portal-shell portal-shell--${role}`}>
      <div className="portal-utility-bar">
        <div className="portal-shell-container">
          <span>VeriScrutiny · application scrutiny workspace</span>
          <span className="portal-demo-label">Demonstration service · not an official AICTE portal</span>
        </div>
      </div>

      <header className="portal-masthead">
        <div className="portal-shell-container portal-masthead-content">
          <Link
            to={isOfficer ? "/aicte/dashboard" : "/institution/dashboard"}
            className="portal-brand"
            aria-label="VeriScrutiny portal home"
          >
            <span className="portal-brand-mark" aria-hidden="true">
              {isOfficer ? <ShieldCheck /> : <Building2 />}
            </span>
            <span>
              <span className="portal-brand-title">VeriScrutiny</span>
              <span className="portal-brand-subtitle">Institutional application scrutiny</span>
            </span>
          </Link>

          <div className="portal-session">
            <div className="portal-session-context">
              <span className="portal-session-label">{isOfficer ? "Scrutiny Officer Portal" : "Institution Portal"}</span>
              <span className="portal-session-name">{identity}</span>
              <span className="portal-session-id">{isOfficer ? "Officer ID" : "Institution ID"}: {identifier}</span>
            </div>
            <span className="portal-year">Approval year <strong>2026–27</strong></span>
            <button type="button" className="portal-logout" onClick={handleLogout} aria-label="Sign out">
              <LogOut aria-hidden="true" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <nav className="portal-primary-nav" aria-label={`${isOfficer ? "Officer" : "Institution"} portal navigation`}>
        <div className="portal-shell-container portal-nav-list">
          {navigation[role].map(({ label, path, icon: Icon }) => (
            <NavLink
              key={label}
              to={path}
              end={path.endsWith("dashboard") || path.endsWith("history") || path.endsWith("profile")}
              className={({ isActive }) => {
                const isPendingLink = label === "Pending scrutiny";
                const isInstitutionLink = role === "aicte" && label === "Institutions";
                const current = isPendingLink
                  ? isOfficer && location.pathname === "/aicte/institutions" && location.search.includes("filter=pending")
                  : isInstitutionLink
                  ? isOfficer && location.pathname === "/aicte/institutions" && !location.search.includes("filter=pending")
                  : isActive;
                return `portal-nav-link${current ? " is-active" : ""}`;
              }}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="portal-service-notice" role="note">
        <div className="portal-shell-container">
          <span className="portal-notice-marker">DEMO</span>
          <span>Records are stored in this browser. VeriScrutiny findings are advisory; the authorised officer makes the final decision.</span>
        </div>
      </div>

      <main className="portal-main">
        <div className="portal-shell-container">
          <Breadcrumb />
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
