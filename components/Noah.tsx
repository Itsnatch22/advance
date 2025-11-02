'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { MessageCircle, X } from 'lucide-react';

export default function NoahChat() {
  const [open, setOpen] = useState(false);
  const chat = useChat({ api: '/api/noah' } as any);
  const { messages } = chat;

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-green-600 p-4 text-white shadow-lg hover:bg-green-700 transition-all"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-6 z-40 w-80 md:w-96 rounded-2xl border border-gray-200 bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden flex flex-col">
          <div className="p-3 border-b border-gray-200 dark:border-neutral-800 font-semibold text-gray-800 dark:text-gray-100">
            💬 Wiza — EaziWage Assistant
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm">
            {messages.map((m, i) => {
              const text = (m as any).content ?? (m as any).text ?? (m as any).message ?? JSON.stringify(m);
              return (
                <div
                  key={i}
                  className={`p-2 rounded-lg max-w-[80%] ${
                    m.role === 'user'
                      ? 'ml-auto bg-green-600 text-white'
                      : 'mr-auto bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {text}
                </div>
              );
            })}
          </div>
          <form onSubmit={(chat as any).handleSubmit} className="p-3 border-t border-gray-200 dark:border-neutral-800 flex">
            <input
              name="input"
              placeholder="Ask Wiza anything..."
              className="flex-1 p-2 text-sm rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 focus:outline-none"
            />
            <button
              type="submit"
              className="ml-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
