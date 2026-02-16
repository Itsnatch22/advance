'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { partners } from '@/constants/data'

const duplicated = [...partners, ...partners]

export default function Marquee() {
  return (
    <section className="relative py-24 border-y border-slate-200 dark:border-slate-800 bg-linear-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 overflow-hidden">

      <div className="max-w-7xl mx-auto px-6">

        <p className="text-center text-xs font-semibold tracking-[0.25em] text-slate-500 uppercase mb-16">
          Trusted by leading companies across East Africa
        </p>

        {/* spotlight */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_60%)]" />

        <div className="relative overflow-hidden">

          {/* gradient mask for premium fade */}
          <div className="absolute inset-y-0 left-0 w-40 bg-linear-to-r from-white dark:from-slate-950 to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-40 bg-linear-to-l from-white dark:from-slate-950 to-transparent z-10" />

          <motion.div
            className="flex gap-20 w-max"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              repeat: Infinity,
              duration: 25,
              ease: 'linear'
            }}
          >
            {duplicated.map((partner, i) => (
              <div
                key={i}
                className="group relative h-14 w-36 flex items-center justify-center opacity-60 hover:opacity-100 transition duration-500"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={140}
                  height={60}
                  className="object-contain grayscale group-hover:grayscale-0 transition duration-500 dark:invert dark:group-hover:invert-0"
                />
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
