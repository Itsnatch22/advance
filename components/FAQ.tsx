"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { FAQCard } from "@/components/shared/FAQCard";

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

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative overflow-hidden bg-slate-50/50 py-40">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-0 h-150 w-150 rounded-full bg-green-50/50 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-150 w-150 rounded-full bg-emerald-50/50 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <div className="mb-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase"
          >
            Help Center
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="font-serif text-5xl leading-tight font-bold tracking-tight text-slate-900 sm:text-6xl"
          >
            Our{" "}
            <span className="bg-linear-to-r from-emerald-700 via-green-600 to-emerald-600 bg-clip-text text-transparent">
              Frequently
            </span>{" "}
            Asked Questions
          </motion.h2>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <FAQCard
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-28 text-center"
        >
          <Link href="/faq">
            <Button
              variant="outline"
              size="lg"
              className="group h-14 rounded-2xl border-slate-200 bg-white px-10 font-bold hover:bg-slate-50"
            >
              View All FAQs
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
