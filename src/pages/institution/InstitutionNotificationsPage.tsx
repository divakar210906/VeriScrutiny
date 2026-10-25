// src/pages/institution/InstitutionNotificationsPage.tsx
import { Link } from "react-router-dom";
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight 
} from "lucide-react";

export default function InstitutionNotificationsPage() {
  const notifications = [
    {
      id: "notif-1",
      title: "Action Required: Faculty Declaration Needs Correction",
      message: "The AICTE Scrutiny Committee flagged your Faculty Declaration (Doc Ref: KEC/REG-FAC/DEC-2026-V1). Cadre ratio is 1:2.4 instead of required 1:2:6 norm.",
      timestamp: "Today, 11:20 AM",
      action: "/institution/upload",
      actionLabel: "Re-upload Document",
      urgent: true,
    },
    {
      id: "notif-2",
      title: "Submission Ingested: Fire Safety Certificate",
      message: "Your Fire Safety Certificate (TN-FRS/ED-ERD/NOC-2025/1192) was successfully filed and is currently under review by the scrutiny officer.",
      timestamp: "Yesterday, 04:45 PM",
      action: "/institution/submissions",
      actionLabel: "View Submission",
      urgent: false,
    },
    {
      id: "notif-3",
      title: "Scrutiny Window Reminder: Extension of Approval 2026–27",
      message: "Final deadline for uploading all 10 mandatory statutory filings for Southern Region is 15 November 2026.",
      timestamp: "2 days ago",
      action: "/institution/required-documents",
      actionLabel: "View Checklist",
      urgent: false,
    },
  ];

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#0b2545] flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-600" />
            <span>Compliance Notifications & Alerts</span>
          </h1>
          <p className="text-xs text-slate-500">
            Official communications dispatched by AICTE Scrutiny Division to Kongu Engineering College
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-300 rounded shadow-sm divide-y divide-slate-200">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 flex items-start gap-3 text-xs ${
              n.urgent ? "bg-amber-50/40" : "hover:bg-slate-50"
            }`}
          >
            <div className="mt-0.5 flex-shrink-0">
              {n.urgent ? (
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              )}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className={`font-bold ${n.urgent ? "text-amber-950" : "text-slate-900"}`}>
                  {n.title}
                </span>
                <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{n.timestamp}</span>
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">{n.message}</p>
              <div className="pt-1">
                <Link
                  to={n.action}
                  className="text-[#0056b3] font-semibold hover:underline inline-flex items-center gap-0.5 text-[11px]"
                >
                  <span>{n.actionLabel}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
