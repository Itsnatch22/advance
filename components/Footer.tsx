'use client'

import { useEffect, useRef } from 'react';
import { FiLinkedin, FiFacebook, FiTwitter, FiMail } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link'
import gsap from 'gsap';
import { BiWallet, BiLocationPlus } from 'react-icons/bi';
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const footerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
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
        className='overflow-hidden text-gray border-t border-gray-800 h-full bg-black relative'
        >
            <div
            className='container mx-auto px-6 md:py-16 py-12'
            >
                <div className='grid grid-cols-1 md:grid-cols-4 gap-12'>
                    <div className='footer-col space-y-4'>
                        <Link href='/' className='flex items-center'>
                            <BiWallet className='text-green-400 w-5 h-5'/>
                            <span className='text-xl font-bold text-white'>
                                EaziWage
                            </span>
                        </Link>
                        <p className='text-gray-300 text-sm'>
                            Empowering Kenyan workers with instant access to their earned wages, reducing financial stress and improving workplace productivity.
                        </p>
                        <div className='flex space-x-4'>
                            {[
                                { icon: FiFacebook, url: 'https://facebook.com' },
                                { icon: FiTwitter, url: 'https://twitter.com' },
                                { icon: FiLinkedin, url: 'https://linkedin.com' },
                            ].map((social, index) => (
                                <Link
                                href={social.url}
                                key={index}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-gray-400 hover:text-green-500 transition-colors'
                                >
                                    <social.icon className='w-5 h-5' />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Product Links Column */}
                    <div className="footer-col">
                        <h3 className='text-white font-semibold mb-4'>Product</h3>
                        <ul className='space-y-2'>
                            {[
                                {name: 'How It Works', href: 'how-it-works'},
                                {name: 'Pricing', href: 'pricing'},
                                {name: 'Security', href: 'security'},
                                {name: 'Integrations', href: 'integrate'},
                            ].map((link,index)=>(
                                <li
                                key={index}>
                                    <Link
                                    href={link.href}
                                    className='text-sm text-gray-400 hover:text-green-500 hover:underline'>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links Column */}
                    <div className="footer-col">
                        <h3 className='text-white font-semibold mb-4'>Company</h3>
                        <ul className='space-y-2'>
                            {[
                                {name: 'About Us', href: 'about'},
                                {name: 'Careers', href: 'careers'},
                                {name: 'Partners', href: 'partners'},
                                {name: 'Contact', href: 'contact'},
                            ].map((link,index)=>(
                                <li
                                key={index}>
                                    <Link
                                    href={link.href}
                                    className='text-sm text-gray-400 hover:text-green-500'>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h3 className='text-white font-semibold mb-4'>Contact</h3>
                        <ul className='space-y-2'>
                            {[
                                {icon: FiMail, href: 'mailto:hello@eaziwage.co.ke', text: 'hello@eaziwage.co.ke'},
                                {icon: FaWhatsapp, href: 'https://wa.me/+254723154900', text: '+254 723 154900'},
                                {icon: BiLocationPlus, href: 'https://google.com/maps?q=Westlands,+Nairobi',text: 'Westlands,Nairobi'},
                            ].map((contact,index)=>(
                                <li
                                key={index}>
                                    <a href={contact.href}
                                    target={contact.href.startsWith("http") ? "_blank" : undefined}
                                    rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                    className='flex items-center gap-2 text-sm text-gray-400 hover:text-green-500 transition'>
                                        <contact.icon className='w-5 h-5' />
                                        {contact.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/*Bottom Bar*/}
                <div
                className='bottom-bar border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center'>
                    <div className="flex space-x-6">
                        <Link href='/privacy' className='text-xs text-gray-400 hover:text-green-500'>Privacy Policy</Link>
                        <Link href='/terms' className='text-xs text-gray-400 hover:text-green-500'>Terms of Service</Link>
                        <Link href='/cookies' className='text-xs text-gray-400 hover:text-green-500'>Cookie Policy</Link>
                        <Link href='/regulations' className='text-xs text-gray-400 hover:text-green-500'>Regulatory</Link>
                    </div>
                    <p className='text-xs text-gray-400 hover:text-green-500 mb-4 md:mb-0'>
                        &copy; {currentYear} EaziWage. All Rights Reserved
                    </p>
                </div>

                <div className="w-full flex justify-center mt-16 md:mt-20">
                    <h1
                    className="text-[80px] md:text-[160px] hidden lg:flex font-black leading-none bg-green-600 bg-clip-text text-transparent tracking-tight"
                    >
                    EaziWage
                    </h1>
                </div>
            </div>
            <div className='bg-gray-700'>
                <p className='text-xs text-white ml-20 p-2 items-center justify-center hidden lg:flex'>
                    EaziWage is regulated by the Central Bank of Kenya. All funds are provided by licensed banking partners.
                    This service does not constitute lending under the Banking Act.
                </p>
            </div>
        </footer>
    )
}