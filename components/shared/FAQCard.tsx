"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useId } from "react";

interface FAQCardProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function FAQCard({ question, answer, isOpen, onToggle }: FAQCardProps) {
  const reduceMotion = useReducedMotion();
  const answerId = useId();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full"
    >
      <div
        className={`group relative overflow-hidden rounded-2xl border border-slate-200/60 transition-colors duration-300 ${
          isOpen
            ? "bg-white shadow-lg ring-1 shadow-green-500/5 ring-green-500/15"
            : "bg-white/70 hover:bg-white"
        }`}
      >
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={isOpen ? answerId : undefined}
          onClick={onToggle}
          className="relative z-10 flex w-full items-center justify-between gap-5 p-5 text-left sm:p-7"
        >
          <span
            className={`text-base font-bold tracking-tight transition-colors duration-300 sm:text-lg ${
              isOpen ? "text-green-600" : "text-slate-900"
            }`}
          >
            {question}
          </span>
          <div
            className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
              isOpen
                ? "bg-green-600 text-white"
                : "bg-slate-100 text-slate-500 group-hover:bg-green-500 group-hover:text-white"
            }`}
          >
            <ChevronDown
              className={`size-5 ${reduceMotion ? "" : "transition-transform duration-300"} ${isOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              id={answerId}
              initial={reduceMotion ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="px-5 pb-5 sm:px-7 sm:pb-7">
                <div className="mb-5 h-px w-full bg-slate-100" />
                <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                  {answer}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default FAQCard;
