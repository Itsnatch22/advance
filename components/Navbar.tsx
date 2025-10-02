"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiMenu,BiX, BiChevronDown, BiWallet } from "react-icons/bi";
import Link from "next/link";

const links = [
  { name: "About Us", href: "/about", dropdown: ["About Us", "Mision & Vision", "Story", "Core Values", "Team", "CTA"] },
  { name: "How it works", href: "/how-it-works", dropdown: ["Overview", "Benefits", "Testimonials"] },
  { name: "For Employers", href: "/employers", dropdown: ["Features", "Case Studies", "Support"] },
  { name: "For Employees", href: "/employees", dropdown: ["Access Wages", "Financial Wellness", "Help Centre"] },
  { name: "For Banks", href: "/banks", dropdown: [] },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <nav className="w-full bg-white shadow fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-green-700">
          <BiWallet className="text-black" />
          EaziWage
        </Link>
        <div className="hidden lg:flex items-center gap-8">
          {links.map((link, i) => (
            <div
              key={i}
              className="relative group"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <Link href={link.href} className="flex items-center gap-1 font-medium text-gray-700 hover:text-green-600 transition">
                {link.name}
                {link.dropdown.length > 0 && <BiChevronDown className="w-4 h-4" />}
              </Link>

              {/* Dropdown */}
              {link.dropdown.length > 0 && hovered === i && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-10 left-0 bg-white rounded-lg shadow-lg py-3 px-4 w-48"
                >
                  {link.dropdown.map((item, j) => (
                    <Link
                      key={j}
                      href="#"
                      className="block py-2 text-gray-600 hover:text-green-600 transition"
                    >
                      {item}
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </div>
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/login" className="px-4 py-2 text-gray-700 font-medium hover:text-green-600 transition">
            Login
          </Link>
          <Link href="/register" className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">
            Get Started
          </Link>
        </div>
        <button
          className="lg:hidden text-gray-700"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <BiX className="w-6 h-6" /> : <BiMenu className="w-6 h-6" />}
        </button>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 right-0 w-64 h-screen bg-white shadow-lg p-6 flex flex-col gap-6 lg:hidden"
          >
            {links.map((link, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Link href={link.href} className="font-medium text-gray-700 hover:text-green-600">
                  {link.name}
                </Link>
                {link.dropdown.length > 0 && (
                  <div className="ml-4 flex flex-col gap-1">
                    {link.dropdown.map((item, j) => (
                      <Link key={j} href="#" className="text-gray-500 hover:text-green-600 text-sm">
                        {item}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <hr />
            <button className="w-full px-4 py-2 text-gray-700 font-medium hover:text-green-600 transition">
              Login
            </button>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">
              Get Started
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}