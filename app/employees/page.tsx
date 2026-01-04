"use client";
import { motion } from "framer-motion";
import { 
  Clock3, 
  Wallet, 
  Smartphone, 
  Users, 
  CheckCircle2, 
  BrainCircuit, 
  Lightbulb, 
  BarChart3, 
  Repeat 
} from "lucide-react";
import { AppleCardsCarouselDemo } from "@/components/Carousel";
import { ComplianceStrip } from "@/components/shared/ComplianceStrip";
import { FeatureCard } from "@/components/shared/FeatureCard";
import { FAQItem } from "@/components/shared/FAQItem";
import UI from "./UI";

const reasons = [
  { 
    icon: Wallet, 
    title: "No interest, ever", 
    desc: "It's not a loan. Just early access to your own earnings." 
  },
  { 
    icon: Clock3, 
    title: "Instant when you need it", 
    desc: "Withdraw anytime within employer limits—24/7 processing." 
  },
  { 
    icon: Smartphone, 
    title: "M-PESA or bank", 
    desc: "Choose the payout channel that suits you." 
  },
  { 
    icon: CheckCircle2, 
    title: "Secure & compliant", 
    desc: "CBK-aligned model • ODPC data protection." 
  },
  { 
    icon: Users, 
    title: "Improves wellbeing", 
    desc: "Reduce financial stress and avoid costly mobile loans." 
  },
  { 
    icon: CheckCircle2, 
    title: "Transparent fees", 
    desc: "Flat KSh 25 + Application 5%—clearly shown before you confirm." 
  },
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
  {
    icon: Repeat,
    title: "Repeat",
    desc: "Continue to earn and withdraw as needed, with no limits or hidden fees.",
  },
];


const complianceItems = [
  { text: "Regulated partners • CBK-aligned framework" },
  { text: "ODPC-compliant data handling" },
  { text: "Transparent pricing (KSh 25 + 5%)" },
  { text: "Auto-settlement via payroll" },
];

const faqs = [
  {
    question: "Is EaziWage available for withdrawal 24/7 365 days a year?",
    answer:
      "Yes. Users can withdraw at any time, the earnings they have already worked for and accumulated.",
  },
  {
    question: "How long does it take for users to receive withdrawals?",
    answer:
      "The withdrawal request will be processed for instant disbursement. However, withdrawals are dependent on mobile money and bank systems. Mobile wallet transfers are typically quicker.",
  },
  {
    question:
      "What is the minimum and maximum earned wage amount that can be withdrawn?",
    answer:
      "There is no minimum withdrawal amount. The maximum withdrawal amount is capped to a portion of your gross salary in alignment with law, payroll verification, your residency, your Employer's policies and the EaziWage eligibility requirements.",
  },
  {
    question: "Who is eligible to use EaziWage?",
    answer:
      "Employers who have a valid Business Registration and who have signed up to the EaziWage platform, in Kenya, Tanzania, Uganda and Rwanda. EaziWage is available for all employees who are currently employed and paid in the jurisdiction of the verified and registered Employer.",
  },
  {
    question: "How do I accumulate earned wages?",
    answer:
      "EaziWage will retrieve your work information directly from your Employer to track your available earnings.",
  },
];

export default function Employees() {
  return (
    <section className="min-h-screen w-full mx-auto relative py-10 sm:py-14 lg:py-20 flex flex-col items-center">
      <UI />
      
      <ComplianceStrip items={complianceItems} className="mb-8 sm:mb-10" />

      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-10 lg:text-left text-center mt-10 sm:mt-14">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <h2 className="font-serif text-gray-900 dark:text-white font-bold text-4xl sm:text-5xl lg:text-6xl mb-6 tracking-tight">
            Why employees choose Eaziwage
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl leading-relaxed">
            A practical well-being lever that pays for itself.
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

            {/* Roll-Out Plans */}
            <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-24 sm:mt-32 lg:mt-40">
                <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
                    <h2 className="font-serif text-gray-900 dark:text-white font-bold text-4xl sm:text-5xl lg:text-6xl mb-6 tracking-tight">
                        Your Financial Empowerment Journey
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl leading-relaxed">
                        Awareness → Empowerment → Growth — a smarter way to handle money you&apos;ve already earned.
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

            {/* Works Areas */}
            <div className="w-full max-w-7xl px-2 sm:px-4 lg:px-6 mt-10 sm:mt-20 lg:mt-30">
                <div className="text-center lg:text-left mb-12">
                    <h2 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-gray-900 dark:text-white mb-6 tracking-tight">
                        Versatility across <span className="text-green-500">jobs & sectors</span>
                    </h2>
                    <p className="text-gray-600 dark:text-white text-sm sm:text-base mt-3 sm:mt-4 mx-auto lg:mx-0">
                        Real Kenyan contexts: retail, banking, hospitality, logistics, schools, factories and more.
                    </p>
                </div>
                <div className="mt-3 sm:mt-5">
                <AppleCardsCarouselDemo />
                </div>
            </div>
             
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
    </section>
  );
}