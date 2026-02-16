"use client";
import { motion } from "framer-motion";
import {
  User,
  Wallet,
  Cog,
  LineChart,
  Lock,
  BadgeCheck,
  Clipboard,
  CircuitBoard,
  BrainCircuit,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { AppleCardsCarouselDemo } from "@/components/Carousel";
import { ComplianceStrip } from "@/components/shared/ComplianceStrip";
import { FeatureCard } from "@/components/shared/FeatureCard";
import { FAQItem } from "@/components/shared/FAQItem";
import UI from "./UI";
import ROI from "@/components/ROI";
import Integrations from "@/components/Integrations";
import { BRAND_COLORS } from "@/constants/colors";

const reasons = [
  {
    icon: User,
    title: "Improve retention",
    desc: "Reduce churn by supporting financial wellbeing—especially in hourly & shift roles.",
  },
  {
    icon: Wallet,
    title: "Payroll-integrated",
    desc: "Auto-deduct on payday with configurable limits and employer policies.",
  },
  {
    icon: Cog,
    title: "Fast rollout",
    desc: "Simple HRIS/Payroll mapping and sandbox to validate flows before go-live.",
  },
  {
    icon: BadgeCheck,
    title: "Zero balance-sheet loans",
    desc: "It's not a loan product. No lending, no interest, no debt on your books.",
  },
  {
    icon: Lock,
    title: "Granular controls",
    desc: "Role-based access, approvals, per-group limits, and time-bound restrictions.",
  },
  {
    icon: LineChart,
    title: "Actionable analytics",
    desc: "Adoption, usage, and impact dashboards for HR, Finance, and Operations.",
  },
];

const rolloutPlans = [
  {
    icon: Clipboard,
    title: "Sandbox",
    desc: "Map payroll fields, test auto-deductions, validate fee visibility.",
  },
  {
    icon: CircuitBoard,
    title: "Integrate",
    desc: "Connect HRIS/Payroll or CSV; set groups, roles & permissions.",
  },
  {
    icon: BrainCircuit,
    title: "Control",
    desc: "Define limits (% of earned wages), cool-offs, approvals & hours.",
  },
  {
    icon: BadgeCheck,
    title: "Launch",
    desc: "Brief managers, share staff onboarding link, monitor adoption.",
  },
];

const faqs = [
  {
    question: "How does Eaziwage integrate with our existing payroll system?",
    answer:
      "Eaziwage seamlessly integrates with most major payroll systems through secure APIs. We also support CSV uploads for manual payroll systems. Our integration team will work closely with your HR and IT departments to ensure a smooth setup process.",
  },
  {
    question:
      "What are the costs associated with implementing Eaziwage for our employees?",
    answer:
      "Eaziwage operates on a transparent pricing model with no hidden fees. Employers typically pay a nominal setup fee and a small transaction fee per withdrawal made by employees. There are no subscription fees or interest charges involved.",
  },
  {
    question:
      "How does Eaziwage ensure the security and privacy of employee data?",
    answer:
      "Eaziwage prioritizes data security and privacy. We comply with all relevant data protection regulations, including ODPC guidelines. Employee data is encrypted both in transit and at rest, and we implement strict access controls to ensure that only authorized personnel can access sensitive information.",
  },
  {
    question:
      "Can we customize the Eaziwage platform to align with our company policies?",
    answer:
      "Yes, Eaziwage offers a range of customization options to align with your company policies. You can set withdrawal limits, approval workflows, and define which employee groups have access to the service. Our platform is designed to be flexible to meet the unique needs of your organization.",
  },
];

const complianceItems = [
  { text: "Regulated partners • Regulatory compliant" },
  { text: "Data protection assured" },
  { text: "Transparent pricing (Flat fee + 5%)" },
  { text: "Auto-settlement via payroll" },
];

export default function Employers() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section className="relative mx-auto flex min-h-screen w-full flex-col items-center overflow-hidden bg-linear-to-b from-white via-slate-50/30 to-white py-12 sm:py-16 lg:py-20">
      <UI />
      
      {/* Enhanced compliance strip with refined styling */}
      <ComplianceStrip
        items={complianceItems}
        className="mb-16 border-y border-slate-200/60 bg-white/80 py-6 backdrop-blur-sm sm:mb-20 lg:mb-24 sm:py-8"
      />

      {/* Employers Reasons - refined card grid with improved visual hierarchy */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header with badge treatment */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16 lg:mb-20">
          <div className="mb-5 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              For Employers
            </div>
          </div>
          <h2 className="mb-5 font-serif text-4xl font-bold tracking-tight text-slate-900 sm:mb-6 sm:text-5xl lg:text-6xl">
            Why employers <span className="bg-linear-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">choose</span>{" "}
            EaziWage
          </h2>
          <p className="text-base leading-relaxed text-slate-600 sm:text-lg lg:text-xl">
            A practical well-being lever that pays for itself. Zero cost, zero
            risk, zero hassle.
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

      {/* ROI section with improved spacing */}
      <div className="mt-20 w-full sm:mt-24 lg:mt-32">
        <ROI />
      </div>

      {/* Roll-Out Plans - refined card treatment */}
      <div className="mt-20 w-full max-w-7xl px-4 sm:mt-24 lg:mt-32 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16 lg:mb-20">
          <div className="mb-5 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Implementation
            </div>
          </div>
          <h2 className="mb-5 font-serif text-4xl font-bold tracking-tight text-slate-900 sm:mb-6 sm:text-5xl lg:text-6xl">
            Employer <span className="bg-linear-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">rollout plan</span>
          </h2>
          <p className="text-base leading-relaxed text-slate-600 sm:text-lg lg:text-xl">
            From sandbox to go live in days, not months. We handle the heavy
            lifting.
          </p>
        </div>

        {/* Enhanced rollout cards with numbered steps */}
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

      {/* Integrations section with improved spacing */}
      <div className="mt-20 w-full sm:mt-24 lg:mt-32">
        <Integrations />
      </div>

      {/* Works Areas - refined section header */}
      <div className="mt-16 w-full max-w-7xl px-2 sm:mt-20 lg:mt-24 sm:px-4 lg:px-6">
        <div className="mb-10 text-center sm:mb-12 lg:mb-16 lg:text-left">
          <div className="mb-5 flex justify-center lg:justify-start">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Versatile Solution
            </div>
          </div>
          <h2 className="mb-5 font-serif text-4xl font-bold tracking-tight text-slate-900 sm:mb-6 sm:text-5xl lg:text-6xl">
            Works across sectors & sizes
          </h2>
          <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg lg:mx-0 lg:text-xl">
            Retail • Hospitality • Manufacturing • Logistics • Banks • Schools •
            Healthcare
          </p>
        </div>
        <div className="-mx-4 sm:mx-0">
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