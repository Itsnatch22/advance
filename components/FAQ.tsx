"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { PinnedFAQSection } from "@/components/shared/PinnedFAQSection";

const faqs = [
  {
    question: "What is earned wage access and how does EaziWage work?",
    answer:
      "Earned wage access allows employees to access part of their earned wages before payday. EaziWage integrates with payroll and mobile money to enable instant disbursements.",
  },
  {
    question: "Who can use EaziWage?",
    answer:
      "Our solution targets employees in Kenya, Uganda, Tanzania and Rwanda across sectors; eligibility is determined by payroll data and work history.",
  },
  {
    question: "What security measures are considered?",
    answer:
      "All sensitive account and contact information — including bank account numbers and phone numbers — is stored encrypted, not in plaintext. Authentication credentials, password reset tokens, and MFA backup codes are hashed, never stored in readable form. Admin actions are tracked through an internal audit log, and platform activity is monitored for suspicious logins and fraud signals in real time.",
  },
  {
    question: "Are there any fees associated with using EaziWage?",
    answer:
      "EaziWage offers a transparent pricing model with no hidden fees. While there may be nominal transaction fees and application fees for instant access, there are no interest charges or subscription fees.",
  },
  {
    question: "How to get started?",
    answer:
      "For employers: Visit the EaziWage Dashboard and register your company. For employees: Register through the EaziWage register page using your company's code, provided by your employer. If your employer isn't on EaziWage yet, you can still register and refer them — we'll reach out to get them onboarded.",
  },
];

export default function FAQ() {
  return (
    <PinnedFAQSection
      eyebrow="Help Center"
      title={
        <>
          Our{" "}
          <span className="bg-linear-to-r from-emerald-700 via-green-600 to-emerald-600 bg-clip-text text-transparent">
            Frequently
          </span>{" "}
          Asked Questions
        </>
      }
      intro="Answers to common questions about earned wage access, eligibility, fees, security, and getting started with EaziWage."
      faqs={faqs}
      footer={
        <Link href="/faq">
          <Button
            variant="outline"
            size="lg"
            className="group h-14 rounded-2xl border-slate-200 bg-white px-8 font-bold hover:bg-slate-50"
          >
            View All FAQs
            <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      }
    />
  );
}
