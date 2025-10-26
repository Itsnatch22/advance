'use client'

import { useEffect, useRef, useState } from 'react';
import { FiLinkedin, FiMail, FiInstagram } from 'react-icons/fi';
import { FaXTwitter } from "react-icons/fa6";
import { FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link'
import gsap from 'gsap';
import { BiWallet, BiLocationPlus } from 'react-icons/bi';
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion } from "framer-motion"
import Locator from './Locator';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
    const [currentYear, setCurrentYear] = useState<number | null>(null);
    const footerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Avoid using Date at render time in a Client Component
        if (currentYear === null) {
            setCurrentYear(new Date().getFullYear());
        }

        const footer = footerRef.current;

        const footerCols = footer?.querySelectorAll(".footer-col");
        if (footerCols && footerCols.length > 0) {
            gsap.fromTo(
                footerCols,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: footer,
                        start: "top 80%",
                        toggleActions: "play none none none",
                    },
                }
            );
        }

        const bottomBarElements = footer?.querySelectorAll(".bottom-bar");
        if (bottomBarElements && bottomBarElements.length > 0) {
            gsap.fromTo(
                bottomBarElements,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: bottomBarElements,
                        start: "top 95%",
                        toggleActions: "play none none none",
                    },
                }
            );
        }
    })
    return(
        <footer
  ref={footerRef}
  className="relative overflow-hidden bg-gradient-to-b from-gray-950 via-black to-green-950 text-gray-300 border-t border-gray-800"
>
  {/* Subtle ambient glow orb */}
  <div className="absolute top-0 left-0 w-80 h-80 bg-green-600/10 blur-3xl rounded-full"></div>
  <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-400/10 blur-3xl rounded-full"></div>

  <div className="relative container mx-auto px-4 sm:px-6 md:py-16 py-12">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 sm:gap-10 md:gap-12">
      {/* Brand */}
      <div className="footer-col space-y-4 sm:col-span-2 md:col-span-1">
        <Link href="/" className="flex items-center gap-2">
          <BiWallet className="text-green-400 w-6 h-6" />
          <span className="text-xl font-bold text-white">EaziWage</span>
        </Link>
        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
          Empowering Kenyan workers with instant access to earned wages — reducing
          financial stress and boosting workplace performance.
        </p>

        <div className="flex space-x-4 pt-2">
          {[
            { icon: FiInstagram, url: "https://instagram.com" },
            { icon: FaXTwitter, url: "https://x.com" },
            { icon: FiLinkedin, url: "https://linkedin.com" },
          ].map((social, index) => (
            <motion.a
              whileHover={{ scale: 1.2 }}
              href={social.url}
              key={index}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-green-500 transition"
            >
              <social.icon className="w-5 h-5" />
            </motion.a>
          ))}
        </div>
      </div>

      {/* Product */}
      <div className="footer-col">
        <h3 className="text-white font-semibold mb-4">Product</h3>
        <ul className="space-y-2">
          {[
            { name: "How It Works", href: "how-it-works" },
            { name: "Pricing", href: "pricing" },
            { name: "Integrations", href: "integrate" },
          ].map((link, index) => (
            <li key={index}>
              <Link
                href={link.href}
                className="text-sm text-gray-400 hover:text-green-400 hover:translate-x-1 transition-all"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Company */}
      <div className="footer-col">
        <h3 className="text-white font-semibold mb-4">Company</h3>
        <ul className="space-y-2">
          {[
            { name: "About Us", href: "about" },
            { name: "Careers", href: "careers" },
            { name: "Partners", href: "partners" },
            { name: "Careers", href: "careers" },
            { name: "Contact", href: "contact" },
          ].map((link, index) => (
            <li key={index}>
              <Link
                href={link.href}
                className="text-sm text-gray-400 hover:text-green-400 hover:translate-x-1 transition-all"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Legal */}
      <div className='footer-col'>
        <h3 className='text-white font-semibold mb-4'>Legal</h3>
        <ul className='space-y-2'>
          {[
            { name: "Data Policy", href: "/data.pdf"},
            { name: "ABC Policy", href: "/corruption.pdf"},
            { name: "Code of Ethics", href: "/ethics.pdf"},
            { name: "Gifts Policy", href: "/gifts.pdf"},
            { name: "AML & CFT Policy", href: "/money.pdf"},
            { name: "Whistleblowing Policy", href: "/whistleblow.pdf"},
            { name: "Terms of Service", href: "/terms.pdf"},
          ].map((link, index) => (
            <li key={index}>
              <Link
                href={link.href}
                target='_blank'
                className="text-sm text-gray-400 hover:text-green-400 hover:translate-x-1 transition-all"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact */}
      <div className="footer-col">
        <h3 className="text-white font-semibold mb-4">Contact</h3>
        <ul className="space-y-2">
          {[
            { icon: FiMail, href: "mailto:info@eaziwage.com", text: "info@eaziwage.com" },
            { icon: FaWhatsapp, href: "https://wa.me/+254723154900", text: "+254 723 154900" },
            { icon: BiLocationPlus, href: "https://google.com/maps?q=Westlands,+Nairobi", text: "Westlands, Nairobi" },
          ].map((contact, index) => (
            <li key={index}>
              <a
                href={contact.href}
                target={contact.href.startsWith("http") ? "_blank" : undefined}
                rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-400 transition"
              >
                <contact.icon className="w-5 h-5" />
                {contact.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
       <p className="text-xs text-gray-500 text-center md:text-left">&copy; {currentYear ?? ''} EaziWage. All Rights Reserved</p>
       <Locator/>
    </div>
  </div>

  {/* Regulatory Strip */}
  <div className="bg-gray-900/80 border-t border-gray-800">
    <p className="text-xs text-gray-400 p-3 sm:p-4 text-center max-w-4xl mx-auto px-4">
      EaziWage is regulated by the Central Bank of Kenya. All funds are provided by licensed banking partners.
      This service does not constitute lending under the Banking Act.
    </p>
  </div>
</footer>

    )
}