"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  ChevronDown,
  Menu,
  X,
  UserCheck,
  Shield,
  DollarSign,
  Calculator,
} from "lucide-react";

const Navbar = () => {
  const [openDrawer, setOpenDrawer] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDrawer(null);
      }
    }

    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
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
          icon: <UserCheck className="h-5 w-5 text-green-600" />,
          desc: "Simplify payroll & empower employees with instant advances.",
          href: "/employers",
        },
        {
          title: "For Employees",
          icon: <DollarSign className="h-5 w-5 text-green-600" />,
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
          title: "Partners",
          icon: <Shield className="h-5 w-5 text-green-600" />,
          desc: "Explore our global network of trusted partners.",
          href: "/partners",
        },
        {
          title: "Calculator",
          icon: <Calculator className="h-5 w-5 text-green-600" />,
          desc: "See how you can access an advance using our calculator.",
          href: "/calculator",
        },
      ],
    },
  ];

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-gray-200/50 bg-white/80 shadow-md backdrop-blur-md dark:border-gray-800/50 dark:bg-black/80"
          : "bg-white shadow-none dark:bg-black"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-12">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold text-green-700 sm:text-3xl"
        >
          <motion.div whileHover={{ rotate: 5, scale: 1.1 }}>
            <Wallet className="h-7 w-7 text-black sm:h-8 sm:w-8 dark:text-white" />
          </motion.div>
          EaziWage
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-10 lg:flex">
          {links.map((link, i) => (
            <div key={i} className="relative">
              {/* Clickable main link */}
              <Link
                href={link.href}
                onClick={() => setOpenDrawer(openDrawer === i ? null : i)}
                className="group relative flex items-center gap-1 text-lg font-medium text-gray-700 transition hover:text-green-600 dark:text-white"
              >
                {link.name}
                {link.drawer && (
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${openDrawer === i ? "rotate-180" : "group-hover:translate-y-0.5"}`}
                  />
                )}
                <motion.span
                  className="absolute left-0 -bottom-1 h-0.5 bg-green-600"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </Link>

              {/* Fancy Dropdown Drawer */}
              <AnimatePresence>
                {openDrawer === i && link.drawer && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute top-12 left-0 w-[400px] overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-neutral-900"
                  >
                    <div className="grid gap-2">
                      {link.drawer.map((item, j) => (
                        <Link
                          key={j}
                          href={item.href}
                          onClick={() => setOpenDrawer(null)}
                          className="group flex items-start gap-4 rounded-lg p-3 transition hover:bg-green-50 dark:hover:bg-neutral-800"
                        >
                          <div className="mt-1 rounded-lg bg-green-100 p-2 transition-colors group-hover:bg-green-200 dark:bg-green-900/30 dark:group-hover:bg-green-900/50">
                            {item.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 transition-colors group-hover:text-green-700 dark:text-white dark:group-hover:text-green-400">
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
        <div className="hidden items-center gap-4 lg:flex">
          <Link href="https://app.eaziwage.com" target="_blank" rel="noopener noreferrer">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 font-medium text-gray-700 transition hover:text-green-600 dark:text-white"
            >
              Dashboard
            </motion.button>
          </Link>
          <Link href="/contact/sales">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white shadow-md transition hover:bg-green-700 hover:shadow-lg"
            >
              Contact Sales
            </motion.button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="p-2 text-gray-700 lg:hidden dark:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-16 right-0 flex h-[calc(100vh-4rem)] w-full flex-col gap-6 overflow-y-auto border-l border-gray-200 bg-white p-6 shadow-lg sm:w-80 lg:hidden dark:border-gray-800 dark:bg-black"
          >
            {links.map((link, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Link
                  href={link.href}
                  onClick={() => setOpenDrawer(openDrawer === i ? null : i)}
                  className="flex items-center justify-between text-lg font-medium text-gray-700 dark:text-white"
                >
                  {link.name}
                  {link.drawer && (
                    <ChevronDown
                      className={`transition-transform duration-200 ${
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
                      className="ml-4 flex flex-col gap-3 overflow-hidden"
                    >
                      {link.drawer.map((item, j) => (
                        <Link
                          key={j}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-neutral-800"
                        >
                          <div className="text-green-600">{item.icon}</div>
                          <span className="font-medium text-gray-600 dark:text-gray-300">
                            {item.title}
                          </span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <hr className="border-gray-200 dark:border-gray-800" />
            <Link
              href="https://app.eaziwage.com/"
              onClick={() => setMobileOpen(false)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-center font-medium text-gray-700 transition hover:text-green-600 dark:border-gray-700 dark:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/contact/sales"
              onClick={() => setMobileOpen(false)}
              className="w-full rounded-xl bg-green-600 px-4 py-3 text-center font-medium text-white shadow-md transition hover:bg-green-700"
            >
              Contact Sales
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
