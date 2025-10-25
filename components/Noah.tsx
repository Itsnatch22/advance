"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";

export default function Noah() {
  const [ open, setOpen ] = useState(false);
  const [ messages, setMessages ] = useState<{
    from: "noah" | "user";
    text: string;
  }[]>([
    {from: "noah", text: "Hey👋, Noah here! Need a hand?"},
  ]);
  const [ input, setInput ] = useState("");
  const [ kb, setKb ] = useState<{ id: string; title: string; text: string | string[]; source?: string }[] | null>(null);

  // Lightweight internal context and knowledge
  const knowledge = [
    { q: /pricing|cost|fee|charges?/i, a: "Our platform fee is 5% per access plus a small KES 25 flat fee. No hidden costs." },
    { q: /advance|how.*work|works?/i, a: "Work days are tracked across a 30‑day cycle. You can access up to a capped percent of your net earnings based on accrued days and allowances." },
    { q: /security|safe|safety|secure/i, a: "We use bank‑grade encryption and follow industry best practices. Data is processed securely and never shared without consent." },
    { q: /partners?|integrations?|api/i, a: "We integrate with payroll and HR systems. For APIs or partnerships, reach out via the Contact page." },
    { q: /support|help|contact/i, a: "You can reach us through the Contact page. Share your company and a brief context so we can route you quickly." },
  ];

  // Load external JSON knowledge once when chat opens
  useEffect(() => {
    if (!open || kb) return;
    fetch("/data/noah_knowledge.json")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setKb(data);
      })
      .catch(() => {
        // fail silently; Noah will still work with built-in knowledge
      });
  }, [open, kb]);

  const normalizedKb = useMemo(() => {
    if (!kb) return [] as { title: string; text: string; source?: string }[];
    return kb.map((item) => ({
      title: item.title,
      text: Array.isArray(item.text) ? item.text.join(" \n ") : item.text,
      source: item.source,
    }));
  }, [kb]);

  // Simple reasoning pipeline
  const think = (history: {from: string; text: string}[], user: string): string => {
    const cleaned = user.trim();
    if (!cleaned) return "";

    // 1) Fast intents
    const lower = cleaned.toLowerCase();
    if (["hi","hello","hey","yo"].some(g => lower.startsWith(g))) {
      return "Hi! I'm Noah. Ask about advances, fees, eligibility, or security.";
    }

    // 2) Knowledge lookup (built-in)
    for (const item of knowledge) {
      if (item.q.test(cleaned)) return item.a;
    }

    // 2b) External KB lookup (fuzzy contains in title/text)
    for (const item of normalizedKb) {
      const hay = `${item.title}\n${item.text}`.toLowerCase();
      if (hay.includes(lower)) {
        return `${item.text}${item.source ? `\nSource: ${item.source}` : ""}`;
      }
    }

    // 3) Contextual heuristics using short history window
    const recent = history.slice(-4).map(h => h.text.toLowerCase()).join(" \n ");
    if (/(eligib|qualif)/i.test(cleaned)) {
      return "Eligibility is based on your gross salary, allowances, and accrued days in the 30‑day cycle. Use the calculator to estimate your accessible amount.";
    }
    if (/when.*pay|payout|disburse|receive/i.test(cleaned)) {
      return "Once an advance is requested and approved, funds are disbursed instantly to your mobile or bank account.";
    }

    // 4) Fallback: reflective response with next‑step guidance
    return "I’m not fully certain yet, but here’s a tip: you can estimate access using the Calculator and review fees in Pricing. Tell me if your question is about fees, eligibility, or security, and I’ll get more specific.";
  };

  const handleSend = () => {
    const msg = input.trim();
    if(!msg) return;
    const updated = [...messages, {from: "user", text: msg}];
    setMessages(updated);
    setInput("");

    // Simulate thinking delay
    setTimeout(() => {
      const reply = think(updated, msg);
      if (!reply) return;
      setMessages((prev) => ([...prev, { from: "noah", text: reply }]));
    }, 400);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileTap={{ scale: 0.9 }}
        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white p-4 rounded-full shadow-lg focus:outline-none transition flex items-center justify-center"
      >
        {open ? <X size={22} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-16 right-0 w-80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-700 to-green-600 text-white px-4 py-3 font-semibold flex justify-between items-center">
              Noah 💬
              <span className="text-xs opacity-90">EaziWage Assistant</span>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-80 scrollbar-thin" role="log" aria-live="polite">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-2xl max-w-[75%] text-sm leading-snug ${
                      msg.from === "user"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 dark:text-gray-100 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input Area */}
            <div className="flex items-center p-2 border-t dark:border-gray-800 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Noah..."
                className="flex-1 text-sm px-3 py-2 outline-none bg-transparent dark:text-white"
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                aria-label="Chat input"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleSend}
                className="p-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition"
                aria-label="Send message"
              >
                <Send size={18} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
