import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { PATIENTS } from './constants/patients';
import { MessageSquare } from 'lucide-react';

function App() {
  const [activePatient, setActivePatient] = useState(null);

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans antialiased bg-white">
      <Sidebar
        patients={PATIENTS}
        activePatient={activePatient}
        onSelectPatient={setActivePatient}
      />

      <main className="flex-1 h-full">
        {activePatient ? (
          <ChatWindow key={activePatient.id} patient={activePatient} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-slate-50/50">
            {/* Hero Section */}
            <div className="text-center max-w-xl px-8">
              {/* Logo */}
              <div className="mb-8 inline-flex">
                <div className="text-[#1e4d8c]">
                  <svg width="64" height="64" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 12C8 12 12 8 20 8C28 8 32 12 32 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M8 20C8 20 12 16 20 16C28 16 32 20 32 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M8 28C8 28 12 24 20 24C28 24 32 28 32 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-[#1e4d8c] mb-3 tracking-tight">
                About MyMR
              </h1>
              <p className="text-slate-600 mb-8 leading-relaxed">
                <span className="font-medium text-slate-800">MyMR was built to solve this.</span> We empower patients with full ownership and secure control of their medical records while connecting providers, payors, and health systems on one interoperable, AI-powered platform.
              </p>

              {/* Features */}
              <div className="space-y-4 text-left max-w-md mx-auto mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#1e4d8c]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-[#1e4d8c]"></div>
                  </div>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium text-slate-800">Multi-Model AI Analysis</span> — Compare responses from Claude and MedGemma side-by-side
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#1e4d8c]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-[#1e4d8c]"></div>
                  </div>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium text-slate-800">Intelligent Automation</span> — Transform how healthcare data is used
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#1e4d8c]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-[#1e4d8c]"></div>
                  </div>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium text-slate-800">Personalized Healthcare</span> — Digital twins for real-time health insights
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="flex items-center justify-center gap-2 text-[#1e4d8c]">
                <MessageSquare size={18} />
                <span className="text-sm font-medium">Select a patient from the sidebar to begin</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;