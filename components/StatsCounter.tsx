"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";

export default function StatsCounter() {
  const stats = {
    targeted_customers: 4650,
    targeted_companies: 5,
    annual_advances: 558000000,
  };

  return (
    <motion.section
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className="w-full py-20 bg-gradient-to-b from-black to-gray-900 text-white text-center"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-10">Our Growth Targets</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 150 }}
        >
          <h3 className="text-5xl font-bold">
            <CountUp end={stats.targeted_customers} duration={3.5} />+
          </h3>
          <p className="text-gray-300 mt-2">Targeted Customers</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 150 }}
        >
          <h3 className="text-5xl font-bold">
            <CountUp end={stats.targeted_companies} duration={3.5} />+
          </h3>
          <p className="text-gray-300 mt-2">Targeted Companies</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 150 }}
        >
          <h3 className="text-5xl font-bold">
            <CountUp end={stats.annual_advances / 1000000} duration={3.5} />M+
          </h3>
          <p className="text-gray-300 mt-2">Annual Advances (KSH)</p>
        </motion.div>
      </div>
    </motion.section>
  );
}
