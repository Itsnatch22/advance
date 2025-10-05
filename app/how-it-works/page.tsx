"use client";

import { FiCalendar, FiPhone, FiCheckCircle, FiLock } from "react-icons/fi"
import { Calculator } from "lucide-react";

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
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero */}
      <section className="bg-gray-50 py-24 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-green-700 font-serif">
          How EaziWage Works
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-gray-600">
          Seamless, secure, and transparent salary advances in a few simple steps.
        </p>
      </section>

      <section className="max-w-6xl mx-auto py-20 px-6 grid gap-16">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`flex flex-col gap-4 ${
              i % 2 !== 0 ? "md:flex-row-reverse md:items-start" : "md:flex-row md:items-start"
            }`}
          >
            {/* Icon placeholder */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12  rounded-full flex items-center justify-center text-white font-bold text-lg">
                {step.icon}
              </div>
            </div>
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold mb-4 text-green-700 font-mono">{step.title}</h2>
              {step.description.map((line, idx) => (
                <p key={idx} className="text-gray-600 leading-relaxed mb-2">
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="bg-green-700 text-white py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4 font-serif">Ready to Streamline Workplace Finance?</h2>
        <p className="mb-8 text-lg max-w-2xl mx-auto">
          Join EaziWage and empower your employees with safe, seamless salary advances.
        </p>
        <a
          href="/contact"
          className="bg-white text-green-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
        >
          Get Started
        </a>
      </section>
    </div>
  );
}
