import { User, Search, Activity } from 'lucide-react';

export default function Sidebar({ patients, activePatient, onSelectPatient }) {
  return (
    <aside className="w-72 bg-white border-r border-slate-200 h-screen flex flex-col">
      {/* Logo & Header */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="text-[#1e4d8c]">
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12C8 12 12 8 20 8C28 8 32 12 32 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M8 20C8 20 12 16 20 16C28 16 32 20 32 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M8 28C8 28 12 24 20 24C28 24 32 28 32 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1e4d8c] tracking-tight">MyMR</h1>
            <p className="text-[10px] text-slate-500 font-medium">Empowering Patients Through Intelligent Care</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patients..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e4d8c]/20 focus:border-[#1e4d8c] transition-all duration-200"
          />
        </div>
      </div>

      {/* Section Label */}
      <div className="px-5 py-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Patient Records</p>
      </div>

      {/* Patient List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        {patients.map((patient) => {
          const isActive = activePatient?.id === patient.id;
          return (
            <button
              key={patient.id}
              onClick={() => onSelectPatient(patient)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${isActive
                  ? 'bg-[#1e4d8c] text-white'
                  : 'hover:bg-slate-50 text-slate-700'
                }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${isActive
                  ? 'bg-white/20'
                  : 'bg-slate-100 group-hover:bg-slate-200'
                }`}>
                <User size={18} className={isActive ? 'text-white' : 'text-slate-500'} />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className={`font-medium text-sm truncate ${isActive ? 'text-white' : 'text-slate-800'}`}>
                  {patient.name}
                </p>
                <p className={`text-xs truncate ${isActive ? 'text-white/70' : 'text-slate-400'}`}>
                  ID: {patient.id.slice(0, 8)}...
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-lg bg-[#1e4d8c]/10 flex items-center justify-center text-[#1e4d8c] text-xs font-bold">
            AI
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-slate-700">AI Comparison Mode</p>
            <p className="text-[10px] text-slate-400">Multi-model analysis</p>
          </div>
        </div>
      </div>
    </aside>
  );
}