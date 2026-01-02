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
  BrainCircuit 
} from "lucide-react";
import Link from "next/link";
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
        desc: "Adoption, usage, and impact dashboards for HR, Finance, and Operations."
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
        answer: "Eaziwage seamlessly integrates with most major payroll systems through secure APIs. We also support CSV uploads for manual payroll systems. Our integration team will work closely with your HR and IT departments to ensure a smooth setup process."
    },
    {
        question: "What are the costs associated with implementing Eaziwage for our employees?",
        answer: "Eaziwage operates on a transparent pricing model with no hidden fees. Employers typically pay a nominal setup fee and a small transaction fee per withdrawal made by employees. There are no subscription fees or interest charges involved."
    },
    {
        question: "How does Eaziwage ensure the security and privacy of employee data?",
        answer: "Eaziwage prioritizes data security and privacy. We comply with all relevant data protection regulations, including ODPC guidelines. Employee data is encrypted both in transit and at rest, and we implement strict access controls to ensure that only authorized personnel can access sensitive information."
    },
    {
        question: "Can we customize the Eaziwage platform to align with our company policies?",
        answer: "Yes, Eaziwage offers a range of customization options to align with your company policies. You can set withdrawal limits, approval workflows, and define which employee groups have access to the service. Our platform is designed to be flexible to meet the unique needs of your organization."
    },
];


const complianceItems = [
  { text: "Regulated partners • Regulatory compliant" },
  { text: "Data protection assured" },
  { text: "Transparent pricing (Flat fee + 5%)" },
  { text: "Auto-settlement via payroll" },
];

export default function Employers() {
    return(
        <section className="min-h-screen w-full mx-auto relative py-16 sm:py-24 lg:py-32 flex flex-col items-center overflow-hidden">
            <UI/>
            <ComplianceStrip 
              items={complianceItems} 
              className="border-y border-gray-100 dark:border-white/10 py-6 sm:py-8 mb-16 sm:mb-24 backdrop-blur-sm" 
            />

            {/* Employers Reasons */}
            <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
                    <h2 className="font-serif text-gray-900 dark:text-white font-bold text-4xl sm:text-5xl lg:text-6xl mb-6 tracking-tight">
                        Why employers <span className="text-green-500">choose</span> EaziWage
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl leading-relaxed">
                        A practical well-being lever that pays for itself. Zero cost, zero risk, zero hassle.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
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
            
            <div className="w-full mt-24 sm:mt-32">
                <ROI/>
            </div>

            {/* Roll-Out Plans */}
            <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-24 sm:mt-32 lg:mt-40">
                <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
                    <h2 className="font-serif text-gray-900 dark:text-white font-bold text-4xl sm:text-5xl lg:text-6xl mb-6 tracking-tight">
                        Employer <span className="text-green-500">rollout plan</span>
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl leading-relaxed">
                        From sandbox to go live in days, not months. We handle the heavy lifting.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {rolloutPlans.map((item, j) => (
                    <motion.div
                    key={j}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: j * 0.1 }}
                    className="relative p-6 sm:p-8 rounded-3xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-green-200 dark:hover:border-green-800 transition-colors duration-300"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 shadow-sm flex items-center justify-center mb-6">
                            <item.icon className="w-6 h-6 text-gray-900 dark:text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                            {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {item.desc}
                        </p>
                    </motion.div>
                ))}
                </div>
            </div>

            <div className="w-full mt-24 sm:mt-32">
                <Integrations/>
            </div>

            {/* Works Areas */}
            <div className="w-full max-w-7xl px-2 sm:px-4 lg:px-6 mt-10 sm:mt-20 lg:mt-30">
                <div className="text-center lg:text-left mb-12">
                    <h2 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-gray-900 dark:text-white mb-6 tracking-tight">
                        Works across sectors & sizes
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0">
                        Retail • Hospitality • Manufacturing • Logistics • Banks • Schools • Healthcare
                    </p>
                </div>
                <div className="-mx-4 sm:mx-0">
                    <AppleCardsCarouselDemo />
                </div>
            </div>
             
             {/* FAQs */}
            <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-center text-gray-900 dark:text-white font-bold mb-12">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <FAQItem
                      key={index}
                      question={faq.question}
                      answer={faq.answer}
                      index={index}
                    />
                  ))}
                </div>
            </div>

            <div className="sticky bottom-6 z-50 px-4 w-full max-w-xl mx-auto">
                <motion.div 
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1, type: "spring" }}
                    className="rounded-2xl border border-gray-200/80 dark:border-white/10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-2xl p-4 flex items-center justify-between gap-4"
                >
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200 pl-2">
                        Ready to roll out earned wage access?
                    </div>
                    <Link 
                        href="#roi" 
                       className="shrink-0 rounded-xl px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white font-medium shadow-lg shadow-green-900/20 hover:shadow-green-900/30 hover:scale-105 transition-all duration-300"
                    >
                        Get ROI
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}