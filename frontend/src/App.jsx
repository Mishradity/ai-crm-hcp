import React from 'react';
import InteractionForm from './components/InteractionForm';
import ChatAssistant from './components/ChatAssistant';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-['Inter'] text-gray-900 p-6">
      <header className="max-w-7xl mx-auto mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-800">Log HCP Interaction</h1>
      </header>
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InteractionForm />
        </div>
        <div className="lg:col-span-1">
          <ChatAssistant />
        </div>
      </main>
    </div>
  );
}

export default App;