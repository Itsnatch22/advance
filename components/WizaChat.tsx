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
  ChevronLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils/utils";
import {
  useWizaChat,
  type PublicSession,
  type AttachmentData,
} from "@/hooks/useWizaChat";
import { VoiceButton } from "@/components/shared/VoiceButton";
import {
  FileAttachButton,
  FilePreview,
  type AttachedFile,
} from "@/components/shared/FileAttachButton";
import { GifPicker, type GifResult } from "@/components/shared/GifPicker";

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

function MessageContent({ text }: { text: string }) {
  if (text.startsWith("__gif__")) {
    const url = text.slice("__gif__".length);
    return (
      <img
        src={url}
        alt="GIF"
        className="max-h-36 max-w-full rounded-xl object-contain"
        loading="lazy"
      />
    );
  }
  const clean = text.replace(/\n?__ESCALATE__\s*$/m, "").trim();
  return <p className="whitespace-pre-wrap">{clean}</p>;
}

function EscalateForm({
  query,
  onDone,
}: {
  query: string;
  onDone: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSending(true);
    setErr(false);
    try {
      const res = await fetch("/api/escalate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), query }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
      setTimeout(onDone, 3000);
    } catch {
      setErr(true);
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 dark:border-emerald-800 dark:bg-emerald-950/40">
        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          ✓ Sent! Our team will reply to {email} shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative mt-2 space-y-2 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 dark:border-slate-700 dark:bg-slate-800/60"
    >
      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
        Leave your details and our support team will follow up:
      </p>
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white"
      />
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white"
      />
      {err && (
        <p className="text-[10px] text-red-500">
          Failed to send. Please try again.
        </p>
      )}
      <button
        type="submit"
        disabled={sending || !name.trim() || !email.trim()}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-600 py-1.5 text-xs font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-40"
      >
        {sending ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Send className="h-3 w-3" />
        )}
        {sending ? "Sending…" : "Send to support"}
      </button>
    </form>
  );
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
  const [isMobile, setIsMobile] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [attachment, setAttachment] = useState<AttachedFile | null>(null);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [escalatedMsgId, setEscalatedMsgId] = useState<string | null>(null);
  const [escalateDismissed, setEscalateDismissed] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");
    const updateMobile = () => setIsMobile(mediaQuery.matches);

    updateMobile();
    mediaQuery.addEventListener("change", updateMobile);
    return () => mediaQuery.removeEventListener("change", updateMobile);
  }, []);

  const {
    messages,
    sendMessage,
    streaming,
    error,
    regenerate,
    sessionId,
    sessions = [],
    loadingHistory,
    loadSession,
    deleteSession,
    newSession,
    refreshSessions,
  } = useWizaChat({ mode: "widget" });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streaming, isOpen, isMinimized]);

  useEffect(() => {
    if (!streaming) {
      const last = messages[messages.length - 1];
      if (last && last.role !== "user") {
        const text = getMessageText(last);
        if (text.includes("__ESCALATE__")) {
          setEscalatedMsgId(last.id);
          setEscalateDismissed(false);
        }
      }
    }
  }, [messages, streaming]);

  useEffect(() => {
    if (isOpen) refreshSessions?.();
  }, [isOpen, refreshSessions]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const handleSend = async (e?: FormEvent) => {
    e?.preventDefault();
    if ((!inputValue.trim() && !attachment) || streaming) return;
    const text = inputValue;
    const file = attachment;
    setInputValue("");
    setAttachment(null);
    setShowGifPicker(false);
    if (showHistory) setShowHistory(false);
    const att: AttachmentData | undefined = file
      ? { mimeType: file.mimeType, base64: file.base64 }
      : undefined;
    try {
      await sendMessage(text, att);
    } catch {}
  };

  const handleGifSelect = async (gif: GifResult) => {
    setShowGifPicker(false);
    try {
      await sendMessage(`__gif__${gif.url}`);
    } catch {}
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLoadSession = async (sid: string) => {
    await loadSession?.(sid);
    setShowHistory(false);
  };

  const CHAT_W = 370;
  const HIST_W = 250;
  const totalW = showHistory && !isMobile ? CHAT_W + HIST_W : CHAT_W;

  return (
    <div className="fixed right-2 bottom-2 z-50 flex flex-col items-end select-none sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, scale: 0.85, y: 24 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              width: isMobile
                ? "calc(100vw - 1rem)"
                : isMinimized
                  ? 260
                  : totalW,
              height: isMinimized
                ? "auto"
                : isMobile
                  ? "min(460px, calc(100dvh - 5.5rem))"
                  : 460,
            }}
            exit={{ opacity: 0, scale: 0.85, y: 24 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className={cn(
              "mb-2 flex max-h-[calc(100dvh-5.5rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_32px_80px_-12px_rgba(0,0,0,0.18)] sm:mb-4 sm:rounded-[22px] dark:border-slate-800 dark:bg-slate-900",
              isMobile && showHistory ? "flex-col" : "flex-row"
            )}
            style={{
              minWidth: isMobile ? 0 : isMinimized ? 260 : CHAT_W,
              maxWidth: isMobile ? "calc(100vw - 1rem)" : undefined,
            }}
          >
            {/* ── History sidebar ── */}
            <AnimatePresence>
              {showHistory && !isMinimized && (
                <motion.div
                  key="sidebar"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: isMobile ? "100%" : HIST_W, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ type: "spring", damping: 28, stiffness: 340 }}
                  className="flex min-h-0 flex-col overflow-hidden border-r border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950/50"
                  style={{
                    width: isMobile ? "100%" : HIST_W,
                    minWidth: isMobile ? 0 : HIST_W,
                    height: isMobile ? "100%" : undefined,
                  }}
                >
                  {/* Sidebar header */}
                  <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-3.5 py-3 dark:border-slate-800">
                    <span className="text-xs font-semibold tracking-widest text-slate-600 uppercase dark:text-slate-300">
                      History
                    </span>
                    <div className="flex items-center gap-2">
                      {isMobile && (
                        <button
                          onClick={() => setShowHistory(false)}
                          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                          Chat
                        </button>
                      )}
                      <button
                        onClick={() => {
                          newSession();
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
                  </div>

                  {/* Session list */}
                  <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 py-2">
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
                          onDelete={() => deleteSession?.(s.id)}
                        />
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Main chat panel ── */}
            <div
              className={cn(
                "flex min-h-0 min-w-0 flex-1 flex-col",
                isMobile && showHistory && "hidden"
              )}
              style={{ width: isMobile ? "100%" : CHAT_W }}
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
                        {streaming ? "Thinking…" : "Always online"}
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
                    className="min-h-0 flex-1 space-y-4 overflow-y-auto scroll-smooth px-3 py-3 sm:px-4 sm:py-4"
                  >
                    {messages.map((m) => {
                      const text = getMessageText(m);
                      const timestamp = getMessageTimestamp(m);
                      const isUser = m.role === "user";
                      const isEscalateMsg = m.id === escalatedMsgId;
                      const userQuery = isEscalateMsg
                        ? getMessageText(messages[messages.indexOf(m) - 1] ?? m)
                        : "";
                      return (
                        <motion.div
                          key={m.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.18 }}
                          className={cn(
                            "flex flex-col",
                            isUser ? "items-end" : "items-start"
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
                                "min-w-0 rounded-2xl px-3 py-2.5 text-sm leading-relaxed [overflow-wrap:anywhere] break-words",
                                isUser
                                  ? "rounded-br-sm bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
                                  : "rounded-bl-sm border border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                              )}
                            >
                              <MessageContent text={text} />
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

                          {isEscalateMsg && !escalateDismissed && (
                            <div className="mt-1 w-[88%]">
                              <EscalateForm
                                query={userQuery}
                                onDone={() => setEscalateDismissed(true)}
                              />
                            </div>
                          )}
                        </motion.div>
                      );
                    })}

                    {/* Thinking indicator */}
                    {streaming && (
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
                    {error && !streaming && (
                      <div className="flex justify-center">
                        <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 dark:border-red-900 dark:bg-red-950/40">
                          <p className="text-xs text-red-500">
                            Something went wrong.
                          </p>
                          <button
                            onClick={() => regenerate?.()}
                            className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
                          >
                            <RefreshCcw className="h-2.5 w-2.5" /> Retry
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  <div className="shrink-0 border-t border-slate-100 px-2 pt-2 pb-2 sm:px-3 sm:pb-3 dark:border-slate-800">
                    {/* File preview */}
                    {attachment && (
                      <div className="mb-2">
                        <FilePreview
                          file={attachment}
                          onRemove={() => setAttachment(null)}
                        />
                      </div>
                    )}

                    {/* GIF picker */}
                    <div className="relative">
                      <AnimatePresence>
                        {showGifPicker && (
                          <GifPicker
                            onSelect={handleGifSelect}
                            onClose={() => setShowGifPicker(false)}
                            position="above"
                          />
                        )}
                      </AnimatePresence>
                    </div>

                    <form
                      onSubmit={handleSend}
                      className="relative flex min-w-0 items-center gap-1 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 px-1.5 py-1 transition-colors focus-within:border-emerald-400 sm:gap-1.5 sm:px-2 dark:border-slate-700 dark:bg-slate-800 dark:focus-within:border-emerald-600"
                    >
                      <FileAttachButton
                        onFile={setAttachment}
                        disabled={streaming}
                        className="h-7 w-7 shrink-0"
                      />
                      <button
                        type="button"
                        onClick={() => setShowGifPicker((v) => !v)}
                        disabled={streaming}
                        title="Send a GIF"
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:text-emerald-600 disabled:opacity-40"
                      >
                        <span className="text-[9px] font-bold tracking-tight">
                          GIF
                        </span>
                      </button>
                      <VoiceButton
                        onTranscript={(t) =>
                          setInputValue((prev) => (prev ? `${prev} ${t}` : t))
                        }
                        disabled={streaming}
                        className="h-7 w-7 shrink-0"
                      />
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={
                          attachment ? "Add a caption…" : "Type a message…"
                        }
                        disabled={streaming}
                        className="h-8 min-w-0 flex-1 border-0 bg-transparent px-0 text-xs text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-sm dark:text-white"
                      />
                      <button
                        type="submit"
                        disabled={
                          streaming || (!inputValue.trim() && !attachment)
                        }
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600 transition-colors hover:bg-emerald-700 disabled:opacity-30"
                      >
                        <Send className="h-3.5 w-3.5 text-white" />
                      </button>
                    </form>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between px-3 pb-2.5 sm:px-4">
                    <button
                      onClick={() => {
                        newSession();
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
