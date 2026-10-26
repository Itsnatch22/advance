import type { IconType } from "react-icons";
import { FaGithub, FaInstagram, FaLink, FaLinkedin } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  image: string;
  contribution?: string;
  personalDetail?: string;
  links?: {
    icon: IconType;
    label: string;
    href: string;
  }[];
}

export const people: TeamMember[] = [
  {
    slug: "mark-kamau",
    name: "Mark Kamau",
    role: "Co-Founder & Lead Developer",
    image: "/team/mark.png",
    contribution:
      "I build and evolve EaziWage across the stack, from product experiences and integrations to backend logic, debugging, and the systems that keep everything working together. Combine hands-on development with product thinking, turning ideas into working features and untangling the problems that come with building a complex product.",
    personalDetail:
      "My relationship with technology goes beyond writing code. I enjoy understanding how things work beneath the surface, tracing problems to their roots, and exploring what's possible when different ideas and technologies come together. I'm naturally curious, constantly experimenting, and rarely short of a new idea to explore. For me, building software is as much about understanding and problem-solving as it is about creating something useful.",
    links: [
      { icon: FaGithub, label: "GitHub", href: "https://github.com/Itsnatch22" },
      { icon: FaLink, label: "Personal website", href: "https://kamaumark.vercel.app" },
      { icon: FaLinkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/mark-kamau-4a0b932b0/"},
      { icon: SiGmail, label: "Gmail", href: "mailto:mark@eaziwage.com"}
    ],
  },
  {
    slug: "joel-omolo",
    name: "Joel Omolo",
    role: "Co-Founder & Developer",
    image: "/team/joel.png",
    links: [
      { icon: FaGithub, label: "GiHub", href: "https://github.com/TheeKJ" },
      { icon: FaLink, label: "Personal website", href: "https://jowey.netlify.app" },
      { icon: FaLinkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/joel-ndoho-4371102a1/"},
      { icon: SiGmail, label: "Gmail", href: "mailto:joel@eaziwage.com"}
    ],
     contribution:
    "I help turn EaziWage from an idea into something real — building the product, working through the technical details, and figuring out how everything fits together. For me, it’s more than writing code. It’s about building something I genuinely believe can make a difference.",
  personalDetail:
    "I’m naturally curious and always exploring technology, business, sales, and new ideas. I enjoy taking an idea from a simple conversation and seeing how far we can take it. Building EaziWage has given me a chance to create, learn, and work on something that means more to me than just having a job.",
  },
  {
    slug: "henry-kimani",
    name: "Henry Kimani",
    role: "Co-Founder & CMO",
    image: "/team/henry.png",
    links: [
      { icon: FaLinkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/henry-kimani-6b0519261/"},
      { icon: SiGmail, label: "Gmail", href: "mailto:mail@eaziwage.com"}
    ]
  },
  {
    slug: "jason-crawford",
    name: "Jason Crawford",
    role: "Co-Founder & CEO",
    image: "/team/jason.png",
    links: [
      { icon: FaGithub, label: "GiHub", href: "https://github.com/TheeKJ" },
      { icon: FaLinkedin, label: "LinkedIn", href: ""},
      { icon: SiGmail, label: "Gmail", href: "mailto:jason@eaziwage.com"}
    ]
  },
];
