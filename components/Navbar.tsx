// Navbar.tsx - Enhanced
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
          icon: <UserCheck className="h-5 w-5 text-emerald-600" strokeWidth={2} />,
          desc: "Simplify payroll & empower employees with instant advances.",
          href: "/employers",
        },
        {
          title: "For Employees",
          icon: <DollarSign className="h-5 w-5 text-emerald-600" strokeWidth={2} />,
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
          icon: <Shield className="h-5 w-5 text-emerald-600" strokeWidth={2} />,
          desc: "Explore our global network of trusted partners.",
          href: "/partners",
        },
        {
          title: "Calculator",
          icon: <Calculator className="h-5 w-5 text-emerald-600" strokeWidth={2} />,
          desc: "See how you can access an advance using our calculator.",
          href: "/calculator",
        },
      ],
    },
  ];

  return (
    <nav
      ref={navRef}
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200/60 bg-white/95 shadow-lg shadow-slate-900/5 backdrop-blur-md"
          : "bg-white/80 backdrop-blur-sm shadow-sm"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-18 sm:px-6 lg:px-8">
        {/* Logo - Enhanced */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
        >
          <motion.div 
            whileHover={{ rotate: 5, scale: 1.1 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500/20 to-green-500/20 ring-1 ring-emerald-500/20 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-emerald-500/20"
          >
            <Wallet className="h-5 w-5 text-emerald-600 sm:h-6 sm:w-6" strokeWidth={2.5} />
          </motion.div>
          <span className="font-serif text-2xl font-bold text-slate-900 transition-colors group-hover:text-emerald-700 sm:text-3xl">
            EaziWage
          </span>
        </Link>

        {/* Desktop Nav - Enhanced */}
        <div className="hidden items-center gap-8 lg:flex">
          {links.map((link, i) => (
            <div key={i} className="relative">
              <Link
                href={link.href}
                onClick={() => setOpenDrawer(openDrawer === i ? null : i)}
                className="group relative flex items-center gap-1.5 text-base font-semibold text-slate-700 transition-colors duration-200 hover:text-emerald-600"
              >
                {link.name}
                {link.drawer && (
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${openDrawer === i ? "rotate-180 text-emerald-600" : "group-hover:translate-y-0.5"}`}
                    strokeWidth={2.5}
                  />
                )}
                <motion.span
                  className="absolute -bottom-1 left-0 h-0.5 bg-linear-to-r from-emerald-600 to-green-600"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </Link>

              {/* Enhanced Dropdown */}
              <AnimatePresence>
                {openDrawer === i && link.drawer && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute left-0 top-12 w-96 overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-2 shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5"
                  >
                    <div className="grid gap-1">
                      {link.drawer.map((item, j) => (
                        <Link
                          key={j}
                          href={item.href}
                          onClick={() => setOpenDrawer(null)}
                          className="group flex items-start gap-4 rounded-xl p-4 transition-all duration-200 hover:bg-emerald-50/50"
                        >
                          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-emerald-50 to-green-50 ring-1 ring-emerald-500/10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-emerald-500/20">
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900 transition-colors group-hover:text-emerald-700">
                              {item.title}
                            </h4>
                            <p className="mt-0.5 text-sm leading-relaxed text-slate-600">
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

        {/* Right side buttons - Enhanced */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link href="https://eaziwageapp.vercel.app" target="_blank" rel="noopener noreferrer">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-xl px-5 py-2.5 font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-100 hover:text-emerald-600"
            >
              Dashboard
            </motion.button>
          </Link>
          <Link href="/sales">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-xl bg-linear-to-r from-emerald-600 to-green-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30"
            >
              Contact Sales
            </motion.button>
          </Link>
        </div>

        {/* Mobile toggle - Enhanced */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200 lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" strokeWidth={2.5} />
          ) : (
            <Menu className="h-5 w-5" strokeWidth={2.5} />
          )}
        </button>
      </div>

      {/* Mobile Drawer - Enhanced */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-16 flex h-[calc(100vh-4rem)] w-full flex-col gap-6 overflow-y-auto border-l border-slate-200/60 bg-white p-6 shadow-2xl sm:top-18 sm:h-[calc(100vh-4.5rem)] sm:w-96 lg:hidden"
          >
            {links.map((link, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Link
                  href={link.href}
                  onClick={() => setOpenDrawer(openDrawer === i ? null : i)}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-base font-semibold text-slate-800 transition-colors hover:bg-slate-50 hover:text-emerald-600"
                >
                  {link.name}
                  {link.drawer && (
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${
                        openDrawer === i ? "rotate-180 text-emerald-600" : ""
                      }`}
                      strokeWidth={2.5}
                    />
                  )}
                </Link>
                <AnimatePresence>
                  {openDrawer === i && link.drawer && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-3 flex flex-col gap-2 overflow-hidden"
                    >
                      {link.drawer.map((item, j) => (
                        <Link
                          key={j}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 transition-all hover:bg-emerald-50"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200/60">
                            {item.icon}
                          </div>
                          <span className="font-medium text-slate-700">
                            {item.title}
                          </span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <hr className="border-slate-200" />
            <Link
              href="https://eaziwageapp.vercel.app"
              onClick={() => setMobileOpen(false)}
              className="w-full rounded-xl border border-slate-200/60 bg-white px-4 py-3 text-center font-semibold text-slate-700 ring-1 ring-slate-900/5 transition-all hover:bg-slate-50 hover:text-emerald-600"
            >
              Dashboard
            </Link>
            <Link
              href="/sales"
              onClick={() => setMobileOpen(false)}
              className="w-full rounded-xl bg-linear-to-r from-emerald-600 to-green-600 px-4 py-3 text-center font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30"
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