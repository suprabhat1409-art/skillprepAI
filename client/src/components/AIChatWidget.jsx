import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AIChatWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hi ${user?.name || 'there'}! I am your SkillPrep AI Coach. How can I help you accelerate your prep today?`,
      sender: 'ai',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      text,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // AI Coaching responses
    setTimeout(() => {
      let reply = "I'm analyzing your preparation dashboard. To improve your readiness, I highly recommend checking out your tailored Learning Roadmap and practicing a mock interview session!";
      const query = text.toLowerCase();

      if (query.includes('ats') || query.includes('resume')) {
        reply = "To maximize your ATS score, make sure to integrate the keywords from your target role (like " + (user?.skills?.slice(0, 3).join(', ') || 'React, Node.js') + ") and format your resume sections cleanly.";
      } else if (query.includes('interview') || query.includes('practice')) {
        reply = "You can launch our AI Mock Interview simulator in the navigation bar! It supports technical, behavioral, and system design categories with step-by-step scoring.";
      } else if (query.includes('roadmap') || query.includes('learn')) {
        reply = "Your Learning Roadmap is auto-generated based on the gap between your resume and your target role: " + (user?.targetRole || 'Software Engineer') + ". Try to complete the checklist items!";
      } else if (query.includes('skill') || query.includes('gap')) {
        reply = "Check out the Skill Gap tab! It outlines your matched vs missing capabilities and recommends courses or open-source projects.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: reply,
          sender: 'ai',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {isOpen && (
        <div className="w-80 sm:w-96 h-[480px] rounded-2xl border border-indigo-500/20 glass-panel shadow-2xl flex flex-col mb-4 overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-indigo-950/60 p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-slate-900 rounded-full"></span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-wide">SkillPrep Coach</h4>
                <p className="text-[10px] text-emerald-400">AI Assistant Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/20">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-900/90 text-slate-100 border border-slate-800 rounded-tl-none'
                }`}>
                  <p className="leading-relaxed">{msg.text}</p>
                  <span className="text-[9px] text-slate-400 block text-right mt-1">{msg.time}</span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-900/90 text-slate-100 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/40 flex gap-2 overflow-x-auto whitespace-nowrap">
            <button onClick={() => handleSend('How to improve ATS score?')} className="text-xs bg-indigo-950/50 hover:bg-indigo-900/50 border border-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full transition-colors">
              📈 Resume Tips
            </button>
            <button onClick={() => handleSend('Where is my roadmap?')} className="text-xs bg-indigo-950/50 hover:bg-indigo-900/50 border border-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full transition-colors">
              🗺️ Roadmap
            </button>
            <button onClick={() => handleSend('How to start interview practice?')} className="text-xs bg-indigo-950/50 hover:bg-indigo-900/50 border border-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full transition-colors">
              🎙️ Mock Interview
            </button>
          </div>

          {/* Footer Input */}
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 border-t border-slate-800 bg-indigo-950/20 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your prep..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button type="submit" className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white shadow-2xl flex items-center justify-center transition-all hover:scale-110 hover:-rotate-12 duration-300 select-none border border-white/10"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default AIChatWidget;
