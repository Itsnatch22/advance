"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  User,
  Send,
  RefreshCcw,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Mail,
  MessageSquare,
  MessagesSquare,
  ChevronLeft,
} from "lucide-react";
import { useWizaCoachChat, type DeliveryChannel } from "@/hooks/useWizaCoachChat";

function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <span key={i} className="mb-1.5 block last:mb-0">
            {parts.map((p, j) =>
              p.startsWith("**") && p.endsWith("**") ? (
                <strong key={j} className="font-semibold">
                  {p.slice(2, -2)}
                </strong>
              ) : (
                p
              )
            )}
          </span>
        );
      })}
    </>
  );
}

function TypingCursor() {
  return (
    <span className="ml-1 inline-flex translate-y-0.5 gap-1">
      {[0, 0.15, 0.3].map((delay) => (
        <motion.span
          key={delay}
          className="block h-1 w-1 rounded-full bg-current opacity-50"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1, delay }}
        />
      ))}
    </span>
  );
}

function formatMessageTimestamp(iso: string) {
  return new Intl.DateTimeFormat("en-KE", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

function formatConversationTimestamp(iso: string) {
  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

const CHANNEL_OPTIONS: {
  id: DeliveryChannel;
  label: string;
  desc: string;
  Icon: React.ElementType;
}[] = [
  {
    id: "chat",
    label: "Show in chat",
    desc: "Display summary inline here",
    Icon: MessagesSquare,
  },
  {
    id: "email",
    label: "Send to email",
    desc: "Get a formatted email recap",
    Icon: Mail,
  },
  {
    id: "sms",
    label: "Send via SMS",
    desc: "Receive a concise text message",
    Icon: MessageSquare,
  },
];

function SummaryModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: (channel: DeliveryChannel, address?: string) => void;
  onCancel: () => void;
}) {
  const [step, setStep] = React.useState<"channel" | "address">("channel");
  const [channel, setChannel] = React.useState<DeliveryChannel | null>(null);
  const [address, setAddress] = React.useState("");

  const isEmail = channel === "email";
  const isSms = channel === "sms";

  function handleChannelPick(ch: DeliveryChannel) {
    if (ch === "chat") {
      onConfirm("chat");
      return;
    }
    setChannel(ch);
    setStep("address");
  }

  function handleAddressSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!channel) return;
    onConfirm(channel, address.trim() || undefined);
  }

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center rounded-[2.5rem] bg-white/80 backdrop-blur-sm dark:bg-slate-950/80">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mx-6 w-full max-w-xs rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900"
      >
        <AnimatePresence mode="wait">
          {step === "channel" ? (
            <motion.div
              key="channel"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950">
                <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="mb-1 font-semibold text-slate-900 dark:text-white">
                Where should Wiza send your summary?
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Choose how you'd like to receive the key advice, numbers, and
                next steps from this session.
              </p>
              <div className="space-y-2">
                {CHANNEL_OPTIONS.map(({ id, label, desc, Icon }) => (
                  <button
                    key={id}
                    onClick={() => handleChannelPick(id)}
                    className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition-colors hover:border-emerald-400 hover:bg-emerald-50/50 dark:border-slate-700 dark:hover:border-emerald-600 dark:hover:bg-emerald-950/30"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                      <Icon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {label}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={onCancel}
                className="mt-4 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="address"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
            >
              <button
                onClick={() => setStep("channel")}
                className="mb-4 flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Back
              </button>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950">
                {isEmail ? (
                  <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <MessageSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                )}
              </div>
              <h3 className="mb-1 font-semibold text-slate-900 dark:text-white">
                {isEmail ? "Where should we email it?" : "What's your phone number?"}
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {isEmail
                  ? "Enter your email and we'll send a full formatted recap."
                  : "Include your country code — e.g. +254 712 345 678 for Kenya."}
              </p>
              <form onSubmit={handleAddressSubmit} className="space-y-3">
                <input
                  type={isEmail ? "email" : "tel"}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={isEmail ? "you@example.com" : "+254 712 345 678"}
                  autoFocus
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-600"
                />
                {isSms && (
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    SMS format: key numbers + next steps, under 480 characters.
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-slate-900 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-slate-900"
                  >
                    Send summary
                  </button>
                  <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default function Wiza() {
  const {
    messages,
    streaming,
    error,
    sendMessage,
    requestSummary,
    newSession,
  } = useWizaCoachChat();

  const [input, setInput] = useState("");
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryStatus, setSummaryStatus] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messages.length === 0) return;
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || streaming) return;
    const text = input;
    setInput("");
    await sendMessage(text);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSummaryConfirm = async (channel: DeliveryChannel, address?: string) => {
    setShowSummaryModal(false);
    const msg = await requestSummary(channel, address);
    setSummaryStatus(msg);
    setTimeout(() => setSummaryStatus(null), 4000);
  };

  const isEmpty = messages.length === 0;
  const conversationStartedAt = messages[0]?.createdAt ?? null;

  return (
    <section className="relative overflow-hidden bg-white py-24 dark:bg-slate-950">
      {/* Subtle background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-0 h-125 w-125 rounded-full bg-emerald-50/60 blur-[140px] dark:bg-emerald-950/30" />
        <div className="absolute bottom-0 left-0 h-100 w-100 rounded-full bg-teal-50/60 blur-[120px] dark:bg-teal-950/20" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-start gap-16 lg:grid-cols-2 lg:gap-24">
          {/* ── Left: copy ─────────────────────────────────────────────── */}
          <div className="relative z-10 lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 dark:bg-white"
            >
              <Sparkles className="h-7 w-7 text-emerald-400 dark:text-emerald-600" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-5 font-serif text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white"
            >
              Meet Wiza. <br />
              Your AI Financial{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                Coach.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="mb-10 max-w-lg text-lg leading-relaxed text-slate-600 dark:text-slate-400"
            >
              Instant calculations. Playful insights. Real talk about your
              money. Wiza turns salary questions into interactive financial
              stories — no lecture required.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.16 }}
              className="grid gap-4"
            >
              {[
                {
                  label: "Instant Calculations",
                  desc: "Daily earning rate, mid-month cash availability, advance limits — all in milliseconds.",
                },
                {
                  label: "Playful Commentary",
                  desc: "Future you might have opinions about this latte budget. Let's run the numbers.",
                },
                {
                  label: "No Auth Required",
                  desc: "Anyone can try Wiza, no authentication required.",
                },
              ].map(({ label, desc }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.24 + i * 0.08 }}
                  className="flex gap-3"
                >
                  <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  <div>
                    <h4 className="mb-0.5 text-sm font-semibold text-slate-900 dark:text-white">
                      {label}
                    </h4>
                    <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      {desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: chat widget ────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.32 }}
            className="relative flex h-168 flex-col overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Summary modal overlay */}
            {showSummaryModal && (
              <SummaryModal
                onConfirm={handleSummaryConfirm}
                onCancel={() => setShowSummaryModal(false)}
              />
            )}

            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 dark:bg-white">
                    <Bot className="h-5 w-5 text-emerald-400 dark:text-emerald-600" />
                  </div>
                  <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" />
                </div>
                <div>
                  <p className="mb-0.5 text-sm leading-none font-semibold text-slate-900 dark:text-white">
                    Wiza
                  </p>
                  <div className="flex items-center gap-1.5">
                    <motion.span
                      className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                      animate={{ opacity: streaming ? [1, 0.4, 1] : 1 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                    {conversationStartedAt && (
                      <>
                        <span className="text-[10px] text-slate-300 dark:text-slate-600">
                          ·
                        </span>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          Started{" "}
                          {formatConversationTimestamp(conversationStartedAt)}
                        </p>
                      </>
                    )}
                    <p className="text-[10px] font-semibold tracking-widest text-emerald-600 uppercase dark:text-emerald-400">
                      {streaming ? "Thinking…" : "Ready"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {messages.length > 0 && !streaming && (
                  <button
                    onClick={() => setShowSummaryModal(true)}
                    title="Get session summary"
                    className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-emerald-600 dark:hover:bg-slate-800"
                  >
                    <FileText size={16} />
                  </button>
                )}
                <button
                  onClick={newSession}
                  title="New conversation"
                  className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
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
                  className="mx-4 mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 dark:bg-emerald-950"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">
                    {summaryStatus}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto scroll-smooth px-5 py-5">
              {isEmpty ? (
                <div className="flex h-full min-h-80 flex-col items-center justify-center px-8 text-center">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800">
                    <Bot className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                  </div>
                  <h4 className="mb-2 text-base font-semibold text-slate-800 dark:text-slate-200">
                    How can Wiza help you today?
                  </h4>
                  <p className="mb-6 text-sm leading-relaxed text-slate-400 dark:text-slate-500">
                    Try me! Ask about salary breakdowns, budget tips, or
                    spending habits.
                  </p>
                  {/* Quick-start prompts */}
                  <div className="w-full space-y-2">
                    {[
                      "How much of my salary can I access right now?",
                      "Help me survive till payday",
                      "Is it safe to request an advance today?",
                    ].map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => sendMessage(prompt)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-left text-sm text-slate-600 transition-all hover:border-emerald-400 hover:bg-emerald-50/50 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex max-w-[85%] items-end gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                      >
                        {/* Avatar */}
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                            msg.role === "user"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                              : "bg-slate-900 text-emerald-400 dark:bg-white dark:text-emerald-600"
                          }`}
                        >
                          {msg.role === "user" ? (
                            <User size={14} />
                          ) : (
                            <Bot size={14} />
                          )}
                        </div>

                        {/* Bubble */}
                        <div
                          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "rounded-br-sm bg-emerald-600 text-white"
                              : "rounded-bl-sm border border-slate-100 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                          }`}
                        >
                          {msg.pending && !msg.content ? (
                            <TypingCursor />
                          ) : (
                            <>
                              <RichText text={msg.content} />
                              {msg.pending && <TypingCursor />}
                            </>
                          )}
                          <p
                            className={`mt-2 text-[10px] font-medium ${
                              msg.role === "user"
                                ? "text-emerald-50/80"
                                : "text-slate-400 dark:text-slate-500"
                            }`}
                          >
                            {formatMessageTimestamp(msg.createdAt)}
                          </p>
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
                    className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 dark:border-red-900 dark:bg-red-950/50"
                  >
                    <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-100 px-4 pt-2 pb-4 dark:border-slate-800">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Wiza anything…"
                  disabled={streaming}
                  className="flex-1 rounded-xl border border-transparent bg-slate-50 px-4 py-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none disabled:opacity-50 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-600"
                />
                <button
                  type="submit"
                  disabled={streaming || !input.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white transition-colors hover:bg-emerald-600 disabled:opacity-30 dark:bg-white dark:text-slate-900 dark:hover:bg-emerald-500 dark:hover:text-white"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
