import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateFormField } from '../store/interactionSlice';

export default function InteractionForm() {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.interaction.formData);
  const suggestions = useSelector((state) => state.interaction.aiSuggestions);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field, value) => {
    dispatch(updateFormField({ field, value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('https://ai-crm-hcp-8qem.onrender.com/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hcp_name: form.hcpName,
          interaction_type: form.interactionType,
          date: form.date,
          time: form.time,
          attendees: form.attendees,
          topics_discussed: form.topicsDiscussed,
          materials_shared: form.materialsShared,
          samples_distributed: form.samplesDistributed,
          sentiment: form.sentiment,
          outcomes: form.outcomes,
          follow_up_actions: form.followUpActions,
        }),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const sentimentPills = [
    { label: 'Positive', activeClass: 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/40', icon: '⚡', desc: 'High Intent / Champion' },
    { label: 'Neutral', activeClass: 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500/40', icon: '⚖️', desc: 'Spec Reviewing' },
    { label: 'Negative', activeClass: 'bg-rose-500/20 border-rose-500 text-rose-300 ring-1 ring-rose-500/40', icon: '🛑', desc: 'Budget / Tech Blocker' }
  ];

  return (
    <div className="bg-[#111827]/90 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      
      {/* Account Context Banner */}
      <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-[#131d31] to-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-lg shadow-lg shadow-cyan-500/20 text-white font-bold">
            ⌘
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-wide">{form.hcpName || 'Sarah Connor (CTO)'}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Enterprise Tier-1 • $140K ARR
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
              <span>Stack: AWS EKS, Kafka, GraphQL</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-medium">Stage: Architecture Validation</span>
            </div>
          </div>
        </div>

        {savedSuccess && (
          <span className="text-xs font-semibold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3 py-1 rounded-lg flex items-center gap-1.5 animate-fade-in">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            Synced to Pipeline
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        
        {/* Row 1: Client Lead & Stage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Client Stakeholder <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full bg-[#1E293B]/60 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition"
              value={form.hcpName}
              placeholder="e.g. Sarah Connor (Head of Engineering)"
              onChange={(e) => handleChange('hcpName', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Sync Category
            </label>
            <select
              className="w-full bg-[#1E293B]/60 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 transition cursor-pointer"
              value={form.interactionType}
              onChange={(e) => handleChange('interactionType', e.target.value)}
            >
              <option value="Meeting">⚡ Deep-Dive Technical Demo</option>
              <option value="Call">📞 Architecture Review (Zoom)</option>
              <option value="Email">✉️ Security & Compliance Followup</option>
              <option value="Virtual">🤝 MSA & Pricing Negotiation</option>
            </select>
          </div>
        </div>

        {/* Row 2: Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Sync Date</label>
            <input
              type="date"
              className="w-full bg-[#1E293B]/60 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 transition"
              value={form.date}
              onChange={(e) => handleChange('date', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Timestamp</label>
            <input
              type="time"
              className="w-full bg-[#1E293B]/60 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 transition"
              value={form.time}
              onChange={(e) => handleChange('time', e.target.value)}
            />
          </div>
        </div>

        {/* Row 3: Attendees */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Stakeholders in Call
          </label>
          <input
            type="text"
            className="w-full bg-[#1E293B]/60 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
            placeholder="e.g. Alex (VP Infra), David (DevOps Lead), Lisa (Security Officer)"
            value={form.attendees}
            onChange={(e) => handleChange('attendees', e.target.value)}
          />
        </div>

        {/* Row 4: Technical Discussion Points */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Technical Discussion & Requirements <span className="text-cyan-400">*</span>
            </label>
            <span className="text-[10px] font-mono font-medium text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded">
              ⚡ Copilot Auto-Populate
            </span>
          </div>
          <textarea
            rows="3"
            required
            className="w-full bg-[#1E293B]/60 border border-slate-700/80 rounded-xl p-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition leading-relaxed"
            placeholder="Discussed sub-50ms API latency SLAs, multi-region database failover, and pricing tier for 2M requests/month..."
            value={form.topicsDiscussed}
            onChange={(e) => handleChange('topicsDiscussed', e.target.value)}
          />
        </div>

        {/* Row 5: Sentiment Pills */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Inferred Deal Sentiment & Velocity
          </label>
          <div className="grid grid-cols-3 gap-3">
            {sentimentPills.map((p) => {
              const isSelected = form.sentiment.toLowerCase() === p.label.toLowerCase();
              return (
                <button
                  type="button"
                  key={p.label}
                  onClick={() => handleChange('sentiment', p.label)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-0.5 transition-all ${
                    isSelected
                      ? p.activeClass
                      : 'border-slate-800 bg-[#1E293B]/30 text-slate-400 hover:bg-[#1E293B]/60 hover:text-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-xs">
                    <span>{p.icon}</span> <span>{p.label}</span>
                  </span>
                  <span className="text-[10px] opacity-60 font-mono">{p.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 6: Outcomes & Action Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Outcomes & Decisions
            </label>
            <textarea
              rows="2"
              className="w-full bg-[#1E293B]/60 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
              placeholder="Team cleared technical hurdles; requested sandbox API keys for 14-day trial..."
              value={form.outcomes}
              onChange={(e) => handleChange('outcomes', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Deliverables & Next Steps
            </label>
            <textarea
              rows="2"
              className="w-full bg-[#1E293B]/60 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
              placeholder="Provision 10k sandbox credits and send SOC-2 Type II audit PDF..."
              value={form.followUpActions}
              onChange={(e) => handleChange('followUpActions', e.target.value)}
            />
          </div>
        </div>

        {/* AI Action Suggestions */}
        <div className="bg-[#0B1120]/80 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
            <span>✨</span> Recommended Follow-Up Actions
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              'Send SOC2 Type-II compliance pack',
              'Book tech call with Principal Solutions Architect',
              'Dispatch 10,000 API Sandbox Credits'
            ].map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChange('followUpActions', form.followUpActions ? `${form.followUpActions}; ${s}` : s)}
                className="text-xs bg-[#1E293B]/80 text-slate-300 border border-slate-700 hover:border-cyan-400 hover:text-cyan-300 px-3 py-1.5 rounded-lg transition text-left font-medium"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3.5 px-4 rounded-xl text-xs tracking-wider uppercase transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <>
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Syncing to Enterprise Pipeline...
            </>
          ) : (
            'Commit & Sync Engagement'
          )}
        </button>
      </form>
    </div>
  );
}