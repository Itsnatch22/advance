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
    <section className="relative mx-auto flex min-h-screen w-full flex-col items-center py-10 sm:py-14 lg:py-20">
      <UI />

      <ComplianceStrip items={complianceItems} className="mb-8 sm:mb-10" />

      <div className="mt-10 w-full max-w-7xl px-4 text-center sm:mt-14 sm:px-6 lg:px-10 lg:text-left">
        <div className="mx-auto mb-16 max-w-3xl text-center sm:mb-20">
          <h2 className="mb-6 font-serif text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
            Why employees choose Eaziwage
          </h2>
          <p className="text-lg leading-relaxed text-gray-600 sm:text-xl dark:text-gray-300">
            A practical well-being lever that pays for itself.
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

      {/* Roll-Out Plans */}
      <div className="mt-24 w-full max-w-7xl px-4 sm:mt-32 sm:px-6 lg:mt-40 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center sm:mb-20">
          <h2 className="mb-6 font-serif text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
            Your Financial Empowerment Journey
          </h2>
          <p className="text-lg leading-relaxed text-gray-600 sm:text-xl dark:text-gray-300">
            Awareness → Empowerment → Growth — a smarter way to handle money
            you&apos;ve already earned.
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
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Works Areas */}
      <div className="mt-10 w-full max-w-7xl px-2 sm:mt-20 sm:px-4 lg:mt-30 lg:px-6">
        <div className="mb-12 text-center lg:text-left">
          <h2 className="mb-6 font-serif text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
            Versatility across{" "}
            <span className="text-green-500">jobs & sectors</span>
          </h2>
          <p className="mx-auto mt-3 text-sm text-gray-600 sm:mt-4 sm:text-base lg:mx-0 dark:text-white">
            Real Kenyan contexts: retail, banking, hospitality, logistics,
            schools, factories and more.
          </p>
        </div>
        <div className="mt-3 sm:mt-5">
          <AppleCardsCarouselDemo />
        </div>
      </div>

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
                        <p className="px-5 pb-5 text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg">
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
