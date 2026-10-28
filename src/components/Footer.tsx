import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Footer() {
  const { userRole } = useAuth();
  const links = userRole === "aicte"
    ? [
        { label: "Officer dashboard", to: "/aicte/dashboard" },
        { label: "Institutions", to: "/aicte/institutions" },
        { label: "Scrutiny history", to: "/aicte/history" },
      ]
    : [
        { label: "Institution dashboard", to: "/institution/dashboard" },
        { label: "Required documents", to: "/institution/required-documents" },
        { label: "My submissions", to: "/institution/submissions" },
      ];

  return (
    <footer className="portal-footer no-print">
      <div className="portal-shell-container portal-footer-inner">
        <div>
          <span className="portal-footer-brand">VeriScrutiny · application scrutiny demonstration</span>
          <p>
            This prototype is not the official AICTE portal and does not transmit records to AICTE systems.
            Analysis is advisory. Final scrutiny and decisions remain with the authorised officer.
            Data and uploaded files are stored in this browser.
          </p>
        </div>
        <nav className="portal-footer-nav" aria-label="Footer navigation">
          {links.map(({ label, to }) => (
            <Link key={to} to={to}>{label}</Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
