"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { partners } from "@/constants/data";

type Partner = { name: string; logo: string };

/*
  9-slot size rhythm — cycles through xs → lg → md → xl to break grid
  uniformity and create natural visual weight variation.
*/
const SIZE_CLASSES = [
  "w-24 h-8",   // xs
  "w-36 h-12",  // lg
  "w-28 h-10",  // md
  "w-40 h-14",  // xl
  "w-24 h-8",   // xs
  "w-32 h-11",  // md-lg
  "w-36 h-12",  // lg
  "w-28 h-9",   // sm-md
  "w-40 h-14",  // xl
] as const;

function rotateArr<T>(arr: T[], n: number): T[] {
  const len = arr.length;
  return [...arr.slice(n % len), ...arr.slice(0, n % len)];
}

/* pre-compute at module level — partners is a static constant */
const row1Items: Partner[] = [...partners, ...partners];
const row2Items: Partner[] = [
  ...rotateArr(partners as Partner[], 3),
  ...rotateArr(partners as Partner[], 3),
];
const row3Items: Partner[] = [
  ...rotateArr(partners as Partner[], 6),
  ...rotateArr(partners as Partner[], 6),
];

interface RowProps {
  items: Partner[];
  direction: "ltr" | "rtl";
  duration: number;
  interactive?: boolean;
}

function Row({ items, direction, duration, interactive = true }: RowProps) {
  return (
    /* marquee-row class enables the CSS :hover → pause rule */
    <div className={`${interactive ? "marquee-row" : ""} overflow-hidden`}>
      <div
        className={`animate-marquee-${direction} flex w-max items-center gap-14`}
        style={{ "--mdur": `${duration}s` } as React.CSSProperties}
      >
        {items.map((partner, i) => {
          const sizeClass = SIZE_CLASSES[i % SIZE_CLASSES.length];

          if (!interactive) {
            return (
              <div
                key={i}
                className={`relative flex shrink-0 items-center justify-center ${sizeClass}`}
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={160}
                  height={56}
                  className="h-full w-full object-contain grayscale"
                />
              </div>
            );
          }

          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2, ease: "easeOut" as const }}
              className={`group relative flex shrink-0 items-center justify-center ${sizeClass}`}
            >
              {/* hover spotlight */}
              <div className="absolute inset-0 rounded-xl bg-white/70 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100" />
              <Image
                src={partner.logo}
                alt={partner.name}
                width={160}
                height={56}
                className="relative h-full w-full object-contain opacity-60 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function Marquee() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white via-slate-50 to-white py-40">
      {/* ambient glow */}
      <div className="absolute inset-0 -z-10">
        <div className="bg-primary/10 absolute top-0 left-1/2 h-125 w-125 -translate-x-1/2 rounded-full blur-[140px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 text-center text-xs font-bold tracking-[0.35em] text-slate-500 uppercase"
        >
          Designed for the region&apos;s most trusted institutions
        </motion.p>

        <div className="flex flex-col gap-6">
          {/* ghost row — depth layer, 0.4 opacity, no interactions */}
          <div className="opacity-40">
            <Row items={row3Items} direction="ltr" duration={55} interactive={false} />
          </div>

          {/* primary row */}
          <Row items={row1Items} direction="ltr" duration={40} />

          {/* secondary row — reversed direction for depth */}
          <Row items={row2Items} direction="rtl" duration={32} />
        </div>
      </div>

      {/* edge fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-linear-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-linear-to-l from-white to-transparent" />
    </section>
  );
}
