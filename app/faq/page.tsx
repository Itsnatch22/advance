"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Users,
  Building2,
  CreditCard,
  Shield,
  Clock,
  MessageSquare,
  Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

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
  icon: typeof HelpCircle;
  color: string;
}[] = [
  {
    id: "general",
    label: "General",
    icon: HelpCircle,
    color: "from-primary to-emerald-600",
  },
  {
    id: "employees",
    label: "For Employees",
    icon: Users,
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "employers",
    label: "For Employers",
    icon: Building2,
    color: "from-teal-500 to-primary",
  },
  {
    id: "fees",
    label: "Fees & Pricing",
    icon: CreditCard,
    color: "from-primary to-emerald-500",
  },
  {
    id: "security",
    label: "Security & Privacy",
    icon: Shield,
    color: "from-emerald-600 to-teal-600",
  },
  {
    id: "technical",
    label: "Technical",
    icon: Clock,
    color: "from-teal-600 to-primary",
  },
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
      a: "EaziWage is currently available in Kenya, Uganda, Tanzania, and Rwanda. We support local mobile wallet providers in each country including Mobile Wallet services like MTN Mobile Money, Airtel Money, and others.",
    },
    {
      q: "How is EaziWage different from payday loans?",
      a: "Unlike payday loans which charge 30-120% APR interest and create debt, EaziWage has zero interest and only charges a small flat fee (3.5-6.5%). There's no debt created, no credit check, and no impact on your credit score.",
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
      a: "You'll need: (1) A valid National ID or passport, (2) A phone number registered in your name, (3) Employment verification from your employer. That's it — no pay slips, bank statements, or guarantors required.",
    },
    {
      q: "How much can I access?",
      a: "You can access up to 50% of your earned (but unpaid) wages at any time. This limit helps ensure responsible usage and that you have enough for regular expenses. The exact amount available is shown in your dashboard.",
    },
    {
      q: "How fast will I receive my money?",
      a: "Instantly! Once you confirm the advance, funds are sent to your Mobile Wallet in under 3 seconds. Bank transfers may take 1-2 business days depending on your bank.",
    },
    {
      q: "When do I pay back the advance?",
      a: "The advance amount plus fee is automatically deducted from your next paycheck. You don't need to do anything — it's completely automatic. No separate payments, no reminders, no hassle.",
    },
    {
      q: "Can I take multiple advances?",
      a: "Yes, you can take multiple advances as long as you stay within your available limit (50% of earned wages). Each advance has its own fee calculated independently — there's no compounding.",
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
    },
    {
      q: "How does EaziWage integrate with our payroll?",
      a: "We offer multiple integration options: API integration for automated sync, manual CSV upload for periodic updates, or direct integration with popular payroll systems. Our team will help you choose the best option.",
    },
    {
      q: "How long does implementation take?",
      a: "Most employers are live within 1-2 weeks. This includes company verification, payroll integration setup, and employee onboarding. We provide dedicated support throughout the process.",
    },
    {
      q: "Can we customize advance limits and policies?",
      a: "Absolutely. You can set custom advance limits (e.g., 30% instead of 50%), frequency caps (e.g., max 2 advances per month), minimum employment tenure requirements, and more. You maintain full control.",
    },
    {
      q: "Will employees see their individual transactions?",
      a: "Employers only see aggregated data — total advances, average amounts, usage rates, etc. Individual employee transactions and balances are kept private to protect employee confidentiality.",
    },
    {
      q: "What happens during payroll processing?",
      a: "Before each payroll run, we provide a deduction file showing the total amount to deduct from each employee who took advances. You simply include these deductions in your normal payroll — we handle everything else.",
    },
  ],
  fees: [
    {
      q: "What are EaziWage's fees?",
      a: "Fees range from 3.5% to 6.5% per advance, depending on your employer's plan tier and your personal risk profile. The exact fee is always shown before you confirm any transaction — no surprises.",
    },
    {
      q: "Are there any hidden fees?",
      a: "Absolutely not. The fee shown when you request an advance is the only fee you'll ever pay. No late fees, no penalties, no monthly charges, no interest. We're committed to complete transparency.",
    },
    {
      q: "How is my fee rate determined?",
      a: "Your fee depends on two factors: (1) Your employer's plan tier (Starter, Business, or Enterprise), and (2) Your personal risk score based on tenure, advance history, and repayment record. Good usage habits can lower your fee over time.",
    },
    {
      q: "Is there interest on advances?",
      a: "No interest, ever. Unlike loans, EaziWage charges a flat fee per advance. This fee doesn't compound or grow over time. You pay the same amount whether you repay immediately or at the end of the month.",
    },
    {
      q: "Can my employer subsidize the fees?",
      a: "Yes! Enterprise customers can negotiate employer-subsidized fees as part of their employee benefits package. Contact our sales team to learn about employer-subsidized pricing options.",
    },
  ],
  security: [
    {
      q: "Is my data safe with EaziWage?",
      a: "Yes. We use bank-grade 256-bit encryption for all data transmission and storage. We're fully compliant with local data protection regulations and never share your personal information with third parties without consent.",
    },
    {
      q: "Can my employer see my transactions?",
      a: "No. Employers only see aggregated statistics — they cannot see individual employee advances, balances, or transaction history. Your financial privacy is fully protected.",
    },
    {
      q: "What security measures protect my account?",
      a: "Multiple layers: (1) Encrypted data transmission, (2) Two-factor authentication option, (3) Biometric login on mobile, (4) Session timeouts, (5) Suspicious activity monitoring, (6) Secure Mobile Wallet integration.",
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
      a: "We support all major Mobile Wallet providers including MTN Mobile Money, Airtel Money, and other local mobile money services across all markets. Bank transfers are also available.",
    },
    {
      q: "Is there a mobile app?",
      a: "Yes! EaziWage is available as a mobile app for iOS and Android, as well as a web application. All features are available across all platforms with real-time sync.",
    },
    {
      q: "What if my Mobile Wallet provider is down?",
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
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  const toggleItem = (index: number) => {
    setOpenItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

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
    <div className="min-h-screen bg-white text-slate-900">

      {/* HERO */}
      <section className="relative overflow-hidden pt-32 pb-24 bg-linear-to-b from-slate-50 to-white">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-125 w-125-translate-x-1/2 bg-emerald-500/10 blur-[140px] rounded-full" />
        </div>

        <div className="mx-auto max-w-4xl text-center px-6">

          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-700">
            <HelpCircle className="h-4 w-4" />
            Help Center
          </div>

          <h1 className="font-serif mb-6 text-5xl sm:text-6xl font-bold">
            Frequently Asked <span className="text-emerald-600">Questions</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-xl text-slate-600">
            Real answers. No support tickets required.
          </p>

          {/* SEARCH */}
          <div className="relative mx-auto max-w-xl">
            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="h-14 rounded-2xl border-2 border-slate-200 bg-white/70 backdrop-blur-xl pl-12 text-lg focus:border-emerald-500"
            />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      {!searchQuery && (
        <section className="border-y border-slate-200 bg-white py-10">
          <div className="flex flex-wrap justify-center gap-3 px-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all
                ${
                  activeCategory === cat.id
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
                }`}
              >
                <cat.icon className="h-4 w-4" />
                {cat.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* FAQ LIST */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">

          {!searchQuery && currentCategory && (
            <div className="mb-10 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <currentCategory.icon className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold">{currentCategory.label}</h2>
            </div>
          )}

          <div className="space-y-4">

            {filteredFaqs.map((faq, i) => {
              const open = openItems[i];

              return (
                <motion.div
                  key={i}
                  layout
                  className="rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <button
                    onClick={() => toggleItem(i)}
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <h3 className="pr-4 text-lg font-semibold">{faq.q}</h3>

                    {open ? (
                      <ChevronUp className="text-emerald-600" />
                    ) : (
                      <ChevronDown className="text-slate-400" />
                    )}
                  </button>

                  <AnimatePresence>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-6 text-slate-600"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

          </div>
        </div>
      </section>
    </div>
  );
}
