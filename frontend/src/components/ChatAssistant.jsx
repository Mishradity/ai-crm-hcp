import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addChatMessage, setFullFormData } from '../store/interactionSlice';

export default function ChatAssistant() {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.interaction.chatMessages);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const quickPrompts = [
    "Met Sarah (CTO at FinTech), demoed multi-tenant API, positive sentiment, requested sandbox keys",
    "Synced with Priya (VP of Engineering). Architecture review passed with zero blockers, highly positive sentiment. Dispatch MSA and contract for signature.",
    "Synced with David (CTO). Unhappy with data residency options in EU, critical blocker. Highly dissatisfied, negative sentiment, putting POC on hold.",
    "Call with Elena (Head of Security). Reviewing data privacy and SOC-2 compliance specs, neutral sentiment."
  ];

  const handleSend = async (overrideText = null) => {
    const textToSend = overrideText || inputText;
    if (!textToSend.trim() || loading) return;

    dispatch(addChatMessage({ sender: 'user', text: textToSend }));
    if (!overrideText) setInputText('');
    setLoading(true);

    try {
      const res = await fetch('https://ai-crm-hcp-8qem.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });
      const data = await res.json();
      dispatch(addChatMessage({ sender: 'assistant', text: data.reply }));

      if (data.extracted_data) {
        dispatch(setFullFormData({
          hcpName: data.extracted_data.hcp_name || 'Enterprise Stakeholder',
          interactionType: data.extracted_data.interaction_type || 'Meeting',
          date: data.extracted_data.date || new Date().toISOString().split('T')[0],
          time: data.extracted_data.time || '15:00',
          attendees: data.extracted_data.attendees || 'Engineering & Architecture Team',
          topicsDiscussed: data.extracted_data.topics_discussed || textToSend,
          sentiment: data.extracted_data.sentiment || 'Positive',
          outcomes: data.extracted_data.outcomes || 'Discussion documented',
          followUpActions: data.extracted_data.follow_up_actions || 'Action item logged',
        }));
      }
    } catch (err) {
      dispatch(addChatMessage({ sender: 'assistant', text: 'Error communicating with AI service.' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111827]/90 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl flex flex-col h-[780px] overflow-hidden">
      
      {/* Copilot Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#131d31] to-slate-900 px-5 py-4 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-sm shadow-md shadow-cyan-500/20 text-white font-bold">
            ⚡
          </div>
          <div>
            <div className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
              Sales Copilot <span className="text-[10px] text-emerald-400 font-mono font-normal">● Live</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">Autonomous LangGraph Engine</div>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded">
          Llama-3 / Groq
        </span>
      </div>

      {/* Quick Run Pills */}
      <div className="bg-[#0B1120]/80 px-4 py-2 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px] shrink-0">
        <span className="font-mono text-slate-500 text-[10px] uppercase font-bold shrink-0">Run:</span>
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSend(qp)}
            className="whitespace-nowrap bg-[#1E293B]/70 border border-slate-700/80 hover:border-cyan-400 hover:text-cyan-300 text-slate-300 px-2.5 py-1 rounded-md transition font-medium text-[11px]"
          >
            {qp.length > 28 ? qp.substring(0, 28) + '...' : qp}
          </button>
        ))}
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0B0F17]/40">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'bg-[#1E293B]/90 border border-slate-700/70 text-slate-200 shadow-sm'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1 font-mono">
              {m.sender === 'user' ? 'You' : 'DevScale Copilot'}
            </span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-[#1E293B]/80 border border-slate-700 rounded-xl px-3 py-2 w-fit">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
            Executing LangGraph tool calls & syncing state...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Command Input Bar */}
      <div className="p-3 bg-[#0D121F] border-t border-slate-800">
        <div className="flex items-center gap-2 bg-[#1E293B]/70 border border-slate-700/80 rounded-xl p-1.5 focus-within:border-cyan-400 transition">
          <input
            type="text"
            className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none font-sans"
            placeholder="Type meeting summary (e.g. 'Met Sarah, agreed on pilot')..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !inputText.trim()}
            className="bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 disabled:opacity-40 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition shadow-md shadow-cyan-500/20"
          >
            Send ↵
          </button>
        </div>
      </div>

    </div>
  );
}