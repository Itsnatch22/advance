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
    desc: "It’s not a loan product. No lending, no interest, no debt on your books.",
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
    <section className="relative mx-auto flex min-h-screen w-full flex-col items-center overflow-hidden py-16 sm:py-24 lg:py-32">
      <UI />
      <ComplianceStrip
        items={complianceItems}
        className="mb-16 border-y border-gray-100 py-6 backdrop-blur-sm sm:mb-24 sm:py-8 dark:border-white/10"
      />

      {/* Employers Reasons */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center sm:mb-20">
          <h2 className="mb-6 font-serif text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
            Why employers <span className="text-green-500">choose</span>{" "}
            EaziWage
          </h2>
          <p className="text-lg leading-relaxed text-gray-600 sm:text-xl dark:text-white-300">
            A practical well-being lever that pays for itself. Zero cost, zero
            risk, zero hassle.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-10">
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

      <div className="mt-24 w-full sm:mt-32">
        <ROI />
      </div>

      {/* Roll-Out Plans */}
      <div className="mt-24 w-full max-w-7xl px-4 sm:mt-32 sm:px-6 lg:mt-40 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center sm:mb-20">
          <h2 className="mb-6 font-serif text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
            Employer <span className="text-green-500">rollout plan</span>
          </h2>
          <p className="text-lg leading-relaxed text-gray-600 sm:text-xl dark:text-white-300">
            From sandbox to go live in days, not months. We handle the heavy
            lifting.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {rolloutPlans.map((item, j) => (
            <motion.div
              key={j}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: j * 0.1 }}
              className="relative rounded-3xl border border-transparent bg-gray-50 p-6 transition-colors duration-300 hover:border-green-200 sm:p-8 dark:bg-white/5 dark:hover:border-green-800"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-white/10">
                <item.icon className="h-6 w-6 text-gray-900 dark:text-white" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-white-400">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-24 w-full sm:mt-32">
        <Integrations />
      </div>

      {/* Works Areas */}
      <div className="mt-8 w-full max-w-7xl px-2 sm:mt-16 sm:px-4 lg:mt-24 lg:px-6">
        <div className="mb-12 text-center lg:text-left">
          <h2 className="mb-6 font-serif text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
            Works across sectors & sizes
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl lg:mx-0 dark:text-white-300">
            Retail • Hospitality • Manufacturing • Logistics • Banks • Schools •
            Healthcare
          </p>
        </div>
        <div className="-mx-4 sm:mx-0">
          <AppleCardsCarouselDemo />
        </div>
      </div>

      {/* FAQs */}
      <div className="mx-auto w-full max-w-4xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <h2 className="mb-12 text-center font-serif text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl dark:text-white">
          Frequently Asked Questions
        </h2>
              <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:border-green-500/30 dark:border-white/10 dark:bg-white/5">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border-b border-gray-200 last:border-none dark:border-gray-700"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="group flex w-full items-center justify-between p-5 text-left focus:outline-none"
            >
              <span className="text-base font-medium text-gray-900 dark:text-white transition-colors group-hover:text-green-700 sm:text-lg">
                {faq.question}
              </span>
              <ArrowRight
                className={`ml-2 h-5 w-5 shrink-0 text-gray-500 dark:text-white transition-transform duration-300 ${openIndex === index ? "rotate-90 text-green-600" : ""}`}
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
                  <p className="px-5 pb-5 text-base leading-7 text-gray-600 dark:text-white-300 sm:text-lg">
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
