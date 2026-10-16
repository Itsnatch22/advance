import type { Metadata } from "next";
import PolicyPage, {
  type PolicySection,
} from "@/components/policies/EaziWagePolicies";

export const metadata: Metadata = {
  title: "EaziWage Whistleblowing Policy",
  description:
    "Learn about EaziWage's Whistleblowing Policy, which outlines the procedures for reporting misconduct or violations of company policies.",
};

const sections: PolicySection[] = [
  {
    id: "applicability",
    title: "Applicability",
    paragraphs: [
      "The Whistleblowing (“WBL”) Policy (“the Policy”) applies to all employees, employers, contractors, agents, investors, banks and any other individuals or entities within the EaziWage Group, if and where relevant.",
      "Failure to comply with these policies and procedures may result in disciplinary action, including but not limited to warnings, additional training, termination of employment, or legal action.",
    ],
  },
  {
    id: "whistleblowing-statement",
    title: "1. Whistleblowing Policy Statement",
    paragraphs: [
      "EaziWage Holdings Limited (“the Firm”) and its associated entities (the “Group”) is committed to the highest standards of ethics, integrity, and lawful conduct. We encourage employees and all other “associated persons” (directors, officers, contractors, consultants, suppliers, agents, and interns) to speak up about suspected wrongdoing without fear of retaliation.",
      "This Policy aligns with applicable Kenyan laws, including the Bribery Act, No. 47 of 2016, Anti-Corruption and Economic Crimes Act of 2003 (ACECA), Proceeds of Crime and Anti-Money Laundering Act of 2009 (POCAMLA), the Employment Act of 2007, and the Data Protection Act, 2019 (DPA). Where public-interest corruption is concerned, whistleblowers may also report directly to the Ethics and Anti-Corruption Commission (EACC).",
      "Note: Kenya’s Whistleblower Protection Bill, 2023/2024 is progressing through Parliament; when enacted, the Firm will update this Policy to incorporate any additional protections and duties (e.g., mandated internal channels and anti-reprisal mechanisms).",
    ],
  },
  {
    id: "purpose-and-scope",
    title: "2. Purpose & Scope",
    paragraphs: [
      "Purpose: Provide safe, confidential channels to raise concerns about suspected misconduct and ensure timely, fair, and compliant handling of reports.",
      "Scope: Applies to all employees and associated persons. Concerns may relate to:",
    ],
    items: [
      "Bribery, corruption, fraud, theft, embezzlement or facilitation payments;",
      "AML/CFT violations, sanctions breaches, suspicious transactions or “tipping-off”; ",
      "Breaches of law/regulation (incl. procurement, competition, tax), serious policy breaches;",
      "Data protection/privacy violations; cyber incidents; misuse of confidential information;",
      "Health & safety risks; environmental harm; gross negligence or concealment of wrongdoing.",
    ],
    afterContent: [
      {
        type: "paragraphs",
        paragraphs: [
          "What this is not: Routine HR grievances (e.g., performance ratings, pay disputes) follow the Firm’s Grievance or HR policies unless they involve wrongdoing covered above.",
        ],
      },
    ],
  },
  {
    id: "legal-and-regulatory-framework",
    title: "3. Legal & Regulatory Framework",
    subsections: [
      {
        heading: "3.1. Kenyan Laws and Regulations",
        items: [
          "Bribery Act of 2016 – duty on private entities to have prevention procedures; internal reporting supports compliance.",
          "ACECA of 2003 – establishes and empowers EACC to receive/investigate corruption complaints.",
          "POCAMLA of 2009 – criminalises money laundering; prohibits “tipping-off”; requires internal escalation to CEO/FRC reporting where applicable.",
          "Employment Act of 2007 – protects employees from unfair dismissal/discrimination; whistleblowers must not suffer detriment for good-faith reports.",
          "Data Protection Act of 2019 – requires lawful, secure handling of personal data in whistleblowing processes, with confidentiality and access controls.",
          "Pending: Whistleblower Protection Bill, 2023/2024 (will be incorporated on enactment).",
        ],
      },
      {
        heading: "3.2. Definition of Whistleblowing",
        items: [
          "Whistleblowing: Good-faith disclosure of suspected wrongdoing or risk.",
          "Good Faith: Honest belief that the information is true or likely true at the time.",
          "Associated Person: Any person who performs services for or on behalf of the Firm.",
          "Retaliation: Any adverse action (dismissal, demotion, threats, harassment, blacklisting, contract termination) because of a disclosure.",
        ],
      },
    ],
  },
  {
    id: "reporting-channels",
    title: "4. Reporting Channels",
    paragraphs: [
      "Whistleblowers may choose any one of the following channels (including anonymous where feasible):",
    ],
    subsections: [
      {
        heading: "4.1. Internal Reporting",
        items: [
          "1. Line Manager (unless implicated).",
          "2. Chief Executive Officer (primary intake for financial crime/bribery/data issues).",
          "3. Chief Executive Officer (escalation or where senior management is implicated).",
          "4. Dedicated reporting mailbox (configured for secure, potentially anonymous intake): Mr. Jason Crawford, CEO, whistleblow@eaziwage.com.",
        ],
      },
      {
        heading: "4.2. External Reporting",
        items: [
          "EACC official reporting channels (web, hotline, walk-in). Use where you reasonably believe the concern involves corruption or where internal reporting is not appropriate.",
        ],
      },
    ],
    afterContent: [
      {
        type: "paragraphs",
        paragraphs: [
          "Whistleblowers may also report to other competent authorities (e.g., FRC for AML matters, law enforcement) as permitted by law.",
        ],
      },
    ],
  },
  {
    id: "confidentiality-and-anonymity",
    title: "5. Confidentiality, Anonymity & Data Protection",
    paragraphs: [
      "The Firm will protect the identity of whistleblowers and persons named in reports to the fullest extent allowed by law; disclosures are shared strictly on a need-to-know basis.",
      "Anonymous reports will be assessed and investigated to the extent practicable and all records (intake forms, evidence, investigation notes, outcomes) are classified confidential, stored securely with access logs, and handled in compliance with the Data Protection Act of 2019 and internal retention rules.",
    ],
  },
  {
    id: "non-retaliation-and-good-faith-protection",
    title: "6. Non-Retaliation and Good Faith Protection",
    paragraphs: [
      "There is Zero tolerance for retaliation against any person who raises a concern in good faith or participates in an investigation — even if the concern is not substantiated.",
      "All allegations made maliciously or with knowing falsity may result in disciplinary action.",
      "Managers must proactively prevent detrimental treatment (workplace reprisal, blacklisting, contract penalties) and must escalate suspected retaliation immediately to Compliance/HR.",
    ],
  },
  {
    id: "intake-triage-and-investigation",
    title: "7. Intake, Triage, and Investigation Process",
    items: [
      "1. Acknowledge receipt (within 5 business days where contact details are available).",
      "2. Triage (within 10 business days): assess scope, risks, urgency, and potential conflicts; ring-fence evidence (legal hold), and decide on investigation path.",
      "3. Assign an investigator or team (Compliance/Legal/HR/Internal Audit). If senior leadership is implicated, appoint an independent investigator and notify the Board Chair (or Audit/Risk Committee).",
      "4. Investigate: gather facts, interview relevant parties, review records/systems; maintain a defensible chain of custody.",
      "5. Conclude with a written report (facts, analysis, findings, remediation, disciplinary/contractual action, regulatory notifications if required).",
      "6. Feedback to whistleblower (where contactable), respecting confidentiality and legal constraints (e.g., no tipping-off in AML matters).",
      "7. Escalate/Report to authorities where required (e.g., EACC for corruption; FRC for STR/CTR; police/DPP where criminal conduct is indicated).",
    ],
  },
  {
    id: "roles-and-responsibilities",
    title: "8. Roles and Responsibilities",
    items: [
      "Board/Senior Management: Set the tone; approve policy; ensure resources; receive periodic whistleblowing metrics and significant case reports.",
      "CEO: Overall accountability; ensures impartial investigations; authorises external reporting when required and Owns the channel; triage; investigation governance; records; reports trends; coordinates with authorities.",
      "Managers: Encourage speaking up; maintain confidentiality; prevent retaliation; escalate promptly.",
      "All Employees/Associated Persons: Read, understand, and comply with this Policy; report concerns promptly; cooperate with investigations.",
    ],
  },
  {
    id: "training-and-awareness",
    title: "9. Training and Awareness",
    items: [
      "Mandatory training at onboarding and annually thereafter for all staff; targeted modules for managers, investigators, and intake owners.",
      "Periodic awareness campaigns (posters, intranet, emails) explaining protected disclosures, examples, and channels.",
      "Third-party onboarding includes acknowledgment of this Policy and antiretaliation expectations.",
    ],
  },
  {
    id: "record-keeping-and-retention",
    title: "10. Record Keeping and Retention",
    items: [
      "Maintain whistleblowing registers, case files, evidence logs, decisions, and remediation records securely.",
      "Retention: ordinarily five (5) years from case closure (or longer if required by law, litigation hold, regulator requests, or related AML retention rules).",
      "Access limited to designated Compliance/Legal/HR personnel; logs reviewed periodically.",
    ],
  },
  {
    id: "monitoring-and-reporting",
    title: "11. Monitoring and Reporting",
    paragraphs: [
      "Compliance will provide bi-annually anonymised metrics to senior management/Board/Audit Committee (volumes, categories, cycle times, substantiation rates, remedial actions).",
    ],
  },
  {
    id: "policy-review",
    title: "12. Policy Review",
    paragraphs: [
      "This Policy is reviewed at least annually or upon material legal/operational changes (including the enactment of a Whistleblower Protection law). Updates are communicated to all staff and associated persons; acknowledgment is required.",
    ],
  },
  {
    id: "policy-review-and-updates",
    title: "13. Policy Review and Updates",
    paragraphs: [
      "This Policy shall be reviewed at least annually or upon significant regulatory or operational changes. Amendments will be approved by the Board of Directors and communicated to all staff.",
      "All employees must acknowledge receipt and understanding of the latest version.",
    ],
  },
  {
    id: "contact-us",
    title: "Contact Us",
    paragraphs: ["info@eaziwage.com", "+254 72 315 4900"],
  },
];

export default function WhistleblowingPage() {
  return (
    <PolicyPage
      title="EaziWage Whistleblowing Policy"
      description="The Whistleblowing (“WBL”) Policy (“the Policy”) applies to all employees, employers, contractors, agents, investors, banks and any other individuals or entities within the EaziWage Group, if and where relevant."
      updated="October 16, 2026"
      sections={sections}
    />
  );
}
