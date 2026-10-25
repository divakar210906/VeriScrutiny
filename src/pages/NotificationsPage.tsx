// src/pages/NotificationsPage.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  Clock, 
  CheckCheck, 
  ArrowRight 
} from "lucide-react";

interface NotificationItem {
  id: string;
  type: "success" | "warning" | "error" | "info";
  title: string;
  message: string;
  timestamp: string;
  documentId?: string;
  read: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    type: "warning",
    title: "Action Required: External Fire Registry Confirmation",
    message: "Fire Safety Certificate (TN-FRS/ED-ERD/NOC-2025/1192) has been flagged with WARNING. Requires manual verification against state portal.",
    timestamp: "10 minutes ago",
    documentId: "doc-2",
    read: false,
  },
  {
    id: "notif-2",
    type: "error",
    title: "Document Rejected: Faculty Cadre Ratio Non-Conformity",
    message: "Faculty Declaration (KEC/REG-FAC/DEC-2026-V1) failed statutory scrutiny due to 1:2.4 cadre ratio vs mandated 1:2:6 norm.",
    timestamp: "2 hours ago",
    documentId: "doc-4",
    read: false,
  },
  {
    id: "notif-3",
    type: "success",
    title: "Scrutiny Cleared: Affiliation Certificate Validated",
    message: "Affiliation Certificate from Anna University passed all 10 statutory scrutiny rules with 100% confidence.",
    timestamp: "Yesterday",
    documentId: "doc-1",
    read: true,
  },
  {
    id: "notif-4",
    type: "info",
    title: "AICTE Approval Window 2026–27 Open",
    message: "Annual scrutiny window for Extension of Approval (EoA) is active until 15 November 2026.",
    timestamp: "2 days ago",
    read: true,
  },
];

export default function NotificationsPage() {
  const [list, setList] = useState<NotificationItem[]>(initialNotifications);
  const [filter, setFilter] = useState<string>("ALL");

  const markAllAsRead = () => {
    setList((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const filtered = list.filter((item) => {
    if (filter === "UNREAD") return !item.read;
    if (filter === "WARNING") return item.type === "warning" || item.type === "error";
    return true;
  });

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#0b2545] flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-600" />
            <span>Institutional Compliance Notification Dispatch</span>
          </h1>
          <p className="text-xs text-slate-500">
            Real-time audit alerts, scrutiny non-conformity dispatches, and statutory window deadlines
          </p>
        </div>

        <button
          onClick={markAllAsRead}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold transition"
        >
          <CheckCheck className="w-3.5 h-3.5 text-slate-500" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-semibold space-x-2">
        <button
          onClick={() => setFilter("ALL")}
          className={`py-2 px-3 border-b-2 transition ${
            filter === "ALL" ? "border-[#0b2545] text-[#0b2545]" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          All Notifications ({list.length})
        </button>
        <button
          onClick={() => setFilter("UNREAD")}
          className={`py-2 px-3 border-b-2 transition ${
            filter === "UNREAD" ? "border-[#0b2545] text-[#0b2545]" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Unread ({list.filter((n) => !n.read).length})
        </button>
        <button
          onClick={() => setFilter("WARNING")}
          className={`py-2 px-3 border-b-2 transition ${
            filter === "WARNING" ? "border-[#0b2545] text-[#0b2545]" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Urgent Action & Rejections
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-slate-300 rounded shadow-sm divide-y divide-slate-200">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No active notifications matching the selected filter.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 transition-colors flex items-start gap-3 text-xs ${
                !item.read ? "bg-blue-50/30" : "hover:bg-slate-50"
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {item.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : item.type === "warning" ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                ) : item.type === "error" ? (
                  <XCircle className="w-4 h-4 text-rose-600" />
                ) : (
                  <Info className="w-4 h-4 text-blue-600" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-slate-900 ${!item.read ? "text-[#0b2545]" : ""}`}>
                    {item.title}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{item.timestamp}</span>
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">{item.message}</p>
                {item.documentId && (
                  <div className="pt-1">
                    <Link
                      to={`/scrutiny/${item.documentId}`}
                      className="text-[#0056b3] font-semibold hover:underline inline-flex items-center gap-0.5 text-[11px]"
                    >
                      <span>Examine Scrutiny Sheet</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
