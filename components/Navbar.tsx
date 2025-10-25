"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BiWallet, BiChevronDown, BiMenu, BiX } from "react-icons/bi";
import { FiTrendingUp, FiUserCheck, FiShield, FiDollarSign } from "react-icons/fi";
import { Calculator } from "lucide-react";

const Navbar = () => {
  const [openDrawer, setOpenDrawer] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDrawer(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    {
      name: "Solutions",
      href: "#",
      drawer: [
        {
          title: "For Employers",
          icon: <FiUserCheck className="text-green-600 w-5 h-5" />,
          desc: "Simplify payroll & empower employees with instant advances.",
          href: "/employers",
        },
        {
          title: "For Employees",
          icon: <FiDollarSign className="text-green-600 w-5 h-5" />,
          desc: "Access part of your salary anytime before payday.",
          href: "/employees",
        },
      ],
    },
    {
      name: "Resources",
      href: "#",
      drawer: [
        {
          title: "How It Works",
          icon: <FiTrendingUp className="text-green-600 w-5 h-5" />,
          desc: "Understand our system & onboarding process.",
          href: "/how-it-works",
        },
        {
          title: "Partners",
          icon: <FiShield className="text-green-600 w-5 h-5" />,
          desc: "Explore our global network of trusted partners.",
          href: "/partners",
        },
        {
          title: "Calculator",
          icon: <Calculator className="text-green-600 w-5 h-5" />,
          desc: "See how you can access an advance using our calculator.",
          href: "/calculator",
        },
      ],
    },
  ];

  return (
    <nav
      ref={navRef}
      className="w-full fixed top-0 left-0 z-50 bg-white dark:bg-black shadow"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-green-700"
        >
          <BiWallet className="text-black dark:text-white w-6 h-6 sm:w-7 sm:h-7" />
          EaziWage
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map((link, i) => (
            <div key={i} className="relative">
              {/* Clickable main link */}
              <Link
              href={link.href}
                onClick={() =>
                  setOpenDrawer(openDrawer === i ? null : i)
                }
                className="flex items-center gap-1 font-medium text-gray-700 dark:text-white hover:text-green-600 transition"
              >
                {link.name}
                {link.drawer && <BiChevronDown className="w-4 h-4" />}
              </Link>

              {/* Fancy Dropdown Drawer */}
              <AnimatePresence>
                {openDrawer === i && link.drawer && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.25 }}
                    className="absolute top-12 left-0 bg-white dark:bg-neutral-900 shadow-lg rounded-xl p-6 w-[500px] border border-gray-200 dark:border-gray-700"
                  >
                    <div className="grid gap-4">
                      {link.drawer.map((item, j) => (
                        <Link
                          key={j}
                          href={item.href}
                          onClick={() => setOpenDrawer(null)}
                          className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
                        >
                          <div className="mt-1">{item.icon}</div>
                          <div>
                            <h4 className="font-semibold text-gray-800 dark:text-white">
                              {item.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Right side buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-gray-700 dark:text-white font-medium hover:text-green-600 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-gray-700 dark:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <BiX className="w-6 h-6" />
          ) : (
            <BiMenu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Drawer (unchanged) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 right-0 w-72 sm:w-80 h-screen bg-white dark:bg-black shadow-lg p-6 flex flex-col gap-6 lg:hidden overflow-y-auto"
          >
            {links.map((link, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Link
                href={link.href}
                  onClick={() =>
                    setOpenDrawer(openDrawer === i ? null : i)
                  }
                  className="font-medium text-gray-700 dark:text-white flex items-center justify-between"
                >
                  {link.name}
                  {link.drawer && (
                    <BiChevronDown
                      className={`transition ${
                        openDrawer === i ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Link>
                <AnimatePresence>
                  {openDrawer === i && link.drawer && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-4 flex flex-col gap-2"
                    >
                      {link.drawer.map((item, j) => (
                        <Link
                          key={j}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="text-gray-500 dark:text-gray-400 hover:text-green-600 text-sm"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <hr />
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="w-full px-4 py-2 text-gray-700 dark:text-white font-medium hover:text-green-600 transition text-left"
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition text-center"
            >
              Get Started
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
