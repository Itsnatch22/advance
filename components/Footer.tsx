
'use client'

import { useEffect, useState } from 'react';
import { Facebook, Linkedin, Mail, Twitter, Instagram, Wallet, MapPin, Shield } from 'lucide-react';
import Link from 'next/link'
import { motion } from "framer-motion"
import Locator from './Locator';

export default function Footer() {
    const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);
    return(
        <footer
  className="relative overflow-hidden bg-gradient-to-b from-gray-950 via-black to-green-950 text-gray-300 border-t border-gray-800"
>
  {/* Subtle ambient glow orb */}
  <div className="absolute top-0 left-0 w-80 h-80 bg-green-600/10 blur-3xl rounded-full"></div>
  <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-400/10 blur-3xl rounded-full"></div>

  <div className="relative container mx-auto px-4 sm:px-6 md:py-16 py-12">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 sm:gap-10 md:gap-12">
      {/* Brand */}
      <div className="space-y-4 sm:col-span-2 md:col-span-1">
        <Link href="/" className="flex items-center gap-2 group">
          <Wallet className="text-green-400 w-6 h-6 group-hover:text-green-300 transition-colors" />
          <span className="text-xl font-bold text-white group-hover:text-green-50 transition-colors">EaziWage</span>
        </Link>
        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
          Empowering Kenyan workers with instant access to earned wages — reducing
          financial stress and boosting workplace performance.
        </p>

        <div className="flex space-x-4 pt-2">
          {[
            { icon: Facebook, url: "https://www.facebook.com/share/1CwgkthTRT/" },
            { icon: Instagram, url: "https://www.instagram.com/eaziwagelimited/" },
            { icon: Twitter, url: "https://x.com/eaziwagelimited?t=m-WyH8sFtbLOAiRjVKFVPw&s=08" },
            { icon: Linkedin, url: "https://www.linkedin.com/company/eaziwage/?viewAsMember=true" },
          ].map((social, index) => (
            <motion.a
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
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
      <div>
        <h3 className="text-white font-semibold mb-4">Product</h3>
        <ul className="space-y-2">
          {[
            { name: "How It Works", href: "how-it-works" },
            { name: "Pricing", href: "pricing" },
            { name: "Resources", href: "resources" },
          ].map((link, index) => (
            <li key={index}>
              <Link
                href={link.href}
                className="text-sm text-gray-400 hover:text-green-400 hover:translate-x-1 transition-all inline-block"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Company */}
      <div>
        <h3 className="text-white font-semibold mb-4">Company</h3>
        <ul className="space-y-2">
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
                className="text-sm text-gray-400 hover:text-green-400 hover:translate-x-1 transition-all inline-block"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Legal */}
      <div>
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
                className="text-sm text-gray-400 hover:text-green-400 hover:translate-x-1 transition-all inline-block"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact */}
      <div>
        <h3 className="text-white font-semibold mb-4">Contact</h3>
        <ul className="space-y-2">
          {[
            { icon: Mail, href: "mailto:support@eaziwage.com", text: "support@eaziwage.com" },
            { icon: MapPin, href: "https://google.com/maps?q=Westlands,+Nairobi", text: "Westlands, Nairobi" },
          ].map((contact, index) => (
            <li key={index}>
              <a
                href={contact.href}
                target={contact.href.startsWith("http") ? "_blank" : undefined}
                rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-400 transition group"
              >
                <contact.icon className="w-5 h-5 group-hover:text-green-500 transition-colors" />
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
       <Link 
       href="/status" 
       className='flex items-center gap-1 text-xs text-gray-500 md:text-left animate-pulse hover:text-green-400 transition-colors'>
       <Shield className='w-3 h-3 text-green-500 inline'/> Eaziwage Status
      </Link>
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