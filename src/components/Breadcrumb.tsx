// src/components/Breadcrumb.tsx
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const location = useLocation();

  // If custom items are not provided, auto-generate from pathname
  const pathnames = location.pathname.split("/").filter((x) => x);

  const crumbs: BreadcrumbItem[] = items || [
    { label: "Dashboard", path: "/dashboard" },
    ...pathnames.map((value, index) => {
      const to = `/${pathnames.slice(0, index + 1).join("/")}`;
      let label = value.charAt(0).toUpperCase() + value.slice(1);
      if (value.startsWith("doc-")) {
        label = "Document Details";
      }
      return {
        label: label.replace(/-/g, " "),
        path: index === pathnames.length - 1 ? undefined : to,
      };
    }),
  ];

  return (
    <nav className="flex items-center text-xs text-slate-500 py-2 border-b border-slate-200/80 mb-4 bg-white/70 px-4 -mx-4 sm:-mx-6 sm:px-6">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 hover:text-[#0b2545] font-medium transition-colors"
      >
        <Home className="w-3.5 h-3.5 text-slate-500" />
        <span>Home</span>
      </Link>

      {crumbs.map((crumb, idx) => (
        <div key={idx} className="flex items-center">
          <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400" />
          {crumb.path ? (
            <Link
              to={crumb.path}
              className="hover:text-[#0b2545] font-medium text-slate-600 transition-colors"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="font-semibold text-[#0b2545] truncate max-w-xs">{crumb.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
