"use client";

import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

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
    question: "What security measures are considered?",
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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center font-serif text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl"
      >
        Our <span className="text-green-600">Frequently</span> Asked Questions
      </motion.h2>
      <div className="mx-auto w-full max-w-4xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <h2 className="mb-12 text-center font-serif text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
                <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:border-green-500/30">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-200 last:border-none"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="group flex w-full items-center justify-between p-5 text-left focus:outline-none"
              >
                <span className="text-base font-medium text-gray-900 transition-colors group-hover:text-green-700 sm:text-lg">
                  {faq.question}
                </span>
                <ArrowRight
                  className={`ml-2 h-5 w-5 shrink-0 text-gray-500 transition-transform duration-300 ${openIndex === index ? "rotate-90 text-green-600" : ""}`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-base leading-7 text-gray-600 sm:text-lg">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
