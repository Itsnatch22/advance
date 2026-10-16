import type { Metadata } from "next";
import PolicyPage, {
  type PolicySection,
} from "@/components/policies/EaziWagePolicies";

export const metadata: Metadata = {
  title: "EaziWage Code of Ethics and Business Conduct",
  description:
    "Read EaziWage's Code of Ethics and Business Conduct, including the standards expected of employees and associated persons.",
};

const sections: PolicySection[] = [
  {
    id: "purpose",
    title: "1. Purpose",
    paragraphs: [
      "This Code defines the ethical principles, professional standards, and behavioural expectations that guide all actions and decisions within EaziWage Holdings Limited (“the Firm” or “EaziWage”) and its associated entities (the “Group”).",
      "It ensures that the Firm’s conduct reflects honesty, fairness, integrity, and respect for the law in every relationship—with employees, customers, employers, banks, mobile-money partners, regulators, and the communities we serve.",
    ],
  },
  {
    id: "scope",
    title: "2. Scope",
    paragraphs: [
      "This Code applies to:",
      "All stakeholders must familiarise themselves with this Code and comply with it as a condition of engagement.",
    ],
    items: [
      "All employees, officers, directors, and Board members;",
      "All contractors, consultants, agents, and representatives;",
      "All subsidiaries, affiliates, and associated companies of EaziWage Holdings Limited;",
      "Any third parties or vendors acting on behalf of the Firm (“associated persons”).",
    ],
  },
  {
    id: "our-core-values",
    title: "3. Our Core Values",
    items: [
      "1. Integrity: We uphold security and transparency in every transaction.",
      "2. Accessibility: Designed for everyone — employers, employees, and partners alike.",
      "3. Innovation: We harness technology to empower people and scale access.",
      "4. Transparency: Clarity and visibility at every financial touchpoint.",
    ],
  },
  {
    id: "compliance-with-laws-and-regulations",
    title: "4. Compliance with Laws & Regulations",
    paragraphs: [
      "All stakeholders must comply with all applicable Kenyan- and international laws, including:",
      "Any breach of law or regulation will be treated as a serious disciplinary matter and may lead to dismissal or prosecution.",
    ],
    items: [
      "Bribery Act of 2016 – prohibition on giving, offering, or accepting bribes.",
      "Anti-Corruption and Economic Crimes Act of 2003 (ACECA) – integrity in public/private dealings.",
      "Proceeds of Crime & Anti-Money Laundering Act of 2009 (POCAMLA) – prevention of money laundering and terrorist financing.",
      "Data Protection Act 2019 – lawful, secure handling of personal data.",
      "Employment Act of 2007 – fair labour practices, non-discrimination, and protection of workers.",
      "Companies Act of 2015 – directors’ fiduciary duties and corporate governance.",
    ],
  },
  {
    id: "ethical-responsibilities",
    title: "5. Ethical Responsibilities",
  },
  {
    id: "personal-integrity",
    title: "5.1 Personal Integrity",
    items: [
      "Act honestly, fairly, and with professionalism in all dealings.",
      "Avoid conflicts of interest or situations where personal interests interfere with business decisions.",
      "Declare any potential conflict immediately to the Compliance Officer or line manager.",
    ],
  },
  {
    id: "conflicts-of-interest",
    title: "5.2 Conflicts of Interest",
    paragraphs: ["Employees and directors must:"],
    items: [
      "Not use their position for personal gain or advantage;",
      "Disclose any financial interest in entities that transact with EaziWage;",
      "Seek written clearance before engaging in outside employment, consultancy, or investment that overlaps with the Firm’s interests.",
    ],
  },
  {
    id: "anti-bribery-and-corruption",
    title: "5.3 Anti-Bribery & Corruption",
    items: [
      "Never offer, promise, give, request, or accept bribes, kickbacks, facilitation payments, or improper advantages.",
      "All gifts and hospitality must comply with the Gifts, Hospitality & Entertainment Policy and be recorded in the register.",
      "Follow the Anti-Bribery and Policy; to embed a consistent anti-bribery culture throughout the Group.",
      "Report any suspected bribery or unethical inducement immediately.",
    ],
  },
  {
    id: "confidentiality-and-data-protection",
    title: "5.4 Confidentiality & Data Protection",
    items: [
      "Protect all personal, financial, and business-sensitive information entrusted to you.",
      "Use data only for authorised business purposes and in compliance with the Data Privacy & Protection Policy and the Data Protection Act 2019.",
      "Do not disclose or misuse confidential information even after leaving the Firm.",
    ],
  },
  {
    id: "fair-dealing",
    title: "5.5 Fair Dealing",
    items: [
      "Compete fairly, avoiding anti-competitive practices, collusion, or misleading representations.",
      "Treat customers and partners honestly and transparently.",
    ],
  },
  {
    id: "protection-of-company-assets",
    title: "5.6 Protection of Company Assets",
    items: [
      "Use company property, systems, and funds responsibly and only for legitimate business purposes.",
      "Report any loss, theft, or misuse of assets promptly.",
    ],
  },
  {
    id: "financial-integrity",
    title: "5.7 Financial Integrity",
    items: [
      "Keep accurate and complete financial records in accordance with accounting standards and audit requirements.",
      "Never falsify records, create undisclosed accounts, or misstate financial results.",
      "Cooperate fully with auditors and regulators.",
    ],
  },
  {
    id: "workplace-conduct-and-human-rights",
    title: "5.8 Workplace Conduct & Human Rights",
    items: [
      "Treat all colleagues with respect, dignity, and courtesy.",
      "Prohibit discrimination, harassment, bullying, or intimidation based on gender, ethnicity, disability, religion, or any other protected status.",
      "Provide a safe, healthy, and inclusive work environment.",
      "Respect labour rights as set out in the Employment Act of 2007 and ILO conventions.",
    ],
  },
  {
    id: "environmental-responsibility",
    title: "5.9 Environmental Responsibility",
    items: [
      "Minimise environmental footprint, support sustainability, and promote green energy practices consistent with EaziWage’s Environmental, Sustainability, and Governance (ESG) commitments.",
    ],
  },
  {
    id: "data-security-and-cyber-ethics",
    title: "5.10 Data Security & Cyber Ethics",
    items: [
      "Follow all security protocols, password and device-use policies, and report phishing or breaches immediately.",
      "Use company networks and systems ethically—no unauthorised downloads, data scraping, or privacy violations.",
    ],
  },
  {
    id: "political-and-charitable-activity",
    title: "5.11 Political & Charitable Activity",
    items: [
      "EaziWage remains politically neutral. Employees may engage in personal political activities outside work but must not use company resources or imply company endorsement.",
      "Charitable contributions on behalf of EaziWage require management approval and transparency.",
    ],
  },
  {
    id: "anti-money-laundering",
    title: "5.12 Anti-Money Laundering",
    items: [
      "Follow the Anti-Money and Counter-Financing of Terrorism Policy; identify and report suspicious transactions to the Chief Executive Officer.",
      "Never engage in or facilitate transactions that conceal the origin of funds.",
    ],
  },
  {
    id: "reporting-misconduct",
    title: "6. Reporting Misconduct",
    paragraphs: [
      "Employees are required to report unethical behaviour, policy violations, or suspected unlawful acts through the Whistleblowing Policy or directly to the Chief Executive Officer:",
    ],
    items: [
      "Reports may be made confidentially or anonymously.",
      "Retaliation against whistleblowers is strictly prohibited.",
    ],
  },
  {
    id: "disciplinary-action",
    title: "7. Disciplinary Action",
    paragraphs: [
      "Violations of this Code or related policies may lead to disciplinary action including warning, suspension, termination, restitution, and/or legal referral to the Ethics and Anti-Corruption Commission (EACC) or other authorities.",
    ],
  },
  {
    id: "roles-and-responsibilities",
    title: "8. Roles & Responsibilities",
    paragraphs: ["Role — Responsibility"],
    subsections: [
      {
        heading: "Board of Directors",
        paragraphs: [
          "Endorse and promote ethical culture; oversee compliance.",
        ],
      },
      {
        heading: "Chief Executive Officer",
        paragraphs: [
          "Ensure leadership commitment and adequate resources and implement ethics training, monitoring, and investigations.",
        ],
      },
      {
        heading: "Managers / Supervisors",
        paragraphs: [
          "Lead by example, communicate expectations, handle disclosures.",
        ],
      },
      {
        heading: "All Employees / Contractors / Agents",
        paragraphs: [
          "Read, understand, and comply with the Code and all related policies.",
        ],
      },
    ],
  },
  {
    id: "training-and-acknowledgement",
    title: "9. Training & Acknowledgement",
    paragraphs: [
      "Every employee will receive ethics training during onboarding and annually thereafter. All employees, directors, and agents must sign an Acknowledgement Form confirming that they have read, understood, and will adhere to this Code.",
    ],
  },
  {
    id: "review-and-approval",
    title: "10. Review & Approval",
    paragraphs: [
      "This Code will be reviewed annually or when changes in law or business operations occur.",
    ],
  },
  {
    id: "contact-us",
    title: "Contact Us",
    paragraphs: ["info@eaziwage.com", "+254 72 315 4900"],
  },
];

export default function CodeOfEthicsPage() {
  return (
    <PolicyPage
      title="Code of Ethics and Business Conduct"
      description="The Code of Ethics and Business Conduct (“CEBC”) Policy (“the Code”) applies to all employees, employers, contractors, agents, investors, banks and any other individuals or entities within the EaziWage Group, if and where relevant."
      updated="October 16, 2026"
      sections={sections}
    />
  );
}
