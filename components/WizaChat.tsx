'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, X, Send, Loader2, Minimize2, Maximize2,
  RefreshCcw, Bot, User, Sparkles, History, Trash2,
  Plus, Clock,
} from 'lucide-react';
import { Input }    from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn }       from '@/lib/utils';
import { useWizaPublicChat, type PublicSession } from '@/hooks/useWizaPublicChat';

// ── helpers ───────────────────────────────────────────────────────────────

function getMessageText(m: any): string {
  if (m.parts) return m.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('');
  return m.content ?? '';
}

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60)   return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ── TypingDots ────────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <span className="inline-flex gap-0.75 items-center h-4">
      {[0, 0.18, 0.36].map((d) => (
        <motion.span
          key={d}
          className="block w-1.25 h-1.25 rounded-full bg-emerald-500"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 1, delay: d }}
        />
      ))}
    </span>
  );
}

// ── SessionItem ───────────────────────────────────────────────────────────

function SessionItem({
  session, active, onLoad, onDelete,
}: {
  session:   PublicSession;
  active:    boolean;
  onLoad:    () => void;
  onDelete:  () => void;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div
      className={cn(
        'group relative flex items-start gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all',
        active
          ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800'
          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent',
      )}
      onClick={onLoad}
    >
      <MessageSquare
        className={cn('w-3.5 h-3.5 mt-0.5 shrink-0 transition-colors',
          active ? 'text-emerald-600' : 'text-slate-400')}
      />
      <div className="flex-1 min-w-0">
        <p className={cn('text-xs font-medium truncate leading-tight',
          active ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300')}>
          {session.title}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Clock className="w-2.5 h-2.5 text-slate-400" />
          <span className="text-[10px] text-slate-400">{timeAgo(session.updated_at)}</span>
          <span className="text-[10px] text-slate-300 dark:text-slate-600">·</span>
          <span className="text-[10px] text-slate-400">{session.message_count} msgs</span>
        </div>
      </div>

      {/* Delete */}
      {confirming ? (
        <div className="flex gap-1 absolute right-2 top-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => { onDelete(); setConfirming(false); }}
            className="px-2 py-0.5 rounded text-[10px] bg-red-500 text-white font-medium hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="px-2 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium"
          >
            No
          </button>
        </div>
      ) : (
        <button
          onClick={(e) => { e.stopPropagation(); setConfirming(true); }}
          className="opacity-0 group-hover:opacity-100 absolute right-2 top-2 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500 transition-all"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────

export default function WizaChat() {
  const [isOpen,      setIsOpen]      = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [inputValue,  setInputValue]  = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    messages, sendMessage, status, error, regenerate, setMessages,
    isLoading, sessionId, sessions, loadingHistory,
    loadSession, deleteSession, startNewSession, refreshSessions,
  } = useWizaPublicChat();

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status, isOpen, isMinimized]);

  // Refresh session list whenever chat opens
  useEffect(() => {
    if (isOpen) refreshSessions();
  }, [isOpen]);

  const toggleChat = () => { setIsOpen(!isOpen); setIsMinimized(false); };

  const handleSend = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    const text = inputValue;
    setInputValue('');
    if (showHistory) setShowHistory(false);
    try { await sendMessage({ text }); } catch {}
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleLoadSession = async (sid: string) => {
    await loadSession(sid);
    setShowHistory(false);
  };

  const CHAT_W = 370;
  const HIST_W = 250;
  const totalW = showHistory ? CHAT_W + HIST_W : CHAT_W;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, scale: 0.85, y: 24 }}
            animate={{
              opacity: 1, scale: 1, y: 0,
              width:  isMinimized ? 260 : totalW,
              height: isMinimized ? 'auto' : 460,
            }}
            exit={{ opacity: 0, scale: 0.85, y: 24 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="mb-4 overflow-hidden rounded-[22px] shadow-[0_32px_80px_-12px_rgba(0,0,0,0.18)] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex"
            style={{ minWidth: isMinimized ? 260 : CHAT_W }}
          >

            {/* ── History sidebar ── */}
            <AnimatePresence>
              {showHistory && !isMinimized && (
                <motion.div
                  key="sidebar"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: HIST_W, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ type: 'spring', damping: 28, stiffness: 340 }}
                  className="overflow-hidden border-r border-slate-100 dark:border-slate-800 flex flex-col bg-slate-50/70 dark:bg-slate-950/50"
                  style={{ width: HIST_W, minWidth: HIST_W }}
                >
                  {/* Sidebar header */}
                  <div className="flex items-center justify-between px-3.5 py-3 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                      History
                    </span>
                    <button
                      onClick={() => { startNewSession(); setShowHistory(false); }}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-colors"
                    >
                      <Plus className="w-3 h-3 text-white" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">New</span>
                    </button>
                  </div>

                  {/* Session list */}
                  <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
                    {sessions.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-32 text-center px-4">
                        <MessageSquare className="w-6 h-6 text-slate-300 mb-2" />
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Your past conversations will appear here.
                        </p>
                      </div>
                    ) : (
                      sessions.map((s) => (
                        <SessionItem
                          key={s.id}
                          session={s}
                          active={s.id === sessionId}
                          onLoad={() => handleLoadSession(s.id)}
                          onDelete={() => deleteSession(s.id)}
                        />
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Main chat panel ── */}
            <div className="flex flex-col flex-1 min-w-0" style={{ width: CHAT_W }}>

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-emerald-700 dark:bg-emerald-800">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <Avatar className="h-8 w-8 border-2 border-white/20">
                      <AvatarImage src="/favicon.ico" />
                      <AvatarFallback className="bg-emerald-800 text-xs text-white font-bold">WZ</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-400 border border-emerald-700" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white flex items-center gap-1.5 leading-none">
                      Wiza Chat<Sparkles className="h-3 w-3 text-emerald-300" />
                    </p>
                    {!isMinimized && (
                      <p className="text-[10px] text-emerald-200 mt-0.5 uppercase tracking-widest font-medium">
                        {isLoading ? 'Thinking…' : 'Always online'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-0.5">
                  {!isMinimized && (
                    <button
                      onClick={() => setShowHistory(!showHistory)}
                      title="Conversation history"
                      className={cn(
                        'h-7 w-7 flex items-center justify-center rounded-lg transition-colors',
                        showHistory
                          ? 'bg-white/20 text-white'
                          : 'text-emerald-200 hover:bg-white/10 hover:text-white',
                      )}
                    >
                      <History className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="h-7 w-7 flex items-center justify-center rounded-lg text-emerald-200 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    {isMinimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={toggleChat}
                    className="h-7 w-7 flex items-center justify-center rounded-lg text-emerald-200 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* Loading history overlay */}
                  {loadingHistory && (
                    <div className="flex items-center justify-center gap-2 py-3 bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" />
                      <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">Loading conversation…</span>
                    </div>
                  )}

                  {/* Messages */}
                  <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth"
                  >
                    {messages.map((m) => {
                      const text = getMessageText(m);
                      const isUser = m.role === 'user';
                      return (
                        <motion.div
                          key={m.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.18 }}
                          className={cn('flex', isUser ? 'justify-end' : 'justify-start')}
                        >
                          <div className={cn('flex items-end gap-2 max-w-[88%]', isUser && 'flex-row-reverse')}>
                            <div className={cn(
                              'w-6 h-6 rounded-lg flex items-center justify-center shrink-0',
                              isUser
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700'
                                : 'bg-slate-900 dark:bg-white text-emerald-400 dark:text-emerald-600',
                            )}>
                              {isUser ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                            </div>
                            <div className={cn(
                              'px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
                              isUser
                                ? 'bg-emerald-600 text-white rounded-br-sm shadow-sm shadow-emerald-500/20'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-sm border border-slate-200 dark:border-slate-700',
                            )}>
                              <p className="whitespace-pre-wrap">{text}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* Thinking indicator */}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="flex items-end gap-2 max-w-[88%]">
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 bg-slate-900 dark:bg-white text-emerald-400 dark:text-emerald-600">
                            <Bot className="h-3 w-3" />
                          </div>
                          <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            <TypingDots />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Error state */}
                    {error && !isLoading && (
                      <div className="flex justify-center">
                        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 rounded-xl">
                          <p className="text-xs text-red-500">Something went wrong.</p>
                          <button
                            onClick={() => regenerate()}
                            className="text-xs text-red-600 font-semibold flex items-center gap-1 hover:underline"
                          >
                            <RefreshCcw className="h-2.5 w-2.5" /> Retry
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  <div className="px-3 pb-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <form
                      onSubmit={handleSend}
                      className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-1.5 border border-slate-200 dark:border-slate-700 focus-within:border-emerald-400 dark:focus-within:border-emerald-600 transition-colors"
                    >
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message…"
                        disabled={isLoading}
                        className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm h-8 px-0 text-slate-900 dark:text-white placeholder:text-slate-400"
                      />
                      <button
                        type="submit"
                        disabled={isLoading || !inputValue.trim()}
                        className="h-7 w-7 flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 transition-colors shrink-0"
                      >
                        <Send className="h-3.5 w-3.5 text-white" />
                      </button>
                    </form>
                  </div>

                  {/* Footer */}
                  <div className="px-4 pb-2.5 flex justify-between items-center">
                    <button
                      onClick={() => { startNewSession(); setShowHistory(false); }}
                      className="text-[9px] text-slate-400 hover:text-emerald-600 transition-colors uppercase font-bold tracking-widest flex items-center gap-1"
                    >
                      <RefreshCcw className="h-2 w-2" /> New chat
                    </button>
                    <span className="text-[9px] text-slate-300 dark:text-slate-600 font-medium">
                      Powered by EaziWage
                    </span>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}>
        <button
          onClick={toggleChat}
          className={cn(
            'h-14 w-14 rounded-full shadow-2xl flex items-center justify-center border-2 transition-all duration-300',
            isOpen
              ? 'bg-white dark:bg-slate-800 text-emerald-700 border-emerald-100 dark:border-slate-700'
              : 'bg-emerald-700 text-white border-white/80 hover:bg-emerald-800',
          )}
        >
          {isOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <div className="relative">
              <MessageSquare className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400" />
              </span>
            </div>
          )}
        </button>
      </motion.div>
    </div>
  );
}