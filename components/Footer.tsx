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
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Locator from "./Locator";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);
  return (
    <footer className="relative overflow-hidden border-t border-gray-800 bg-gradient-to-b from-gray-950 via-black to-green-950 text-gray-300">
      {/* Subtle ambient glow orb */}
      <div className="absolute top-0 left-0 h-80 w-80 rounded-full bg-green-600/10 blur-3xl"></div>
      <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl"></div>

      <div className="relative container mx-auto px-4 py-12 sm:px-6 md:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 md:grid-cols-5 md:gap-20">
          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 md:col-span-1">
            <Link href="/" className="group flex items-center gap-2">
              <motion.div whileHover={{ rotate: 5, scale: 1.1 }}>
                <Wallet className="h-6 w-6 text-green-400 transition-colors group-hover:text-green-300" />
              </motion.div>
              <span className="text-2xl font-bold text-white transition-colors group-hover:text-green-50">
                EaziWage
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-gray-400">
              Empowering Kenyan workers with instant access to earned wages —
              reducing financial stress and boosting workplace performance.
            </p>

            <div className="flex space-x-4 pt-2">
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
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  href={social.url}
                  key={index}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition hover:text-green-500"
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-6 text-xl font-bold text-white">Product</h3>
            <ul className="space-y-3">
              {[
                { name: "Resources", href: "resources" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="inline-block text-base text-gray-300"
                  >
                    <motion.span
                      whileHover={{ x: 5, color: "var(--color-green-400)" }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.name}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-6 text-xl font-bold text-white">Company</h3>
            <ul className="space-y-3">
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
                    className="inline-block text-base text-gray-300"
                  >
                    <motion.span
                      whileHover={{ x: 5, color: "var(--color-green-400)" }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.name}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-6 text-xl font-bold text-white">Legal</h3>
            <ul className="space-y-3">
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
                    className="inline-block text-base text-gray-300"
                  >
                    <motion.span
                      whileHover={{ x: 5, color: "var(--color-green-400)" }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.name}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-xl font-bold text-white">Contact</h3>
            <ul className="space-y-3">
              {[
                {
                  icon: Mail,
                  href: "mailto:support@eaziwage.com",
                  text: "support@eaziwage.com",
                },
                {
                  icon: MapPin,
                  href: "https://google.com/maps?q=Westlands,+Nairobi",
                  text: "Westlands, Nairobi",
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
                    className="group flex items-center gap-2 text-base text-gray-300"
                  >
                    <contact.icon className="h-5 w-5 transition-colors group-hover:text-green-500" />
                    <motion.span
                      whileHover={{ x: 5, color: "var(--color-green-400)" }}
                      transition={{ duration: 0.2 }}
                    >
                      {contact.text}
                    </motion.span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 md:flex-row">
          <p className="text-center text-xs text-gray-500 md:text-left">
            &copy; {currentYear ?? ""} EaziWage. All Rights Reserved
          </p>
          <Locator />
          <Link
            href="/status"
            className="flex animate-pulse items-center gap-1 text-xs text-gray-500 transition-colors hover:text-green-400 md:text-left"
          >
            <Shield className="inline h-3 w-3 text-green-500" /> Eaziwage Status
          </Link>
        </div>
      </div>

      {/* Regulatory Strip */}
      <div className="border-t border-gray-800 bg-gray-900/80">
        <p className="mx-auto max-w-4xl p-3 px-4 text-center text-xs text-gray-400 sm:p-4">
          EaziWage operates in compliance with applicable financial regulations 
          and laws in each country of operation. Funds are provided through licensed banking 
          and financial partners. This service does not constitute lending under
           applicable banking laws.
        </p>
      </div>
    </footer>
  );
}
