import { UserCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AicteProfilePage() {
  const { officerId } = useAuth();

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#071a30] flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-600" />
            <span>AICTE Scrutiny Officer Profile</span>
          </h1>
          <p className="text-xs text-slate-500">
            Signed-in demonstration user
          </p>
        </div>
        <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-300">
        Demonstration identity
        </span>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-slate-300 rounded shadow-sm p-6 space-y-4 text-xs">
        <div className="flex items-start gap-4 pb-4 border-b border-slate-200">
          <div className="w-16 h-16 rounded-full bg-[#071a30] text-white flex items-center justify-center font-bold text-xl flex-shrink-0" aria-hidden="true">
            SR
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">AICTE Scrutiny Officer</h2>
            <p className="text-xs text-slate-600 font-medium">Southern Region · Demonstration account</p>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              Officer ID: <strong className="text-slate-800">{officerId}</strong>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-slate-500 block font-semibold">Portal role</span>
            <span className="text-slate-800">Application scrutiny and officer decision</span>
          </div>
          <div>
            <span className="text-slate-500 block font-semibold">Approval year shown in demo</span>
            <span className="font-semibold text-slate-800">2026–27</span>
          </div>
          <div className="sm:col-span-2 border-t border-slate-200 pt-3">
            <span className="text-slate-500 block font-semibold">Account boundary</span>
            <span className="text-slate-800">This is a client-side demonstration identity; it is not connected to an AICTE identity provider or officer registry.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
