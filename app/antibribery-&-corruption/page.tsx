import type { Metadata } from "next";
import PolicyPage, {
  type PolicySection,
} from "@/components/policies/EaziWagePolicies";

export const metadata: Metadata = {
  title: "EaziWage Anti-Bribery and Corruption Policy",
  description:
    "Read EaziWage's Anti-Bribery and Corruption Policy and its standards for preventing and reporting bribery and corruption.",
};

const lastRevised = new Date("2026-10-16T00:00:00Z");

const sections: PolicySection[] = [
  {
    id: "anti-bribery-corruption-policy-statement",
    title: "1. Anti-Bribery & Corruption Policy Statement",
    paragraphs: [
      "Eaziwage Holdings Limited (the “Firm”) and its associated companies (the “Group”) conduct business in an honest, ethical, and transparent manner. We adopt a zero-tolerance approach toward bribery, corruption, and facilitation payments, and we are committed to acting professionally, fairly, and with integrity in all business dealings and relationships.",
      "We shall comply with all applicable Kenyan laws regarding bribery, corruption, and related misconduct, especially the Bribery Act, No. 47 of 2016 (the “Bribery Act”) and, where applicable, the Anti-Corruption and Economic Crimes Act of 2003 (ACECA). We also commit to adhering to the Model Procedures, Guidelines, and Regulations issued under the Bribery Act by the Ethics and Anti-Corruption Commission (EACC). This Policy aims to ensure the Firm meets its legal obligations under Kenyan law, and to embed a consistent anti-bribery culture throughout the Group. Any breach of this Policy will be regarded as serious misconduct and may lead to disciplinary action (up to and including termination) or referral to law enforcement, where appropriate.",
    ],
    items: [],
  },
  {
    id: "legal-framework-in-kenya",
    title: "2. Legal Framework in Kenya",
    paragraphs: [
      "The Bribery Act, No. 47 of 2016 came into force on 13 January 2017. Under the Bribery Act, a “bribe” means giving or receiving an offer, promise or advantage (financial or non-financial) where one knows or believes that acceptance would constitute improper performance of a relevant function or activity. Key offences include:",
    ],
    items: [],
    subsections: [
      {
        heading: "Key offences include:",
        items: [
          "Offering, promising or giving a bribe (Section 5)",
          "Requesting, agreeing to receive, or accepting a bribe (Section 6)",
          "Bribing a foreign public official (Section 8)",
          "Failure of a private entity to prevent bribery (Section 9)",
          "Failure of a private entity to prevent bribery of an associated person (Section 10)",
        ],
      },
      {
        heading: "Further provisions",
        paragraphs: [
          "The Act has extra-territorial reach: it can apply to acts outside Kenya by persons who are Kenyan or if intended to have effect in Kenya. Entities found liable under Section 9 or 10 (failure to prevent bribery) may be subject to civil or criminal sanctions. The Bribery Act is supported by the Anti-Bribery Regulations, 2022 and Guidelines for preparation of procedures issued by the Cabinet Secretary and EACC.",
        ],
      },
      {
        heading: "Supporting legislation includes:",
        items: [
          "The Anti-Corruption and Economic Crimes Act (ACECA) of 2003 continues to apply, particularly for investigation, enforcement, and sanctioning of corruption and economic crime offences.",
          "The Ethics and Anti-Corruption Commission Act of 2011 establishes the EACC, which has preventive, investigative, and enforcement powers.",
          "Other relevant Kenyan laws (e.g. Public Officer Ethics Act, Public Procurement and Disposal Act, Proceeds of Crime and Anti-Money Laundering Act) may intersect with bribery and corruption in public procurement, reporting, and asset seizure contexts.",
        ],
      },
    ],
  },
  {
    id: "principles-approach",
    title: "3. Principles & Approach",
    paragraphs: [
      "We adopt a risk-based approach to preventing bribery and corruption in accordance with the Kenyan Guidelines and EACC model procedures. The key principles include:",
      "1. Proportionate procedures – Our policies and controls shall be commensurate with the size, nature, complexity, and bribery risk exposure of the Firm and its operations in Kenya and abroad.",
      "2. Top-level commitment – Senior management must set the “tone from the top” and visibly support, enforce, and champion this Policy.",
      "3. Risk assessment – Regular and structured assessments of bribery corruption risks (internal and external) including country risk, sector risk, transaction risk, and third-party risk.",
      "4. Due diligence – Before engaging agents, contractors, third parties or counterparties, we shall perform due diligence appropriate to the assessed risk.",
      "5. Communication & training – This Policy and related procedures must be communicated to all employees, officers, directors and associated persons; training must be provided periodically.",
      "6. Monitoring, review & continuous improvement – We will monitor compliance, conduct internal audits, review adequacy of controls, and update this Policy regularly (at least annually).",
      "All records relevant to anti-bribery procedures, investigations, risk assessments, due diligence, training and decisions must be retained for at least five (5) years, or longer if required under statutory or regulatory rules.",
    ],
  },
  {
    id: "prohibited-conduct-policy-rules",
    title: "4. Prohibited Conduct & Policy Rules",
    paragraphs: [],
    items: [],
  },
  {
    id: "giving-bribes",
    title: "4.1 Giving Bribes",
    paragraphs: [
      "No employee, officer or associated person shall offer, promise, give, or authorize the giving of any financial or other advantage (e.g. gifts, hospitality, entertainment, facilitation payments, loans, donations, favors, in-kind benefits) to any person (public or private) to induce or reward improper performance of a relevant function or activity.",
      "Facilitation payments (i.e. small payments to expedite routine governmental actions) are prohibited. This prohibition applies even if the bribe is not accepted, or the improper performance does not materialize; the offer alone is an offence under Kenyan law.",
      "Gifts and hospitality may only be given or accepted in line with the Group’s Gifts & Hospitality Policy, provided they are moderate, transparent, documented, and not given with any expectation of undue influence.",
    ],
    items: [],
  },
  {
    id: "receiving-bribes",
    title: "4.2 Receiving Bribes",
    paragraphs: [
      "No employee, officer or associated person shall solicit, agree to receive, or accept any financial or other advantage from any person (public or private) in connection with the improper performance of a relevant function or activity.",
      "Any offer or request must be reported immediately to the Chief Executive Officer (CEO).",
    ],
    items: [],
  },
  {
    id: "bribery-of-foreign-public-officials",
    title: "4.3 Bribery of Foreign Public Officials",
    paragraphs: [
      "When dealing across borders, no person shall offer, promise, or give any advantage to a foreign public official to influence their decisions in obtaining or retaining business, contracts, or other advantage. This conduct is explicitly prohibited under Section 8 of the Bribery Act.",
    ],
    items: [],
  },
  {
    id: "failure-to-prevent-bribery",
    title: "4.4 Failure to Prevent Bribery",
    paragraphs: [
      "The Firm may be held criminally liable under Sections 9 and 10 of the Bribery Act if it fails to put in place adequate procedures to prevent bribery by persons associated with it.",
      "Therefore, the Firm must ensure robust internal controls, oversight, and monitoring.",
    ],
    items: [],
  },
  {
    id: "conflicts-of-interest-gifts",
    title: "4.5 Conflicts of Interest & Gifts",
    paragraphs: [
      "All employees and associated persons must avoid or properly manage conflicts of interest, real or perceived. Any gift or hospitality offered or accepted must be disclosed and recorded. Gifts in cash are strictly prohibited. The Firm may decline or return gifts or hospitality that exceed acceptable levels, or that may give rise to suspicion.",
    ],
    items: [],
  },
  {
    id: "reporting-and-refusal",
    title: "4.6 Reporting and Refusal",
    paragraphs: [
      "Any employee or associated person who is offered a bribe (or solicited to give one) or becomes aware of suspicious conduct must refuse or decline and immediately report the matter according to this Policy’s reporting channels. The Firm will not allow retaliation or detrimental treatment against any person who refuses to participate in bribery or who reports a concern in good faith (in line with the Whistleblowing Policy). Anonymous or confidential reporting is permitted, if permitted under Kenyan law (and in line with Whistleblowing procedures).",
    ],
    items: [],
  },
  {
    id: "risk-assessment",
    title: "5. Risk Assessment",
    paragraphs: [
      "The Firm will conduct a bribery and corruption risk assessment at least annually (and more frequently where circumstances change) to identify risk exposures:",
      "Country risk (geographic risk of corruption)",
      "Sector or industry risk",
      "Transaction risk (size, complexity, novelty)",
      "Business partner / third-party risk",
      "Internal process risk",
      "Based on risk ratings, mitigation measures will be applied (enhanced due diligence, approvals, monitoring, audit, oversight).",
      "The Board, or a delegated committee, shall review the risk assessment and approve mitigation strategies.",
    ],
  },
  {
    id: "due-diligence",
    title: "6. Due Diligence",
    paragraphs: [
      "Before entering into a new relationship with third parties (agents, suppliers, investors, contractors, joint ventures, etc.), due diligence must be carried out proportionate to the risk. Due diligence may include:",
      "Any concerns or red flags must be escalated, and the relationship may be rejected or terminated.",
      "Due diligence is not a one-off process — review should be ongoing, with periodic reassessment (e.g. annually for high-risk third parties; biannually or triennially for lower risk).",
    ],
    items: [
      "Sanctions checks (e.g. local/international lists)",
      "Background and reputation checks (media, litigation records)",
      "Anti-bribery policies or certifications from the counterparty",
      "Reference checks",
      "Clarification of ownership, structure, beneficial owners",
      "Review of their controls, training, governance and past compliance record",
      "A formal questionnaire, audits, site visits, where necessary",
    ],
  },
  {
    id: "communication-training",
    title: "7. Communication & Training",
    paragraphs: [
      "This Policy will be communicated to all employees, officers, directors, contractors, investors, banks, agents, and third parties engaging with the Firm in Kenya or abroad. All relevant personnel shall receive periodic training (at least annually or whenever there is a significant change) on bribery risks, this Policy and procedures, how to identify red flags, and reporting obligations. New hires must receive induction training on anti-bribery requirements before undertaking sensitive duties. We will seek written acknowledgment from key third parties (agents, suppliers, intermediaries) confirming that they understand and will comply with this Policy (or equivalent standards). We will incorporate anti-bribery clauses and representations in contracts with third parties (e.g. warranties, audit rights, termination rights in case of breach).",
    ],
    items: [],
  },
  {
    id: "monitoring-auditing-reporting",
    title: "8. Monitoring, Auditing & Reporting",
    paragraphs: [
      "The Firm’s internal audit or compliance functions (as applicable) shall monitor and review implementation of this Policy and related procedures. Key metrics, incidents, risks and investigations will be reported periodically (at least annually) to senior management and, where applicable, to the Board or audit committee. Where a potential violation is detected or suspected, an internal investigation will be initiated promptly, preserving evidence and ensuring confidentiality. If required, the matter will be self-reported to relevant Kenyan authorities (e.g. EACC, Director of Public Prosecutions) consistent with legal obligations and cooperation with investigations.",
    ],
    items: [],
  },
  {
    id: "roles-responsibilities",
    title: "9. Roles & Responsibilities",
    paragraphs: [],
    items: [],
  },
  {
    id: "board-senior-management",
    title: "9.1 Board / Senior Management",
    paragraphs: [],
    items: [
      "Approve and oversee this Policy and ensure adequate resources for its implementation.",
      "Demonstrate visible support and leadership in anti-bribery culture.",
      "Receive reports on bribery risk, incidents, training, due diligence and audits.",
      "Review and ensure periodic updating of this Policy.",
    ],
  },
  {
    id: "chief-executive-officer",
    title: "9.2 Chief Executive Officer",
    paragraphs: [],
    items: [
      "Oversee day-to-day implementation, management, escalation decisions, and reporting.",
      "Ensure adequate staffing, training, adaptive processes, and monitoring.",
      "Where required, decide whether to escalate a suspected bribery matter to authorities, and ensure records of the rationale and decision-making.",
      "Liaise with the Compliance/Legal function and coordinate any self-reporting obligations.",
      "Develop and maintain anti-bribery procedures, controls, and supporting documentation.",
      "Conduct risk assessments, compliance reviews and audits.",
      "Provide advice, guidance, and training to business units.",
      "Carry out investigations, monitor remediation, follow-up of corrective actions.",
      "Maintain records of due diligence, investigations, training and reporting metrics.",
    ],
  },
  {
    id: "employees-associated-persons",
    title: "9.3 Employees & Associated Persons",
    paragraphs: [],
    items: [
      "Understand and comply with this Policy and related procedures.",
      "Participate in training when required.",
      "Promptly report any actual or suspected bribery, requests, offers or red flags.",
      "Cooperate with investigations or audits.",
      "Act with integrity, avoid conflicts of interest, and exercise care in providing gifts, hospitality or dealing with third parties.",
    ],
  },
  {
    id: "self-reporting-cooperation-with-authorities",
    title: "10. Self-Reporting & Cooperation with Authorities",
    paragraphs: [
      "Where a possible breach of Kenyan anti-bribery law is detected, the Firm may, in appropriate circumstances, self-report to the relevant Kenyan authority (e.g. EACC or DPP) to mitigate exposure, subject to legal advice.",
      "The Firm will fully cooperate with investigations by EACC, other anti-corruption agencies, or law enforcement, preserving confidentiality and integrity of the process.",
    ],
    items: [],
  },
  {
    id: "policy-review-amendment",
    title: "11. Policy Review & Amendment",
    paragraphs: [
      "This Policy may be amended or updated as necessary to reflect changes in law, regulation, business operations, or best practice. Senior management must review the Policy at least annually, and whenever there is a material change in risk environment or operations. All employees and associated persons must acknowledge any changes and maintain awareness.",
    ],
    items: [],
  },
  {
    id: "contact-details",
    title: "Contact Us",
    paragraphs: ["info@eaziwage.com | +254 72 315 4900"],
  },
];

export default function CorruptionPage() {
  return (
    <PolicyPage
      title="Anti-Bribery and Corruption Policy"
      description="The Anti-Bribery and Corruption (“ABC”) Policy (“the Policy”) applies to all employees, employers, contractors, agents, investors, banks and any other individuals or entities within the EaziWage Group, if and where relevant."
      updated={lastRevised.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })}
      sections={sections}
    />
  );
}
