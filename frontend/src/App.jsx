import React, { useState } from 'react';
import InteractionForm from './components/InteractionForm';
import ChatAssistant from './components/ChatAssistant';

function App() {
  const [activeTab, setActiveTab] = useState('engagements');

  const navItems = [
    { id: 'dashboard', label: 'Pipeline & Deals', icon: '📈' },
    { id: 'accounts', label: 'Enterprise Accounts', icon: '🏢' },
    { id: 'engagements', label: 'Log Client Sync', icon: '⚡' },
    { id: 'licenses', label: 'POC & API Credits', icon: '🔑' },
    { id: 'security', label: 'SOC2 & Contracts', icon: '🛡️' },
  ];

  return (
    <div className="flex h-screen bg-[#0B0F17] text-slate-100 font-sans antialiased overflow-hidden">
      
      {/* 1. Left SaaS Dark Sidebar */}
      <aside className="w-64 bg-[#111827] text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div>
          {/* SaaS Logo */}
          <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800 bg-[#0D121F]">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-extrabold text-base shadow-lg shadow-blue-500/20">
              ⚡
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                DevScale CRM <span className="text-[9px] px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded-full font-mono border border-blue-400/30">v3.0</span>
              </div>
              <div className="text-[11px] text-slate-400">Enterprise B2B Pipeline</div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2 font-mono">Workspace</div>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* User Account / Rep Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0D121F]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
              AM
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-white">Aditya Mishra</div>
              <div className="text-[11px] text-slate-400 truncate">Enterprise Account Exec</div>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Workstation Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 bg-[#111827] border-b border-slate-800 px-8 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-white tracking-tight">Client Engagement & Meeting Intelligence</h1>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded">
              Tier-1 Accounts
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-emerald-950/60 text-emerald-400 text-xs px-3 py-1.5 rounded-full border border-emerald-800 font-semibold font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Groq LangGraph Copilot Online
            </div>
          </div>
        </header>

        {/* Content Workspace */}
        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          
          {/* SaaS Pipeline Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#111827] p-4 rounded-xl border border-slate-800 shadow-sm flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-blue-900/40 text-blue-400 flex items-center justify-center text-lg font-bold border border-blue-800/40">
                💼
              </div>
              <div>
                <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Quarterly Pipeline</div>
                <div className="text-lg font-extrabold text-white">$1.84M <span className="text-xs text-emerald-400 font-normal">↑ 18%</span></div>
              </div>
            </div>

            <div className="bg-[#111827] p-4 rounded-xl border border-slate-800 shadow-sm flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-emerald-900/40 text-emerald-400 flex items-center justify-center text-lg font-bold border border-emerald-800/40">
                🎯
              </div>
              <div>
                <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Win Probability</div>
                <div className="text-lg font-extrabold text-white">74.5% <span className="text-xs text-emerald-400 font-normal">High Conv</span></div>
              </div>
            </div>

            <div className="bg-[#111827] p-4 rounded-xl border border-slate-800 shadow-sm flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-purple-900/40 text-purple-400 flex items-center justify-center text-lg font-bold border border-purple-800/40">
                ⚡
              </div>
              <div>
                <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">POC Credits Issued</div>
                <div className="text-lg font-extrabold text-white">45 / 100 <span className="text-xs text-slate-400 font-normal">Allocated</span></div>
              </div>
            </div>

            <div className="bg-[#111827] p-4 rounded-xl border border-slate-800 shadow-sm flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-cyan-900/40 text-cyan-400 flex items-center justify-center text-lg font-bold border border-cyan-800/40">
                ⏱️
              </div>
              <div>
                <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Sales Velocity</div>
                <div className="text-lg font-extrabold text-cyan-300">18 Days <span className="text-xs text-slate-400 font-normal">Avg. Cycle</span></div>
              </div>
            </div>
          </div>

          {/* Grid Layout: Left Interaction Form (7 Cols) + Right AI Copilot (5 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <InteractionForm />
            </div>
            <div className="lg:col-span-5">
              <ChatAssistant />
            </div>
          </div>

        </main>
      </div>

    </div>
  );
}

export default App;