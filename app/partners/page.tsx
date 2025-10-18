"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { bankingPartners, techPartners, corporatePartners } from "@/constants"
import Link from "next/link"

export default function PartnersPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black py-16 overflow-hidden">
  {/* === Intro Section === */}
  <section className="relative py-20 px-6 text-center">
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-4xl text-black dark:text-white font-bold md:text-6xl font-serif"
    >
      Our <span className="text-green-600">Partners</span>
    </motion.h1>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="mt-4 text-lg dark:text-gray-300 text-gray-700 max-w-3xl mx-auto leading-relaxed"
    >
      We&apos;re building a movement with Africa&apos;s most trusted banks, forward-thinking employers,
      and cutting-edge technology providers. Together, we&apos;re redefining how pay works.
    </motion.p>
  </section>

  {/* === Section Divider === */}
  <div className="h-[2px] w-3/4 mx-auto my-10 bg-gradient-to-r from-transparent via-green-500/40 to-transparent"></div>

  {/* === Banking Partners === */}
  <section className="max-w-6xl mb-24 mx-auto py-6">
    <h2 className="text-3xl font-bold text-gray-800 text-center dark:text-white font-mono">
      Our Banking Backbone
    </h2>
    <p className="mt-4 text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto">
      Partnering with Africa&apos;s leading financial institutions to ensure fast, secure, and reliable wage access.
    </p>

    <div className="overflow-hidden mt-10">
      <motion.div
        className="flex space-x-16"
        animate={{ x: ["100%", "-100%"] }}
        transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
      >
        {[...bankingPartners, ...bankingPartners].map((partner, index) => (
          <div key={index} className="flex-shrink-0">
            <div className="p-[2px] bg-gradient-to-br from-green-500 via-emerald-400 to-green-600 rounded-full">
              <Image
                src={partner.logo ?? partner.href ?? "Partner logo"}
                alt={partner.name}
                width={160}
                height={80}
                className="rounded-full w-28 h-28 object-contain bg-white dark:bg-gray-900 transition"
              />
            </div>
          </div>
        ))}
      </motion.div>
    </div>

    <div className="grid md:grid-cols-3 gap-6 mt-12">
      {bankingPartners.map((partner, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: i * 0.1 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 shadow rounded-2xl p-6 hover:shadow-green-400/30 transition"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{partner.name}</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">{partner.blurb}</p>
        </motion.div>
      ))}
    </div>
  </section>

  {/* === Section Divider === */}
  <div className="h-[2px] w-3/4 mx-auto my-10 bg-gradient-to-r from-transparent via-green-500/40 to-transparent"></div>

  {/* === Corporate Partners === */}
  <section className="max-w-6xl mb-24 mx-auto py-6">
    <h2 className="text-3xl font-bold text-gray-800 text-center dark:text-white font-mono">
      Empowering Workforces
    </h2>
    <p className="mt-4 text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto">
      From startups to enterprise firms — our partners empower teams to access what they earn, when they need it.
    </p>

    <div className="overflow-hidden mt-10">
      <motion.div
        className="flex space-x-16"
        animate={{ x: ["100%", "-100%"] }}
        transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
      >
        {[...corporatePartners, ...corporatePartners].map((partner, index) => (
          <div key={index} className="flex-shrink-0">
            <div className="p-[2px] bg-gradient-to-br from-green-500 via-emerald-400 to-green-600 rounded-full">
              <Image
                src={partner.logo}
                alt={partner.name}
                width={160}
                height={80}
                className="rounded-full w-28 h-28 bg-white dark:bg-gray-900 object-contain"
              />
            </div>
          </div>
        ))}
      </motion.div>
    </div>

    <div className="grid md:grid-cols-3 gap-6 mt-12">
      {corporatePartners.map((partner, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: i * 0.1 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 shadow rounded-2xl p-6 hover:shadow-green-400/30 transition"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{partner.name}</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">{partner.blurb}</p>
        </motion.div>
      ))}
    </div>
  </section>

  {/* === Section Divider === */}
  <div className="h-[2px] w-3/4 mx-auto my-10 bg-gradient-to-r from-transparent via-green-500/40 to-transparent"></div>

  {/* === Tech Partners === */}
  <section className="max-w-6xl mb-24 mx-auto py-6">
    <h2 className="text-3xl font-bold text-gray-800 text-center dark:text-white font-mono">
      Built on Trusted Infrastructure
    </h2>
    <p className="mt-4 text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto">
      Integrated with the world&apos;s most secure technologies and payment systems — because reliability matters.
    </p>

    <div className="overflow-hidden mt-10">
      <motion.div
        className="flex space-x-16"
        animate={{ x: ["100%", "-100%"] }}
        transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
      >
        {[...techPartners, ...techPartners].map((partner, index) => (
          <div key={index} className="flex-shrink-0">
            <div className="p-[2px] bg-gradient-to-br from-green-500 via-emerald-400 to-green-600 rounded-full">
              <Image
                src={partner.logo}
                alt={partner.name}
                width={160}
                height={80}
                className="rounded-full w-28 h-28 object-contain bg-white dark:bg-gray-900"
              />
            </div>
          </div>
        ))}
      </motion.div>
    </div>

    <div className="grid md:grid-cols-3 gap-6 mt-12">
      {techPartners.map((partner, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: i * 0.1 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 shadow rounded-2xl p-6 hover:shadow-green-400/30 transition"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{partner.name}</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">{partner.blurb}</p>
        </motion.div>
      ))}
    </div>
  </section>

  {/* === Outro CTA === */}
  <section className="text-center py-16">
    <h3 className="text-2xl font-serif text-gray-800 dark:text-white font-bold">
      We&apos;re stronger together.
    </h3>
    <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
      Want to be part of the EaziWage ecosystem? Let&apos;s build Africa&apos;s financial future - one payday at a time.
    </p>
    <Link
      href="/contact"
      className="mt-6 inline-block bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
    >
      Partner With Us
    </Link>
  </section>
</div>

    )
}