"use client";

import React, { useState, MouseEvent } from "react";
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
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
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
  icon: any;
}[] = [
  { id: "general", label: "General", icon: HelpCircle },
  { id: "employees", label: "For Employees", icon: Users },
  { id: "employers", label: "For Employers", icon: Building2 },
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

const FloatingOrb = ({ color, delay, className }: { color: string; delay: number; className?: string }) => (
  <motion.div
    animate={{
      y: [0, -40, 0],
      x: [0, 20, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 10 + Math.random() * 5,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
    className={`absolute h-[500px] w-[500px] rounded-full blur-[120px] opacity-20 ${color} ${className}`}
  />
);

const FAQItemCard = ({ faq, isOpen, toggle }: { faq: FAQItem; isOpen: boolean; toggle: () => void }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 150, damping: 20 });

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  }

  return (
    <motion.div style={{ perspective: 1000 }} className="w-full">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        style={{ rotateX, rotateY }}
        className={`group relative overflow-hidden rounded-[2rem] border border-slate-200/60 transition-all duration-500 ${
          isOpen ? "bg-white shadow-2xl shadow-green-500/10 ring-1 ring-green-500/20" : "bg-white/40 backdrop-blur-2xl hover:bg-white"
        }`}
      >
        <motion.div
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([mx, my]) => `radial-gradient(350px circle at ${mx}px ${my}px, rgba(34, 197, 94, 0.04), transparent 80%)`
            ),
          }}
          className="absolute inset-0 pointer-events-none"
        />

        <button
          onClick={toggle}
          className="relative z-10 flex w-full items-center justify-between p-8 text-left"
        >
          <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${isOpen ? "text-green-700" : "text-slate-900"}`}>
            {faq.q}
          </span>
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-500 ${
            isOpen ? "bg-green-600 text-white rotate-180" : "bg-slate-100 text-slate-500 group-hover:bg-green-500 group-hover:text-white"
          }`}>
            <ChevronDown size={20} />
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="px-8 pb-8">
                <div className="h-px w-full bg-slate-100 mb-8" />
                <p className="text-lg leading-relaxed text-slate-500">
                  {faq.a}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className={`absolute bottom-0 left-0 h-1.5 w-0 bg-green-600 transition-all duration-700 ${isOpen ? "w-full" : "group-hover:w-full"}`} />
      </motion.div>
    </motion.div>
  );
};

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (q: string) => {
    setOpenItems((prev) => ({ ...prev, [q]: !prev[q] }));
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
    <main className="relative min-h-screen overflow-hidden bg-white">
      {/* Immersive Background */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingOrb color="bg-green-100" delay={0} className="top-[-10%] left-[10%]" />
        <FloatingOrb color="bg-emerald-100" delay={2} className="top-[30%] right-[5%]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
      </div>

      {/* HERO */}
      <section className="relative pt-40 pb-32 lg:pt-56 lg:pb-48">
        <div className="relative z-10 mx-auto max-w-5xl text-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-green-600 backdrop-blur-md"
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
            Frequently Asked <span className="italic text-green-600">Questions</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="mt-8 mx-auto mb-16 max-w-2xl text-xl text-slate-500"
          >
            Real answers. No support tickets required.
          </motion.p>

          {/* SEARCH */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative mx-auto max-w-2xl group"
          >
            <Search className="absolute top-1/2 left-6 h-6 w-6 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-green-600" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="h-20 rounded-3xl border-slate-200 bg-white/80 pl-16 pr-8 text-xl shadow-2xl backdrop-blur-xl transition-all focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
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
                className={`flex items-center gap-3 rounded-2xl px-8 py-4 text-sm font-black uppercase tracking-widest transition-all duration-300
                ${
                  activeCategory === cat.id
                    ? "bg-slate-900 text-white shadow-2xl scale-105"
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
      <section className="relative z-10 py-32 lg:py-48">
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
              <h2 className="font-serif text-4xl font-bold tracking-tight text-slate-900">{currentCategory.label}</h2>
            </motion.div>
          )}

          <div className="space-y-6">
            {filteredFaqs.map((faq, i) => (
              <FAQItemCard
                key={faq.q}
                faq={faq}
                isOpen={!!openItems[faq.q]}
                toggle={() => toggleItem(faq.q)}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
