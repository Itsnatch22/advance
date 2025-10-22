'use client'
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"

export default function ScrollToTop() {
    const [ showButton, setShowButton ] = useState(false);
    const [ scrollProgress, setScrollProgress ] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            setScrollProgress(progress);

            setShowButton(window.innerHeight + scrollTop >= document.body.offsetHeight - 200);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AnimatePresence>
            { showButton && (
                <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 100 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 100 }}
                transition={{ type: "spring", stiffness: 120 }}
                onClick={scrollToTop}
                className="
                    fixed top-8 right-8 z-50 
                    w-14 h-14 
                    rounded-full 
                    bg-white dark:bg-neutral-900 
                    shadow-lg 
                    flex items-center justify-center 
                    cursor-pointer group
                "
                >
                {/* Circular progress ring */}
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle
                    cx="50%"
                    cy="50%"
                    r="26%"
                    stroke="#e5e7eb"
                    strokeWidth="5"
                    fill="none"
                    />
                    <circle
                    cx="50%"
                    cy="50%"
                    r="26%"
                    stroke="#16a34a"
                    strokeWidth="5"
                    strokeDasharray="164"
                    strokeDashoffset={164 - (scrollProgress / 100) * 164}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-150 ease-linear"
                    />
                </svg>

                <ArrowUp className="text-green-600 group-hover:text-green-500 transition-transform duration-300 group-hover:-translate-y-1" size={24} />
                </motion.div>
            )}
        </AnimatePresence>
    )
}