'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Sparkles, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  isTyping?: boolean;
}

const CONVERSATION_FLOW: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content: "My electricity bill of KES 2,500 is due tomorrow and I need KES 3,000 for groceries. Can I safely take an advance without ruining my budget next month?"
  },
  {
    id: '2',
    role: 'ai',
    content: "Let's look at your finances, Sarah. \n\nYour current earned wages are **KES 18,500**.\nTaking an advance of **KES 5,500** (plus a flat KES 150 fee) leaves you with **KES 12,850** accessible before payday.\n\nBased on your historical spending, your fixed expenses next month are KES 8,000. This advance is **safe** and keeps you well within your financial safety net."
  }
];

export default function WizaHeroPreview() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const runAnimationSequence = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setMessages([]);

    // 1. User typing
    setMessages([{ id: 'typing-1', role: 'user', content: '', isTyping: true }]);
    await new Promise(r => setTimeout(r, 1500));
    
    // 2. User message appears
    setMessages([CONVERSATION_FLOW[0]]);
    await new Promise(r => setTimeout(r, 800));

    // 3. AI analyzing state
    setMessages([
        CONVERSATION_FLOW[0], 
        { id: 'typing-2', role: 'ai', content: '', isTyping: true }
    ]);
    await new Promise(r => setTimeout(r, 2000));

    // 4. AI response appears
    setMessages([
      CONVERSATION_FLOW[0],
      CONVERSATION_FLOW[1]
    ]);
    
    setIsAnimating(false);
  };

  return (
    <section className="py-24 relative overflow-hidden bg-white">
      {/* Decorative Background Elements */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-emerald-200 to-green-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-288.75" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Content Left */}
          <div className="relative z-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center mb-8 shadow-2xl shadow-slate-900/20"
            >
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-400/20 to-transparent flex items-center justify-center border border-emerald-500/20 relative overflow-hidden">
                    <Sparkles className="w-8 h-8 text-emerald-400 relative z-10" />
                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl animate-pulse" />
                </div>
            </motion.div>

            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-6"
            >
                Meet Wiza. <br/>
                Your AI Financial Coach.
            </motion.h2>

            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed"
            >
                We don't automate loans; we automate financial wellness. Wiza analyzes real-time spending habits, upcoming bills, and earned wages to give employees actionable, ethical advice before they advance a single shilling.
            </motion.p>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="space-y-4 mb-10"
            >
                {[
                    "Analyzes affordability before approving advances",
                    "Provides personalized budgeting strategies",
                    "Flags risky financial behavior automatically"
                ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="text-slate-700 font-medium">{feature}</span>
                    </div>
                ))}
            </motion.div>

            <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                onClick={() => { setHasStarted(true); runAnimationSequence(); }}
                disabled={isAnimating}
                className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-slate-900 px-8 py-4 font-bold text-white shadow-xl shadow-slate-900/10 transition-all duration-300 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span className="relative z-10">
                    {isAnimating ? 'Analyzing Request...' : 'Run Simulation'}
                </span>
                {!isAnimating && <ArrowRight className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />}
            </motion.button>
          </div>

          {/* AI Terminal Right */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative lg:h-150 flex items-center justify-center perspective-1000"
          >
              <div className="absolute inset-0 bg-linear-to-tr from-emerald-100 to-transparent rounded-full blur-3xl opacity-50 -z-10" />
              
              <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/60 shadow-2xl shadow-slate-900/10 overflow-hidden flex flex-col h-137.5 relative">
                  
                  {/* Chat Header */}
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 backdrop-blur-md sticky top-0 z-20">
                      <div className="flex items-center gap-3">
                          <div className="relative">
                              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center">
                                  <Bot className="w-5 h-5 text-emerald-400" />
                              </div>
                              <div className="absolute bottom-0 right-0 w-3 h-3 border-2 border-white bg-green-500 rounded-full" />
                          </div>
                          <div>
                              <h3 className="font-bold text-slate-900 leading-tight">Wiza</h3>
                              <p className="text-xs text-emerald-600 font-medium tracking-wide uppercase">AI Financial Coach</p>
                          </div>
                      </div>
                  </div>

                  {/* Chat Area */}
                  <div className="flex-1 p-5 overflow-y-auto bg-slate-50/30 flex flex-col gap-6 relative">
                      {!hasStarted ? (
                           <div className="h-full flex flex-col items-center justify-center text-center px-6 opacity-60">
                               <Bot className="w-12 h-12 text-slate-300 mb-4" />
                               <p className="text-slate-500 font-medium">Click "Run Simulation" to see Wiza analyze a complex real-world advance request.</p>
                           </div>
                      ) : (
                          <AnimatePresence>
                              {messages.map((msg) => (
                                  <motion.div 
                                      key={msg.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                                  >
                                      <div className={`flex items-end gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-emerald-100' : 'bg-slate-900'}`}>
                                              {msg.role === 'user' ? <User className="w-4 h-4 text-emerald-700" /> : <Bot className="w-4 h-4 text-emerald-400" />}
                                          </div>
                                          
                                          <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                              msg.role === 'user' 
                                                ? 'bg-emerald-600 text-white rounded-br-sm' 
                                                : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm'
                                          }`}>
                                              {msg.isTyping ? (
                                                  <div className="flex gap-1.5 px-2 py-1 relative">
                                                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-current rounded-full opacity-60" />
                                                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-current rounded-full opacity-60" />
                                                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-current rounded-full opacity-60" />
                                                  </div>
                                              ) : (
                                                  // Basic markdown parser for the demo
                                                  msg.content.split('\n').map((line, i) => {
                                                      // Bold text parser
                                                      const parts = line.split(/(\*\*.*?\*\*)/g);
                                                      return (
                                                          <span key={i} className="block mb-2 last:mb-0">
                                                              {parts.map((part, j) => {
                                                                  if (part.startsWith('**') && part.endsWith('**')) {
                                                                      return <strong key={j} className={`font-bold ${msg.role === 'user' ? 'text-white' : 'text-slate-900'}`}>{part.slice(2, -2)}</strong>;
                                                                  }
                                                                  return part;
                                                              })}
                                                          </span>
                                                      );
                                                  })
                                              )}
                                          </div>
                                      </div>
                                  </motion.div>
                              ))}
                              
                              {messages.length === 2 && !isAnimating && (
                                  <motion.div 
                                      initial={{ opacity: 0, scale: 0.9 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: 0.5 }}
                                      className="ml-10 max-w-[85%] bg-emerald-50 border border-emerald-100 p-4 rounded-2xl rounded-bl-sm mt-2"
                                  >
                                      <div className="flex items-center gap-2 mb-3">
                                          <ShieldAlert className="w-4 h-4 text-emerald-600" />
                                          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Advance Pre-Approved</span>
                                      </div>
                                      <div className="bg-white rounded-xl p-3 shadow-sm border border-emerald-100 flex justify-between items-center mb-3">
                                          <span className="text-sm font-semibold text-slate-700">KES 5,500</span>
                                          <span className="text-xs text-slate-400">Fee: KES 150</span>
                                      </div>
                                      <button className="w-full bg-emerald-600 text-white rounded-xl py-2.5 text-sm font-bold shadow-md shadow-emerald-500/20 hover:bg-emerald-500 transition-colors">
                                          Transfer to M-PESA Now
                                      </button>
                                  </motion.div>
                              )}
                          </AnimatePresence>
                      )}
                      <div ref={chatEndRef} />
                  </div>
              </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
