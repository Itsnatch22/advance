"use client"
import { motion } from "framer-motion";
import { Clock3, Wallet, Smartphone, Users, CheckCircle2, BrainCircuit, ShieldCheck,  ArrowRight, Lightbulb, BarChart3 } from "lucide-react";
import { AppleCardsCarouselDemo } from "@/components/Carousel";

const reasons = [
    { icon: Wallet, title: "No interest, ever", desc: "It’s not a loan. Just early access to your own earnings." },
    { icon: Clock3, title: "Instant when you need it", desc: "Withdraw anytime within employer limits—24/7 processing." },
    { icon: Smartphone, title: "M-PESA or bank", desc: "Choose the payout channel that suits you." },
    { icon: ShieldCheck, title: "Secure & compliant", desc: "CBK-aligned model • ODPC data protection." },
    { icon: Users, title: "Improves wellbeing", desc: "Reduce financial stress and avoid costly mobile loans." },
    { icon: CheckCircle2, title: "Transparent fees", desc: "Flat KSh 25 + Application 5%—clearly shown before you confirm." },
];

const rolloutPlans = [
    {
        icon: Lightbulb,
        title: "Awareness",
        desc: "See your earned wages in real time and understand your safe withdrawal limit.",
    },
    {
        icon: BrainCircuit,
        title: "Empowerment",
        desc: "Withdraw when needed, avoid debt traps, and keep payday on track automatically.",
    },
    {
        icon: BarChart3,
        title: "Growth",
        desc: "Build savings habits and reduce stress with transparent fees and strong protections.",
    },
];


const faqs = [
    {
        question: "Is EaziWage available for withdrawal 24/7 365 days a year?",
        answer: "Yes. Users can be withdraw at any time, the earnings they have already worked for and accumulated."
    },
    {
        question: "How long does it take for users to receive withdrawals?",
        answer: "The withdrawal request will be processed for instant disbursement. However, withdrawals are dependent on mobile money and bank systems. Mobile wallet transfers are typically quicker"
    },
    {
        question: "What is the minimum and maximum earned wage amount that can be withdrawn?",
        answer: "There is no minimum withdrawal amount. The maximum withdrawal amount is  capped to a portion of your gross salary in alignment with law, payroll verification, your residency, your Employer’s policies and the EaziWage eligibility requirements."
    },
    {
        question: "Who is eligible to use EaziWage?",
        answer: "Employers whom have a valid Business Registration and whom have signed up to the EaziWage platform, in Kenya, Tanzania, Uganda and Rwanda. EaziWage is available for all employees who are currently employed and paid in the jurisdiction of the verified and registered Employer."
    },
    {
        question: "How do I accumulate earned wages?",
        answer: "EaziWage will retrieve your work information directly from your Employer to track your available earnings."
    },
];

export default function Employers() {
    return(
        <section className="min-h-screen w-full mx-auto relative py-10 sm:py-14 lg:py-20 flex flex-col items-center">
            {/* Employer Dashboard */}
            <div className="w-full min-h-screen mx-auto bg-gray-300 rounded-2xl px-10 py-10 mb-10 sm:mb-24 lg:mb-32 flex items-center justify-center">
                <h1 className="font-medium font-serif text-4xl animate-pulse text-green-400">Dashboard to be displayed here</h1>
            </div>
            {/* Compliance Strip */}
            <div className="w-full bg-gray-50 border border-gray-200 py-3 sm:py-4 px-3 sm:px-6 lg:px-10 mb-8 sm:mb-10">
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-6 text-[0.75rem] sm:text-sm text-gray-700 text-center">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
                    <span>Regulated partners • CBK-aligned framework</span>
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
                Your Financial Empowerment Journey
                </h2>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-prose">
                Awareness → Empowerment → Growth — a smarter way to handle money you’ve already earned.
                </p>

                <div className="mt-8 sm:mt-10 lg:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
                {rolloutPlans.map((item, j) => (
                    <motion.div
                    key={j}
                    initial={{ opacity: 0, y: -40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: j * 0.1 }}
                    className="w-full p-4 sm:p-5 lg:p-6 border border-gray-300 shadow-sm hover:shadow-lg rounded-xl sm:rounded-2xl bg-white transition"
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
                Versatility across jobs & sectors
                </h2>
                <p className="text-gray-600 text-sm sm:text-base mt-3 sm:mt-4 max-w-prose mx-auto lg:mx-0">
                Real Kenyan contexts: retail, banking, hospitality, logistics, schools, factories and more.
                </p>
                <div className="mt-3 sm:mt-5">
                <AppleCardsCarouselDemo />
                </div>
            </div>
             
             {/* FAQs */}
            <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 w-full lg:px-10 mt-6 sm:mt-7 lg:mt-8">
                <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl text-gray-900 font-semibold">Employer Frequently Asked Questions</h2>
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