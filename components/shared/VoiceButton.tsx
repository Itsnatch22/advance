"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

export function VoiceButton({ onTranscript, disabled, className }: VoiceButtonProps) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setSupported(
      typeof window !== "undefined" &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ("SpeechRecognition" in window || "webkitSpeechRecognition" in (window as any))
    );
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const start = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SpeechRecognitionAPI = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition: any = new SpeechRecognitionAPI();
    recognition.lang = navigator.language || "en";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      const transcript: string = e.results[0][0].transcript;
      onTranscript(transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [onTranscript]);

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={listening ? stop : start}
      disabled={disabled}
      title={listening ? "Stop recording" : "Voice input"}
      className={cn(
        "relative flex items-center justify-center rounded-xl transition-all duration-200",
        listening ? "text-red-500 scale-110" : "text-slate-400 hover:text-emerald-600",
        className
      )}
    >
      {listening && (
        <motion.span
          className="absolute inset-0 rounded-xl bg-red-100 dark:bg-red-950/40"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        />
      )}
      <span className="relative z-10">
        {listening ? <MicOff size={15} /> : <Mic size={15} />}
      </span>
    </button>
  );
}
