import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, ArrowRight, BookOpen, Printer, Calendar, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { aiService } from '../../services/ai/aiService';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  action?: {
    label: string;
    route: string;
  };
}

export const AIAssistantDrawer: React.FC = () => {
  const {
    isAIAssistantOpen,
    setIsAIAssistantOpen,
    student,
    subjects,
    topics,
    materials,
    tasks,
    totalSemesterPagesAvoided,
    navigate,
  } = useApp();

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: `Hi ${student.name.split(' ')[0]}! 👋 I'm your EcoStudy Academic Copilot. I analyze your 4 subjects, attendance percentages, upcoming exams, and uploaded materials to streamline your daily learning.\n\nHow can I help you today?`,
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAIAssistantOpen) {
      scrollToBottom();
    }
  }, [messages, isAIAssistantOpen]);

  const quickPrompts = [
    { label: 'What should I study?', query: 'What should I study today?' },
    { label: 'Optimize this PDF', query: 'Optimize this PDF with SmartPrint' },
    { label: 'Check attendance', query: 'Check my attendance status' },
    { label: 'Explain Trees', query: 'Explain Trees and AVL rotations' },
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input.trim();
    if (!textToSend) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now',
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await aiService.generateAssistantResponse(textToSend, {
        studentName: student.name,
        subjects,
        topics,
        materials,
        tasks,
        pagesAvoided: totalSemesterPagesAvoided,
      });

      setTimeout(() => {
        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: response.text,
          timestamp: 'Just now',
          action: response.actionSuggestion,
        };
        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
      }, 500);
    } catch {
      setIsTyping(false);
    }
  };

  if (!isAIAssistantOpen) {
    return (
      <button
        onClick={() => setIsAIAssistantOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-3.5 py-2.5 bg-slate-900/95 hover:bg-slate-900 text-white rounded-full shadow-xl shadow-slate-950/25 border border-slate-700/60 backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 group cursor-pointer"
        aria-label="Open AI Assistant"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <Sparkles className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-semibold tracking-wide text-slate-100 pr-0.5">EcoStudy AI</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      {/* Backdrop */}
      <div
        onClick={() => setIsAIAssistantOpen(false)}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity pointer-events-auto"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10 pointer-events-auto">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-[#0B291E] text-white flex items-center justify-between border-b border-emerald-900/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold tracking-tight text-white flex items-center gap-2 font-['Plus_Jakarta_Sans',sans-serif]">
                  EcoStudy AI
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/30 text-emerald-300 uppercase tracking-wider">
                    Copilot
                  </span>
                </h3>
                <p className="text-xs text-emerald-200/70">Context-aware academic advisor</p>
              </div>
            </div>

            <button
              onClick={() => setIsAIAssistantOpen(false)}
              className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900/50 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts bar */}
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {quickPrompts.map(qp => (
              <button
                key={qp.label}
                onClick={() => handleSend(qp.query)}
                className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all font-medium"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-[#0B291E] flex items-center justify-center shrink-0 mt-0.5 text-emerald-300">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-br-xs'
                      : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/60'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {msg.action && (
                    <button
                      onClick={() => {
                        navigate(msg.action!.route);
                        setIsAIAssistantOpen(false);
                      }}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      {msg.action.label}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-300 flex items-center justify-center shrink-0 mt-0.5 text-slate-700">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 pl-10">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-100" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-200" />
                <span className="text-slate-500 font-medium">EcoStudy is analyzing academic context...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3.5 border-t border-slate-200 bg-white">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about what to study, attendance, or print..."
                className="flex-1 px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2.5 rounded-xl bg-[#0B291E] text-white hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
