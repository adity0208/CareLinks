import { useEffect, useRef, useState } from 'react';
import { ChatMessage } from '../../types';
import { Send, Bot, User, AlertCircle, Heart } from 'lucide-react';
import { generateGeminiResponse } from '../../services/genAI';

interface ChatInterfaceProps {
  messages: ChatMessage[];
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  sender: 'bot',
  message: "Hello! I'm CareBot, your healthcare assistant. I can help with general health questions, wellness tips, and care guidance. How can I assist you today?\n\n⚠️ Remember: For medical emergencies, please call emergency services immediately.",
  timestamp: new Date().toISOString()
};

const QUICK_QUESTIONS = [
  "What are signs of dehydration?",
  "How to manage stress?",
  "Healthy eating tips",
  "When to see a doctor?",
  "Exercise for beginners"
];

export default function ChatInterface({ messages: initialMessages }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = async (messageText?: string) => {
    const text = messageText || newMessage.trim();
    if (!text) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);
    setError(null);

    try {
      const aiMessage = await generateGeminiResponse(text, messages);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        message: aiMessage,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('AI error:', err);
      setError('Failed to get response. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSend(question);
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 h-[700px] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur opacity-75"></div>
            <div className="relative bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-full">
              <Heart className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">CareBot</h2>
            <p className="text-sm text-gray-600">Your AI Healthcare Assistant</p>
          </div>
          <div className="ml-auto">
            <div className="flex items-center space-x-1 text-green-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-3 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.sender === 'user'
                  ? 'bg-blue-500'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}>
                {message.sender === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`p-4 rounded-2xl shadow-sm ${message.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-br-md'
                    : 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
                  }`}
              >
                <p className="whitespace-pre-line text-sm leading-relaxed">{message.message}</p>
                <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Quick Questions (show only if no user messages yet) */}
        {messages.length === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 font-medium">Quick questions to get started:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_QUESTIONS.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-full hover:bg-blue-50 hover:border-blue-200 transition-colors duration-200"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex justify-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask about symptoms, wellness tips, or health guidance..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            disabled={isTyping}
          />
          <button
            onClick={() => handleSend()}
            disabled={isTyping || !newMessage.trim()}
            className={`px-4 py-3 rounded-xl transition-all duration-200 ${isTyping || !newMessage.trim()
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          CareBot provides general health information. Always consult healthcare professionals for medical advice.
        </p>
      </div>
    </div>
  );
}
