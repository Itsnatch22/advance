"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send } from "lucide-react";


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

    return(
        <div className="fixed bottom-6 right-6 z-50">
            <button
            onClick={() => setOpen(!open)}
            className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg focus:outline-none transition">
                <MessageCircle size={24} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        <div className="bg-green-600 text-white px-4 py-2 font-semibold">
                            Noah - Your Virtual Assistant
                        </div>
                        <div className="flex-1 p-3 space-y-2 overflow-y-auto max-h-80 scrollbar-thin">
                        {messages.map((msg, i) => (
                            <div
                            key={i}
                            className={`flex ${
                                msg.from === "user" ? "justify-end" : "justify-start"
                            }`}
                            >
                            <div
                                className={`px-3 py-2 rounded-lg max-w-[75%] text-sm ${
                                msg.from === "user"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-800"
                                }`}
                            >
                                {msg.text}
                            </div>
                            </div>
                        ))}
                        </div>
                        <div className="flex items-center p-2 border-t">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type something..."
                            className="flex-1 text-sm px-3 py-2 outline-none"
                        />
                        <button
                            onClick={handleSend}
                            className="p-2 text-blue-600 hover:text-blue-800"
                        >
                            <Send size={18} />
                        </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}