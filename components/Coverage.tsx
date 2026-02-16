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
    <section className="relative overflow-hidden bg-linear-to-b from-white via-slate-50/30 to-white py-20 sm:py-24 lg:py-32">

      {/* Enhanced ambient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-emerald-100/40 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-green-100/30 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Enhanced header section */}
        <div className="mb-16 text-center sm:mb-20 lg:mb-24">

          {/* Enhanced badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-6 flex justify-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/10">
              <Globe className="h-4 w-4" strokeWidth={2.5} />
              <span>Regional Coverage</span>
            </div>
          </motion.div>

          {/* Enhanced heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="mb-5 font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
          >
            Financial access across{" "}
            <span className="bg-linear-to-r from-emerald-700 via-green-600 to-emerald-600 bg-clip-text text-transparent">
              East Africa
            </span>
          </motion.h2>

          {/* Enhanced description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg lg:text-xl"
          >
            Real-time wage infrastructure with native mobile money rails.
          </motion.p>
        </div>

        {/* Enhanced country cards grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-4"
        >
          {countries.map((country) => (
            <motion.div
              key={country.name}
              variants={item}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-8 shadow-lg shadow-slate-900/5 backdrop-blur-xl transition-all duration-300 hover:border-emerald-200/80 hover:shadow-xl hover:shadow-emerald-500/10"
            >

              {/* Enhanced hover gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-br from-emerald-50/0 via-green-50/0 to-emerald-50/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative z-10">

                {/* Flag with enhanced styling */}
                <div className="relative mb-6 inline-block">
                  {/* Glow behind flag */}
                  <div className="absolute -inset-2 rounded-xl bg-emerald-100/50 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100"></div>
                  
                  <Image
                    src={country.flag}
                    alt={country.name}
                    width={80}
                    height={80}
                    className="relative rounded-lg ring-1 ring-slate-200/60 transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Country name */}
                <h3 className="mb-2 text-2xl font-bold tracking-tight text-slate-900">
                  {country.name}
                </h3>

                {/* Users count with enhanced styling */}
                <p className="mb-4 font-semibold text-emerald-600">
                  {country.users} users
                </p>

                {/* Enhanced progress bar */}
                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-600">
                    <span>Wage access coverage</span>
                    <span className="font-semibold text-slate-900">{country.cap}%</span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200/60">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${country.cap}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                      viewport={{ once: true }}
                      className="h-full bg-linear-to-r from-emerald-500 to-green-500 shadow-sm"
                    />
                  </div>
                </div>

                {/* Enhanced provider badges */}
                <div className="mb-6 flex flex-wrap gap-2">
                  {country.providers.map((p) => (
                    <span
                      key={p}
                      className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200/50 transition-all duration-300 group-hover:bg-emerald-50 group-hover:text-emerald-700 group-hover:ring-emerald-200/50"
                    >
                      {p}
                    </span>
                  ))}
                </div>

                {/* Currency badge */}
                <div className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-1 ring-1 ring-slate-200/60">
                  <svg className="h-3 w-3 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-medium text-slate-600">{country.currency}</span>
                </div>
              </div>

              {/* Enhanced bottom accent line */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-linear-to-r from-emerald-500 to-green-500 transition-all duration-300 group-hover:w-full"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}