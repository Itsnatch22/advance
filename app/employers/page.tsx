"use client"
import { motion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { User, Wallet, Cog, LineChart, Lock, BadgeCheck, Clipboard, CircuitBoard, BrainCircuit, ShieldCheck, ChevronRight, ChevronLeft } from "lucide-react";
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

const images = [
    "/eaziwage/automotive.png",
    "/eaziwage/banking.png",
    "/eaziwage/retail.png",
    "/eaziwage/support.png",
    "/eaziwage/cons",
];
export default function Employers() {
    return(
        <section className="min-h-screen w-full mx-auto relative py-10 sm:py-14 lg:py-20 flex flex-col items-center">
            {/* Compliance Strip */}
            <div className="w-full bg-gray-50 border border-gray-200 py-3 sm:py-4 px-3 sm:px-6 lg:px-10 mb-8 sm:mb-10">
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-6 text-[0.75rem] sm:text-sm text-gray-700 text-center">
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
                <h2 className="font-serif text-gray-800 font-semibold text-xl sm:text-2xl lg:text-3xl mb-2 sm:mb-3">
                Why employers choose Eaziwage
                </h2>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-prose">
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
                <h2 className="font-serif text-gray-900 font-semibold text-xl sm:text-2xl lg:text-3xl mb-2 sm:mb-3">
                Employer rollout plan
                </h2>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-prose">
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
                <h2 className="font-serif font-semibold text-xl sm:text-2xl lg:text-3xl text-gray-900">
                Works across sectors & sizes
                </h2>
                <p className="text-gray-600 text-sm sm:text-base mt-3 sm:mt-4 max-w-prose mx-auto lg:mx-0">
                Retail • Hospitality • Manufacturing • Logistics • Banks • Schools •
                Healthcare
                </p>
                <div className="mt-10 sm:mt-12">
                <AppleCardsCarouselDemo />
                </div>
            </div>
        </section>
    )
}