'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, User, Send, RefreshCcw, FileText,
  CheckCircle2, AlertTriangle, Sparkles,
} from 'lucide-react';
import { useWizaChat } from '@/hooks/useWizaChat';

// ── Markdown renderer — handles **bold** in AI responses ──────────────────
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, i) => {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <span key={i} className="block last:mb-0 mb-1.5">
            {parts.map((p, j) =>
              p.startsWith('**') && p.endsWith('**')
                ? <strong key={j} className="font-semibold">{p.slice(2, -2)}</strong>
                : p
            )}
          </span>
        );
      })}
    </>
  );
}

// ── Animated typing cursor ────────────────────────────────────────────────
function TypingCursor() {
  return (
    <span className="inline-flex gap-1 ml-1 translate-y-0.5">
      {[0, 0.15, 0.3].map(delay => (
        <motion.span
          key={delay}
          className="block w-1 h-1 rounded-full bg-current opacity-50"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1, delay }}
        />
      ))}
    </span>
  );
}

// ── Summary modal ─────────────────────────────────────────────────────────
function SummaryModal({
  onConfirm, onCancel,
}: {
  onConfirm: () => void;
  onCancel:  () => void;
}) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm rounded-[2.5rem]">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1,   opacity: 1 }}
        className="mx-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl"
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center mb-4">
          <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
          Send session summary?
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
          Wiza will generate a summary of this conversation with key advice, numbers, and next steps — then send it to your preferred channel.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Yes, send it
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function WizaHeroPreview() {
  const { messages, streaming, error, sendMessage, requestSummary, newSession } = useWizaChat();

  const [input,        setInput]        = useState('');
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryStatus,    setSummaryStatus]    = useState<string | null>(null);

  const chatEndRef   = useRef<HTMLDivElement>(null);
  const inputRef     = useRef<HTMLInputElement>(null);
  const textareaLike = input.length > 60;

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || streaming) return;
    const text = input;
    setInput('');
    await sendMessage(text);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSummaryConfirm = async () => {
    setShowSummaryModal(false);
    const msg = await requestSummary();
    setSummaryStatus(msg);
    setTimeout(() => setSummaryStatus(null), 4000);
  };

  const isEmpty = messages.length === 0;

  return (
    <section className="py-24 relative overflow-hidden bg-white dark:bg-slate-950">

      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-125 h-125 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-100 h-100 bg-teal-50/60 dark:bg-teal-950/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* ── Left: copy ─────────────────────────────────────────────── */}
          <div className="relative z-10 lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center mb-8"
            >
              <Sparkles className="w-7 h-7 text-emerald-400 dark:text-emerald-600" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-5"
            >
              Meet Wiza.{' '}
              <br />
              Your AI Financial{' '}
              <span className="text-emerald-600 dark:text-emerald-400">Coach.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-lg leading-relaxed"
            >
              Wiza doesn't just process transactions — she builds financial resilience.
              Real-time token streaming. Every conversation saved. Opt-in summaries
              delivered to your inbox or phone.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.14 }}
              className="space-y-3"
            >
              {[
                'Affordability analysis before every advance',
                'Full conversation history via Supabase',
                'Token-streamed answers — no waiting',
                'Session summaries sent by email or SMS',
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 text-sm">{f}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: chat terminal ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative w-full bg-white dark:bg-slate-900 rounded-4xl border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-900/10 flex flex-col"
              style={{ minHeight: 580 }}
            >

              {/* Summary modal overlay */}
              <AnimatePresence>
                {showSummaryModal && (
                  <SummaryModal
                    onConfirm={handleSummaryConfirm}
                    onCancel={() => setShowSummaryModal(false)}
                  />
                )}
              </AnimatePresence>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center">
                      <Bot className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white leading-none mb-0.5">
                      Wiza
                    </p>
                    <div className="flex items-center gap-1.5">
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                        animate={{ opacity: streaming ? [1, 0.4, 1] : 1 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      />
                      <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                        {streaming ? 'Thinking…' : 'Ready'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {messages.length > 0 && !streaming && (
                    <button
                      onClick={() => setShowSummaryModal(true)}
                      title="Get session summary"
                      className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-emerald-600"
                    >
                      <FileText size={16} />
                    </button>
                  )}
                  <button
                    onClick={newSession}
                    title="New conversation"
                    className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400"
                  >
                    <RefreshCcw size={16} />
                  </button>
                </div>
              </div>

              {/* Summary status toast */}
              <AnimatePresence>
                {summaryStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mx-4 mt-3 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950 rounded-xl flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">{summaryStatus}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 scroll-smooth">
                {isEmpty ? (
                  <div className="h-full min-h-80 flex flex-col items-center justify-center text-center px-8">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-5">
                      <Bot className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                    </div>
                    <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-2">
                      How can Wiza help you today?
                    </h4>
                    <p className="text-sm text-slate-400 dark:text-slate-500 leading-relaxed mb-6">
                      Ask about an advance, get a budget check, or request a spending review.
                    </p>
                    {/* Quick-start prompts */}
                    <div className="w-full space-y-2">
                      {[
                        'Is a KES 5,000 advance safe right now?',
                        'Review my upcoming bills',
                        'How is my financial health score?',
                      ].map(prompt => (
                        <button
                          key={prompt}
                          onClick={() => sendMessage(prompt)}
                          className="w-full text-left px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:border-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {messages.map(msg => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-end gap-2.5 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                          {/* Avatar */}
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            msg.role === 'user'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                              : 'bg-slate-900 dark:bg-white text-emerald-400 dark:text-emerald-600'
                          }`}>
                            {msg.role === 'user'
                              ? <User size={14} />
                              : <Bot size={14} />
                            }
                          </div>

                          {/* Bubble */}
                          <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-emerald-600 text-white rounded-br-sm'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-sm'
                          }`}>
                            {msg.pending && !msg.content
                              ? <TypingCursor />
                              : (
                                <>
                                  <RichText text={msg.content} />
                                  {msg.pending && <TypingCursor />}
                                </>
                              )
                            }
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}

                {/* Error banner */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-950/50 rounded-xl border border-red-100 dark:border-red-900"
                    >
                      <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask Wiza anything…"
                    disabled={streaming}
                    className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-transparent focus:border-emerald-400 dark:focus:border-emerald-600 focus:outline-none transition-colors disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={streaming || !input.trim()}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-emerald-600 dark:hover:bg-emerald-500 dark:hover:text-white transition-colors disabled:opacity-30 shrink-0"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}