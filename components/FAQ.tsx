"use client";

import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 overflow-hidden">

      {/* ambient field */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/3 w-125 h-125 bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/3 w-125 h-125 bg-green-500/10 blur-[120px] rounded-full" />
      </div>

      {/* staged intro */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="text-center font-serif text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl mb-20"
      >
        Our <span className="text-green-600">Frequently</span> Asked Questions
      </motion.h2>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto w-full max-w-4xl"
      >
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-xl">

          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                variants={item}
                className="group relative border-b border-gray-200 last:border-none"
              >
                <button
                  onClick={() =>
                    setOpenIndex(isOpen ? null : index)
                  }
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <span className="text-base font-medium text-gray-900 transition-colors group-hover:text-green-700 sm:text-lg">
                    {faq.question}
                  </span>

                  <ArrowRight
                    className={`ml-2 h-5 w-5 shrink-0 transition-all duration-300 ${
                      isOpen
                        ? "rotate-90 text-green-600"
                        : "text-gray-500 group-hover:text-green-600"
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-base leading-7 text-gray-600 sm:text-lg">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* sweep line */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-green-600 transition-all duration-500 group-hover:w-full" />
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/faq">
            <Button variant="outline" size="lg" className="rounded-xl group">
              View All FAQs
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>

      </motion.div>
    </section>
  );
}
