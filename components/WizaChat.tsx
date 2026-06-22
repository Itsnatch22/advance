"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  Minimize2,
  Maximize2,
  RefreshCcw,
  Bot,
  User,
  Sparkles,
  History,
  Trash2,
  Plus,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils/utils";
import {
  useWizaWidgetChat,
  type PublicSession,
} from "@/hooks/useWizaWidgetChat";

type PublicChatPart = {
  type: string;
  text?: string;
};

type PublicChatMessage = {
  id: string;
  role: string;
  content?: string;
  parts?: PublicChatPart[];
  createdAt?: string;
  created_at?: string;
};

function getMessageText(m: PublicChatMessage): string {
  if (m.parts)
    return m.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text ?? "")
      .join("");
  return m.content ?? "";
}

function getMessageTimestamp(message: PublicChatMessage): string | null {
  return message.createdAt ?? message.created_at ?? null;
}

function formatMessageTimestamp(iso: string): string {
  return new Intl.DateTimeFormat("en-KE", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

function formatConversationTimestamp(iso: string): string {
  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

function TypingDots() {
  return (
    <span className="inline-flex h-4 items-center gap-0.75">
      {[0, 0.18, 0.36].map((d) => (
        <motion.span
          key={d}
          className="block h-1.25 w-1.25 rounded-full bg-emerald-500"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 1, delay: d }}
        />
      ))}
    </span>
  );
}

function SessionItem({
  session,
  active,
  onLoad,
  onDelete,
}: {
  session: PublicSession;
  active: boolean;
  onLoad: () => void;
  onDelete: () => void;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div
      className={cn(
        "group relative flex cursor-pointer items-start gap-2.5 rounded-xl px-3 py-2.5 transition-all",
        active
          ? "border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/50"
          : "border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60"
      )}
      onClick={onLoad}
    >
      <MessageSquare
        className={cn(
          "mt-0.5 h-3.5 w-3.5 shrink-0 transition-colors",
          active ? "text-emerald-600" : "text-slate-400"
        )}
      />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-xs leading-tight font-medium",
            active
              ? "text-emerald-700 dark:text-emerald-300"
              : "text-slate-700 dark:text-slate-300"
          )}
        >
          {session.title}
        </p>
        <div className="mt-0.5 flex items-center gap-1.5">
          <Clock className="h-2.5 w-2.5 text-slate-400" />
          <span className="text-[10px] text-slate-400">
            {formatConversationTimestamp(session.created_at)}
          </span>
          <span className="text-[10px] text-slate-300 dark:text-slate-600">
            ·
          </span>
          <span className="text-[10px] text-slate-400">
            {session.message_count} msgs
          </span>
        </div>
      </div>

      {/* Delete */}
      {confirming ? (
        <div
          className="absolute top-2 right-2 flex gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              onDelete();
              setConfirming(false);
            }}
            className="rounded bg-red-500 px-2 py-0.5 text-[10px] font-medium text-white hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300"
          >
            No
          </button>
        </div>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setConfirming(true);
          }}
          className="absolute top-2 right-2 rounded-lg p-1 text-slate-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

export default function WizaChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    sendMessage,
    status,
    error,
    regenerate,
    isLoading,
    sessionId,
    sessions,
    loadingHistory,
    loadSession,
    deleteSession,
    startNewSession,
    refreshSessions,
  } = useWizaWidgetChat();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status, isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen) refreshSessions();
  }, [isOpen, refreshSessions]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const handleSend = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    const text = inputValue;
    setInputValue("");
    if (showHistory) setShowHistory(false);
    try {
      await sendMessage({ text });
    } catch {}
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLoadSession = async (sid: string) => {
    await loadSession(sid);
    setShowHistory(false);
  };

  const CHAT_W = 370;
  const HIST_W = 250;
  const totalW = showHistory ? CHAT_W + HIST_W : CHAT_W;

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, scale: 0.85, y: 24 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              width: isMinimized ? 260 : totalW,
              height: isMinimized ? "auto" : 460,
            }}
            exit={{ opacity: 0, scale: 0.85, y: 24 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="mb-4 flex overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_32px_80px_-12px_rgba(0,0,0,0.18)] dark:border-slate-800 dark:bg-slate-900"
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
                  transition={{ type: "spring", damping: 28, stiffness: 340 }}
                  className="flex flex-col overflow-hidden border-r border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950/50"
                  style={{ width: HIST_W, minWidth: HIST_W }}
                >
                  {/* Sidebar header */}
                  <div className="flex items-center justify-between border-b border-slate-100 px-3.5 py-3 dark:border-slate-800">
                    <span className="text-xs font-semibold tracking-widest text-slate-600 uppercase dark:text-slate-300">
                      History
                    </span>
                    <button
                      onClick={() => {
                        startNewSession();
                        setShowHistory(false);
                      }}
                      className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 transition-colors hover:bg-emerald-700"
                    >
                      <Plus className="h-3 w-3 text-white" />
                      <span className="text-[10px] font-bold tracking-wider text-white uppercase">
                        New
                      </span>
                    </button>
                  </div>

                  {/* Session list */}
                  <div className="flex-1 space-y-1 overflow-y-auto px-2 py-2">
                    {sessions.length === 0 ? (
                      <div className="flex h-32 flex-col items-center justify-center px-4 text-center">
                        <MessageSquare className="mb-2 h-6 w-6 text-slate-300" />
                        <p className="text-[11px] leading-relaxed text-slate-400">
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
            <div
              className="flex min-w-0 flex-1 flex-col"
              style={{ width: CHAT_W }}
            >
              {/* Header */}
              <div className="flex items-center justify-between bg-emerald-700 px-4 py-3 dark:bg-emerald-800">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <Avatar className="h-8 w-8 border-2 border-white/20">
                      <AvatarImage src="/favicon.ico" />
                      <AvatarFallback className="bg-emerald-800 text-xs font-bold text-white">
                        WZ
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full border border-emerald-700 bg-green-400" />
                  </div>
                  <div>
                    <p className="flex items-center gap-1.5 text-sm leading-none font-bold text-white">
                      Wiza Chat
                      <Sparkles className="h-3 w-3 text-emerald-300" />
                    </p>
                    {!isMinimized && (
                      <p className="mt-0.5 text-[10px] font-medium tracking-widest text-emerald-200 uppercase">
                        {isLoading ? "Thinking…" : "Always online"}
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
                        "flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
                        showHistory
                          ? "bg-white/20 text-white"
                          : "text-emerald-200 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <History className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-emerald-200 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {isMinimized ? (
                      <Maximize2 className="h-3.5 w-3.5" />
                    ) : (
                      <Minimize2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <button
                    onClick={toggleChat}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-emerald-200 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* Loading history overlay */}
                  {loadingHistory && (
                    <div className="flex items-center justify-center gap-2 border-b border-emerald-100 bg-emerald-50 py-3 dark:border-emerald-900 dark:bg-emerald-950/30">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" />
                      <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                        Loading conversation…
                      </span>
                    </div>
                  )}

                  {/* Messages */}
                  <div
                    ref={scrollRef}
                    className="flex-1 space-y-4 overflow-y-auto scroll-smooth px-4 py-4"
                  >
                    {messages.map((m) => {
                      const text = getMessageText(m);
                      const timestamp = getMessageTimestamp(m);
                      const isUser = m.role === "user";
                      return (
                        <motion.div
                          key={m.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.18 }}
                          className={cn(
                            "flex",
                            isUser ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "flex max-w-[88%] items-end gap-2",
                              isUser && "flex-row-reverse"
                            )}
                          >
                            <div
                              className={cn(
                                "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg",
                                isUser
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950"
                                  : "bg-slate-900 text-emerald-400 dark:bg-white dark:text-emerald-600"
                              )}
                            >
                              {isUser ? (
                                <User className="h-3 w-3" />
                              ) : (
                                <Bot className="h-3 w-3" />
                              )}
                            </div>
                            <div
                              className={cn(
                                "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                                isUser
                                  ? "rounded-br-sm bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
                                  : "rounded-bl-sm border border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                              )}
                            >
                              <p className="whitespace-pre-wrap">{text}</p>
                              {timestamp && (
                                <p
                                  className={cn(
                                    "mt-2 text-[10px] font-medium",
                                    isUser
                                      ? "text-emerald-50/80"
                                      : "text-slate-400 dark:text-slate-500"
                                  )}
                                >
                                  {formatMessageTimestamp(timestamp)}
                                </p>
                              )}
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
                        <div className="flex max-w-[88%] items-end gap-2">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-emerald-400 dark:bg-white dark:text-emerald-600">
                            <Bot className="h-3 w-3" />
                          </div>
                          <div className="rounded-2xl rounded-bl-sm border border-slate-200 bg-slate-100 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                            <TypingDots />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Error state */}
                    {error && !isLoading && (
                      <div className="flex justify-center">
                        <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 dark:border-red-900 dark:bg-red-950/40">
                          <p className="text-xs text-red-500">
                            Something went wrong.
                          </p>
                          <button
                            onClick={() => regenerate()}
                            className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
                          >
                            <RefreshCcw className="h-2.5 w-2.5" /> Retry
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  <div className="border-t border-slate-100 px-3 pt-2 pb-3 dark:border-slate-800">
                    <form
                      onSubmit={handleSend}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 transition-colors focus-within:border-emerald-400 dark:border-slate-700 dark:bg-slate-800 dark:focus-within:border-emerald-600"
                    >
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message…"
                        disabled={isLoading}
                        className="h-8 flex-1 border-0 bg-transparent px-0 text-sm text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-white"
                      />
                      <button
                        type="submit"
                        disabled={isLoading || !inputValue.trim()}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600 transition-colors hover:bg-emerald-700 disabled:opacity-30"
                      >
                        <Send className="h-3.5 w-3.5 text-white" />
                      </button>
                    </form>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between px-4 pb-2.5">
                    <button
                      onClick={() => {
                        startNewSession();
                        setShowHistory(false);
                      }}
                      className="flex items-center gap-1 text-[9px] font-bold tracking-widest text-slate-400 uppercase transition-colors hover:text-emerald-600"
                    >
                      <RefreshCcw className="h-2 w-2" /> New chat
                    </button>
                    <span className="text-[9px] font-medium text-slate-300 dark:text-slate-600">
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
            "flex h-14 w-14 items-center justify-center rounded-full border-2 shadow-2xl transition-all duration-300",
            isOpen
              ? "border-emerald-100 bg-white text-emerald-700 dark:border-slate-700 dark:bg-slate-800"
              : "border-white/80 bg-emerald-700 text-white hover:bg-emerald-800"
          )}
        >
          {isOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <div className="relative">
              <MessageSquare className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
              </span>
            </div>
          )}
        </button>
      </motion.div>
    </div>
  );
}
