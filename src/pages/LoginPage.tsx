// src/pages/LoginPage.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../types";
import { 
  ShieldCheck, 
  Lock, 
  Building2, 
  RotateCw, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>("institution");
  const [identifier, setIdentifier] = useState("KEC001");
  const [password, setPassword] = useState("demo123");
  const [captchaInput, setCaptchaInput] = useState("7X8K");
  const [captchaCode, setCaptchaCode] = useState("7X8K");
  const [error, setError] = useState("");

  const refreshCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput(code);
  };

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === "institution") {
      setIdentifier("KEC001");
      setPassword("demo123");
    } else {
      setIdentifier("AICTE001");
      setPassword("demo123");
    }
    setError("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (captchaInput.trim().toUpperCase() !== captchaCode) {
      setError("Security captcha code does not match. Please verify.");
      return;
    }

    const success = login(role, identifier.trim(), password);
    if (success) {
      if (role === "institution") {
        navigate("/institution/dashboard");
      } else {
        navigate("/aicte/dashboard");
      }
    } else {
      setError("Invalid authentication credentials. Please check ID and Password.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col justify-between font-sans">
      {/* Top Header */}
      <header className="bg-[#0b2545] text-white border-b-2 border-amber-500 shadow-md">
        <div className="h-1 bg-gradient-to-r from-amber-500 via-white to-emerald-600"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded border border-amber-400 bg-[#071a30] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="font-serif font-black text-xl tracking-wider text-white uppercase">
                VERISCRUTINY
              </h1>
              <p className="text-xs text-slate-300 font-medium">
                National Institutional Document Verification & Scrutiny Portal
              </p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-xs text-amber-300 font-semibold block">AY 2026–2027</span>
            <span className="text-[11px] text-slate-300">Approval & Scrutiny Cycle</span>
          </div>
        </div>
      </header>

      {/* Main Form */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-md bg-white border border-slate-300 rounded shadow-md overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-[#0b2545] text-white px-6 py-4 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wide">
                  Single Sign-On (SSO) Portal
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Select your authorization role to enter the workspace
                </p>
              </div>
              <Lock className="w-5 h-5 text-amber-400" />
            </div>

            {/* Role Selection Tabs */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-700">
              <button
                type="button"
                onClick={() => handleRoleSelect("institution")}
                className={`py-2 px-3 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  role === "institution"
                    ? "bg-white text-[#0b2545] shadow-sm"
                    : "bg-[#071a30] text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Building2 className="w-4 h-4 text-amber-500" />
                <span>Institution User 🏫</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("aicte")}
                className={`py-2 px-3 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  role === "aicte"
                    ? "bg-white text-[#0b2545] shadow-sm"
                    : "bg-[#071a30] text-slate-300 hover:bg-slate-800"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>AICTE In-charge 🏛️</span>
              </button>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {error && (
              <div className="p-3 bg-rose-50 border-l-4 border-rose-600 text-rose-800 text-xs rounded flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick Demo Pre-fill Box */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800">
                  {role === "institution" ? "Demo Institution:" : "Demo AICTE Officer:"}
                </span>{" "}
                {role === "institution" ? "Kongu Engineering College" : "Dr. K. Senthil Kumar (Southern Region)"}
                <div className="text-[11px] text-slate-500 font-mono">
                  {role === "institution" ? "ID: KEC001" : "Officer ID: AICTE001"} • Pass: demo123
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (role === "institution") {
                    setIdentifier("KEC001");
                  } else {
                    setIdentifier("AICTE001");
                  }
                  setPassword("demo123");
                  setError("");
                }}
                className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded text-[11px] font-semibold transition"
              >
                Quick Fill
              </button>
            </div>

            {/* Identifier */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {role === "institution" ? "Institution ID / Code" : "AICTE Officer ID"}
                <span className="text-rose-600 ml-0.5">*</span>
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={role === "institution" ? "e.g. KEC001" : "e.g. AICTE001"}
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] font-medium"
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password <span className="text-rose-600">*</span>
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Demo Password: demo123");
                  }}
                  className="text-[11px] text-[#0056b3] hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] font-medium"
                required
              />
            </div>

            {/* Captcha Box */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Security Captcha <span className="text-rose-600">*</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="bg-slate-800 text-amber-400 font-mono font-bold tracking-widest px-4 py-2 rounded text-sm border border-slate-700 select-none">
                  {captchaCode}
                </div>
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="p-2 border border-slate-300 rounded hover:bg-slate-100 text-slate-600 transition"
                  title="Generate New Code"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] font-mono uppercase font-bold"
                  required
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1 text-slate-600">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-3.5 h-3.5 text-[#134074] border-slate-300 rounded"
                />
                <span>Remember session credentials</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#0b2545] hover:bg-[#134074] text-white font-bold text-xs rounded shadow transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>
                {role === "institution" ? "Enter Institution Portal" : "Enter AICTE Scrutiny Portal"}
              </span>
            </button>
          </form>

          {/* Footer */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-center text-slate-500">
            <span>Need assistance? Contact institutional helpline: </span>
            <span className="font-mono font-semibold text-slate-700">+91 4294 226555</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#071a30] text-slate-400 text-xs py-4 border-t border-slate-800 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p>© 2026 VeriScrutiny Platform • Institutional Scrutiny & Compliance System</p>
          <p className="text-[11px] text-slate-500">
            Smart India Hackathon 2026 Prototype. Two-role institutional verification workflow.
          </p>
        </div>
      </footer>
    </div>
  );
}
