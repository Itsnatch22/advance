'use client'

import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'
import Image from 'next/image'

const countries = [
  { name: 'Kenya', flag: '/flag/KE.png', providers: ['M-PESA', 'Airtel Money'], users: '25,000+', currency: 'KES', cap: 60 },
  { name: 'Uganda', flag: '/flag/UG.png', providers: ['MTN MoMo', 'Airtel Money'], users: '12,000+', currency: 'UGX', cap: 45 },
  { name: 'Tanzania', flag: '/flag/TZ.png', providers: ['M-PESA', 'Tigo Pesa'], users: '8,000+', currency: 'TZS', cap: 40 },
  { name: 'Rwanda', flag: '/flag/RW.png', providers: ['MTN MoMo', 'Airtel Money'], users: '5,000+', currency: 'RWF', cap: 50 },
];


export default function Coverage() {
  return (
    <section className="relative py-28 lg:py-36 overflow-hidden bg-white">

      {/* ambient gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(0,200,255,0.08),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.12),transparent_40%)]" />

      <div className="max-w-7xl mx-auto px-6">

        {/* header */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            <Globe className="w-4 h-4" />
            Coverage
          </div>

          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 dark:text-white font-serif">
            Financial access across {" "}
            <span className="text-green-600">
              East Africa
            </span>
          </h2>

          <p className="mt-6 text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Real-time wage infrastructure with native mobile money rails.
          </p>
        </div>

        {/* grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
          {countries.map((country, i) => (
            <motion.div
              key={country.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -12 }}
              className="group relative rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-xl p-8 overflow-hidden"
            >

              {/* hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-linear-to-br from-primary/10 to-green-500/10" />

              {/* flag */}
              <Image src={country.flag} alt={country.name} className="text-6xl mb-6" width={100} height={100} />

              {/* name */}
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {country.name}
              </h3>

              {/* users */}
              <p className="text-primary font-semibold mt-1">
                {country.users} users
              </p>

              {/* wage cap */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Wage access</span>
                  <span>{country.cap}%</span>
                </div>

                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${country.cap}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-linear-to-r from-primary to-green-500"
                  />
                </div>
              </div>

              {/* providers */}
              <div className="flex flex-wrap gap-2 mt-6">
                {country.providers.map((p) => (
                  <span
                    key={p}
                    className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600"
                  >
                    {p}
                  </span>
                ))}
              </div>

              {/* currency */}
              <p className="text-xs text-slate-400 mt-6">
                {country.currency}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
