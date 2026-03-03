'use client'

import React, { useRef, MouseEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform, easeOut } from 'framer-motion'
import { Globe } from 'lucide-react'
import Image from 'next/image'

const countries = [
  { name: 'Kenya', flag: '/flag/KE.png', providers: ['M-PESA', 'Airtel Money'], users: '25,000+', currency: 'KES', cap: 60 },
  { name: 'Uganda', flag: '/flag/UG.png', providers: ['MTN MoMo', 'Airtel Money'], users: '12,000+', currency: 'UGX', cap: 45 },
  { name: 'Tanzania', flag: '/flag/TZ.png', providers: ['M-PESA', 'Tigo Pesa'], users: '8,000+', currency: 'TZS', cap: 40 },
  { name: 'Rwanda', flag: '/flag/RW.png', providers: ['MTN MoMo', 'Airtel Money'], users: '5,000+', currency: 'RWF', cap: 50 },
];

const CountryCard = ({ country }: { country: any }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 });

  function onMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{ perspective: 1000 }}
      className="h-full"
    >
      <motion.div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ rotateX, rotateY }}
        className="group relative h-full overflow-hidden rounded-3xl border border-slate-200/60 bg-white/50 p-8 backdrop-blur-xl transition-shadow duration-500 hover:shadow-2xl hover:shadow-green-500/10"
      >
        <motion.div
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([mx, my]) => `radial-gradient(350px circle at ${mx}px ${my}px, rgba(34, 197, 94, 0.06), transparent 80%)`
            ),
          }}
          className="absolute inset-0 pointer-events-none"
        />

        <div className="relative z-10">
          <div className="relative mb-6 inline-block">
            <div className="absolute -inset-4 rounded-full bg-green-500/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
            <Image
              src={country.flag}
              alt={country.name}
              width={80}
              height={80}
              className="relative rounded-xl ring-1 ring-slate-200/60 transition-transform duration-500 group-hover:scale-110 shadow-lg"
            />
          </div>

          <h3 className="mb-2 text-2xl font-bold tracking-tight text-slate-900 group-hover:text-green-700 transition-colors">
            {country.name}
          </h3>

          <p className="mb-6 font-bold text-green-600">
            {country.users} users
          </p>

          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
              <span>Wage access coverage</span>
              <span className="text-slate-900">{country.cap}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100 ring-1 ring-inset ring-slate-200/50">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${country.cap}%` }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                viewport={{ once: true }}
                className="h-full bg-linear-to-r from-green-500 to-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]"
              />
            </div>
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            {country.providers.map((p: string) => (
              <span
                key={p}
                className="rounded-lg bg-slate-100/80 px-3 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200/50 transition-all duration-300 group-hover:bg-green-500 group-hover:text-white group-hover:ring-green-500/30"
              >
                {p}
              </span>
            ))}
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2 ring-1 ring-slate-200/60 shadow-sm">
            <span className="text-xs font-black tracking-widest text-slate-400">CURRENCY</span>
            <span className="text-sm font-bold text-slate-900">{country.currency}</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-linear-to-r from-green-500 to-emerald-500 transition-all duration-700 group-hover:w-full" />
      </motion.div>
    </motion.div>
  );
};

export default function Coverage() {
  return (
    <section className="relative overflow-hidden bg-slate-50/50 py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 h-125 w-125 rounded-full bg-green-100/20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-125 w-125 rounded-full bg-emerald-100/20 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-green-600"
          >
            <Globe className="h-4 w-4" />
            <span>Regional Coverage</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl"
          >
            Financial access across{" "}
            <span className="text-green-600">East Africa</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-xl text-slate-500 max-w-3xl mx-auto"
          >
            Real-time wage infrastructure with native mobile money rails.
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {countries.map((country) => (
            <CountryCard key={country.name} country={country} />
          ))}
        </div>
      </div>
    </section>
  )
}