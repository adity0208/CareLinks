import { useEffect, useRef, useState } from 'react';
import { ChatMessage } from '../../types';
import { Send, Bot, User, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { generateGeminiResponse } from '../../services/genAI/index';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  apiKey?: string;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  sender: 'bot',
  message: "Hello! I'm your AI Health Assistant. I can help with general health questions, wellness tips, and care guidance. How can I assist you today?\n\n⚠️ For medical emergencies, please call emergency services immediately.",
  timestamp: new Date().toISOString()
};

const QUICK_QUESTIONS = [
  "What are signs of dehydration?",
  "How to manage fever?",
  "Healthy eating tips",
  "When to see a doctor?",
  "Child vaccination schedule"
];

export default function ChatInterface({ messages: initialMessages, apiKey }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = async (text?: string) => {
    const messageText = text || newMessage.trim();
    if (!messageText || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: messageText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);
    setError(null);

    try {
      console.log('🎯 ChatInterface sending request with API key:', {
        hasApiKey: !!apiKey,
        keyLength: apiKey ? apiKey.length : 0,
        keyPreview: apiKey ? apiKey.substring(0, 10) + '...' : 'none'
      });

      const aiMessage = await generateGeminiResponse(messageText, messages, apiKey);
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
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 h-[700px] flex flex-col overflow-hidden">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-3 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
              {/* Avatar */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${message.sender === 'user'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}>
                {message.sender === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div className={`rounded-2xl px-4 py-3 max-w-full ${message.sender === 'user'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                : 'bg-gray-50 text-gray-800 border border-gray-100'
                }`}>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.message}
                </div>
                <div className={`text-xs mt-2 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3 max-w-[85%]">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                  <span className="text-sm text-gray-600">AI is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex justify-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3 max-w-md">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-red-800">Something went wrong</p>
                <p className="text-xs text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Questions (show only if no messages yet) */}
        {messages.length === 1 && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">Try asking about:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {QUICK_QUESTIONS.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs px-3 py-2 rounded-full border border-blue-200 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-100 bg-white/60 backdrop-blur-sm p-4">
        <div className="flex space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask about symptoms, wellness tips, or health guidance..."
            className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            disabled={isTyping}
          />
          <button
            onClick={() => handleSend()}
            disabled={isTyping || !newMessage.trim()}
            className={`px-4 py-3 rounded-xl transition-all duration-200 ${isTyping || !newMessage.trim()
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
          >
            {isTyping ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-center mt-3 space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Sparkles className="w-3 h-3" />
            <span>Powered by Google Gemini AI</span>
          </div>
          <span>•</span>
          <span>For general health information only</span>
        </div>
      </div>
    </div>
  );
}