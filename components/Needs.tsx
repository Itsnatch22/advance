'use client'
import { motion } from "framer-motion"
import { ZapIcon, ShieldCheck, Workflow, ScrollText, LineChart, Smartphone } from "lucide-react";

const steps = [
    {
        icon: ZapIcon,
        title: "Instant Disbursment",
        description: "Funds available within minutes through mobile money or bank transfer. No waiting periods or complex approval processes.",
    },
    {
        icon: ShieldCheck,
        title: "Bank-Grade Security",
        description: "Military-grade encryption to ensure your financial data and transactions are completely secure.",
    },
    {
        icon: Workflow,
        title: "HR Integration",
        description: "Seamless integration with existing payroll systems. Automatic deductions and comprehensive employee management.",
    },
    {
        icon: ScrollText,
        title: "Regulatory Compliance",
        description: "Fully compliant with local financial and data regulations. Regular audits and updates to ensure adherence to local laws.",
    },
    {
        icon: LineChart,
        title: "Real-Time Analytics",
        description: "Detailed insights into employee earned wage usage patterns and financial health through an intuitive dashboard.",
    },
    {
        icon: Smartphone,
        title: "Mobile Accessibility",
        description: "Access and manage earned wages directly from your mobile device. User-friendly app designed for on-the-go financial management.",
    }
];

const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
  }

export default function Needs() {
    return(
        <section className="relative py-16 sm:py-20 bg-gradient-to-b from-gray-50 via-green-50/10 to-gray-50 dark:from-black dark:to-gray-900">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white font-serif"
    >
      Built for the <span className="text-green-600">African Workforce</span>
    </motion.h2>
    <motion.p
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.2 }}
      viewport={{ once: true }}
      className="mt-4 text-gray-600 dark:text-white max-w-2xl mx-auto text-base sm:text-lg px-4"
    >
      Enterprise-grade fintech built for Africa - compliant, secure, and fully integrated with local banking
      and mobile money systems.
    </motion.p>
    <p className="text-sm mt-2 text-gray-400 dark:text-gray-500 italic">
      Integrated with mobile money applications, payroll providers & leading banks.
    </p>

    <motion.div 
    variants={container}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {steps.map((step, i) => (
        <motion.div
          key={i}
          variants={item}
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-white dark:bg-gray-800 border border-green-100 dark:border-green-900/30 p-6 rounded-2xl shadow hover:shadow-green-500/30 hover:border-green-400 transition-colors"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <step.icon className="w-12 h-12 text-black dark:text-white relative z-10"
              />
              <div className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-30 bg-green-400 transition"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{step.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm text-center">{step.description}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  </div>
</section>

    )
}