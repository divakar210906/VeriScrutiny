import { UserCheck } from "lucide-react";

export default function AicteProfilePage() {
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
            Designated Inspection Officer • Southern Regional Directorate (Chennai)
          </p>
        </div>
        <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          Active Officer Credential
        </span>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-slate-300 rounded shadow-sm p-6 space-y-4 text-xs">
        <div className="flex items-start gap-4 pb-4 border-b border-slate-200">
          <div className="w-16 h-16 rounded-full bg-[#071a30] text-amber-400 flex items-center justify-center font-bold text-xl flex-shrink-0">
            SK
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Dr. K. Senthil Kumar, Ph.D.</h2>
            <p className="text-xs text-slate-600 font-medium">Senior Scrutiny Officer & Regional Verification Lead</p>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              Officer ID: <strong className="text-slate-800">AICTE001</strong> • Directorate: Southern Region (Tamil Nadu, Puducherry)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-slate-500 block font-semibold">Official Email:</span>
            <span className="font-mono text-slate-800">senthilkumar.k@aicte-india.org</span>
          </div>
          <div>
            <span className="text-slate-500 block font-semibold">Directorate Contact:</span>
            <span className="font-mono text-slate-800">+91 44 2235 0104</span>
          </div>
          <div>
            <span className="text-slate-500 block font-semibold">Regional Office Address:</span>
            <span className="text-slate-800">AICTE Southern Regional Office, Shastri Bhavan, 26 Haddows Road, Nungambakkam, Chennai - 600006</span>
          </div>
          <div>
            <span className="text-slate-500 block font-semibold">Approval Process Cycle:</span>
            <span className="font-semibold text-emerald-700">AY 2026–2027 Scrutiny Committee Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
