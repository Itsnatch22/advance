"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Percent,
  RefreshCw,
  ReceiptIcon,
  Database,
  ShieldCheck,
  Scale,
} from "lucide-react";

const pricing = [
  {
    icon: Percent,
    title: "0% Interest Charges",
    desc: "Enjoy the freedom of borrowing without the burden of interest. Our transparent fee structure ensures you don't have to pay interest.",
  },
  {
    icon: RefreshCw,
    title: "No Subscription Fees",
    desc: "Access our services without any recurring subscription fees. Pay only for what you use, when you use it.",
  },
  {
    icon: ReceiptIcon,
    title: "Transaction Fees",
    desc: "A small fee applies per transaction to cover processing costs, ensuring you get your funds quickly and securely.",
  },
  {
    icon: Database,
    title: "No Data Retrieval Fees",
    desc: "We believe in transparency. There are no hidden fees for accessing or retrieving your data from our platform.",
  },
  {
    icon: ShieldCheck,
    title: "No Hidden Fees",
    desc: "Earned Wage Access with transparent, no hidden fees; includes up to 5% application fees and no interest, with options for advance salary access.",
  },
  {
    icon: Scale,
    title: "Up to 5% Application Fees",
    desc: "A nominal application fee of up to 5% may apply, depending on your eligibility and the amount you wish to access.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative bg-white py-16 text-center sm:py-20 dark:bg-neutral-950"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="font-serif text-3xl font-bold text-green-700 sm:text-4xl md:text-5xl lg:text-6xl dark:text-green-600"
        >
          Fast. Fair. <span className="text-black dark:text-white">Fully</span>{" "}
          Transparent.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-4 px-4 text-base text-gray-600 sm:text-lg dark:text-gray-300"
        >
          It&apos;s not a loan, it&apos;s freedom — the freedom to live, plan,
          and dream without waiting for payday.
        </motion.p>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-10 grid grid-cols-1 justify-items-center gap-6 sm:mt-12 md:grid-cols-2 lg:grid-cols-3"
        >
          {pricing.map((card, i) => (
            <motion.div
              key={i}
              variants={item}
              whileHover={{ scale: 1.05, translateY: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-full max-w-sm rounded-2xl border border-green-100 bg-white p-6 shadow transition-colors hover:border-green-400 hover:shadow-green-500/30 dark:border-green-900/30 dark:bg-gray-800"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50 transition-colors group-hover:bg-green-100 dark:bg-green-900/20 dark:group-hover:bg-green-900/40">
                <card.icon className="h-7 w-7 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-white">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
