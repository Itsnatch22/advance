"use client"
import { motion } from "framer-motion"
import { ShieldCheck, Cpu, Users, Eye } from "lucide-react"
import Image from "next/image"
import gsap from "gsap"
import * as React from "react"
export default function AboutPage() {
    const storyRef = React.useRef<HTMLDivElement>(null);
    const valuesRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        gsap.fromTo(storyRef.current, 
        {opacity: 0, y: -50}, 
        {opacity: 1, y: 0, duration: 1.2, ease: "power2.out"});

        gsap.fromTo(valuesRef.current, 
        {opacity: 0, y: 50}, 
        {opacity: 1, y: 0, duration: 1.2, ease: "power2.out", delay: 0.3});
    }, []);
    return(
        <div className="min-h-screen bg-white dark:bg-black text-gray-300">
            <section className="relative bg-gray-50 text-center dark:bg-green-400 py-24 px-6">
                <motion.h1
                className="text-4xl md:text-6xl font-bold text-gray-700 font-serif"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6}}>
                    About EaziWage
                </motion.h1>
                <p className="mt-6 text-lg md:text-xl dark:text-white mx-auto text-gray-600"
                >
                    Building financial wellness through secure, transparent, and accessible salary advances.
                </p>
            </section>

            <section className="goals-section max-w-5xl mx-auto py-20 px-6 grid md:grid-cols-2 gap-12"
            >
                <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                >
                    <h2 className="text-2xl ont-semibold mb-4 text-green-700 font-mono">Our Mission</h2>
                    <p className="text-gray-600 leading-relaxed dark:text-white">
                        To empower employees and employers with a safe and seamless platform that
                        provides early access to earned wages, eliminating financial stress while
                        improving workplace productivity.
                    </p>
                </motion.div>
                <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                >
                    <h2 className="text-2xl ont-semibold mb-4 text-green-700 font-mono">Our Vision</h2>
                    <p className="text-gray-600 leading-relaxed dark:text-white">
                        To be Africa&apos;s leading workplace finance partner, enabling financial wellness
                        through innovation, transparency, and secure technology.
                    </p>
                </motion.div>
            </section>

            <section className=" py-20 px-6">
                <div ref={storyRef} className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-semibold text-green-700 mb-6 font-mono">Our Story</h2>
                    <p className="text-gray-600 leading-relaxed mb-4 dark:text-white">
                        EaziWage was born out of a simple but urgent reality: most Kenyan workers
                        struggle to stretch their income until payday, often turning to expensive mobile
                        loans or shylocks. This cycle of stress impacts not only the individual but also
                        the workplace — from absenteeism to reduced productivity.
                    </p>

                    <p className="text-gray-600 leading-relaxed dark:text-white">
                        Our team of engineers and financial experts came together to design a secure,
                        transparent, and scalable platform that gives employees early access to wages
                        they&apos;ve already earned, backed by trusted banks and mobile money infrastructure.
                    </p>
                </div>
            </section>

            <section ref={valuesRef} className="max-w-6xl mx-auto py-20 px-6 text-center">
                <h2 className="text-2xl font-semibold mb-12 text-green-700 font-mono">Our Core Values</h2>
                <div className="grid md:grid-cols-4 gap-10">
                    <div className="flex flex-col items-center bg-white dark:bg-gray-400 shadow-sm rounded-lg p-6 hover:shadow-md transition">
                        <ShieldCheck className="w-10 h-10 text-green-700 mb-4" />
                        <h3 className="font-semibold mb-2 text-black">Integrity</h3>
                        <p className="text-gray-600 text-sm dark:text-black">
                            Secure and transparent handling of all financial transactions.
                        </p>
                    </div>
                    <div className="flex flex-col items-center bg-white dark:bg-gray-400 shadow-sm rounded-lg p-6 hover:shadow-md transition">
                        <Cpu className="w-10 h-10 text-green-700 mb-4" />
                        <h3 className="font-semibold mb-2 text-black">Innovation</h3>
                        <p className="text-gray-600 text-sm dark:text-black">
                            Leveraging modern technology to deliver reliability and scale.
                        </p>
                    </div>
                    <div className="flex flex-col items-center bg-white dark:bg-gray-400 shadow-sm rounded-lg p-6 hover:shadow-md transition">
                        <Users className="w-10 h-10 text-green-700 mb-4" />
                        <h3 className="font-semibold mb-2 text-black">Accessibility</h3>
                        <p className="text-gray-600 text-sm dark:text-black">
                            Simple and intuitive for employers, employees, partners and banks.
                        </p>
                    </div>
                    <div className="flex flex-col items-center bg-white dark:bg-gray-400 shadow-sm rounded-lg p-6 hover:shadow-md transition">
                        <Eye className="w-10 h-10 text-green-700 mb-4" />
                        <h3 className="font-semibold mb-2 text-black">Transparency</h3>
                        <p className="text-gray-600 text-sm dark:text-black">
                            Clear insights and monitoring for complete trust at every step.
                        </p>
                    </div>
                </div>
            </section>

            <section className="bg-green-700 text-white dark:text-black py-16 text-center">
                <h2 className="text-2xl font-semibold mb-4 font-serif">Ready to Partner With Us?</h2>
                <p className="mb-8 text-lg max-w-2xl mx-auto dark:text-black">
                    Discover how EaziWage can transform your workplace finance and support
                    employee wellbeing.
                </p>
                <a
                href="/contact"
                className="bg-white text-green-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
                >
                Contact Us
                </a>
            </section>
        </div>
    )
}