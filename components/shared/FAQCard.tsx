"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { TiltCard } from "@/components/shared/TiltCard";

interface FAQCardProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function FAQCard({ question, answer, isOpen, onToggle }: FAQCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full"
    >
      <TiltCard
        className={`group relative overflow-hidden rounded-4xl border border-slate-200/60 transition-all duration-500 ${
          isOpen
            ? "bg-white shadow-2xl ring-1 shadow-green-500/10 ring-green-500/20"
            : "bg-white/40 backdrop-blur-2xl hover:bg-white"
        }`}
      >
        <button
          onClick={onToggle}
          className="relative z-10 flex w-full items-center justify-between p-8 text-left"
        >
          <span
            className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
              isOpen ? "text-green-600" : "text-slate-900"
            }`}
          >
            {question}
          </span>
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-500 ${
              isOpen
                ? "rotate-180 bg-green-600 text-white"
                : "bg-slate-100 text-slate-500 group-hover:bg-green-500 group-hover:text-white"
            }`}
          >
            <ChevronDown className="h-5 w-5" />
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="px-8 pb-8">
                <div className="mb-8 h-px w-full bg-slate-100" />
                <p className="text-lg leading-relaxed text-slate-500">{answer}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={`absolute bottom-0 left-0 h-1.5 w-0 bg-green-600 transition-all duration-700 ${
            isOpen ? "w-full" : "group-hover:w-full"
          }`}
        />
      </TiltCard>
    </motion.div>
  );
}

export default FAQCard;
