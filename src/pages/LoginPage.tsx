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
      setIdentifier("AICTE-SR-9042");
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
                Institutional Document Scrutiny System
              </p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-xs text-amber-300 font-semibold block">Approval Cycle 2026–27</span>
            <span className="text-[11px] text-slate-300">Standing Scrutiny Directorate</span>
          </div>
        </div>
      </header>

      {/* Main Form */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-md bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
          
          {/* Formal Header Banner */}
          <div className="bg-[#0b2545] text-white px-6 pt-5 pb-4 border-b border-slate-700">
            <div className="text-center space-y-1">
              <h2 className="text-base font-bold uppercase tracking-wider text-amber-400">
                VERISCRUTINY
              </h2>
              <p className="text-xs text-slate-200 font-medium">
                Institutional Document Scrutiny System
              </p>
            </div>

            {/* Formal Tab Buttons */}
            <div className="grid grid-cols-2 gap-1.5 mt-4 bg-[#071a30] p-1 rounded border border-slate-700">
              <button
                type="button"
                onClick={() => handleRoleSelect("institution")}
                className={`py-2 px-3 rounded text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  role === "institution"
                    ? "bg-white text-[#0b2545] shadow-xs"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-amber-500" />
                <span>Institution Login</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("aicte")}
                className={`py-2 px-3 rounded text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  role === "aicte"
                    ? "bg-white text-[#0b2545] shadow-xs"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>AICTE Officer Login</span>
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

            {/* Identifier */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {role === "institution" ? "AICTE Permanent ID" : "AICTE Officer ID"}
                <span className="text-rose-600 ml-0.5">*</span>
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={role === "institution" ? "e.g. KEC001" : "e.g. AICTE-SR-9042"}
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
                <span className="text-[11px] text-slate-400">Default: demo123</span>
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

            {/* Security Captcha */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Security Verification Captcha <span className="text-rose-600">*</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="px-4 py-2 bg-slate-100 border border-slate-300 rounded font-mono font-black text-slate-800 tracking-widest text-sm select-none">
                  {captchaCode}
                </div>
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="p-2 border border-slate-300 hover:bg-slate-100 rounded text-slate-600 transition"
                  title="Generate new captcha code"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder="Enter captcha"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] uppercase font-mono"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#0b2545] hover:bg-[#134074] text-white font-bold text-xs uppercase tracking-wider rounded shadow-sm transition flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Authenticate & Enter Portal</span>
              </button>
            </div>

            {/* Subtle Demo Credentials Box */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <div>
                <span className="font-semibold text-slate-700">Demo Credentials:</span>{" "}
                {role === "institution" ? (
                  <span>ID: <code className="font-bold text-slate-800">KEC001</code> (Pass: demo123)</span>
                ) : (
                  <span>Officer ID: <code className="font-bold text-slate-800">AICTE-SR-9042</code> (Pass: demo123)</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (role === "institution") {
                    setIdentifier("KEC001");
                  } else {
                    setIdentifier("AICTE-SR-9042");
                  }
                  setPassword("demo123");
                  setError("");
                }}
                className="text-[#0056b3] hover:underline font-semibold"
              >
                Fill
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-1">
          <div>
            VeriScrutiny Institutional Document Verification & Scrutiny Assistance System
          </div>
          <div className="text-[11px] text-slate-400">
            For demonstration & technical scrutiny workflows • AICTE Southern Region
          </div>
        </div>
      </footer>
    </div>
  );
}
