import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addChatMessage, setFullFormData } from '../store/interactionSlice';

function ChatAssistant() {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.interaction.chatMessages);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const userMsg = inputText;
    dispatch(addChatMessage({ sender: 'user', text: userMsg }));
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      dispatch(addChatMessage({ sender: 'assistant', text: data.reply }));

      if (data.extracted_data) {
        dispatch(setFullFormData({
          hcpName: data.extracted_data.hcp_name || '',
          interactionType: data.extracted_data.interaction_type || 'Meeting',
          date: data.extracted_data.date || '',
          time: data.extracted_data.time || '',
          attendees: data.extracted_data.attendees || '',
          topicsDiscussed: data.extracted_data.topics_discussed || '',
          sentiment: data.extracted_data.sentiment || 'Neutral',
          outcomes: data.extracted_data.outcomes || '',
          followUpActions: data.extracted_data.follow_up_actions || '',
        }));
      }
    } catch (err) {
      dispatch(addChatMessage({ sender: 'assistant', text: 'Error communicating with AI service.' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex flex-col h-[750px]">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b">
        <span className="text-blue-600 font-bold">🤖 AI Assistant</span>
        <span className="text-xs text-gray-500">Log interaction via chat</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-sm">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg leading-relaxed ${
              m.sender === 'user'
                ? 'bg-blue-600 text-white ml-auto max-w-[85%]'
                : 'bg-gray-100 text-gray-800 mr-auto max-w-[90%]'
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && <div className="text-xs text-gray-400 italic">AI Agent is thinking and executing tools...</div>}
      </div>

      <div className="pt-3 border-t mt-2 flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Describe interaction..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition"
        >
          ▲ Log
        </button>
      </div>
    </div>
  );
}

export default ChatAssistant;