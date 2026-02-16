'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { partners } from '@/constants/data'

const duplicated = [...partners, ...partners]

export default function Marquee() {
  return (
    <section className="relative py-32 overflow-hidden bg-linear-to-b from-white via-slate-50 to-white">

      {/* ambient glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-125 w-125 -translate-x-1/2 bg-primary/10 blur-[140px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6">

        {/* title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center text-xs font-semibold tracking-[0.35em] text-slate-500 uppercase mb-20"
        >
          Powering payroll for the region&apos;s most trusted institutions
        </motion.p>

        <div className="relative">

          

          {/* moving track */}
          <motion.div
            className="flex gap-28 w-max"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              repeat: Infinity,
              duration: 40,
              ease: 'linear',
            }}
          >
            {duplicated.map((partner, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                className="group relative flex h-20 w-44 items-center justify-center"
              >

                {/* spotlight hover */}
                <div className="absolute inset-0 rounded-2xl bg-white/40 opacity-0 group-hover:opacity-100 blur-xl transition duration-500" />

                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={160}
                  height={70}
                  className="
                    object-contain
                    grayscale
                    opacity-70
                    scale-95
                    transition
                    duration-500
                    group-hover:grayscale-0
                    group-hover:opacity-100
                    group-hover:scale-105
                  "
                />

              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
