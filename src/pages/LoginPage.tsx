import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../types";

const demoAccounts: Record<UserRole, { id: string; label: string }> = {
  institution: { id: "KEC001", label: "Kongu Engineering College · KEC001" },
  aicte: { id: "AICTE-SR-9042", label: "AICTE Officer · Southern Region" },
};

function getPortalFromQuery(value: string | null): UserRole | null {
  return value === "aicte" || value === "institution" ? value : null;
}

export default function LoginPage() {
  const { login, isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [role, setRole] = useState<UserRole | null>(() => getPortalFromQuery(searchParams.get("portal")));
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={userRole === "aicte" ? "/aicte/dashboard" : "/institution/dashboard"} replace />;
  }

  const choosePortal = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setError("");
    setSearchParams({ portal: selectedRole }, { replace: true });
  };

  const returnToPortalSelection = () => {
    setRole(null);
    setIdentifier("");
    setPassword("");
    setError("");
    setSearchParams({}, { replace: true });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!role || isSubmitting) return;

    setError("");
    setIsSubmitting(true);
    window.setTimeout(() => {
      const result = login(role, identifier, password);
      setIsSubmitting(false);

      if (result === "success") {
        navigate(role === "aicte" ? "/aicte/dashboard" : "/institution/dashboard", { replace: true });
      } else if (result === "session_unavailable") {
        setError("This browser could not save your demonstration session. Enable site storage and try again.");
      } else {
        setError("The ID or password is not correct for this portal. Check your details and try again.");
      }
    }, 250);
  };

  const fillDemoCredentials = () => {
    if (!role) return;
    setIdentifier(demoAccounts[role].id);
    setPassword("demo123");
    setError("");
  };

  const isOfficerPortal = role === "aicte";

  return (
    <div className="login-page">
      <div className="login-utility">
        <div className="login-utility-inner">
          <span>VeriScrutiny · application scrutiny workspace</span>
          <span>Demonstration service · not an official AICTE portal</span>
        </div>
      </div>

      <header className="login-header">
        <div className="login-header-inner">
          <Link to="/login" className="login-brand">
            <span className="login-brand-mark" aria-hidden="true">
              <ShieldCheck />
            </span>
            <span>
              <strong>VeriScrutiny</strong>
              <small>Institutional application scrutiny</small>
            </span>
          </Link>
          <div className="login-header-cycle">
            <strong>Approval year 2026–27</strong>
            Two separate portal experiences
          </div>
        </div>
      </header>

      <main className="login-sky">
        <div className="login-content">
          <section className="login-intro" aria-labelledby="login-intro-title">
            <span className="login-intro-kicker">Application and document scrutiny</span>
            <h1 id="login-intro-title">A clear record from submission to officer decision.</h1>
            <p>
              Institutions submit supporting documents. Officers review the application,
              inspect evidence, and record the final decision. VeriScrutiny provides advisory findings.
            </p>
            <ol className="login-workflow" aria-label="Scrutiny workflow">
              {[
                "Institution prepares the application and required documents",
                "Documents are submitted for scrutiny",
                "Officer reviews evidence and advisory findings",
                "Authorised officer records the final decision",
              ].map((step, index) => (
                <li key={step}>
                  <span className="login-workflow-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  {step}
                </li>
              ))}
            </ol>
          </section>

          <section className="login-card" aria-labelledby="login-card-title">
            <div className="login-card-header">
              <span className="login-card-eyebrow">{role ? (isOfficerPortal ? "AICTE officer access" : "Institution access") : "Portal access"}</span>
              <h2 id="login-card-title">{role ? "Sign in to VeriScrutiny" : "Select your portal"}</h2>
              <p className="login-card-description">
                {role
                  ? `Enter the ${isOfficerPortal ? "officer" : "institution"} credentials for this demonstration.`
                  : "Continue to the workspace associated with your role."}
              </p>
            </div>

            {!role ? (
              <div className="login-role-list" aria-label="Choose a portal">
                <button type="button" className="login-role-option" onClick={() => choosePortal("institution")}>
                  <span className="login-role-option-icon" aria-hidden="true"><Building2 /></span>
                  <span className="login-role-option-copy">
                    <strong>Institution Portal</strong>
                    <small>Application, required documents and submissions</small>
                  </span>
                  <ArrowRight aria-hidden="true" />
                </button>
                <button type="button" className="login-role-option" onClick={() => choosePortal("aicte")}>
                  <span className="login-role-option-icon" aria-hidden="true"><ShieldCheck /></span>
                  <span className="login-role-option-copy">
                    <strong>AICTE Scrutiny Officer Portal</strong>
                    <small>Application queue, evidence review and decisions</small>
                  </span>
                  <ArrowRight aria-hidden="true" />
                </button>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="login-form">
                  {error && (
                    <div className="login-error" role="alert">
                      <AlertCircle className="mr-2 inline h-4 w-4 align-text-bottom" aria-hidden="true" />
                      {error}
                    </div>
                  )}
                  <div>
                    <label htmlFor="account-id">{isOfficerPortal ? "Officer ID" : "Institution ID"}</label>
                    <input
                      id="account-id"
                      name="username"
                      autoComplete="username"
                      value={identifier}
                      onChange={(event) => {
                        setIdentifier(event.target.value);
                        setError("");
                      }}
                      placeholder={isOfficerPortal ? "Enter officer ID" : "Enter institution ID"}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="account-password">Password</label>
                    <div className="login-password-wrap">
                      <input
                        id="account-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value);
                          setError("");
                        }}
                        placeholder="Enter password"
                        required
                      />
                      <button
                        type="button"
                        className="login-password-toggle"
                        onClick={() => setShowPassword((visible) => !visible)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        aria-pressed={showPassword}
                      >
                        {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" className="login-submit" disabled={isSubmitting}>
                    <LockKeyhole aria-hidden="true" />
                    {isSubmitting ? "Signing in…" : `Sign in to ${isOfficerPortal ? "Officer Portal" : "Institution Portal"}`}
                  </button>
                  <button type="button" className="login-back" onClick={returnToPortalSelection}>
                    <ArrowLeft aria-hidden="true" />
                    Choose a different portal
                  </button>
                </form>

                <details className="login-demo-details">
                  <summary>Demonstration credentials</summary>
                  <p>{demoAccounts[role].label}</p>
                  <p>Password: <code>demo123</code></p>
                  <button type="button" className="mt-2 font-semibold text-[#124d88] underline" onClick={fillDemoCredentials}>
                    Fill demo credentials
                  </button>
                </details>
              </>
            )}

            <p className="login-prototype-note">
              Demonstration only. Sign-in is stored in this browser and is not connected to an identity provider
              or a live AICTE system.
            </p>
          </section>
        </div>
      </main>

      <footer className="login-footer">
        VeriScrutiny is a decision-support demonstration. Final scrutiny authority remains with the authorised officer.
      </footer>
    </div>
  );
}
