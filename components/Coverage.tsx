'use client'

import { motion, easeOut } from 'framer-motion'
import { Globe } from 'lucide-react'
import Image from 'next/image'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
}

const countries = [
  { name: 'Kenya', flag: '/flag/KE.png', providers: ['M-PESA', 'Airtel Money'], users: '25,000+', currency: 'KES', cap: 60 },
  { name: 'Uganda', flag: '/flag/UG.png', providers: ['MTN MoMo', 'Airtel Money'], users: '12,000+', currency: 'UGX', cap: 45 },
  { name: 'Tanzania', flag: '/flag/TZ.png', providers: ['M-PESA', 'Tigo Pesa'], users: '8,000+', currency: 'TZS', cap: 40 },
  { name: 'Rwanda', flag: '/flag/RW.png', providers: ['MTN MoMo', 'Airtel Money'], users: '5,000+', currency: 'RWF', cap: 50 },
];

export default function Coverage() {
  return (
    <section className="relative py-28 lg:py-36 overflow-hidden bg-white">

      {/* ambient field */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/3 w-125 h-125 bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/3 w-125 h-125 bg-green-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6">

        {/* staged intro */}
        <div className="text-center mb-24">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/10"
          >
            <Globe className="w-4 h-4" />
            Coverage
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 font-serif"
          >
            Financial access across{" "}
            <span className="text-green-600">
              East Africa
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto"
          >
            Real-time wage infrastructure with native mobile money rails.
          </motion.p>
        </div>

        {/* staggered grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 xl:grid-cols-4 gap-8"
        >
          {countries.map((country) => (
            <motion.div
              key={country.name}
              variants={item}
              whileHover="hover"
              className="group relative rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-xl p-8 overflow-hidden transition-all duration-500"
            >

              {/* hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-linear-to-br from-primary/10 to-green-500/10" />

              <div className="relative z-10">

                {/* flag */}
                <Image
                  src={country.flag}
                  alt={country.name}
                  width={100}
                  height={100}
                  className="mb-6 transition-transform duration-300 group-hover:scale-105"
                />

                {/* name */}
                <h3 className="text-2xl font-bold text-slate-900">
                  {country.name}
                </h3>

                {/* users */}
                <p className="text-primary font-semibold mt-1">
                  {country.users} users
                </p>

                {/* progress */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Wage access</span>
                    <span>{country.cap}%</span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${country.cap}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className="h-full bg-linear-to-r from-primary to-green-500"
                    />
                  </div>
                </div>

                {/* providers */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {country.providers.map((p) => (
                    <span
                      key={p}
                      className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600 transition group-hover:bg-white"
                    >
                      {p}
                    </span>
                  ))}
                </div>

                {/* currency */}
                <p className="text-xs text-slate-400 mt-6">
                  {country.currency}
                </p>
              </div>

              {/* sweep line */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-linear-to-r from-emerald-500 to-green-500 transition-all duration-300 group-hover:w-full"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
