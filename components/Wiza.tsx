"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

/**
 * WizaChat - Minimal floating chat widget
 * - Reads suggestions from `/api/wiza/suggestions` (optional)
 * - Posts user messages to /api/wiza (POST { q: string })
 * - Expects { found: boolean, answer: string, source?: string, fallbackEmail?: string }
 *
 * Drop into `app/layout.tsx` as <WizaChat /> so it's global.
 */

export default function WizaChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<
    { from: "wiza" | "user" | "system"; text: string }[]
  >([
    {
      from: "wiza",
      text: "Hey 👋 I’m Wiza — ask me about EaziWage policies, ethics, or how things work. If I’m stuck, I’ll help you send a support request.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, open]);

  const sendMessage = async () => {
    const q = input.trim();
    if (!q) return;
    setMessages((m) => [...m, { from: "user", text: q }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/wiza", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q }),
      });

      const data = await res.json();
      // Simulate typing based on response length
      const fakeTypingMs = Math.min(
        Math.max(data.answer.length * 12, 500),
        1800
      );

      // show typing indicator briefly
      setTimeout(() => {
        setIsTyping(false);
        if (data.found) {
          setMessages((m) => [...m, { from: "wiza", text: data.answer }]);
          if (data.source) {
            setMessages((m) => [
              ...m,
              { from: "system", text: `Source: ${data.source}` },
            ]);
          }
        } else {
          // fallback: show a helpful template + instructions
          setMessages((m) => [
            ...m,
            {
              from: "wiza",
              text: "I couldn't find a direct answer in our docs. I can prepare a support request for you — or you can try a different phrasing.",
            },
            {
              from: "system",
              text: `If you'd like, copy-paste this to support@eaziwage.com:\n\nSubject: Help request — ${q}\n\nMessage: Please help with: ${q}\n\n(Automatically suggested by Wiza)`,
            },
          ]);
        }
      }, fakeTypingMs);
    } catch (err) {
      setIsTyping(false);
      setMessages((m) => [
        ...m,
        {
          from: "wiza",
          text: "Oops something went wrong contacting my brain server. Try again or email support@eaziwage.com",
        },
      ]);
      console.error("Wiza error:", err);
    }
  };

  // Quick suggestion buttons (can be populated from server later)
  const suggestions = [
    "How does early wage access work?",
    "What is the Code of Ethics?",
    "How do I contact support?",
  ];

  return (
    <div className="fixed right-6 bottom-6 z-50">
      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open Wiza chat"
        className="rounded-full bg-emerald-500 p-3 text-white shadow-lg transition hover:bg-emerald-600"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="absolute right-0 bottom-16 flex h-96 w-80 flex-col overflow-hidden rounded-2xl bg-white/80 shadow-2xl backdrop-blur-sm md:w-96"
          >
            <div className="flex items-center justify-between bg-emerald-600 px-3 py-2 text-white">
              <div className="flex items-center gap-2">
                <span className="text-lg">Wiza</span>
                <span className="text-sm opacity-90">— Ask me anything</span>
              </div>
              <button
                onClick={() => {
                  setMessages([
                    {
                      from: "wiza",
                      text: "Hey 👋 I’m Wiza — ask me about EaziWage policies, ethics, or how things work. If I’m stuck, I’ll help you send a support request.",
                    },
                  ]);
                }}
                className="text-xs underline opacity-90"
              >
                Reset
              </button>
            </div>

            {/* Suggestions */}
            <div className="border-b p-2">
              <div className="flex gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setInput(s);
                      // optionally send directly:
                      // setTimeout(() => sendMessage(), 120);
                    }}
                    className="rounded-md bg-gray-100 px-2 py-1 text-xs transition hover:bg-gray-200"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 space-y-2 overflow-y-auto p-3 text-sm"
              ref={scrollRef}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[80%] rounded-lg p-2 ${
                    msg.from === "wiza"
                      ? "bg-emerald-50 text-emerald-900"
                      : msg.from === "user"
                        ? "ml-auto self-end bg-gray-200 text-gray-900"
                        : "bg-neutral-100 text-neutral-800"
                  }`}
                >
                  <pre className="wrap-break-word whitespace-pre-wrap">
                    {msg.text}
                  </pre>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="w-max rounded-lg bg-emerald-50 p-2 text-emerald-900">
                  <TypingDots />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2 border-t p-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                placeholder="Ask Wiza..."
                className="flex-1 rounded-lg border p-2 text-sm focus:ring-1 focus:ring-emerald-400 focus:outline-none"
              />
              <button
                onClick={sendMessage}
                className="rounded-lg bg-emerald-600 px-3 text-sm text-white hover:bg-emerald-700"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Typing dots component */
function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      <motion.span
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
        className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"
      />
      <motion.span
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }}
        className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"
      />
      <motion.span
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
        className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"
      />
    </div>
  );
}
