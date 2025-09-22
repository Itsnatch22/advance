"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

export default function NoahChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    try {
      const res = await fetch("/api/noah/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();

      const assistantMessage = { role: "assistant" as const, text: data.reply };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", text: "⚠️ Service unavailable, please try again later." }]);
    }
  }

  return (
    <div className="fixed bottom-4 right-4">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg bg-green-600 text-white hover:bg-green-700 transition"
        >
          <MessageCircle size={28} />
        </button>
      )}
      {isOpen && (
        <div className="w-96 h-[28rem] flex flex-col bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-green-600 text-white">
            <span className="font-semibold">Noah</span>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-80">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                  m.role === "assistant"
                    ? "bg-gray-200 text-gray-800 self-start"
                    : "bg-green-600 text-white self-end ml-auto"
                }`}
              >
                {m.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex items-center p-3 border-t bg-white">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-green-300"
            />
            <button
              onClick={sendMessage}
              className="ml-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}