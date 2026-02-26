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
                <img 
                  src="/mymr-logo.png" 
                  alt="MyMR Logo" 
                  className="w-16 h-16 object-contain"
                />
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-[#1e4d8c] mb-3 tracking-tight">
                Meet Rebecca
              </h1>
              <p className="text-slate-600 mb-8 leading-relaxed">
                <span className="font-medium text-slate-800">Your AI Healthcare Assistant.</span> Rebecca helps you access and understand medical records with intelligent, conversational insights powered by advanced AI.
              </p>

              {/* Features */}
              <div className="space-y-4 text-left max-w-md mx-auto mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#1e4d8c]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-[#1e4d8c]"></div>
                  </div>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium text-slate-800">Intelligent Assistance</span> — Get instant answers about patient medical records
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#1e4d8c]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-[#1e4d8c]"></div>
                  </div>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium text-slate-800">Natural Conversations</span> — Ask questions in plain language
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#1e4d8c]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-[#1e4d8c]"></div>
                  </div>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium text-slate-800">Secure & Private</span> — Your data stays protected and confidential
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