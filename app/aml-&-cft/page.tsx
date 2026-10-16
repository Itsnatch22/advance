import type { Metadata } from "next";
import PolicyPage, {
  type PolicySection,
} from "@/components/policies/EaziWagePolicies";

export const metadata: Metadata = {
  title:
    "EaziWage Anti-Money Laundering (AML) and Countering the Financing of Terrorism (CFT) Policy",
  description:
    "Learn about EaziWage's Anti-Money Laundering (AML) and Countering the Financing of Terrorism (CFT) Policy, which outlines our commitment to preventing financial crimes and ensuring compliance with Kenyan laws and regulations.",
};

const sections: PolicySection[] = [
  {
    id: "applicability",
    title: "Applicability",
    paragraphs: [
      "The Anti-Money and Counter-Financing of Terrorism (“AML and CFT”) Policy (“the Policy”) applies to all employees, employers, contractors, agents, investors, banks and any other individuals or entities within the EaziWage Group, if and where relevant.",
      "Failure to comply with these policies and procedures may result in disciplinary action, including but not limited to warnings, additional training, termination of employment, or legal action.",
    ],
  },
  {
    id: "aml-&-cft-policy-statement",
    title:
      "1. Anti-Money Laundering (AML) and Countering the Financing of Terrorism (CFT) Policy Statement",
    paragraphs: [
      "EaziWage Holdings Limited (“the Firm”) and its associated companies (the “Group”) are fully committed to preventing the misuse of its operations, products, and services for the purposes of money laundering, terrorist financing, or other financial crimes.",
      "The Firm maintains a zero-tolerance stance against financial crime and shall comply with all applicable Kenyan laws and regulations, including:",
    ],
    items: [
      "Proceeds of Crime and Anti-Money Laundering Act (POCAMLA), No. 9 of 2009",
      "Proceeds of Crime and Anti-Money Laundering Regulations of 2013",
      "Prevention of Terrorism Act of 2012",
      "Guidelines issued by the Financial Reporting Centre (FRC)",
      "CBK Prudential Guidelines on Anti-Money Laundering and Combating the Financing of Terrorism (CBK/PG/08)",
    ],
    afterContent: [
      {
        type: "paragraphs",
        paragraphs: [
          "This policy aims to safeguard the integrity of the Firm’s financial systems and reputation by establishing robust governance, controls, and compliance frameworks to detect, deter, and report money laundering or terrorism financing activities.",
          "All employees, officers, directors, agents, and third-party partners must adhere to this policy.",
        ],
      },
    ],
  },
  {
    id: "legal-regulatory-framework",
    title: "2. Legal and Regulatory framework",
    subsections: [
      {
        heading: "2.1. Applicable Laws and Regulations",
        paragraphs: ["This policy is grounded in Kenyan legislation, notably:"],
        items: [
          "Proceeds of Crime and Anti-Money Laundering Act (POCAMLA) of 2009 – criminalises money laundering and establishes obligations for reporting institutions.",
          "Proceeds of Crime and Anti-Money Laundering Regulations of 2013 – detail compliance procedures, recordkeeping, and reporting requirements.",
          "Prevention of Terrorism Act of 2012 – establishes offences relating to terrorism financing.",
          "Financial Reporting Centre (FRC) – established under Section 21 of POCAMLA as Kenya’s financial intelligence unit (FIU), responsible for receiving, analysing, and disseminating suspicious transaction reports.",
          "Central Bank of Kenya Prudential Guidelines (CBK/PG/08) – applicable to institutions regulated by the CBK, setting out minimum AML/CFT requirements.",
        ],
      },
      {
        heading:
          "2.2.  Definition of Money Laundering and Terrorism Financing ",
        items: [
          "Money Laundering (Section 3, POCAMLA): the process of concealing, disguising, converting, transferring, or dealing with the proceeds of crime to make them appear legitimate.",
          "Terrorism Financing: providing or collecting funds with the intention that they be used, or knowing they will be used, for terrorist acts.",
        ],
        afterContent: [
          {
            type: "paragraphs",
            paragraphs: ["Money laundering typically involves three stages:"],
          },
          {
            type: "list",
            items: [
              "1. Placement – introducing illicit funds into the financial system.",
              "2. Layering – concealing the origin of funds through complex transactions.",
              "3. Integration – reintroducing the laundered funds into the economy as apparently legitimate assets.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "objectives-of-aml-&-cft-policy",
    title: "3. Objectives of the Policy",
    items: [
      "Ensure full compliance with Kenyan AML/CFT laws and regulations.",
      "Protect the Firm and its customers from financial crime risks.",
      "Establish and maintain effective systems and internal controls for AML/CFT compliance.",
      "Promote staff awareness, accountability, and integrity in all dealings.",
      "Foster cooperation with regulatory and enforcement agencies, including the FRC, CBK, and law enforcement.",
    ],
  },
  {
    id: "roles-and-responsibilities",
    title: "4. Roles and Responsibilities",
    subsections: [
      {
        heading: "4.1. Board of Directors and Senior Management ",
        items: [
          "Provide strategic oversight of AML/CFT compliance.",
          "Approve this Policy and ensure adequate resources for implementation.",
          "Review compliance reports, suspicious activity trends, and internal audit findings at least annually.",
          "Demonstrate top-level commitment to an ethical, compliant culture.",
        ],
      },
      {
        heading: "4.2. Chief Executive Officer (CEO) and Management Team",
        items: [
          "Acts as the primary point of contact with the Financial Reporting Centre (FRC).",
          "Receives and assesses internal Suspicious Transaction Reports (STRs).",
          "Ensures timely submission of STRs and Cash Transaction Reports (CTRs) to FRC.",
          "Maintains secure records of reports, investigations, and communications with authorities.",
          "Provides periodic AML/CFT training and reports to senior management.",
        ],
      },
      {
        heading: "4.3. Employees and Associated Persons",
        items: [
          "Must understand and comply with this Policy and related procedures.",
          "Identify and report suspicious activity immediately to the Chief Executive Officer.",
          "Refrain from “tipping off” any person involved in a suspicious transaction.",
          "Participate in AML/CFT training sessions and awareness programs.",
        ],
      },
    ],
  },
  {
    id: "customer-due-diligence",
    title: "5. Customer Due Diligence (CDD)",
    subsections: [
      {
        heading: "5.1. General Requirements",
        paragraphs: [
          "Before establishing any business relationship or carrying out a transaction, the Firm shall:",
        ],
        items: [
          "Identify and verify the customer’s identity using reliable, independent source documents (e.g. National ID, Passport, Certificate of Incorporation, KRA Pin Certificate).",
          "Obtain information on the purpose and intended nature of the relationship.",
          "Identify and verify the beneficial owner (where applicable).",
          "Assess the risk profile and/or credit risk of the customer and transaction.",
        ],
      },
      {
        heading: "5.2. Enhanced Due Diligence (EDD)",
        paragraphs: ["Enhanced due diligence shall be applied to:"],
        items: [
          "High-risk customers (e.g. politically exposed persons (PEPs), foreign clients, complex structures).",
          "High-value or unusual transactions.",
          "Transactions or relationships involving jurisdictions with inadequate AML/CFT controls.",
        ],
        afterContent: [
          {
            type: "paragraphs",
            paragraphs: [
              "EDD measures may include obtaining senior management approval, verifying sources of funds, and closer ongoing monitoring.",
            ],
          },
        ],
      },
      {
        heading: "5.3. Simplified Due Diligence (SDD)",
        paragraphs: [
          "SDD may be applied to low-risk customers (e.g. government agencies, regulated financial institutions) in accordance with FRC and CBK guidelines.",
        ],
      },
      {
        heading: "5.4. Ongoing Monitoring ",
        items: [
          "Monitor transactions to ensure consistency with the customer’s profile and expected behaviour.",
          "Scrutinize complex, unusual, or large transactions with no apparent lawful purpose.",
          "Escalate any inconsistencies to the Chief Executive Officer for further investigation.",
        ],
      },
    ],
  },
  {
    id: "recordkeeping",
    title: "6. Recordkeeping",
    paragraphs: [
      "In compliance with Regulation 25 of the POCAMLA Regulations of 2013, the Firm shall maintain:",
    ],
    items: [
      "All CDD records and transaction documentation for at least seven (7) years after the end of the business relationship or transaction.",
      "STRs, CTRs, and internal reports securely for the same duration.",
      "Electronic or physical records that are easily retrievable and protected from unauthorized access or alteration.",
    ],
  },
  {
    id: "reporting-obligations",
    title: "7. Reporting Obligations",
    subsections: [
      {
        heading: "7.1. Suspicious Transaction Reports (STRs)",
        items: [
          "Employees must promptly report any suspicion of money laundering, terrorism financing, or related financial crimes to the Chief Executive Officer.",
          "The Chief Executive Officer will review and, if warranted, file an STR with the FRC within the prescribed timelines.",
          "It is a criminal offence under POCAMLA to fail to report suspicious activity.",
        ],
      },
      {
        heading: "7.2. Cash Transaction Reports (CTRs)",
        items: [
          "The Firm shall submit CTRs to the FRC for all cash transactions exceeding the prescribed threshold (currently KES 1,000,000 or its foreign currency equivalent).",
        ],
      },
      {
        heading: "7.3. Prohibition on Tipping Off",
        paragraphs: [
          "No employee shall disclose or discuss with any person the fact that an STR or related report has been made or may be made. Breach of this obligation constitutes an offence under Section 48 of POCAMLA.",
        ],
      },
    ],
  },
  {
    id: "risk-assessment-and-monitoring",
    title: "8. Risk assessment and monitoring",
    paragraphs: [
      "The Firm shall conduct an AML/CFT risk assessment annually and whenever there are material changes in operations, products, or markets. Risk factors include: ",
    ],
    items: [
      "Customer risk (nature of the customer, occupation, beneficial ownership).",
      "Product/service risk (ease of misuse for laundering).",
      "Geographic risk (jurisdictions with weak AML/CFT frameworks).",
      "Delivery channel risk (e.g. mobile or digital payments).",
    ],
    afterContent: [
      {
        type: "paragraphs",
        paragraphs: [
          "The Firm’s compliance program shall allocate greater resources and controls to higher-risk areas and customers.",
        ],
      },
    ],
  },
  {
    id: "training-and-awareness",
    title: "9. Training and Awareness",
    paragraphs: [
      "The Firm shall provide mandatory AML/CFT training for all employees upon joining and annually thereafter. Specialized training shall be provided to management, compliance teams, and front-line staff handling transactions or onboarding.",
      "Training topics include red-flag indicators, customer due diligence, recordkeeping, and reporting procedures. Attendance and completion shall be recorded and monitored by the Chief Executive Officer.",
    ],
  },
  {
    id: "internal-controls-and-audits",
    title: "10. Internal controls and Independent audits",
    items: [
      "The Firm shall maintain written internal AML/CFT procedures, risk registers, escalation channels, and approval matrices.",
      "Internal audit shall independently review the AML/CFT program annually to assess its effectiveness and compliance with laws.",
      "Audit findings and corrective actions shall be reported to senior management and tracked to completion.",
    ],
  },
  {
    id: "cooperation-with-authorities",
    title: "11. Cooperation with authorities",
    paragraphs: [
      "The Firm will cooperate fully and in good faith with competent Kenyan authorities including the FRC, CBK, DPP, and law enforcement agencies.",
    ],
    items: [
      "Information will be shared as permitted by law.",
      "The Firm will not obstruct or delay investigations and shall maintain confidentiality.",
    ],
  },
  {
    id: "penalties-and-disciplinary-actions",
    title: "12. Penalties and disciplinary actions",
    paragraphs: ["Violations of POCAMLA or this Policy may result in:"],
    items: [
      "Disciplinary action (including termination)",
      "Personal criminal liability (fines up to KES 5 million and/or imprisonment for up to 14 years).",
      "Corporate fines or sanctions, or",
      "Reporting to regulatory or law enforcement agencies.",
    ],
  },
  {
    id: "policy-review-and-updates",
    title: "13. Policy review and updates",
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

export default function AIPrivacyPage() {
  return (
    <PolicyPage
      title="Anti-Money Laundering (AML) and Countering the Financing of Terrorism (CFT) Policy"
      description="The Anti-Money and Counter-Financing of Terrorism (“AML and CFT”) Policy (“the Policy”) applies to all employees, employers, contractors, agents, investors, banks and any other individuals or entities within the EaziWage Group, if and where relevant. "
      updated="October 16, 2026"
      sections={sections}
    />
  );
}
