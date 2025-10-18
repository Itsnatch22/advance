"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";

export default function Noah() {
  const [ open, setOpen ] = useState(false);
    const [ messages, setMessages ] = useState([
        {from: "noah", text: "Hey👋, Noah here! Need a hand?"},
    ]);
    const [ input, setInput ] = useState("");

    const handleSend = () => {
        if(!input.trim()) return;
        setMessages([...messages, {from: "user", text: input}]);
        setInput("");

        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { from: "noah", text: "Got it!😎, still learning to reply though!"},
            ]);
        }, 800);
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
            <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-80 scrollbar-thin">
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
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleSend}
                className="p-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition"
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
