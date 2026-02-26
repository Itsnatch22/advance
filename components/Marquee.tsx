"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { partners } from "@/constants/data";

const duplicated = [...partners, ...partners];

export default function Marquee() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white via-slate-50 to-white py-32">
      {/* ambient glow */}
      <div className="absolute inset-0 -z-10">
        <div className="bg-primary/10 absolute top-0 left-1/2 h-125 w-125 -translate-x-1/2 rounded-full blur-[140px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 text-center text-xs font-semibold tracking-[0.35em] text-slate-500 uppercase"
        >
          Powering payroll for the region&apos;s most trusted institutions
        </motion.p>

        <div className="relative">
          {/* moving track */}
          <motion.div
            className="flex w-max gap-28"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              duration: 40,
              ease: "linear",
            }}
          >
            {duplicated.map((partner, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                className="group relative flex h-20 w-44 items-center justify-center"
              >
                {/* spotlight hover */}
                <div className="absolute inset-0 rounded-2xl bg-white/40 opacity-0 blur-xl transition duration-500 group-hover:opacity-100" />

                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={160}
                  height={70}
                  className="scale-95 object-contain opacity-70 grayscale transition duration-500 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
