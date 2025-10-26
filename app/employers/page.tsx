"use client"
import { motion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { User, Wallet, Cog, LineChart, Lock, BadgeCheck, Clipboard, CircuitBoard, BrainCircuit, ShieldCheck, ChevronRight, ChevronLeft } from "lucide-react";

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
    "/cta.jpg",
    "/images/card2.webp",
    "/images/card3.webp",
    "/images/card4.webp",
    "/images/card5.webp",
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
        <section className="min-h-screen mx-auto relative py-16 sm:py-20 flex flex-col items-center">
            {/*Compliance Strip */}
            <div className="bg-gray-50 border border-gray-200 w-full h-15 items-center justify-center py-3 px-4 sm:px-6 mb-5">
                <div className="flex flex-wrap text-sm items-center justify-center gap-6 text-gray-700">
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
            <div className="max-w-7xl px-4 sm:px-6 mt-10">
                <h2 className="text-gray-800 mb-4 font-semibold text-2xl sm:text-3xl font-serif">Why employers choose Eaziwage</h2>
                <p className="mt-2 max-w-prose text-gray-600">A practical well-being lever that pays for itself</p>

                <div className="mt-10 sm:mt-12 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6">
                    {reasons.map((item,i) => (
                        <motion.div
                        key={i}
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full maw-w-sm p-5 sm:p-6 shadow-sm border border-gray-400 rounded-2xl"
                        >
                            <item.icon className="w-5 h-5 text-green-500 mb-4"/>
                            <h3 className="text-lg sm:text-xl text-gray-900 font-medium">{item.title}</h3>
                            <p className="text-sm text-gray-400 mt-2">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/*Roll-Out Plans*/}
            <div className="max-w-7xl px-6 mt-10">
                <h2 className="font-serif mt-6 mb-2 text-2xl sm:text-3xl font-semibold">Employer rollout plan</h2>
                <p className="max-w-prose leading-tight text-gray-600 mt-4">From sandbox to go live in days, not months.</p>

                <div className="mt-10 sm:mt-12 grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-6">
                    {rolloutPlans.map((item,j) => (
                        <motion.div
                        key={j}
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-sm p-5 sm:p-6 shadow-sm border border-gray-400 rounded-2xl"
                        >
                            <item.icon className="w-5 h-5 text-green-500 mb-4"/>
                            <h3 className="text-lg font-medium sm:text-xl text-gray-900">{item.title}</h3>
                            <p className="mt-2 text-gray-400 text-sm">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Works areas */}
            <div className="max-w-7xl px-6 mt-10">
                <h2 className="font-serif mt-6 font-semibold sm:text-3xl text-2xl">Works across sectors & sizes</h2>
                <p className="max-w-prose leading-tight mt-4 text-gray-600">Retail • Hospitality • Manufacturing • Logistics • Banks • Schools • Healthcare</p>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
                    <button
                    onClick={() => scroll("left")}
                    className="p-2 rounded-full bg-white/70 dark:bg-neutral-800/70 backdrop-blur-md hover:scale-105 transition">
                       <ChevronLeft className="w-5 h-5" /> 
                    </button>
                </div>
                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-10 scrollbar-hide"
                >
                    {images.map((src, i) => (
                    <div
                        key={i}
                        className="snap-center flex-shrink-0 w-[300px] h-[300px] relative rounded-3xl overflow-hidden shadow-xl mt-10"
                    >
                        <Image
                        src={src}
                        alt={`Card ${i + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                    ))}
                </div>

                {/* right button */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
                    <button
                    onClick={() => scroll("right")}
                    className="p-2 rounded-full bg-white/70 dark:bg-neutral-800/70 backdrop-blur-md hover:scale-105 transition"
                    >
                    <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    )
}