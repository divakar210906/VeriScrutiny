import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { aicteInstitutionsList } from "../mockData";
import { useDocuments } from "../hooks/useDocuments";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

function getBreadcrumbs(pathname: string, search: string, documentNames: Map<string, string>): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const role = segments[0];
  if (role !== "institution" && role !== "aicte") return [];

  const base = `/${role}`;
  const route = segments[1];

  if (!route || route === "dashboard") return [{ label: "Dashboard" }];
  if (route === "required-documents") {
    return [{ label: "Required documents" }];
  }
  if (route === "upload") {
    return [
      { label: "Required documents", path: `${base}/required-documents` },
      { label: "Upload document" },
    ];
  }
  if (route === "submissions") return [{ label: "My submissions" }];
  if (route === "notifications") return [{ label: "Notifications" }];
  if (route === "history") return [{ label: "Scrutiny history" }];
  if (route === "profile") return [{ label: "Profile" }];
  if (route === "institutions") {
    return search.includes("filter=pending")
      ? [{ label: "Pending scrutiny" }]
      : [{ label: "Institutions" }];
  }
  if (route === "institution" && segments[2]) {
    const institutionId = segments[2];
    const institution = aicteInstitutionsList.find((item) => item.id === institutionId);
    return [
      { label: "Institutions", path: `${base}/institutions` },
      { label: institution?.name ?? institutionId },
    ];
  }
  if ((route === "review" || route === "scrutiny") && segments.length >= 3) {
    const institutionId = route === "review" ? segments[2] : "KEC001";
    const docId = route === "review" ? segments[3] : segments[2];
    const institution = aicteInstitutionsList.find((item) => item.id === institutionId);
    const docName = documentNames.get(docId) ?? "Document review";
    return [
      { label: "Pending scrutiny", path: `${base}/institutions?filter=pending` },
      { label: institution?.name ?? institutionId, path: `${base}/institution/${institutionId}` },
      { label: docName },
    ];
  }
  if (route === "report" && segments.length >= 4) {
    const institutionId = segments[2];
    const docId = segments[3];
    return [
      { label: "Institutions", path: `${base}/institutions` },
      { label: institutionId, path: `${base}/institution/${institutionId}` },
      { label: documentNames.get(docId) ?? "Workflow record" },
      { label: "Report" },
    ];
  }
  if (route === "reports") return [{ label: "Workflow record" }];

  return [{ label: route.replace(/-/g, " ") }];
}

export default function Breadcrumb() {
  const location = useLocation();
  const { docs } = useDocuments();
  const role = location.pathname.startsWith("/aicte") ? "aicte" : "institution";
  const dashboardPath = `/${role}/dashboard`;
  const documentNames = new Map(docs.map((document) => [document.id, document.name]));
  const crumbs = getBreadcrumbs(location.pathname, location.search, documentNames);
  if (crumbs.length === 1 && crumbs[0].label === "Dashboard") return null;

  return (
    <nav className="portal-breadcrumb" aria-label="Breadcrumb">
      <Link to={dashboardPath} className="portal-breadcrumb-home">
        <Home aria-hidden="true" />
        <span>Home</span>
      </Link>
      {crumbs.map((crumb, index) => (
        <span className="portal-breadcrumb-segment" key={`${crumb.label}-${index}`}>
          <ChevronRight aria-hidden="true" />
          {crumb.path ? (
            <Link to={crumb.path}>{crumb.label}</Link>
          ) : (
            <span aria-current="page">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
