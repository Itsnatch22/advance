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
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right" ) => {
        if(!scrollRef.current) return;
        const { scrollLeft, clientWidth } =scrollRef.current;
        const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
        scrollRef.current.scrollTo({
            left: scrollLeft + scrollAmount,
            behavior: "smooth",
        });
    };
    return(
        <section className="min-h-screen mx-auto relative py-12 sm:py-16 lg:py-20 flex flex-col items-center">
            {/*Compliance Strip */}
            <div className="bg-gray-50 border border-gray-200 w-full items-center justify-center py-3 px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
                <div className="flex flex-wrap text-xs sm:text-sm items-center justify-center gap-3 sm:gap-4 lg:gap-6 text-gray-700">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-green-500"/>
                        Regulated partners • CBK-aligned
                    </div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-green-500"/>
                        ODPC-compliant data handling
                    </div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-green-500"/>
                        Transparent pricing (KSh 25 + 5%)
                    </div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-green-500"/>
                        Auto-settlement via payroll
                    </div>
                </div>
            </div>
            {/*Employers Reasons */}
            <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 lg:mt-12">
                <h2 className="text-gray-800 mb-3 sm:mb-4 font-semibold text-xl sm:text-2xl lg:text-3xl font-serif">Why employers choose Eaziwage</h2>
                <p className="mt-2 max-w-prose text-sm sm:text-base text-gray-600">A practical well-being lever that pays for itself</p>

                <div className="mt-8 sm:mt-10 lg:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                    {reasons.map((item,i) => (
                        <motion.div
                        key={i}
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full p-4 sm:p-5 lg:p-6 shadow-sm border border-gray-400 rounded-xl sm:rounded-2xl"
                        >
                            <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mb-3 sm:mb-4"/>
                            <h3 className="text-base sm:text-lg lg:text-xl text-gray-900 font-medium">{item.title}</h3>
                            <p className="text-sm sm:text-base text-gray-600 mt-2">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/*Roll-Out Plans*/}
            <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 lg:mt-20">
                <h2 className="font-serif mb-3 sm:mb-4 text-xl sm:text-2xl lg:text-3xl font-semibold">Employer rollout plan</h2>
                <p className="max-w-prose leading-tight text-sm sm:text-base text-gray-600 mt-2 sm:mt-4">From sandbox to go live in days, not months.</p>

                <div className="mt-8 sm:mt-10 lg:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                    {rolloutPlans.map((item,j) => (
                        <motion.div
                        key={j}
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full p-4 sm:p-5 lg:p-6 shadow-sm border border-gray-400 rounded-xl sm:rounded-2xl"
                        >
                            <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mb-3 sm:mb-4"/>
                            <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900">{item.title}</h3>
                            <p className="mt-2 text-gray-600 text-sm sm:text-base">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Works areas */}
            <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 lg:mt-20">
                <h2 className="font-serif font-semibold text-xl sm:text-2xl lg:text-3xl">Works across sectors & sizes</h2>
                <p className="max-w-prose leading-tight mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">Retail • Hospitality • Manufacturing • Logistics • Banks • Schools • Healthcare</p>
                <AppleCardsCarouselDemo/>
            </div>
        </section>
    )
}