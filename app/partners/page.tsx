"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { bankingPartners, techPartners, corporatePartners } from "@/constants"

export default function PartnersPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <section
            className="relative py-20 px-6 text-center">
                <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl text-black font-bold md:text-6xl font-serif">
                    Our Partners
                </motion.h1>
                <motion.p
                initial={{ opacity:0 ,y:20 }}
                animate={{ opacity:1 , y:0 }}
                className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
                >
                    Our system is integrated with leading banking, corporate and technology partners to ensure seamless operations and expectations for every customer.
                </motion.p>
            </section>

            <section className="max-w-6xl mb-24 mx-auto py-6">
                <h2 className="text-3xl font-bold text-gray-800 text-center font-mono">Our Banking Backbone</h2>
                <p className="mt-4 text-gray-600 text-center">
                    We collaborate with leading financial institutions to guarantee fast, secure and reliable salary advances for employees.
                </p>

                <div className="overflow-hidden mt-10">
                    <motion.div
                    className="flex space-x-16"
                    animate={{ x: ["100%", "-100%"] }}
                    transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                    >
                        {[...bankingPartners, ...bankingPartners].map((partner, index) => (
                            <div key={index} className="flex-shrink-0">
                                <Image
                                src={partner.logo ?? partner.href ?? "Partner logo"}
                                alt={partner.name}
                                width={160}
                                height={80}
                                className="rounded-full w-28 h-28 object-contain transition"
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-12">
                    {bankingPartners.map((partner, i) => (
                        <div
                        key={i}
                        className="bg-white shadow rounded-2xl p-6 hover:shadow-lg transition"
                        >
                        <h3 className="text-lg font-semibold text-gray-800">
                            {partner.name}
                        </h3>
                        <p className="mt-2 text-gray-600">{partner.blurb}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="max-w-6xl mb-24 mx-auto py-6">
                <h2 className="text-3xl font-bold text-gray-800 text-center font-mono">Empowering Workforces</h2>
                <p className="mt-4 text-gray-600 text-center">
                    From retail chains to multinational firms, our partners ensure employees access what they earn, when they need it.
                </p>

                <div className="overflow-hidden mt-10">
                    <motion.div
                    className="flex space-x-16"
                    animate={{ x: ["100%", "-100%"] }}
                    transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                    >
                        {[...corporatePartners, ...corporatePartners].map((partner, index) => (
                            <div key={index} className="flex-shrink-0">
                                <Image
                                src={partner.logo}
                                alt={partner.name}
                                width={160}
                                height={80}
                                className="rounded-full w-28 h-28 object-contain transition"
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-12">
                    {corporatePartners.map((partner, i) => (
                        <div
                        key={i}
                        className="bg-white shadow rounded-2xl p-6 hover:shadow-lg transition"
                        >
                        <h3 className="text-lg font-semibold text-gray-800">
                            {partner.name}
                        </h3>
                        <p className="mt-2 text-gray-600">{partner.blurb}</p>
                        </div>
                    ))}
                </div>
            </section>
            <section className="max-w-6xl mb-24 mx-auto py-6">
                <h2 className="text-3xl font-bold text-gray-800 text-center font-mono">Built on Trusted Infrastructure</h2>
                <p className="mt-4 text-gray-600 text-center">
                    Our systems are integrated with the most reliable global technologies and payment providers.
                </p>

                <div className="overflow-hidden mt-10">
                    <motion.div
                    className="flex space-x-16"
                    animate={{ x: ["100%", "-100%"] }}
                    transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                    >
                        {[...techPartners, ...techPartners].map((partner, index) => (
                            <div key={index} className="flex-shrink-0">
                                <Image
                                src={partner.logo}
                                alt={partner.name}
                                width={160}
                                height={80}
                                className="object-contain transition rounded-full w-28 h-28"
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-12">
                    {techPartners.map((partner, i) => (
                        <div
                        key={i}
                        className="bg-white shadow rounded-2xl p-6 hover:shadow-lg transition"
                        >
                        <h3 className="text-lg font-semibold text-gray-800">
                            {partner.name}
                        </h3>
                        <p className="mt-2 text-gray-600">{partner.blurb}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}