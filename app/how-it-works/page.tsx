"use client";

import { FiCalendar, FiPhone, FiCheckCircle, FiLock } from "react-icons/fi"
import { Calculator } from "lucide-react";
import { motion } from "framer-motion";

export default function HowItWorksPage() {
  const steps = [
    {
        icon: <FiCalendar className="w-10 h-10 text-green-600"/>,
      title: "Work Your Days",
      description: [
        "Employees continue their regular duties while KaziAdvance tracks accrued wages in real-time using payroll integration.",
        "No manual input is required; calculations are automatic based on hours/days worked.",
        "Employers can monitor attendance and accrued salary for all employees in one dashboard.",
        "All tracking is encrypted and compliant with Kenyan Data Protection regulations.",
      ],
    },
    {
        icon: <Calculator className="w-10 h-10 text-green-600"/>,
      title: "Calculate Available Amount",
      description: [
        "Platform calculates how much of the earned salary is accessible for an advance.",
        "Factors considered: total days/hours worked, employer-defined limits, previous advances, and platform fees.",
        "Employees see only their own available balance; employers see aggregate data for all employees.",
        "Daily updates and 'what-if' scenario tools can be provided to help employees plan.",
      ],
    },
    {
        icon: <FiPhone className="w-10 h-10 text-green-600"/>,
      title: "Request Your Advance",
      description: [
        "Employees can request a partial salary advance anytime within pre-defined limits.",
        "Funds are disbursed instantly from the partner bank to the employee’s M-PESA account.",
        "Automatic approval rules ensure limits are respected, including max % of salary and outstanding balances.",
        "Notifications are sent to both employer and employee for transparency.",
        "Audit trails ensure every step of request → disbursement → repayment is traceable.",
      ],
    },
    {
        icon: <FiCheckCircle className="w-10 h-10 text-green-600"/>,
      title: "Automatic Repayments",
      description: [
        "On payday, the requested amount plus fees are deducted automatically.",
        "Employees don’t have to manually repay; no risk of missed payments.",
        "Employers are freed from collection tasks; all transactions are secure and transparent.",
        "Repayment schedules are visible to employees individually and in aggregate for employers.",
        "Fees and transactions are logged for auditing and reporting purposes.",
      ],
    },
    {
        icon: <FiLock className="w-10 h-10 text-green-600"/>,
      title: "Security, Compliance & Impact",
      description: [
        "Bank-level encryption and full compliance with Kenyan data protection laws.",
        "Real-time reporting and notifications enhance transparency.",
        "Integration-ready with multiple banks and mobile money platforms (M-PESA).",
        "Scalable infrastructure to handle thousands of employees and high transaction volumes.",
        "Supports financial wellness by reducing absenteeism and stress, improving workplace productivity.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-gray-800 dark:text-gray-200 transition-colors duration-500">
  {/* === Hero Section === */}
  <section className="relative overflow-hidden text-center py-28 px-6">
    <div className="absolute inset-0 bg-gradient-to-b from-green-600/10 via-emerald-500/10 to-transparent dark:from-green-700/30 dark:via-emerald-500/20 blur-3xl"></div>

    <motion.h1
      className="text-5xl md:text-7xl font-bold font-serif leading-tight bg-gradient-to-r from-green-700 to-emerald-400 bg-clip-text text-transparent relative z-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      How EaziWage Works
    </motion.h1>

    <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-300 relative z-10">
      From your day&apos;s work to your wallet - simplified, secure, and stress-free.
    </p>
  </section>

  {/* === Process Section === */}
  <section className="max-w-6xl mx-auto py-24 px-6 grid gap-20">
    {steps.map((step, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className={`flex flex-col gap-6 ${
          i % 2 !== 0 ? "md:flex-row-reverse md:items-start" : "md:flex-row md:items-start"
        }`}
      >
        {/* Icon */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-green-600 dark:bg-emerald-500 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
            {step.icon}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold mb-4 text-green-700 dark:text-emerald-400 font-serif">
            {step.title}
          </h2>
          {step.description.map((line, idx) => (
            <p
              key={idx}
              className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3 text-lg"
            >
              {line}
            </p>
          ))}
        </div>
      </motion.div>
    ))}
  </section>

  {/* === CTA Section === */}
  <section className="relative overflow-hidden bg-gradient-to-br from-green-700 to-emerald-500 dark:from-emerald-500 dark:to-green-700 text-white py-20 text-center">
    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent)]"></div>

    <motion.h2
      className="text-3xl md:text-4xl font-bold font-serif mb-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      Ready to Transform Workplace Finance?
    </motion.h2>
    <p className="mb-10 text-lg max-w-2xl mx-auto dark:text-gray-200">
      Join forward-thinking companies empowering employees with secure, on-demand wage access.
    </p>
    <a
      href="/contact"
      className="bg-white text-green-700 dark:bg-black dark:text-white font-semibold px-8 py-4 rounded-lg shadow-md hover:scale-105 transition-transform"
    >
      Get Started
    </a>
  </section>
</div>

  );
}
