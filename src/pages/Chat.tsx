import React from 'react';
import ChatInterface from '../components/Chat/ChatInterface';
import { mockChatMessages } from '../data/mockData';

export default function Chat() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">AI Health Assistant</h1>
      <div className="max-w-4xl mx-auto">
        <ChatInterface messages={mockChatMessages} />
      </div>
    </div>
  );
}