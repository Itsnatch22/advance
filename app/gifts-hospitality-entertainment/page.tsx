import type { Metadata } from "next";
import PolicyPage, {
  type PolicySection,
} from "@/components/policies/EaziWagePolicies";

export const metadata: Metadata = {
  title: "EaziWage Gifts, Hospitality & Entertainment Policy",
  description:
    "Read EaziWage's policy on giving, receiving, and recording gifts, hospitality, and entertainment.",
};

const sections: PolicySection[] = [
  {
    id: "gifts-hospitality-entertainment-policy-statement",
    title: "1. Gifts, Hospitality & Entertainment Policy Statement",
    paragraphs: [
      "EaziWage Holdings Limited (“the Firm”) and its associated entities (the “Group”) is committed to conducting business in an honest, ethical, and transparent manner. Offering or accepting inappropriate gifts, hospitality, or entertainment can create actual or perceived conflicts of interest and may constitute bribery or corrupt conduct under Kenyan law.",
      "This Policy supports compliance with the Bribery Act of 2016, Anti-Corruption and Economic Crimes Act of 2003 (ACECA), and EACC Guidelines on Gifts and Conflict of Interest, ensuring all interactions are conducted with integrity, transparency, and accountability. The Group maintains zero tolerance for bribery, inducement, or any practice that compromises objectivity, independence, or fair business decision-making.",
    ],
    items: [],
  },
  {
    id: "purpose-scope",
    title: "2. Purpose & Scope",
    paragraphs: [],
    items: [],
    subsections: [
      {
        heading: "Purpose",
        paragraphs: ["The purpose of this Policy is to:"],
        items: [
          "Provide clear guidance on the giving, receiving, and recording of gifts and hospitality;",
          "Prevent bribery, conflicts of interest, and reputational risk;",
          "Support compliance with Kenyan law and internal ethical standards;",
          "Promote transparency in all relationships with clients, suppliers, partners, and public officials.",
        ],
      },
      {
        heading: "Scope",
        paragraphs: ["This Policy applies to:"],
        items: [
          "All employees, directors, officers, and contractors of the Group;",
          "Consultants, agents, suppliers, and other third parties acting on behalf of the Group;",
          "Any other person defined as an “associated person” under the Bribery Act of 2016.",
        ],
      },
    ],
  },
  {
    id: "legal-regulatory-framework",
    title: "3. Legal & Regulatory Framework",
    paragraphs: [],
    items: [],
  },
  {
    id: "applicable-laws-and-regulations",
    title: "2.1 Applicable Laws and Regulations",
    paragraphs: [
      "Under the Bribery Act of 2016 and ACECA of 2003, it is an offence to:",
      "Breaches can result in severe criminal penalties — including fines, imprisonment (up to 10 years), or both — and disciplinary action, including termination of employment and reporting to authorities.",
    ],
    items: [
      "Offer, give, solicit, or accept any advantage to induce or reward the improper performance of a function or duty;",
      "Provide or receive gifts or hospitality with the intent to influence a business decision;",
      "Fail to prevent bribery by associated persons;",
      "Fail to declare or record benefits received in the course of business.",
    ],
  },
  {
    id: "definitions",
    title: "2.2 Definitions",
    paragraphs: [],
    items: [
      "Gift: Anything of value given or received without expectation of direct payment, including cash, vouchers, discounts, goods, tickets, or services.",
      "Hospitality: Meals, drinks, accommodation, transport, entertainment, or event invitations provided as part of legitimate business relationships.",
      "Facilitation Payment: A small payment made to expedite routine government actions — strictly prohibited.",
      "Conflict of Interest: A situation where personal interests or relationships interfere, or appear to interfere, with the impartial performance of duties.",
      "Nominal Value: Small tokens of appreciation or hospitality considered customary and proportionate.",
    ],
  },
  {
    id: "principles-of-conduct",
    title: "4. Principles of Conduct",
    paragraphs: [
      "1. Legitimacy: Gifts or hospitality must serve a genuine business purpose (e.g. courtesy or relationship-building). 2. Transparency: Must be declared and recorded in the Gifts & Hospitality Register.",
      "3. Proportionality: Must be modest, appropriate to the occasion, and not create obligation or influence.",
      "4. No Cash or Equivalents: Cash, vouchers, or other easily transferable benefits are prohibited.",
      "5. No Reciprocation Expectation: There must be no intention to induce favorable treatment. 6. Public Official Caution: Extra care must be taken when dealing with government officials or regulators — even small gifts can be perceived as bribery. 7. Open Declaration: When in doubt, declare the gift or hospitality and seek guidance from Compliance or Management.",
    ],
    items: [],
  },
  {
    id: "giving-gifts-or-hospitality",
    title: "5. Giving Gifts or Hospitality",
    paragraphs: [],
    items: [],
    subsections: [
      {
        heading: "Conditions",
        paragraphs: [
          "Employees may offer modest, bona fide gifts or hospitality if:",
        ],
        items: [
          "They are made transparently, in good faith, and for legitimate business purposes;",
          "They comply with this Policy and applicable laws;",
          "They are not frequent or extravagant;",
          "They are not made during active tenders, contract negotiations, or regulatory reviews.",
        ],
      },
      {
        heading: "Examples of acceptable gifts/hospitality",
        items: [
          "Token branded items (e.g. stationery, diaries, mugs) of nominal value (< KES 10,000);",
          "Working lunches or modest meals in a business setting;",
          "Public or industry events with legitimate networking purpose.",
        ],
      },
      {
        heading:
          "Examples of prohibited gifts/hospitality include, but is not limited to:",
        items: [
          "Cash, vouchers, or equivalents;",
          "Lavish entertainment or travel unrelated to business;",
          "Anything given to influence a tender, license, or regulatory outcome;",
          "Anything that could cause embarrassment if disclosed publicly.",
        ],
      },
    ],
  },
  {
    id: "receiving-gifts-or-hospitality",
    title: "6. Receiving Gifts or Hospitality",
    paragraphs: [],
    items: [],
    subsections: [
      {
        heading: "When a gift or hospitality may be accepted",
        paragraphs: [
          "Employees must not solicit gifts or hospitality. They may accept modest or customary gestures of goodwill only if:",
        ],
        items: [
          "The value is below KES 10,000 per instance (or lower where local laws require);",
          "It does not create any sense of obligation or conflict of interest;",
          "It is declared within five (5) working days using the Gifts & Hospitality Declaration Form;",
          "It is recorded in the Gifts & Hospitality Register maintained by the Compliance Office.",
        ],
      },
      {
        heading: "If a gift exceeds KES 10,000 or may appear inappropriate",
        items: [
          "It must be politely declined or returned;",
          "If refusal may cause offence (e.g., international delegation), the gift must be accepted on behalf of the Firm and immediately surrendered to the Compliance Department for decision on appropriate disposition (e.g., charity donation).",
        ],
      },
    ],
  },
  {
    id: "gifts-hospitality-register",
    title: "7. Gifts & Hospitality Register",
    paragraphs: [],
    items: [
      "Maintained by the Chief Executive Officer;",
      "Must record: date, giver/recipient, description, value, purpose, and decision (accepted/declined/disposed);",
      "Reviewed quarterly by Senior Management and annually by Internal Audit;",
      "Retained for five (5) years for transparency and auditability.",
    ],
  },
  {
    id: "reporting-and-escalation",
    title: "8. Reporting and Escalation",
    paragraphs: [],
    items: [
      "Any employee uncertain about a gift or hospitality must seek advice from their line manager or Compliance before accepting or offering it.",
      "Any suspicious or inappropriate offer must be reported under the Whistleblowing Policy.",
      "Where bribery or corruption is suspected, the Chief Executive Officer must be notified immediately for escalation to relevant authorities (e.g., EACC).",
    ],
  },
  {
    id: "public-officials-and-government-bodies",
    title: "9. Public Officials and Government Bodies",
    paragraphs: [],
    items: [
      "Gifts or hospitality to public officials are discouraged and permitted only in exceptional, pre-approved cases.",
      "All such offers must be pre-cleared by the Chief Executive Officer and recorded in the Register.",
      "Even minor benefits may be construed as attempts to improperly influence under the Bribery Act of 2016.",
    ],
  },
  {
    id: "third-parties-agents-and-partners",
    title: "10. Third Parties, Agents and Partners",
    paragraphs: [
      "The Group must ensure third parties, contractors, agents, and joint venture partners:",
    ],
    items: [
      "Are aware of and agree to comply with this Policy;",
      "Maintain equivalent standards in their own operations;",
      "Declare any gifts or hospitality related to EaziWage’s business. Any breach by third parties may result in contract termination and reporting to authorities.",
    ],
  },
  {
    id: "monitoring-audit-review",
    title: "11. Monitoring, Audit & Review",
    paragraphs: [],
    items: [
      "Compliance and Internal Audit shall periodically review adherence to this Policy.",
      "Non-compliance may result in disciplinary action up to dismissal, and potential criminal referral under the Bribery Act or ACECA.",
      "This Policy will be reviewed annually or upon significant regulatory change.",
    ],
  },
  {
    id: "training-awareness",
    title: "12. Training & Awareness",
    paragraphs: [],
    items: [
      "All employees shall receive mandatory induction and refresher training on this Policy.",
      "Additional training provided to teams with external engagement responsibilities (procurement, sales, finance, partnerships).",
      "Managers are responsible for reinforcing awareness and ensuring declarations are made promptly.",
    ],
  },
  {
    id: "record-retention",
    title: "13. Record Retention",
    paragraphs: [
      "All declaration forms, register entries, and supporting documents shall be:",
    ],
    items: [
      "Kept securely by the Chief Executive Officer;",
      "Retained for five (5) years from the date of entry or as required by law;",
      "Made available to regulators or auditors upon request.",
    ],
  },
  {
    id: "violations-and-disciplinary-measures",
    title: "14. Violations and Disciplinary Measures",
    paragraphs: ["Failure to comply with this Policy may result in:"],
    items: [
      "Internal disciplinary action (up to termination);",
      "Reporting to authorities (EACC, DPP);",
      "Criminal penalties under Kenyan law;",
      "Civil recovery or reputational sanctions against the Firm or individual.",
    ],
  },
  {
    id: "contact-details",
    title: "Contact Us",
    paragraphs: ["info@eaziwage.com | +254 72 315 4900"],
  },
];

export default function GiftsHospitalityEntertainmentPage() {
  return (
    <PolicyPage
      title="Gifts, Hospitality & Entertainment Policy"
      description="The Gifts, Hospitality & Entertainment (“GHE”) Policy (“the Policy”) applies to all employees, employers, contractors, agents, investors, banks and any other individuals or entities within the EaziWage Group, if and where relevant."
      updated="October 16, 2026"
      sections={sections}
    />
  );
}
