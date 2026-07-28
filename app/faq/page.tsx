"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  Search,
  Users,
  Building2,
  CreditCard,
  Shield,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "../../components/ui/input";
import { GridSystem } from "@/components/grid";
import { FloatingOrb } from "@/components/shared/FloatingOrb";
import { FAQCard } from "@/components/shared/FAQCard";

type FAQItem = {
  q: string;
  a: string;
};

type CategoryId =
  | "general"
  | "employees"
  | "employers"
  | "fees"
  | "security"
  | "technical";

const categories: {
  id: CategoryId;
  label: string;
  icon: React.ElementType;
}[] = [
  { id: "general", label: "General", icon: HelpCircle },
  { id: "employers", label: "For Employers", icon: Building2 },
  { id: "employees", label: "For Employees", icon: Users },
  { id: "fees", label: "Fees & Pricing", icon: CreditCard },
  { id: "security", label: "Security & Privacy", icon: Shield },
  { id: "technical", label: "Technical", icon: Clock },
];

const faqs: Record<CategoryId, FAQItem[]> = {
  general: [
    {
      q: "What is EaziWage?",
      a: "EaziWage is an Earned Wage Access (EWA) platform that allows workers to access a portion of their earned wages before their regular payday. It's not a loan — you're accessing money you've already earned but haven't been paid yet.",
    },
    {
      q: "Is EaziWage a loan?",
      a: "No, absolutely not. EaziWage is NOT a loan. You're accessing wages you've already earned through your work. There's no interest, no debt created, and no credit check required. A small transparent fee is charged for the service.",
    },
    {
      q: "Which countries is EaziWage available in?",
      a: "EaziWage is currently available in Kenya, Uganda, Tanzania, and Rwanda. Supported mobile wallets vary by country and include M-PESA, Airtel Money, MTN Mobile Money, and Tigo Pesa depending on where you're based.",
    },
    {
      q: "How is EaziWage different from payday loans?",
      a: "Unlike payday loans which charge 30-120% APR interest and create debt, EaziWage has zero interest and only charges a flat fee of 3.5% to 6.5% per advance, depending on your and your employer's risk profile. There's no debt created, no credit check, and no impact on your credit score.",
    },
    {
      q: "Do I need good credit to use EaziWage?",
      a: "No credit check is required. Since you're accessing your own earned wages, not borrowing money, your credit history doesn't matter. Everyone with verified employment is eligible.",
    },
  ],
  employees: [
    {
      q: "How do I sign up as an employee?",
      a: "First, check if your employer is registered with EaziWage. If yes, download our app or visit our website, complete the simple registration with your National ID, and verify your employment. The process takes about 5 minutes.",
    },
    {
      q: "What documents do I need to sign up?",
      a: "You'll need: (1) A valid National ID or passport, (2) A phone number registered in your name, (3) Employment verification from your employer, (4) Proof of bank account, and (5) Payslips. That's it — no guarantors required.",
    },
    {
      q: "How much can I access?",
      a: "It depends on your country: Kenya up to 50%, Uganda up to 60%, Tanzania up to 30%, Rwanda up to 45% of your earned (but unpaid) wages. Your employer may also set a lower limit than the country cap. The exact amount available is shown in your dashboard.",
    },
    {
      q: "How fast will I receive my money?",
      a: "Mobile wallet transfers are near-instant. Bank transfers may take 1-2 business days depending on your bank.",
      // TODO(Mark): "<3s" claim on the homepage has no backing timing data in
      // dusupay_transactions (only a completion webhook event is stored, no
      // initiation timestamp). Either instrument real elapsed-time tracking
      // or drop the specific number until you can prove it.
    },
    {
      q: "When do I pay back the advance?",
      a: "The advance amount plus fees is deducted from your pay at your next payday, coordinated through your employer's payroll process.",
      // TODO(Mark): current copy said this is "completely automatic" with
      // "no reminders, no hassle." There is no DB-level trigger yet that
      // automatically subtracts advances from final employee pay at payday
      // (payday_recoupments has 0 rows, and this was flagged as an open gap).
      // Don't publish "automatic" language until that logic actually exists.
    },
    {
      q: "Can I take multiple advances?",
      a: "Yes, you can take multiple advances as long as you stay within your available limit and any frequency caps set by your employer. Each advance has its own fee calculated independently — there's no compounding.",
    },
    {
      q: "What if my employer isn't on EaziWage?",
      a: "You can recommend EaziWage to your HR department! Share our employer page with them. Once they register and verify your employment, you'll be able to access your earned wages.",
    },
  ],
  employers: [
    {
      q: "Does EaziWage cost employers anything?",
      a: "No, EaziWage is completely free for employers. There are no setup fees, no monthly charges, and no costs per transaction. Employees pay a small fee on each advance they take.",
      // NOTE(Mark): worth double-checking this against employers.processing_fee
      // (currently 4.5% on both live employer records) — confirm that field
      // represents the employer's fee *tier* passed down to employee advances,
      // not a cost billed to the employer directly, before this claim goes live.
    },
    {
      q: "How does EaziWage integrate with our payroll?",
      a: "We offer multiple integration options: API integration for automated sync, manual CSV upload for periodic updates, or direct integration with popular payroll systems. Our team will help you choose the best option.",
    },
    {
      q: "How long does implementation take?",
      a: "Most employers are live within the first hour after onboarding. This includes company verification, payroll integration setup, and employee onboarding. We provide dedicated support throughout the process.",
    },
    {
      q: "Can we customize advance limits and policies?",
      a: "Absolutely. You can set a lower advance limit than your country's base cap, frequency caps (e.g., max 2 advances per month), minimum employment tenure requirements, and more. You maintain full control.",
    },
    {
      q: "Will employees see their individual transactions?",
      a: "Employers only see aggregated program-level data — total advances, average amounts, and overall utilization across the company. Individual employee balances and transaction history are not visible to employers. Employees can see their own transaction history and balance in their own dashboard.",
      // Removed the old "not tracked at all, for anyone — including EaziWage
      // internally" line. That's false: advances, risk factors, and KYC
      // records are all tracked per-employee internally. Publishing that
      // exact claim is a compliance liability if it's ever quoted back at you.
    },
    {
      q: "What happens during payroll processing?",
      a: "Ahead of each payroll run, we'll provide you with the total amount to deduct for each employee who took advances, so you can include it in your normal payroll process.",
      // TODO(Mark): you already flagged this "deduction file" feature as
      // described-as-live-but-not-built in your last FAQ audit. Still unfixed
      // in this source file. Either ship the feature or keep the copy vague
      // until it exists.
    },
  ],
  fees: [
    {
      q: "What are EaziWage's fees?",
      a: "Fees range from 3.5% to 6.5% per advance, depending on your and your employer's risk profile. The exact fee is always shown before you confirm any transaction — no surprises. We provide nudges to help you reduce your advance fees over time.",
      // Original text had a garbled fragment ("3.5% to 6.5%.8 transaction
      // fee per advance") — cleaned up. Ceiling of 6.5% matches the actual
      // fee formula: Bf(3.5%) + Rf(3.0%) x (1 - CRS/5), worst case CRS=0.
    },
    {
      q: "Are there any hidden fees?",
      a: "Absolutely not. The fee shown when you request an advance is the only fee you'll ever pay. No late fees, no penalties, no monthly charges, no interest. We're committed to complete transparency.",
    },
    {
      q: "How is my fee rate determined?",
      a: "Your fee depends on two factors: (1) Your employer's risk score based on sector, employee retention rate, and compliance, and (2) Your personal risk score based on tenure, advance history, and tax compliance status. Good usage habits can lower your fee over time.",
    },
    {
      q: "Is there interest on advances?",
      a: "No interest, ever. Unlike loans, EaziWage charges a flat fee per advance. This fee doesn't compound or grow over time. You pay the same amount whether you repay immediately or at the end of the month.",
    },
    {
      q: "Can my employer subsidize the fees?",
      a: "Yes! We can negotiate employer-subsidized fees as part of your employee benefits package on EaziWage. Contact our sales team to learn about employer-subsidized pricing options.",
    },
  ],
  security: [
    {
      q: "Is my data safe with EaziWage?",
      a: "Yes. We use bank-grade 256-bit encryption for all data transmission and storage. We're fully compliant with local data protection regulations and never share your personal information with third parties without consent.",
    },
    {
      q: "Can my employer see my transactions?",
      a: "No. Employers only see aggregated statistics — they cannot see individual employee balances or transaction history. Your financial privacy is fully protected.",
    },
    {
      q: "What security measures protect my account?",
      a: "Multiple layers: (1) Encrypted data transmission, (2) Two-factor authentication option, (3) Biometric login on mobile, (4) Session timeouts, (5) Suspicious activity monitoring, (6) Secure mobile wallet integration.",
    },
    {
      q: "Is EaziWage regulated?",
      a: "Yes. We operate in full compliance with financial services regulations in each country we serve. This includes data protection laws, consumer protection regulations, and mobile money guidelines.",
    },
    {
      q: "What happens if someone tries to access my account?",
      a: "Our system monitors for suspicious activity. Multiple failed login attempts trigger account lockout and alert notifications. We recommend enabling two-factor authentication for additional security.",
    },
  ],
  technical: [
    {
      q: "What payment methods are supported?",
      a: "We support major mobile wallet providers including M-PESA, MTN Mobile Money, Airtel Money, and Tigo Pesa, depending on the market you're in. Bank transfers are also available.",
    },
    {
      q: "Is there a mobile app?",
      a: "There is a dedicated roadmap for development already, no release date confirmed yet. In the meantime, the web app works well on mobile browsers, so you're not stuck waiting.",
    },
    {
      q: "What if my mobile wallet provider is down?",
      a: "We monitor mobile money provider status continuously. If your primary provider is experiencing issues, you can choose an alternative payment method. We'll also notify you of any known outages.",
    },
    {
      q: "Can I use EaziWage offline?",
      a: "You need an internet connection to request advances since transactions are processed in real-time. However, you can view your balance and transaction history offline once data has been synced.",
    },
    {
      q: "How do I reset my password?",
      a: "Click 'Forgot Password' on the login page, enter your registered email or phone number, and follow the instructions sent to you. For additional security help, contact our support team.",
    },
  ],
};

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<number | null>(0);

  const filteredFaqs: FAQItem[] = searchQuery
    ? Object.values(faqs)
        .flat()
        .filter(
          (faq: FAQItem) =>
            faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    : faqs[activeCategory];

  const currentCategory = categories.find((c) => c.id === activeCategory);

  return (
    <GridSystem variant="dots" opacity={0.03} className="min-h-screen bg-white">
      {/* Immersive Background */}
      <div className="pointer-events-none absolute inset-0">
        <FloatingOrb
          color="bg-green-100"
          delay={0}
          className="top-[-10%] left-[10%]"
        />
        <FloatingOrb
          color="bg-emerald-100"
          delay={2}
          className="top-[30%] right-[5%]"
        />
      </div>

      {/* HERO */}
      <section className="relative pt-40 pb-32 lg:pt-56 lg:pb-48">
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase backdrop-blur-md"
          >
            <HelpCircle size={14} className="animate-pulse" />
            <span>Help Center</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl lg:text-8xl"
          >
            Frequently Asked{" "}
            <span className="bg-linear-to-r from-emerald-700 via-green-600 to-emerald-600 bg-clip-text text-transparent">
              Questions
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="mx-auto mt-8 mb-16 max-w-2xl text-xl text-slate-500"
          >
            Real answers. No support tickets required.
          </motion.p>

          {/* SEARCH */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="group relative mx-auto max-w-2xl"
          >
            <Search className="absolute top-1/2 left-6 h-6 w-6 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-green-600" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="h-20 rounded-3xl border-slate-200 bg-white/80 pr-8 pl-16 text-xl shadow-2xl backdrop-blur-xl transition-all focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
            />
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES */}
      {!searchQuery && (
        <section className="relative z-10 border-y border-slate-100 bg-white/40 py-12 backdrop-blur-md">
          <div className="flex flex-wrap justify-center gap-4 px-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-3 rounded-2xl px-8 py-4 text-sm font-black tracking-widest uppercase transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "scale-105 bg-slate-900 text-white shadow-2xl"
                    : "border border-slate-200 bg-white text-slate-400 hover:border-green-500 hover:text-green-600"
                }`}
              >
                <cat.icon size={18} />
                {cat.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* FAQ LIST */}
      <section className="relative z-10 py-40">
        <div className="mx-auto max-w-4xl px-6">
          {!searchQuery && currentCategory && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={activeCategory}
              className="mb-16 flex items-center gap-6"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600 shadow-sm ring-1 ring-green-500/10">
                <currentCategory.icon size={28} />
              </div>
              <h2 className="font-serif text-4xl font-bold tracking-tight text-slate-900">
                {currentCategory.label}
              </h2>
            </motion.div>
          )}

          <div className="space-y-6">
            {filteredFaqs.map((faq, index) => (
              <FAQCard
                key={index}
                question={faq.q}
                answer={faq.a}
                isOpen={openItems === index}
                onToggle={() => setOpenItems(openItems === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>
    </GridSystem>
  );
}
