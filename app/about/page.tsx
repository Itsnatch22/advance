"use client"
import { motion } from "framer-motion"
import { ShieldCheck, Cpu, Users, Eye } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
    return(
        <div className="min-h-screen bg-white text-gray-300">
            <section className="relative bg-gray-50 text-center py-24 px-6">
                <motion.h1
                className="text-4xl md:text-6xl font-bold text-gray-700"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6}}>
                    About KaziAdvance
                </motion.h1>
                <p className="mt-6 text-lg md:text-xl mx-auto text-gray-600"
                >
                    Building financial wellness through secure, transparent, and accessible salary advances.
                </p>
            </section>

            <section className="max-w-5xl mx-auto py-20 px-6 grid md:grid-cols-2 gap-12"
            >
                <div>
                    <h2 className="text-2xl ont-semibold mb-4 text-green-700">Our Mission</h2>
                    <p className="text-gray-600 leading-relaxed">
                        To empower employees and employers with a safe and seamless platform that
                        provides early access to earned wages, eliminating financial stress while
                        improving workplace productivity.
                    </p>
                </div>
                <div>
                    <h2 className="text-2xl ont-semibold mb-4 text-green-700">Our Vision</h2>
                    <p className="text-gray-600 leading-relaxed">
                        To be Africa&apos;s leading workplace finance partner, enabling financial wellness
                        through innovation, transparency, and secure technology.
                    </p>
                </div>
            </section>

            <section className="bg-gray-50 py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-semibold text-green-700 mb-6">Our Story</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        KaziAdvance was born out of a simple but urgent reality: most Kenyan workers
                        struggle to stretch their income until payday, often turning to expensive mobile
                        loans or shylocks. This cycle of stress impacts not only the individual but also
                        the workplace — from absenteeism to reduced productivity.
                    </p>

                    <p className="text-gray-600 leading-relaxed">
                        Our team of engineers and financial experts came together to design a secure,
                        transparent, and scalable platform that gives employees early access to wages
                        they&apos;ve already earned, backed by trusted banks and mobile money infrastructure.
                    </p>
                </div>
            </section>

            <section className="max-w-6xl mx-auto py-20 px-6 text-center">
                <h2 className="text-2xl font-semibold mb-12 text-green-700">Our Core Values</h2>
                <div className="grid md:grid-cols-4 gap-10">
                    <div className="flex flex-col items-center bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition">
                        <ShieldCheck className="w-10 h-10 text-green-600 mb-4" />
                        <h3 className="font-semibold mb-2">Integrity</h3>
                        <p className="text-gray-600 text-sm">
                            Secure and transparent handling of all financial transactions.
                        </p>
                    </div>
                    <div className="flex flex-col items-center bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition">
                        <Cpu className="w-10 h-10 text-green-600 mb-4" />
                        <h3 className="font-semibold mb-2">Innovation</h3>
                        <p className="text-gray-600 text-sm">
                            Leveraging modern technology to deliver reliability and scale.
                        </p>
                    </div>
                    <div className="flex flex-col items-center bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition">
                        <Users className="w-10 h-10 text-green-600 mb-4" />
                        <h3 className="font-semibold mb-2">Accessibility</h3>
                        <p className="text-gray-600 text-sm">
                            Simple and intuitive for employers, employees, partners and banks.
                        </p>
                    </div>
                    <div className="flex flex-col items-center bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition">
                        <Eye className="w-10 h-10 text-green-600 mb-4" />
                        <h3 className="font-semibold mb-2">Transparency</h3>
                        <p className="text-gray-600 text-sm">
                            Clear insights and monitoring for complete trust at every step.
                        </p>
                    </div>
                </div>
            </section>

            <section className="bg-gray-50 py-20 px-6 hidden lg:flex">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-2xl font-semibold text-green-700">Meet the team</h2>
                    <div className="grid md:grid-cols-4 gap-10">
                        {[
                            { name: "Jason", title: "Co-Founder & CEO", img: "/team1.jpg" },
                            { name: "Mark", title: "Frontend Developer", img: "/team2.jpg" },
                            { name: "Henry", title: "Head of Operations", img: "/team3.jpg" },
                            { name: "Joel", title: "Backend Engineer", img: "/team4.jpg" },
                        ].map((member,i) => (
                            <div key={i} className="flex flex-col items-center">
                                <Image src={member.img} alt={member.name}
                                className="w-28 h-28 rounded-full object-cover mb-4 shadow" 
                                />
                                <h3>{member.name}</h3>
                                <p>{member.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-green-700 text-white py-16 text-center">
                <h2 className="text-2xl font-semibold mb-4">Ready to Partner With Us?</h2>
                <p className="mb-8 text-lg max-w-2xl mx-auto">
                    Discover how KaziAdvance can transform your workplace finance and support
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