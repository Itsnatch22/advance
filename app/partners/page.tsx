"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { bankingPartners, techPartners, corporatePartners } from "@/constants";
import Link from "next/link";

export default function PartnersPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-gray-50 py-16 dark:bg-black">
      {/* === Intro Section === */}
      <section className="relative px-6 py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="font-serif text-4xl font-bold text-black md:text-6xl dark:text-white"
        >
          Our <span className="text-green-600">Partners</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-700 dark:text-gray-300"
        >
          We&apos;re building a movement with Africa&apos;s most trusted banks,
          forward-thinking employers, and cutting-edge technology providers.
          Together, we&apos;re redefining how pay works.
        </motion.p>
      </section>

      {/* === Section Divider === */}
      <div className="mx-auto my-10 h-[2px] w-3/4 bg-gradient-to-r from-transparent via-green-500/40 to-transparent"></div>

      {/* === Banking Partners === */}
      <section className="mx-auto mb-24 max-w-6xl py-6">
        <h2 className="text-center font-mono text-3xl font-bold text-gray-800 dark:text-white">
          Our Banking Backbone
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600 dark:text-gray-300">
          Partnering with Africa&apos;s leading financial institutions to ensure
          fast, secure, and reliable wage access.
        </p>

        <div className="mt-10 overflow-hidden">
          <motion.div
            className="flex space-x-16"
            animate={{ x: ["100%", "-100%"] }}
            transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
          >
            {[...bankingPartners, ...bankingPartners].map((partner, index) => (
              <div key={index} className="flex-shrink-0">
                <div className="rounded-full bg-gradient-to-br from-green-500 via-emerald-400 to-green-600 p-[2px]">
                  <Image
                    src={partner.logo ?? "Partner logo"}
                    alt={partner.name}
                    width={160}
                    height={80}
                    className="h-28 w-28 rounded-full bg-white object-contain transition dark:bg-gray-900"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {bankingPartners.map((partner, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-white p-6 shadow transition hover:shadow-green-400/30 dark:bg-gray-800"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {partner.name}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {partner.blurb}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === Section Divider === */}
      <div className="mx-auto my-10 h-[2px] w-3/4 bg-gradient-to-r from-transparent via-green-500/40 to-transparent"></div>

      {/* === Corporate Partners === */}
      <section className="mx-auto mb-24 max-w-6xl py-6">
        <h2 className="text-center font-mono text-3xl font-bold text-gray-800 dark:text-white">
          Empowering Workforces
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600 dark:text-gray-300">
          From startups to enterprise firms — our partners empower teams to
          access what they earn, when they need it.
        </p>

        <div className="mt-10 overflow-hidden">
          <motion.div
            className="flex space-x-16"
            animate={{ x: ["100%", "-100%"] }}
            transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
          >
            {[...corporatePartners, ...corporatePartners].map(
              (partner, index) => (
                <div key={index} className="flex-shrink-0">
                  <div className="rounded-full bg-gradient-to-br from-green-500 via-emerald-400 to-green-600 p-[2px]">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={160}
                      height={80}
                      className="h-28 w-28 rounded-full bg-white object-contain dark:bg-gray-900"
                    />
                  </div>
                </div>
              )
            )}
          </motion.div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {corporatePartners.map((partner, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-white p-6 shadow transition hover:shadow-green-400/30 dark:bg-gray-800"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {partner.name}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {partner.blurb}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === Section Divider === */}
      <div className="mx-auto my-10 h-[2px] w-3/4 bg-gradient-to-r from-transparent via-green-500/40 to-transparent"></div>

      {/* === Tech Partners === */}
      <section className="mx-auto mb-24 max-w-6xl py-6">
        <h2 className="text-center font-mono text-3xl font-bold text-gray-800 dark:text-white">
          Built on Trusted Infrastructure
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600 dark:text-gray-300">
          Integrated with the world&apos;s most secure technologies and payment
          systems — because reliability matters.
        </p>

        <div className="mt-10 overflow-hidden">
          <motion.div
            className="flex space-x-16"
            animate={{ x: ["100%", "-100%"] }}
            transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
          >
            {[...techPartners, ...techPartners].map((partner, index) => (
              <div key={index} className="flex-shrink-0">
                <div className="rounded-full bg-gradient-to-br from-green-500 via-emerald-400 to-green-600 p-[2px]">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={160}
                    height={80}
                    className="h-28 w-28 rounded-full bg-white object-contain dark:bg-gray-900"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {techPartners.map((partner, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-white p-6 shadow transition hover:shadow-green-400/30 dark:bg-gray-800"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {partner.name}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {partner.blurb}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === Outro CTA === */}
      <section className="py-16 text-center">
        <h3 className="font-serif text-3xl font-bold text-gray-800 sm:text-4xl md:text-5xl lg:text-6xl dark:text-white">
          We&apos;re stronger together.
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-gray-600 dark:text-gray-300">
          Want to be part of the EaziWage ecosystem? Let&apos;s build
          Africa&apos;s financial future - one payday at a time.
        </p>
        <Link
          href="/form"
          className="mt-6 inline-block rounded-xl bg-green-600 px-6 py-3 text-white transition hover:bg-green-700"
        >
          Partner With Us
        </Link>
      </section>
    </div>
  );
}
