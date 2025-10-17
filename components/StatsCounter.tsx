"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import WorldMap from "./ui/world-map";

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
      className="w-full py-20 bg-gray-50 dark:bg-black dark:text-white text-black text-center"
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

      <div>
        <p className="font-bold text-xl md:text-4xl dark:text-white text-black mt-15">
          Connecting{" "}
          <span className="text-neutral-400">
            {"Africa".split("").map((word, idx) => (
              <motion.span
                key={idx}
                className="inline-block"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
              >
                {word}
              </motion.span>
            ))}
          </span>
        </p>
      </div>
      <WorldMap
        dots={[
          {
  // Nairobi → Dar es Salaam (Tanzania)
  start: { lat: -1.2921, lng: 36.8219 }, // Nairobi
  end: { lat: -6.7924, lng: 39.2083 },   // Dar es Salaam
},
{
  // Nairobi → Kampala (Uganda)
  start: { lat: -1.2921, lng: 36.8219 }, // Nairobi
  end: { lat: 0.3476, lng: 32.5825 },    // Kampala
},
{
  // Nairobi → Addis Ababa (Ethiopia)
  start: { lat: -1.2921, lng: 36.8219 }, // Nairobi
  end: { lat: 9.03, lng: 38.74 },        // Addis Ababa
},
{
  // Nairobi → Kigali (Rwanda)
  start: { lat: -1.2921, lng: 36.8219 }, // Nairobi
  end: { lat: -1.9499, lng: 30.0588 },   // Kigali
},
{
  // Nairobi → Bujumbura (Burundi)
  start: { lat: -1.2921, lng: 36.8219 }, // Nairobi
  end: { lat: -3.3822, lng: 29.3644 },   // Bujumbura
},
{
  // Nairobi → Juba (South Sudan)
  start: { lat: -1.2921, lng: 36.8219 }, // Nairobi
  end: { lat: 4.8594, lng: 31.5713 },    // Juba
},
{
  // Nairobi → Khartoum (Sudan)
  start: { lat: -1.2921, lng: 36.8219 }, // Nairobi
  end: { lat: 15.5007, lng: 32.5599 },   // Khartoum
},
{
  // Nairobi → Johannesburg (South Africa)
  start: { lat: -1.2921, lng: 36.8219 }, // Nairobi
  end: { lat: -26.2041, lng: 28.0473 },  // Johannesburg
},
        ]}
      />
    </motion.section>
  );
}
