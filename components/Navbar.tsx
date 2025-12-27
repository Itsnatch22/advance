"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, ChevronDown, Menu, X, UserCheck, Shield, DollarSign, Calculator } from "lucide-react";

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
    }
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
          icon: <UserCheck className="text-green-600 w-5 h-5" />,
          desc: "Simplify payroll & empower employees with instant advances.",
          href: "/employers",
        },
        {
          title: "For Employees",
          icon: <DollarSign className="text-green-600 w-5 h-5" />,
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
          icon: <Shield className="text-green-600 w-5 h-5" />,
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
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
        scrolled 
        ? "bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-md border-b border-gray-200/50 dark:border-gray-800/50" 
        : "bg-white dark:bg-black shadow-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-green-700"
        >
          <Wallet className="text-black dark:text-white w-6 h-6 sm:w-7 sm:h-7" />
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
                className="flex items-center gap-1 font-medium text-gray-700 dark:text-white hover:text-green-600 transition group"
              >
                {link.name}
                {link.drawer && <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDrawer === i ? "rotate-180" : "group-hover:translate-y-0.5"}`} />}
              </Link>

              {/* Fancy Dropdown Drawer */}
              <AnimatePresence>
                {openDrawer === i && link.drawer && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-12 left-0 bg-white dark:bg-neutral-900 shadow-xl rounded-xl p-4 w-[400px] border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <div className="grid gap-2">
                      {link.drawer.map((item, j) => (
                        <Link
                          key={j}
                          href={item.href}
                          onClick={() => setOpenDrawer(null)}
                          className="flex items-start gap-4 p-3 rounded-lg hover:bg-green-50 dark:hover:bg-neutral-800 transition group"
                        >
                          <div className="mt-1 p-2 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                            {item.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
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
          <Link href="/register">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition shadow-md hover:shadow-lg"
            >
                Get Started
            </motion.button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-gray-700 dark:text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
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
            className="fixed top-16 right-0 w-full sm:w-80 h-[calc(100vh-4rem)] bg-white dark:bg-black shadow-lg p-6 flex flex-col gap-6 lg:hidden overflow-y-auto border-l border-gray-200 dark:border-gray-800"
          >
            {links.map((link, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Link
                href={link.href}
                  onClick={() =>
                    setOpenDrawer(openDrawer === i ? null : i)
                  }
                  className="font-medium text-gray-700 dark:text-white flex items-center justify-between text-lg"
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
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
                        >
                           <div className="text-green-600">{item.icon}</div>
                           <span className="text-gray-600 dark:text-gray-300 font-medium">{item.title}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <hr className="border-gray-200 dark:border-gray-800" />
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="w-full px-4 py-3 text-gray-700 dark:text-white font-medium hover:text-green-600 transition text-center border border-gray-200 dark:border-gray-700 rounded-xl"
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition text-center shadow-md"
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
