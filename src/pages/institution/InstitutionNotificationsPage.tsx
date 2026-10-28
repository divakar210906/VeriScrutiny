import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, Bell, CheckCircle2, Clock } from "lucide-react";
import { useDocuments } from "../../hooks/useDocuments";

export default function InstitutionNotificationsPage() {
  const { docs, loading } = useDocuments();
  const notifications = docs
    .filter((doc) => ["Deficiency Raised", "Needs Correction", "Re-submitted", "Under Scrutiny"].includes(doc.status))
    .map((doc) => {
      const needsAction = doc.status === "Deficiency Raised" || doc.status === "Needs Correction";
      const title = needsAction
        ? `Officer requested a correction: ${doc.name}`
        : doc.status === "Re-submitted"
        ? `Re-submission received: ${doc.name}`
        : `Under officer review: ${doc.name}`;

      return {
        id: `${doc.id}-${doc.status}`,
        title,
        message: doc.details.officerRemarks
          ?? doc.details.rejectionReason
          ?? (needsAction ? "No officer remarks were recorded. Contact the reviewing officer before replacing the document." : `Current status: ${doc.status}.`),
        timestamp: doc.lastScrutinized ?? doc.submissionDate,
        action: needsAction ? `/institution/upload?replace=${doc.id}` : "/institution/submissions",
        actionLabel: needsAction ? "Upload a replacement" : "View submission",
        needsAction,
      };
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (loading) {
    return <p role="status" className="rounded border border-slate-200 bg-white p-6 text-sm text-slate-600">Loading notifications…</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <header className="rounded border border-slate-300 bg-white p-4">
        <h1 className="flex items-center gap-2 text-lg font-bold text-[#0b2545]">
          <Bell className="h-5 w-5 text-slate-600" aria-hidden="true" />
          Application notifications
        </h1>
        <p className="mt-1 text-sm text-slate-600">Updates are derived from document status changes in this browser.</p>
      </header>

      <section aria-label="Notifications" className="divide-y divide-slate-200 rounded border border-slate-300 bg-white">
        {notifications.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Bell className="mx-auto h-7 w-7 text-slate-400" aria-hidden="true" />
            <h2 className="mt-3 text-sm font-semibold text-slate-800">No application updates</h2>
            <p className="mt-1 text-sm text-slate-600">Officer decisions and re-submission updates will appear here.</p>
            <Link to="/institution/submissions" className="mt-4 inline-flex text-sm font-semibold text-blue-800 hover:underline">
              View submissions
            </Link>
          </div>
        ) : notifications.map((notification) => (
          <article key={notification.id} className={`flex items-start gap-3 p-4 ${notification.needsAction ? "bg-amber-50/60" : ""}`}>
            <div className="mt-0.5 shrink-0">
              {notification.needsAction
                ? <AlertTriangle className="h-4 w-4 text-amber-700" aria-hidden="true" />
                : notification.title.startsWith("Re-submission")
                ? <CheckCircle2 className="h-4 w-4 text-blue-700" aria-hidden="true" />
                : <Clock className="h-4 w-4 text-slate-500" aria-hidden="true" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="text-sm font-semibold text-slate-900">{notification.title}</h2>
                <time dateTime={notification.timestamp} className="text-xs text-slate-500">
                  {new Date(notification.timestamp).toLocaleString("en-IN")}
                </time>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">{notification.message}</p>
              <Link to={notification.action} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-blue-800 hover:underline">
                {notification.actionLabel}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
