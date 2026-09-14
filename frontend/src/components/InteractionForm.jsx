import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateFormField } from '../store/interactionSlice';

export default function InteractionForm() {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.interaction.formData);
  const suggestions = useSelector((state) => state.interaction.aiSuggestions);

  const handleChange = (field, value) => {
    dispatch(updateFormField({ field, value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/interactions', {
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
      if (res.ok) alert('Interaction successfully saved to CRM database!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Interaction Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">HCP Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500"
              placeholder="Search or select HCP..."
              value={form.hcpName}
              onChange={(e) => handleChange('hcpName', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Interaction Type</label>
            <select
              className="w-full border rounded px-3 py-2 text-sm"
              value={form.interactionType}
              onChange={(e) => handleChange('interactionType', e.target.value)}
            >
              <option value="Meeting">Meeting</option>
              <option value="Call">Phone Call</option>
              <option value="Email">Email</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Date</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2 text-sm"
              value={form.date}
              onChange={(e) => handleChange('date', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Time</label>
            <input
              type="time"
              className="w-full border rounded px-3 py-2 text-sm"
              value={form.time}
              onChange={(e) => handleChange('time', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Attendees</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Enter names or search..."
            value={form.attendees}
            onChange={(e) => handleChange('attendees', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Topics Discussed</label>
          <textarea
            rows="3"
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Enter key discussion points..."
            value={form.topicsDiscussed}
            onChange={(e) => handleChange('topicsDiscussed', e.target.value)}
          />
        </div>

        <div className="border border-dashed p-3 rounded bg-gray-50 flex justify-between items-center text-xs text-gray-600">
          <span>🎙️ Summarize from Voice Note (Requires Consent)</span>
          <button type="button" className="text-blue-600 font-semibold hover:underline">Record</button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">Observed/Inferred HCP Sentiment</label>
          <div className="flex gap-6">
            {['Positive', 'Neutral', 'Negative'].map((sent) => (
              <label key={sent} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="sentiment"
                  value={sent}
                  checked={form.sentiment.toLowerCase() === sent.toLowerCase()}
                  onChange={() => handleChange('sentiment', sent)}
                />
                {sent}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Outcomes</label>
          <textarea
            rows="2"
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Key outcomes or agreements..."
            value={form.outcomes}
            onChange={(e) => handleChange('outcomes', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Follow-up Actions</label>
          <textarea
            rows="2"
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Enter next steps or tasks..."
            value={form.followUpActions}
            onChange={(e) => handleChange('followUpActions', e.target.value)}
          />
        </div>

        <div className="bg-blue-50/50 p-3 rounded border border-blue-100 text-xs">
          <p className="font-semibold text-blue-900 mb-1">AI Suggested Follow-ups:</p>
          <ul className="list-disc ml-4 space-y-1 text-blue-700">
            {suggestions.map((s, idx) => (
              <li
                key={idx}
                className="cursor-pointer hover:underline"
                onClick={() => handleChange('followUpActions', form.followUpActions ? `${form.followUpActions}; ${s}` : s)}
              >
                {s}
              </li>
            ))}
          </ul>
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded text-sm transition">
          Save Interaction
        </button>
      </form>
    </div>
  );
}