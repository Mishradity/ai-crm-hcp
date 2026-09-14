import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  formData: {
    hcpName: 'Dr. Smith',
    interactionType: 'Meeting',
    date: new Date().toISOString().split('T')[0],
    time: '14:30',
    attendees: '',
    topicsDiscussed: '',
    materialsShared: [],
    samplesDistributed: [],
    sentiment: 'Neutral',
    outcomes: '',
    followUpActions: '',
  },
  aiSuggestions: [
    'Schedule follow-up meeting in 2 weeks',
    'Send OncoBoost Phase III PDF',
    'Add Dr. Sharma to advisory board invite list'
  ],
  chatMessages: [
    { sender: 'assistant', text: 'Log interaction details here (e.g. "Met Dr. Smith, discussed Product X efficacy, positive sentiment, shared brochure") or ask for help.' }
  ]
};

export const interactionSlice = createSlice({
  name: 'interaction',
  initialState,
  reducers: {
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
    },
    setFullFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    addChatMessage: (state, action) => {
      state.chatMessages.push(action.payload);
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
    }
  }
});

export const { updateFormField, setFullFormData, addChatMessage, resetForm } = interactionSlice.actions;
export default interactionSlice.reducer;