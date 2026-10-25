// src/pages/SettingsPage.tsx
import { useState } from "react";
import { loadSettings, saveSettings } from "../utils/storage";
import type { ScrutinySettings } from "../types";
import { 
  Settings2, 
  Bell, 
  Lock, 
  Sliders, 
  CheckCircle2, 
  Save 
} from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<ScrutinySettings>(() => loadSettings());
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#0b2545] flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-amber-600" />
            <span>Portal & Scrutiny Engine Configuration</span>
          </h1>
          <p className="text-xs text-slate-500">
            System preferences, algorithmic tolerance parameters, and access controls
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Configuration parameters saved.</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Section 1: Scrutiny Rule Engine Preferences */}
        <div className="bg-white border border-slate-300 rounded shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Sliders className="w-4 h-4 text-[#0b2545]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0b2545]">
              Algorithmic Scrutiny Rules & Validation Sensitivity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Scrutiny Rule Sensitivity Threshold
              </label>
              <select
                name="autoVerificationThreshold"
                value={settings.autoVerificationThreshold}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] bg-white font-medium"
              >
                <option value="Strict (All 10 Rules Passing)">Strict (All 10 Rules Mandatory)</option>
                <option value="Standard (Warnings permitted for secondary clauses)">Standard (Permit secondary warnings)</option>
                <option value="Provisional (Manual Nodal Override)">Provisional (Requires Nodal Endorsement)</option>
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                Strict mode automatically flags any date or external registry ambiguity as NEEDS REVIEW.
              </p>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Minimum OCR Parameter Confidence (%)
              </label>
              <input
                type="number"
                name="ocrConfidenceMin"
                min={50}
                max={99}
                value={settings.ocrConfidenceMin}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] font-mono font-medium"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Extracted metadata below this confidence triggers manual inspection flag.
              </p>
            </div>

            <div className="md:col-span-2 pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="externalRegistrySync"
                  checked={settings.externalRegistrySync}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#134074] border-slate-300 rounded"
                />
                <span className="font-semibold text-slate-800">
                  Enable Live External Registry Sync (Fire Services, PWD & University Directories)
                </span>
              </label>
              <p className="text-[11px] text-slate-500 ml-6 mt-0.5">
                Automatically queries state statutory APIs during the "Regulatory Cross-Check" pipeline step.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Notifications & Communication */}
        <div className="bg-white border border-slate-300 rounded shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Bell className="w-4 h-4 text-[#0b2545]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0b2545]">
              Institutional Alerts & Notifications
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Statutory Alert Recipient Email
              </label>
              <input
                type="email"
                name="alertEmailRecipient"
                value={settings.alertEmailRecipient}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#134074] font-medium"
                required
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Instant alerts dispatched when documents fail scrutiny or require urgent review.
              </p>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Digital Signature Certificate ID (DSC)
              </label>
              <input
                type="text"
                name="digitalSignatureId"
                value={settings.digitalSignatureId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded font-mono font-medium bg-slate-50"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Cryptographic token used to sign official scrutiny audit dockets.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Security & Session Protocols */}
        <div className="bg-white border border-slate-300 rounded shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Lock className="w-4 h-4 text-[#0b2545]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0b2545]">
              Security & Access Authentication
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Terminal Session Inactivity Timeout (Minutes)
              </label>
              <input
                type="number"
                name="sessionTimeoutMinutes"
                min={5}
                max={60}
                value={settings.sessionTimeoutMinutes}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded font-mono font-medium"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="twoFactorAuth"
                  checked={settings.twoFactorAuth}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#134074] border-slate-300 rounded"
                />
                <span className="font-semibold text-slate-800">
                  Mandatory Two-Factor Authentication (2FA) for Scrutiny Determination
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0b2545] hover:bg-[#134074] text-white font-semibold text-xs rounded shadow-sm transition"
          >
            <Save className="w-3.5 h-3.5 text-amber-400" />
            <span>Apply Configuration Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
