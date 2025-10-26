"use client"

import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import Typed from "typed.js"
import { useRef, useEffect } from "react";

export default function CulturePage() {

    const typedRef = useRef(null);

    useEffect(() => {
        const typed = new Typed(typedRef.current,{
            strings: [
                "Culture",
                "Vibe",
                "Innovation",
                "Identity",
            ],
            typeSpeed: 100,
            backSpeed: 80,
            loop: true,
            backDelay: 2000,
            smartBackspace: true,
        })
        return () => typed.destroy();
    }, []);
    return(
        <section className="min-h-screen relative flex flex-col items-center justify-center py-20 bg-green-300">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="max-w-xl"
            >
                <h1 className="text-4xl font-bold font-serif mb-6">
                    The <span ref={typedRef}/>{" "}at EaziWage
                </h1>
                <p className="leading-relaxed text-xl ">
                    It all started with a single speck of an idea, to a bunch of <code>code</code>{" "}
                    to late night commits mixed with caffeine and brainstorming thanks to{" "} 
                    <Link href="https://github.com" target="_blank" className="text-purple-600">GitHub</Link> {" "}
                    and <Link href="https://nextjs.org" target="_blank" className="text-purple-600">Next.js</Link>.
                    Our culture isn&apos;t just about how we work; it&apos;s about *why* we build.
                </p>
                <p className="mt-4 italic">
                    Here's to re-writing what fintech means to Africa.
                </p>

                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="mt-10 p-4 border border-dashed border-black">
                    <p className="font-mono text-sm tracking-wide mb-4">
                        // The full story is currently loading... Stay tuned for updates!
                    </p>
                    <p className="mt-1 font-semibold">
                        Coming Soon
                    </p>
                </motion.div>
                <p className="mt-4 text-xl">
                    For inquiries, reach us at {" "}
                    <Link href="mailto:info@eaziwage.com" className="text-neutral-900">info@eaziwage.com</Link>
                    <ArrowUpRight size={12} className="ml-2 inline-block"/>
                </p>
            </motion.div>
        </section>
    );
}