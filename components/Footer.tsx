"use client";

import { useEffect, useState } from "react";
import {
  Facebook,
  Linkedin,
  Mail,
  Twitter,
  Instagram,
  Wallet,
  MapPin,
  Shield,
  Send,
  Globe2
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Locator from "./Locator";
import { Input } from "./ui";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="relative overflow-hidden border-t border-slate-800/60 bg-linear-to-b from-slate-900 via-slate-950 to-slate-900">
      {/* Enhanced ambient glow effects */}
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-emerald-600/5 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-green-500/5 blur-3xl"></div>

      {/* Newsletter section - enhanced card treatment */}
      <div className="relative border-b border-slate-800/60 pt-12 sm:pt-16">
        <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 ring-1 ring-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                Newsletter
              </div>
              <h3 className="mb-3 font-serif text-2xl font-bold text-white sm:mb-4 sm:text-3xl lg:text-4xl">
                Stay updated with EaziWage.
              </h3>
              <p className="text-base leading-relaxed text-slate-400 sm:text-lg">
                Get the latest news, product updates, and financial tips delivered to your inbox.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="h-12 flex-1 rounded-xl border-slate-700/60 bg-slate-800/50 px-5 text-white placeholder:text-slate-500 backdrop-blur-sm transition-all duration-300 focus:border-emerald-500/50 focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500/20 sm:h-14 sm:px-6"
              />
              <button className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-green-600 px-6 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/30 sm:h-14 sm:px-8">
                <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 sm:h-5 sm:w-5" strokeWidth={2} />
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content - enhanced spacing and typography */}
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12 md:grid-cols-5 lg:gap-16">
          
          {/* Brand - enhanced styling */}
          <div className="space-y-5 sm:col-span-2 md:col-span-1">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <motion.div 
                whileHover={{ rotate: 5, scale: 1.1 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500/20 to-green-500/20 ring-1 ring-emerald-500/20"
              >
                <Wallet className="h-5 w-5 text-emerald-400 transition-colors group-hover:text-emerald-300" strokeWidth={2} />
              </motion.div>
              <span className="font-serif text-2xl font-bold text-white transition-colors group-hover:text-emerald-50">
                EaziWage
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-slate-400">
              Empowering Kenyan workers with instant access to earned wages —
              reducing financial stress and boosting workplace performance.
            </p>

            {/* Enhanced social links */}
            <div className="flex gap-3 pt-2">
              {[
                {
                  icon: Facebook,
                  url: "https://www.facebook.com/share/1CwgkthTRT/",
                },
                {
                  icon: Instagram,
                  url: "https://www.instagram.com/eaziwagelimited/",
                },
                {
                  icon: Twitter,
                  url: "https://x.com/eaziwagelimited?t=m-WyH8sFtbLOAiRjVKFVPw&s=08",
                },
                {
                  icon: Linkedin,
                  url: "https://www.linkedin.com/company/eaziwage/?viewAsMember=true",
                },
              ].map((social, index) => (
                <motion.a
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href={social.url}
                  key={index}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800/50 text-slate-400 ring-1 ring-slate-700/50 transition-all duration-300 hover:bg-emerald-500/10 hover:text-emerald-400 hover:ring-emerald-500/30"
                >
                  <social.icon className="h-4 w-4" strokeWidth={2} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Product - enhanced link styling */}
          <div>
            <h3 className="mb-5 font-serif text-lg font-bold text-white sm:mb-6 sm:text-xl">
              Product
            </h3>
            <ul className="space-y-3.5">
              {[
                { name: "Resources", href: "resources" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors duration-200 hover:text-emerald-400 sm:text-base"
                  >
                    <span className="h-px w-0 bg-emerald-400 transition-all duration-300 group-hover:w-4"></span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company - enhanced link styling */}
          <div>
            <h3 className="mb-5 font-serif text-lg font-bold text-white sm:mb-6 sm:text-xl">
              Company
            </h3>
            <ul className="space-y-3.5">
              {[
                { name: "About Us", href: "about" },
                { name: "Careers", href: "careers" },
                { name: "Partners", href: "partners" },
                { name: "Culture", href: "culture" },
                { name: "Contact", href: "contact" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors duration-200 hover:text-emerald-400 sm:text-base"
                  >
                    <span className="h-px w-0 bg-emerald-400 transition-all duration-300 group-hover:w-4"></span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal - enhanced link styling */}
          <div>
            <h3 className="mb-5 font-serif text-lg font-bold text-white sm:mb-6 sm:text-xl">
              Legal
            </h3>
            <ul className="space-y-3.5">
              {[
                { name: "Data Policy", href: "/data.pdf" },
                { name: "ABC Policy", href: "/corruption.pdf" },
                { name: "Code of Ethics", href: "/ethics.pdf" },
                { name: "Gifts Policy", href: "/gifts.pdf" },
                { name: "AML & CFT Policy", href: "/money.pdf" },
                { name: "Whistleblowing Policy", href: "/whistleblow.pdf" },
                { name: "Terms of Service", href: "/terms.pdf" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    target="_blank"
                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors duration-200 hover:text-emerald-400 sm:text-base"
                  >
                    <span className="h-px w-0 bg-emerald-400 transition-all duration-300 group-hover:w-4"></span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact - enhanced with icon containers */}
          <div>
            <h3 className="mb-5 font-serif text-lg font-bold text-white sm:mb-6 sm:text-xl">
              Contact
            </h3>
            <ul className="space-y-4">
              {[
                {
                  icon: Mail,
                  href: "mailto:support@eaziwage.com",
                  text: "support@eaziwage.com",
                },
                {
                  icon: MapPin,
                  href: "https://google.com/maps?q=Westlands,+Nairobi",
                  text: "Westlands Business Park, Nairobi",
                },
              ].map((contact, index) => (
                <li key={index}>
                  <a
                    href={contact.href}
                    target={
                      contact.href.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      contact.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="group flex items-start gap-3 text-sm text-slate-400 transition-colors duration-200 hover:text-emerald-400 sm:text-base"
                  >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800/50 ring-1 ring-slate-700/50 transition-all duration-300 group-hover:bg-emerald-500/10 group-hover:ring-emerald-500/30">
                      <contact.icon className="h-4 w-4" strokeWidth={2} />
                    </div>
                    <span className="flex-1 pt-1">{contact.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar - enhanced layout and styling */}
        <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-slate-800/60 pt-8 sm:mt-16 sm:pt-10 md:flex-row">
          <p className="text-center text-xs text-slate-500 sm:text-sm md:text-left">
            &copy; 2025 - {currentYear ?? ""} EaziWage. All Rights Reserved
          </p>
          
          <div className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-800/50 ring-1 ring-slate-700/50">
              <Globe2 className="h-3 w-3 text-emerald-400 sm:h-3.5 sm:w-3.5" strokeWidth={2} />
            </div>
            <span>Kenya · Uganda · Tanzania · Rwanda</span>
          </div>
          
          <Locator />
          
          <Link
            href="/status"
            className="group flex items-center gap-2 rounded-lg bg-slate-800/30 px-3 py-1.5 text-xs text-slate-400 ring-1 ring-slate-700/50 transition-all duration-300 hover:bg-emerald-500/10 hover:text-emerald-400 hover:ring-emerald-500/30 sm:text-sm"
          >
            <Shield className="h-3 w-3 animate-pulse text-emerald-500 sm:h-3.5 sm:w-3.5" strokeWidth={2} />
            <span>Eaziwage Status</span>
          </Link>
        </div>
      </div>

      {/* Regulatory Strip - enhanced card treatment */}
      <div className="border-t border-slate-800/60 bg-slate-900/80 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="rounded-xl border border-slate-800/60 bg-slate-800/30 p-4 sm:p-5">
            <p className="text-center text-xs leading-relaxed text-slate-400 sm:text-sm sm:leading-relaxed">
              EaziWage operates in compliance with applicable financial regulations 
              and laws in each country of operation. Funds are provided through licensed banking 
              and financial partners. This service does not constitute lending under
              applicable banking laws.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
