"use client";

import { motion } from "framer-motion";
import { partners } from "@/constants/data";
import LogoLoop from "./LogoLoop";

const partnerLogos = partners.map((partner) => ({
  src: partner.logo,
  alt: partner.name,
}));

export default function Marquee() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white via-slate-50 to-white py-40">
      <div className="absolute inset-0 -z-10">
        <div className="bg-primary/10 absolute top-0 left-1/2 h-125 w-125 -translate-x-1/2 rounded-full blur-[140px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-28 text-center text-xs font-bold tracking-[0.35em] text-slate-500 uppercase"
        >
          Designed for the region&apos;s trusted institutions
        </motion.p>

        <div className="relative">
          <LogoLoop
            logos={partnerLogos}
            speed={56}
            direction="left"
            logoHeight={64}
            gap={128}
            hoverSpeed={0}
            scaleOnHover
            muted={0.5}
            draggable={false}
            ariaLabel="EaziWage partners"
            style={{ height: 104 }}
          />
        </div>
      </div>
    </section>
  );
}
