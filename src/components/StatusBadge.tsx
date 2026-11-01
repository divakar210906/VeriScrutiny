// src/components/StatusBadge.tsx
import type { DocumentStatus, RuleResult } from "../types";
import { CheckCircle2, AlertTriangle, XCircle, Clock, ShieldCheck } from "lucide-react";

type BadgeType = DocumentStatus | RuleResult | string;

export function StatusBadge({ status, size = "md" }: { status: BadgeType; size?: "sm" | "md" | "lg" }) {
  const normalized = status.toUpperCase();

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-semibold gap-1",
    md: "px-2.5 py-1 text-xs font-semibold gap-1.5",
    lg: "px-3 py-1.5 text-sm font-semibold gap-2",
  }[size];

  if (normalized === "VERIFIED" || normalized === "PASS") {
    return (
      <span
        className={`inline-flex items-center rounded border border-emerald-300 bg-emerald-50 text-emerald-800 ${sizeClasses}`}
      >
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
        <span>{status}</span>
      </span>
    );
  }

  if (normalized === "NEEDS REVIEW" || normalized === "WARNING") {
    return (
      <span
        className={`inline-flex items-center rounded border border-amber-300 bg-amber-50 text-amber-800 ${sizeClasses}`}
      >
        <AlertTriangle className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
        <span>{status}</span>
      </span>
    );
  }

  if (normalized === "REJECTED" || normalized === "FAIL") {
    return (
      <span
        className={`inline-flex items-center rounded border border-rose-300 bg-rose-50 text-rose-800 ${sizeClasses}`}
      >
        <XCircle className="h-3.5 w-3.5 text-rose-600 flex-shrink-0" />
        <span>{status}</span>
      </span>
    );
  }

  if (normalized === "UNDER SCRUTINY") {
    return (
      <span
        className={`inline-flex items-center rounded border border-blue-300 bg-blue-50 text-blue-800 ${sizeClasses}`}
      >
        <span className="relative flex h-2 w-2 mr-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
        </span>
        <span>{status}</span>
      </span>
    );
  }

  if (normalized === "DEFICIENCY RAISED" || normalized === "NEEDS CORRECTION") {
    return (
      <span
        className={`inline-flex items-center rounded border border-rose-400 bg-rose-50 text-rose-800 font-bold ${sizeClasses}`}
      >
        <AlertTriangle className="h-3.5 w-3.5 text-rose-600 flex-shrink-0" />
        <span>{status}</span>
      </span>
    );
  }

  if (normalized === "DEFICIENT") {
    return (
      <span className={`inline-flex items-center rounded border border-rose-300 bg-rose-50 text-rose-800 ${sizeClasses}`}>
        <AlertTriangle className="h-3.5 w-3.5 text-rose-600 flex-shrink-0" />
        <span>{status}</span>
      </span>
    );
  }

  if (normalized === "PENDING SCRUTINY" || normalized === "PENDING") {
    return (
      <span className={`inline-flex items-center rounded border border-amber-300 bg-amber-50 text-amber-900 ${sizeClasses}`}>
        <Clock className="h-3.5 w-3.5 text-amber-700 flex-shrink-0" />
        <span>{status}</span>
      </span>
    );
  }

  if (normalized === "RE-SUBMITTED") {
    return (
      <span
        className={`inline-flex items-center rounded border border-indigo-300 bg-indigo-50 text-indigo-800 font-semibold ${sizeClasses}`}
      >
        <Clock className="h-3.5 w-3.5 text-indigo-600 flex-shrink-0" />
        <span>{status}</span>
      </span>
    );
  }

  if (normalized === "SUBMITTED" || normalized === "UNDER REVIEW") {
    return (
      <span
        className={`inline-flex items-center rounded border border-blue-300 bg-blue-50 text-blue-800 font-semibold ${sizeClasses}`}
      >
        <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
        <span>{status}</span>
      </span>
    );
  }

  // Pending / Default
  return (
    <span
      className={`inline-flex items-center rounded border border-slate-300 bg-slate-100 text-slate-700 ${sizeClasses}`}
    >
      <Clock className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" />
      <span>{status}</span>
    </span>
  );
}

export function RuleResultBadge({ result }: { result: RuleResult }) {
  if (result === "PASS") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
        <ShieldCheck className="w-3 h-3 mr-1 text-emerald-700" /> PASS
      </span>
    );
  }
  if (result === "WARNING") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
        <AlertTriangle className="w-3 h-3 mr-1 text-amber-700" /> WARNING
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
      <XCircle className="w-3 h-3 mr-1 text-rose-700" /> FAIL
    </span>
  );
}

export function VerificationTagBadge({ tag }: { tag: string }) {
  const norm = tag.toUpperCase();
  if (norm === "MATCHED") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-300 uppercase">
        MATCHED
      </span>
    );
  }
  if (norm === "FOUND") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-blue-50 text-blue-800 border border-blue-300 uppercase">
        FOUND
      </span>
    );
  }
  if (norm === "REVIEW REQUIRED") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-amber-50 text-amber-900 border border-amber-300 uppercase">
        REVIEW REQUIRED
      </span>
    );
  }
  if (norm === "MISMATCH") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-rose-50 text-rose-800 border border-rose-300 uppercase">
        MISMATCH
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-slate-100 text-slate-700 border border-slate-300 uppercase">
      {tag}
    </span>
  );
}
