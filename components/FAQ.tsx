"use client";

import { ArrowRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { useState, MouseEvent } from "react";
import Link from "next/link";
import { Button } from "./ui/button";

const faqs = [
  {
    question: "What is earned wage access and how does EaziWage work?",
    answer:
      "Earned wage access allows employees to access part of their earned wages before payday. EaziWage integrates with payroll and mobile money to enable instant disbursements.",
  },
  {
    question: "Who can use EaziWage?",
    answer:
      "Our solution targets Kenyan employees across sectors; eligibility is determined by payroll data and work history.",
  },
  {
    question: "What security measures are considered?",
    answer:
      "Industry-standard encryption, PCI-DSS-aligned practices, and regular audits.",
  },
  {
    question: "Are there any fees associated with using EaziWage?",
    answer:
      "EaziWage offers a transparent pricing model with no hidden fees. While there may be nominal transaction fees and application fees for instant access, there are no interest charges or subscription fees.",
  },
  {
    question: "How to get started?",
    answer:
      "For employers: integrate with your payroll. For employees: download the app or use the web portal to request funds.",
  },
];

const FAQCard = ({ faq, isOpen, onClick }: { faq: any, isOpen: boolean, onClick: () => void }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 150, damping: 20 });

  function onMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  }

  return (
    <motion.div
      style={{ perspective: 1000 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full"
    >
      <motion.div
        onMouseMove={onMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        style={{ rotateX, rotateY }}
        className={`group relative overflow-hidden rounded-3xl border border-slate-200/60 transition-all duration-500 ${
          isOpen ? "bg-white shadow-2xl shadow-green-500/10 ring-1 ring-green-500/20" : "bg-white/40 backdrop-blur-xl hover:bg-white"
        }`}
      >
        <motion.div
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([mx, my]) => `radial-gradient(350px circle at ${mx}px ${my}px, rgba(34, 197, 94, 0.04), transparent 80%)`
            ),
          }}
          className="absolute inset-0 pointer-events-none"
        />

        <button
          onClick={onClick}
          className="relative z-10 flex w-full items-center justify-between p-8 text-left"
        >
          <span className={`text-lg font-bold tracking-tight transition-colors duration-300 ${isOpen ? "text-green-700" : "text-slate-900"}`}>
            {faq.question}
          </span>
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-500 ${
            isOpen ? "bg-green-600 text-white rotate-180" : "bg-slate-100 text-slate-500 group-hover:bg-green-500 group-hover:text-white"
          }`}>
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
                <div className="h-px w-full bg-slate-100 mb-6" />
                <p className="text-lg leading-relaxed text-slate-500">
                  {faq.answer}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className={`absolute bottom-0 left-0 h-1.5 w-0 bg-green-600 transition-all duration-700 ${isOpen ? "w-full" : "group-hover:w-full"}`} />
      </motion.div>
    </motion.div>
  );
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative overflow-hidden bg-slate-50/50 py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 h-150 w-150 rounded-full bg-green-50/50 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-150 w-150 rounded-full bg-emerald-50/50 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <div className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-green-600"
          >
            Help Center
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl"
          >
            Our <span className="text-green-600">Frequently</span> Asked Questions
          </motion.h2>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <FAQCard 
              key={index} 
              faq={faq} 
              isOpen={openIndex === index} 
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <Link href="/faq">
            <Button variant="outline" size="lg" className="h-14 rounded-2xl px-10 font-bold group border-slate-200 bg-white hover:bg-slate-50">
              View All FAQs
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
