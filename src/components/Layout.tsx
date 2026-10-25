// src/components/Layout.tsx
import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";
import Breadcrumb from "./Breadcrumb";
import Footer from "./Footer";
import { AlertCircle } from "lucide-react";

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f9] text-slate-800 font-sans">
      {/* Official Header */}
      <Header />

      {/* AICTE-style Primary Navigation Bar */}
      <Navbar />

      {/* Institutional Notice Ticker */}
      <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-xs py-1.5 px-4 no-print">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <span className="flex items-center gap-1 font-bold uppercase tracking-wider bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded text-[10px] flex-shrink-0">
              <AlertCircle className="w-3 h-3 text-amber-800" />
              STATUTORY NOTICE
            </span>
            <span className="truncate">
              Institutional Document Scrutiny for Extension of Approval (EoA) AY 2026–27 is currently ACTIVE. Mandatory verification deadline: 15 Nov 2026.
            </span>
          </div>
          <span className="hidden md:inline text-[11px] font-mono text-amber-800 flex-shrink-0">
            Node: TN-ERD-01 (Secure)
          </span>
        </div>
      </div>

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <Breadcrumb />
        {children || <Outlet />}
      </main>

      {/* Official Footer */}
      <Footer />
    </div>
  );
}
