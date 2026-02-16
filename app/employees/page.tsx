"use client";
import { motion } from "framer-motion";
import {
  Clock3,
  Wallet,
  Smartphone,
  Users,
  CheckCircle2,
  BrainCircuit,
  Lightbulb,
  BarChart3,
  Repeat,
} from "lucide-react";
import { AppleCardsCarouselDemo } from "@/components/Carousel";
import { ComplianceStrip } from "@/components/shared/ComplianceStrip";
import { FeatureCard } from "@/components/shared/FeatureCard";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import UI from "./UI";

const reasons = [
  {
    icon: Wallet,
    title: "No interest, ever",
    desc: "It's not a loan. Just early access to your own earnings.",
  },
  {
    icon: Clock3,
    title: "Instant when you need it",
    desc: "Withdraw anytime within employer limits—24/7 processing.",
  },
  {
    icon: Smartphone,
    title: "Mobile Money or Bank",
    desc: "Choose the payout channel that suits you.",
  },
  {
    icon: CheckCircle2,
    title: "Secure & compliant",
    desc: "Pan-Africa Ready • Data Protection.",
  },
  {
    icon: Users,
    title: "Improves wellbeing",
    desc: "Reduce financial stress and avoid costly mobile loans.",
  },
  {
    icon: CheckCircle2,
    title: "Transparent fees",
    desc: "Flat USD 2 + Application 5%—clearly shown before you confirm.",
  },
];

const rolloutPlans = [
  {
    icon: Lightbulb,
    title: "Awareness",
    desc: "See your earned wages in real time and understand your safe withdrawal limit.",
  },
  {
    icon: BrainCircuit,
    title: "Empowerment",
    desc: "Withdraw when needed, avoid debt traps, and keep payday on track automatically.",
  },
  {
    icon: BarChart3,
    title: "Growth",
    desc: "Build savings habits and reduce stress with transparent fees and strong protections.",
  },
  {
    icon: Repeat,
    title: "Repeat",
    desc: "Continue to earn and withdraw as needed, with no limits or hidden fees.",
  },
];

const complianceItems = [
  { text: "Regulated partners • Pan-Africa Ready framework" },
  { text: "ODPC-compliant data handling" },
  { text: "Transparent pricing (USD 2 + 5%)" },
  { text: "Auto-settlement via payroll" },
];

const faqs = [
  {
    question: "Is EaziWage available for withdrawal 24/7 365 days a year?",
    answer:
      "Yes. Users can withdraw at any time, the earnings they have already worked for and accumulated.",
  },
  {
    question: "How long does it take for users to receive withdrawals?",
    answer:
      "The withdrawal request will be processed for instant disbursement. However, withdrawals are dependent on mobile money and bank systems. Mobile wallet transfers are typically quicker.",
  },
  {
    question:
      "What is the minimum and maximum earned wage amount that can be withdrawn?",
    answer:
      "There is no minimum withdrawal amount. The maximum withdrawal amount is capped to a portion of your gross salary in alignment with law, payroll verification, your residency, your Employer's policies and the EaziWage eligibility requirements.",
  },
  {
    question: "Who is eligible to use EaziWage?",
    answer:
      "Employers who have a valid Business Registration and who have signed up to the EaziWage platform, in Kenya, Tanzania, Uganda and Rwanda. EaziWage is available for all employees who are currently employed and paid in the jurisdiction of the verified and registered Employer.",
  },
  {
    question: "How do I accumulate earned wages?",
    answer:
      "EaziWage will retrieve your work information directly from your Employer to track your available earnings.",
  },
];

export default function Employees() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section className="relative mx-auto flex min-h-screen w-full flex-col items-center overflow-hidden bg-linear-to-b from-white via-slate-50/30 to-white py-8 sm:py-12 lg:py-16">
      <UI />

      {/* Enhanced compliance strip */}
      <ComplianceStrip 
        items={complianceItems} 
        className="mb-12 border-y border-slate-200/60 bg-white/80 py-6 backdrop-blur-sm sm:mb-16 lg:mb-20 sm:py-8" 
      />

      {/* Why employees choose section - refined styling */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header with badge */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16 lg:mb-20">
          <div className="mb-5 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              For Employees
            </div>
          </div>
          <h2 className="mb-5 font-serif text-4xl font-bold tracking-tight text-slate-900 sm:mb-6 sm:text-5xl lg:text-6xl">
            Why employees choose <span className="bg-linear-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Eaziwage</span>
          </h2>
          <p className="text-base leading-relaxed text-slate-600 sm:text-lg lg:text-xl">
            A practical well-being lever that pays for itself.
          </p>
        </div>

        {/* Enhanced feature cards grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {reasons.map((item, i) => (
            <FeatureCard
              key={i}
              icon={item.icon}
              title={item.title}
              description={item.desc}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* Financial Empowerment Journey - refined card treatment */}
      <div className="mt-20 w-full max-w-7xl px-4 sm:mt-24 lg:mt-32 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16 lg:mb-20">
          <div className="mb-5 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Your Journey
            </div>
          </div>
          <h2 className="mb-5 font-serif text-4xl font-bold tracking-tight text-slate-900 sm:mb-6 sm:text-5xl lg:text-6xl">
            Your Financial <span className="bg-linear-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Empowerment Journey</span>
          </h2>
          <p className="text-base leading-relaxed text-slate-600 sm:text-lg lg:text-xl">
            Awareness → Empowerment → Growth — a smarter way to handle money
            you&apos;ve already earned.
          </p>
        </div>

        {/* Enhanced journey cards with step indicators */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-6">
          {rolloutPlans.map((item, j) => (
            <motion.div
              key={j}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: j * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-lg shadow-slate-900/5 transition-all duration-300 hover:border-emerald-200/80 hover:shadow-xl hover:shadow-emerald-500/10 sm:p-8"
            >
              {/* Step number badge */}
              <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-emerald-50 to-green-50 text-xs font-bold text-emerald-700 ring-1 ring-emerald-500/10">
                {j + 1}
              </div>

              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-linear-to-br from-emerald-50/0 via-green-50/0 to-emerald-50/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

              {/* Icon with enhanced styling */}
              <div className="relative z-10 mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-emerald-50 to-green-50 shadow-sm ring-1 ring-emerald-500/10 transition-transform duration-300 group-hover:scale-110">
                <item.icon className="h-7 w-7 text-emerald-600" strokeWidth={2} />
              </div>

              {/* Content */}
              <h3 className="relative z-10 mb-3 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                {item.title}
              </h3>
              <p className="relative z-10 text-sm leading-relaxed text-slate-600 sm:text-base">
                {item.desc}
              </p>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-linear-to-r from-emerald-500 to-green-500 transition-all duration-300 group-hover:w-full"></div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Versatility section - refined header */}
      <div className="mt-16 w-full max-w-7xl px-2 sm:mt-20 lg:mt-24 sm:px-4 lg:px-6">
        <div className="mb-10 text-center sm:mb-12 lg:mb-16 lg:text-left">
          <div className="mb-5 flex justify-center lg:justify-start">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Versatile Solution
            </div>
          </div>
          <h2 className="mb-4 font-serif text-4xl font-bold tracking-tight text-slate-900 sm:mb-5 sm:text-5xl lg:text-6xl">
            Versatility across{" "}
            <span className="bg-linear-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">jobs & sectors</span>
          </h2>
          <p className="mx-auto text-sm text-slate-600 sm:text-base lg:mx-0 lg:text-lg">
            Real Kenyan contexts: retail, banking, hospitality, logistics,
            schools, factories and more.
          </p>
        </div>
        <div className="mt-4 sm:mt-6">
          <AppleCardsCarouselDemo />
        </div>
      </div>

      {/* FAQs - refined accordion with enhanced styling */}
      <div className="mx-auto w-full max-w-4xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        {/* Section header */}
        <div className="mb-12 text-center sm:mb-16">
          <div className="mb-5 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Support
            </div>
          </div>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Enhanced FAQ accordion */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-xl shadow-slate-900/5 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/5">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-slate-100 last:border-none transition-colors duration-200 hover:bg-slate-50/50"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="group flex w-full items-center justify-between gap-4 p-5 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:p-6"
              >
                <span className="text-base font-semibold tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-emerald-700 sm:text-lg">
                  {faq.question}
                </span>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 transition-all duration-300 group-hover:bg-emerald-50 ${openIndex === index ? "bg-emerald-50" : ""}`}>
                  <ArrowRight
                    className={`h-4 w-4 text-slate-500 transition-all duration-300 ${openIndex === index ? "rotate-90 text-emerald-600" : "group-hover:text-emerald-600"}`}
                    strokeWidth={2.5}
                  />
                </div>
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
                    <div className="border-t border-slate-100 bg-linear-to-b from-slate-50/50 to-transparent px-5 pb-6 pt-4 sm:px-6">
                      <p className="text-sm leading-relaxed text-slate-600 sm:text-base sm:leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
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