"use client"
import { motion } from "framer-motion";
import { User, Wallet, Cog, LineChart, Lock, BadgeCheck, Clipboard, CircuitBoard, BrainCircuit, ShieldCheck, ChevronRight, ArrowRight } from "lucide-react";
import { AppleCardsCarouselDemo } from "@/components/Carousel";

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

export default function Employers() {
    return(
        <section className="min-h-screen w-full mx-auto relative py-10 sm:py-14 lg:py-20 flex flex-col items-center">
            {/* Employer Dashboard */}
            <div className="w-full min-h-screen mx-auto bg-gray-300 rounded-2xl px-10 py-10 mb-10 sm:mb-24 lg:mb-32 flex items-center justify-center">
                <h1 className="font-medium font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl animate-pulse text-green-400">Dashboard to be displayed here</h1>
            </div>
            {/* Compliance Strip */}
            <div className="w-full bg-gray-50 dark:bg-black  py-3 sm:py-4 px-3 sm:px-6 lg:px-10 mb-8 sm:mb-10">
                <div className="flex py-8 flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-6 text-[0.75rem] sm:text-sm text-gray-700 dark:text-white text-center">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
                    <span>Regulated partners • CBK-aligned</span>
                </div>
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
                    <span>ODPC-compliant data handling</span>
                </div>
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
                    <span>Transparent pricing (KSh 25 + 5%)</span>
                </div>
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
                    <span>Auto-settlement via payroll</span>
                </div>
                </div>
            </div>

            {/* Employers Reasons */}
            <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-10 mt-10 sm:mt-14">
                <h2 className="font-serif text-gray-800 dark:text-white font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-2 sm:mb-3">
                Why employers choose Eaziwage
                </h2>
                <p className="text-gray-600 text-sm dark:text-white sm:text-base leading-relaxed max-w-prose">
                A practical well-being lever that pays for itself
                </p>

                <div className="mt-8 sm:mt-10 lg:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
                {reasons.map((item, i) => (
                    <motion.div
                    key={i}
                    initial={{ opacity: 0, y: -40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="w-full p-4 sm:p-5 lg:p-6 border border-gray-300 shadow-sm rounded-xl sm:rounded-2xl bg-white hover:shadow-md transition"
                    >
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-black mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg lg:text-xl text-gray-900 font-medium">
                        {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mt-2 leading-snug">
                        {item.desc}
                    </p>
                    </motion.div>
                ))}
                </div>
            </div>

            {/* Roll-Out Plans */}
            <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-10 mt-14 sm:mt-16 lg:mt-20">
                <h2 className="font-serif dark:text-white text-gray-900 font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-2 sm:mb-3">
                Employer rollout plan
                </h2>
                <p className="text-gray-600 dark:text-white text-sm sm:text-base leading-relaxed max-w-prose">
                From sandbox to go live in days, not months.
                </p>

                <div className="mt-8 sm:mt-10 lg:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
                {rolloutPlans.map((item, j) => (
                    <motion.div
                    key={j}
                    initial={{ opacity: 0, y: -40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: j * 0.1 }}
                    className="w-full p-4 sm:p-5 lg:p-6 border border-gray-300 shadow-sm rounded-xl sm:rounded-2xl bg-white hover:shadow-md transition"
                    >
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-black mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900">
                        {item.title}
                    </h3>
                    <p className="mt-2 text-gray-600 text-sm sm:text-base leading-snug">
                        {item.desc}
                    </p>
                    </motion.div>
                ))}
                </div>
            </div>

            {/* Works Areas */}
            <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-10 mt-14 sm:mt-16 lg:mt-20 text-center lg:text-left">
                <h2 className="font-serif font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl dark:text-white text-gray-900">
                Works across sectors & sizes
                </h2>
                <p className="text-gray-600 text-sm sm:text-base mt-3 sm:mt-4 dark:text-white max-w-prose mx-auto lg:mx-0">
                Retail • Hospitality • Manufacturing • Logistics • Banks • Schools •
                Healthcare
                </p>
                <div className="mt-3 sm:mt-5">
                <AppleCardsCarouselDemo />
                </div>
            </div>
             
             {/* FAQs */}
            <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 w-full lg:px-10 mt-2 sm:mt-3 lg:mt-4">
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-white font-semibold">Employer Frequently Asked Questions</h2>
                <div className="mt-6 divide-y divide-gray-200 border border-gray-200 rounded-2xl bg-white">
                {faqs.map((faqs,index) => (
                    <details key={index} className="group p-5">
                    <summary className="flex dark:text-black cursor-pointer items-center justify-between text-base sm:text-lg font-medium">
                        {faqs.question}
                        <ArrowRight className="ml-2 h-5 w-5 shrink-0 transition-transform duration-200 group-open:rotate-90" />
                    </summary>
                    <p className="mt-4 leading-7 text-gray-600 text-base sm:text-lg">{faqs.answer}</p>
                    </details>
                ))}
                </div>
            </div>
        </section>
    )
}