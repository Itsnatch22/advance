// Bank and partner data
export const bankingPartners = [
  {
    name: "Equity Bank",
    logo: "/partners/equity.svg",
    blurb: "Powering instant salary disbursements.",
    href: "https://equitygroupholdings.com/",
  },
  {
    name: "KCB Bank",
    logo: "/partners/kcb.svg",
    blurb: "Seamless payroll solutions for businesses.",
    href: "https://www.kcbgroup.com/",
  },
  {
    name: "Cooperative Bank",
    logo: "/partners/coop.svg",
    blurb: "Innovative banking for modern enterprises.",
    href: "https://www.co-opbank.co.ke/",
  },
  {
    name: "Stanbic Bank",
    logo: "/partners/stanbic.svg",
    blurb: "Your trusted partner in business growth.",
    href: "https://www.stanbicbank.co.ke/",
  },
  {
    name: "NCBA Bank",
    logo: "/partners/ncba.svg",
    blurb: "Empowering businesses with smart banking.",
    href: "https://ke.ncbagroup.com/",
  },
  {
    name: "Family Bank",
    logo: "/partners/family.svg",
    blurb: "Banking solutions tailored for you.",
    href: "https://familybank.co.ke/",
  },
] as const;

export const corporatePartners = [
  {
    name: "Naivas",
    logo: "/partners/naivas.svg",
    blurb: "Leading supermarket chain enhancing employee benefits.",
    href: "https://www.naivas.co.ke/",
  },
  {
    name: "Carrefour",
    logo: "/partners/carrefour.png",
    blurb: "Global retailer committed to workforce welfare.",
    href: "https://www.carrefour.com/en",
  },
  {
    name: "Mayfair Insurance",
    logo: "/partners/mayfair.png",
    blurb: "Comprehensive insurance solutions for employees.",
    href: "https://mayfairinsurance.co.ke/",
  },
  {
    name: "EABL",
    logo: "/partners/eabl.svg",
    blurb: "Pioneering beverage company supporting workforce welfare.",
    href: "https://eabl.com/",
  },
  {
    name: "Jubilee Insurance",
    logo: "/partners/Jubilee.png",
    blurb: "Trusted insurance partner for employee benefits.",
    href: "https://jubileeinsurance.com/",
  },
  {
    name: "CIC Insurance",
    logo: "/partners/CIC.png",
    blurb: "Innovative insurance solutions for businesses.",
    href: "https://www.cic.co.ke/",
  },
] as const;

export const techPartners = [
  {
    name: "NEXT.js",
    logo: "/partners/next.jpg",
    blurb: "The React framework for production, powering our web experience.",
    href: "https://www.nextjs.org/",
  },
  {
    name: "AWS",
    logo: "/partners/aws.svg",
    blurb: "Cloud solutions driving innovation and scalability.",
    href: "https://aws.amazon.com/",
  },
  {
    name: "Supabase",
    logo: "/partners/supabase.svg",
    blurb: "Open source backend for building secure applications.",
    href: "https://supabase.com/",
  },
  {
    name: "Vercel",
    logo: "/partners/vercel.svg",
    blurb:
      "Platform for frontend developers, providing the speed and reliability.",
    href: "https://vercel.com/",
  },
  {
    name: "Resend",
    logo: "/partners/resend.svg",
    blurb: "Email infrastructure built for developers.",
    href: "https://resend.com/",
  },
  {
    name: "Visa & Mastercard",
    logo: "/partners/visa.svg",
    blurb: "Global payment networks ensuring secure transactions.",
    href: "https://visa.com/",
  },
  {
    name: "Plaid",
    logo: "/partners/plaid.svg",
    blurb: "Connecting applications to users' bank accounts securely.",
    href: "https://plaid.com/",
  },
  {
    name: "Twilio",
    logo: "/partners/twilio.svg",
    blurb:
      "Cloud communications platform for building SMS, Voice & Messaging applications.",
    href: "https://twilio.com/",
  },
  {
    name: "Workpay",
    logo: "/partners/workpay.svg",
    blurb: "Simplified payroll solutions for businesses.",
    href: "https://myworkpay.com/",
  },
] as const;

export const testimonials = [
  // 🇰🇪 KENYA
  {
    quote: "I cleared my electricity bill before it was disconnected. No stress, no calling relatives. Just opened the app and sorted it.",
    author: "Ann Muthoni",
    role: "Pharmacist at Goodlife Pharmacy",
    location: "Nairobi, Kenya",
    avatar: "AM",
    rating: 5
  },
  {
    quote: "Our support team stopped asking for salary advances every other week. Productivity is up and HR pressure is down.",
    author: "Kelvin Onyango",
    role: "HR Manager at iHub",
    location: "Nairobi, Kenya",
    avatar: "KO",
    rating: 5
  },
  {
    quote: "Fuel for my matatu used to depend on chama loans. Now I just access what I’ve worked for.",
    author: "Samuel Mwangi",
    role: "Matatu Driver at Super Metro",
    location: "Nairobi, Kenya",
    avatar: "SM",
    rating: 5
  },

  // 🇺🇬 UGANDA
  {
    quote: "My baby needed medicine at night and I had no cash. EaziWage sent the money instantly. That moment meant everything.",
    author: "Prossy Nankya",
    role: "Nurse at Mulago Hospital",
    location: "Kampala, Uganda",
    avatar: "PN",
    rating: 5
  },
  {
    quote: "Staff used to disappear mid-month looking for side jobs. Now they stay focused because cash flow is not a problem.",
    author: "Michael Kato",
    role: "Operations Lead at SafeBoda",
    location: "Kampala, Uganda",
    avatar: "MK",
    rating: 5
  },
  {
    quote: "Transport to work is no longer a daily struggle. I withdraw a small amount and move.",
    author: "Isaac Okello",
    role: "Warehouse Assistant at DHL",
    location: "Kampala, Uganda",
    avatar: "IO",
    rating: 5
  },

  // 🇷🇼 RWANDA
  {
    quote: "I paid my university tuition balance without taking a loan. That freedom is priceless.",
    author: "Claudine Uwimana",
    role: "Accountant at BK Group",
    location: "Kigali, Rwanda",
    avatar: "CU",
    rating: 5
  },
  {
    quote: "Employee satisfaction improved within the first month. People feel the company actually cares.",
    author: "Jean Paul Habimana",
    role: "HR Director at Irembo",
    location: "Kigali, Rwanda",
    avatar: "JH",
    rating: 5
  },
  {
    quote: "I used it to restock my shop before month end. Sales continued without interruption.",
    author: "Eric Ndayisenga",
    role: "Retail Supervisor at Simba Supermarket",
    location: "Kigali, Rwanda",
    avatar: "EN",
    rating: 5
  },

  // 🇹🇿 TANZANIA
  {
    quote: "School fees deadline came earlier than expected. I accessed my wages in seconds and paid without panic.",
    author: "Neema Joseph",
    role: "Teacher at Feza Schools",
    location: "Dar es Salaam, Tanzania",
    avatar: "NJ",
    rating: 5
  },
  {
    quote: "Our factory workers are less stressed and more consistent. Retention has improved since we introduced EaziWage.",
    author: "Hassan Mwinyi",
    role: "Plant Manager at Bakhresa Group",
    location: "Dar es Salaam, Tanzania",
    avatar: "HM",
    rating: 5
  },
  {
    quote: "I handle family expenses without borrowing from friends anymore. That respect matters to me.",
    author: "Rehema Suleiman",
    role: "Hotel Receptionist at Serena Hotel",
    location: "Dar es Salaam, Tanzania",
    avatar: "RS",
    rating: 5
  }
] as const;


export const partners = [
  { name: 'Safaricom', logo: '/logos/saf.png' },
  { name: 'KCB Group', logo: '/logos/kcb.png' },
  { name: 'Twiga Foods', logo: '/logos/twiga.webp' },
  { name: 'M-KOPA', logo: '/logos/mkopa.webp' },
  { name: 'Jumia', logo: '/logos/jumia.png' },
]
