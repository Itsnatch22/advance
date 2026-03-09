"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function WizaChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // AI SDK 6.x useChat hook
  const { messages, sendMessage, status, error, regenerate, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    messages: [
      {
        id: "welcome",
        role: "assistant",
        parts: [{ type: "text", text: "Hi! I'm Wiza, your EaziWage AI assistant. How can I help you today?" }],
      } as any,
    ],
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isMinimized, status]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const text = inputValue;
    setInputValue("");
    try {
      await sendMessage({ text });
    } catch (err) {
      console.error("WizaChat: Failed to send message", err);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        parts: [{ type: "text", text: "Hi! I'm Wiza, your EaziWage AI assistant. How can I help you today?" }],
      } as any,
    ]);
  };

  const getMessageText = (m: any) => {
    if (m.parts) {
      return m.parts
        .filter((p: any) => p.type === 'text')
        .map((p: any) => p.text)
        .join('');
    }
    return m.content || "";
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? "auto" : "500px",
              width: isMinimized ? "250px" : "380px",
            }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="mb-4 overflow-hidden"
          >
            <Card className="flex h-full flex-col shadow-2xl border-emerald-100 bg-white/95 backdrop-blur-sm dark:bg-slate-900/95">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-emerald-700 p-4 text-white">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Avatar className="h-8 w-8 border-2 border-white/20">
                      <AvatarImage src="/favicon.ico" />
                      <AvatarFallback className="bg-emerald-800 text-xs text-white">WZ</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-400 border border-white"></span>
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                      Wiza AI <Sparkles className="h-3 w-3 text-emerald-300" />
                    </CardTitle>
                    {!isMinimized && (
                      <p className="text-[10px] text-emerald-100 opacity-90">Always online</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white hover:bg-emerald-800"
                    onClick={() => setIsMinimized(!isMinimized)}
                  >
                    {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white hover:bg-emerald-800"
                    onClick={toggleChat}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              {!isMinimized && (
                <>
                  <CardContent
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth min-h-0"
                  >
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={cn(
                          "flex w-max max-w-[85%] flex-col gap-1 rounded-2xl px-4 py-2 text-sm",
                          m.role === "user"
                            ? "ml-auto bg-emerald-600 text-white rounded-tr-none shadow-sm"
                            : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200 shadow-sm"
                        )}
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {m.role === "user" ? (
                            <User className="h-3 w-3 opacity-70" />
                          ) : (
                            <Bot className="h-3 w-3 text-emerald-600" />
                          )}
                          <span className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
                            {m.role === "user" ? "You" : "Wiza"}
                          </span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap">{getMessageText(m)}</p>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex w-max max-w-[85%] flex-col gap-1 rounded-2xl px-4 py-2 text-sm bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <Bot className="h-3 w-3 text-emerald-600" />
                          <span className="text-[10px] font-semibold uppercase tracking-wider opacity-70">Wiza</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin text-emerald-600" />
                          <span className="text-xs italic text-slate-500">Thinking...</span>
                        </div>
                      </div>
                    )}
                    {error && (
                      <div className="text-center p-2">
                        <p className="text-xs text-red-500 mb-2">Something went wrong.</p>
                        <Button variant="outline" size="sm" onClick={() => regenerate()} className="h-8 text-[10px]">
                          <RefreshCcw className="h-3 w-3 mr-1" /> Try again
                        </Button>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <form
                      onSubmit={handleSendMessage}
                      className="flex w-full items-center space-x-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 shadow-inner"
                    >
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm h-9 shadow-none"
                        disabled={isLoading}
                      />
                      <Button 
                        type="submit" 
                        size="icon" 
                        disabled={isLoading || !inputValue.trim()}
                        className="h-8 w-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm shrink-0"
                      >
                        <Send className="h-4 w-4 text-white" />
                      </Button>
                    </form>
                  </CardFooter>
                  
                  <div className="px-4 pb-2 flex justify-between items-center">
                    <button 
                      onClick={clearChat}
                      className="text-[9px] text-slate-400 hover:text-emerald-600 transition-colors uppercase font-bold tracking-widest flex items-center gap-1"
                    >
                      <RefreshCcw className="h-2 w-2" /> Reset Chat
                    </button>
                    <span className="text-[9px] text-slate-300 font-medium">Powered by AI</span>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={toggleChat}
          size="icon"
          className={cn(
            "h-14 w-14 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center border-2 border-white",
            isOpen ? "bg-white text-emerald-700 border-emerald-100" : "bg-emerald-700 text-white hover:bg-emerald-800"
          )}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <div className="relative">
              <MessageSquare className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
