import type { Metadata } from "next";
import AILegalPage, { type LegalSection } from "@/components/legal/AILegalPage";

export const metadata: Metadata = {
  title: "Wiza AI Terms of Service",
  description:
    "Terms governing your use of Wiza, EaziWage's AI-powered financial wellness coach.",
};

const sections: LegalSection[] = [
  {
    id: "agreement",
    title: "1. Agreement and scope",
    paragraphs: [
      "These Terms of Service apply to your access to and use of Wiza, the AI financial wellness coach available on the EaziWage website. In these terms, “EaziWage,” “we,” “us,” and “our” refer to the EaziWage service operating Wiza. “You” means the person using Wiza.",
      "By sending a message, uploading a file, or otherwise using Wiza, you agree to these terms and the Wiza AI Privacy Policy. If you do not agree, do not use Wiza. Other EaziWage products, including earned wage access services, may have separate terms that also apply to those products.",
    ],
  },
  {
    id: "what-wiza-does",
    title: "2. What Wiza does",
    paragraphs: [
      "Wiza provides conversational financial wellness information. Depending on what you ask and whether you are signed in to an eligible EaziWage account, it may explain budgeting concepts, perform calculations using information you provide, discuss cash flow, and summarize a coaching conversation.",
      "If you are signed in, Wiza may use relevant information associated with your EaziWage account, such as your name, country, earned-wage figures, advance limits, recent advance activity, and budget categories, to tailor a response. Wiza does not itself approve, promise, or initiate an earned wage advance.",
    ],
  },
  {
    id: "not-professional-advice",
    title: "3. Not professional financial advice",
    paragraphs: [
      "Wiza is an informational and educational tool, not a bank, lender, investment adviser, credit provider, accountant, lawyer, or financial planner. Its responses are not a recommendation to take a loan, request an advance, buy or sell an investment, or make any other financial decision.",
      "Wiza does not know every detail of your circumstances and cannot replace advice from a qualified professional who understands your situation. Consider your obligations, fees, alternatives, and ability to meet future expenses before acting. Seek independent professional advice for decisions that require it.",
      "Nothing in Wiza creates a fiduciary, advisory, lending, employment, or other professional relationship between you and EaziWage.",
    ],
  },
  {
    id: "accuracy",
    title: "4. AI responses, calculations, and limitations",
    paragraphs: [
      "Wiza uses generative artificial intelligence. Responses are generated from the conversation, available account context, and the system's interpretation of your request. They may be incomplete, outdated, inconsistent, or incorrect, and may not reflect current laws, prices, fees, product eligibility, or your full financial circumstances.",
      "Calculations depend on the information and assumptions used. Check important figures independently against your payslip, account, employer information, or other reliable records. Do not rely on a Wiza response as the sole basis for a financial decision.",
      "Wiza can misunderstand messages, produce plausible-sounding errors, or fail to identify an urgent or unusual issue. You are responsible for deciding whether a response is appropriate and for verifying information before acting.",
    ],
  },
  {
    id: "ewa",
    title: "5. Earned wage access is a separate service",
    paragraphs: [
      "A discussion with Wiza does not constitute an application for, eligibility decision about, or approval of earned wage access. Availability, limits, timing, fees, repayment or payroll deductions, and other conditions are determined by the applicable EaziWage product terms, your employer arrangements, and the information in the relevant account.",
      "Do not treat a calculation or statement made by Wiza as confirmation that funds are available or that a transaction will be completed. Confirm those details in the applicable EaziWage service before taking action.",
    ],
  },
  {
    id: "accounts",
    title: "6. Your account and responsibility",
    paragraphs: [
      "You are responsible for activity carried out through your account and for keeping your sign-in credentials secure. Tell us promptly if you believe your account has been accessed without permission. Do not share passwords, authentication codes, full payment-card details, or other credentials in a Wiza conversation.",
      "You agree to provide information that is accurate to the best of your knowledge and to correct it when needed. Responses based on incomplete or incorrect information may not be useful for your circumstances.",
    ],
  },
  {
    id: "submissions",
    title: "7. Messages, files, and permission to process them",
    paragraphs: [
      "You retain your rights to content you submit. You give EaziWage and the service providers working on our behalf permission to host, transmit, analyze, and use that content as reasonably necessary to provide, protect, troubleshoot, and maintain Wiza and its requested features, subject to the Privacy Policy and applicable law.",
      "Only submit information you are entitled to share. Before attaching a document or image, check it for sensitive details that are not needed for your question. File attachments may be transmitted to the AI provider to generate a response.",
      "Do not submit another person's personal or financial information unless you have their permission or another lawful basis to do so.",
    ],
  },
  {
    id: "acceptable-use",
    title: "8. Acceptable use",
    paragraphs: [
      "Use Wiza lawfully and for personal, informational financial wellness purposes. You must not:",
    ],
    items: [
      "Use Wiza to break the law, deceive another person, commit fraud, or infringe another person's rights.",
      "Attempt to gain unauthorized access to Wiza, its systems, accounts, or data, or interfere with its operation or security.",
      "Upload malware, harmful code, or content that you do not have the right to share.",
      "Use automated means to overload, scrape, or abuse Wiza, or use its responses to build or train a competing service without permission.",
      "Present Wiza's output as a guaranteed, verified, or individually licensed professional opinion.",
    ],
  },
  {
    id: "summaries",
    title: "9. Conversation summaries and delivery",
    paragraphs: [
      "Wiza can generate an optional summary of a conversation. If you choose delivery by email or SMS, you authorize us to process the summary and the destination address or phone number you provide, and to send it through the relevant delivery provider. Check the destination before confirming. Standard messaging or data charges from your provider may apply.",
      "Email and SMS are not guaranteed to be secure or delivered. Do not request delivery to an address or number you do not control or have authority to use. A summary may omit context or reproduce an error from the original conversation.",
    ],
  },
  {
    id: "providers",
    title: "10. Third-party services",
    paragraphs: [
      "Wiza depends on third-party infrastructure and service providers, including Google’s generative AI service, and, when applicable, services used to store account conversations or deliver requested summaries. Their availability and processing are subject to their own service terms and privacy practices. We do not control services or websites operated by third parties.",
      "Your use of Wiza does not give you rights to a third-party service beyond the access needed for Wiza to operate. Links to other services are provided for convenience and do not mean EaziWage endorses their content.",
    ],
  },
  {
    id: "ownership",
    title: "11. Wiza and EaziWage materials",
    paragraphs: [
      "Wiza, its software, name, design, and the materials we provide are owned by EaziWage or its licensors and are protected by applicable intellectual property laws. These terms give you a limited, revocable, non-exclusive right to use Wiza for its intended purpose. They do not transfer ownership of the service or its materials to you.",
      "You may use a response for your personal purposes. Because AI responses may be similar for different people and may contain errors, do not assume that an output is unique, authoritative, or free of third-party rights.",
    ],
  },
  {
    id: "availability",
    title: "12. Availability and changes",
    paragraphs: [
      "We may change, suspend, or discontinue all or part of Wiza, or update these terms, for operational, safety, legal, or product reasons. We will update the date at the top when these terms change. Where a change materially affects your use, we will take steps to provide notice when required by law.",
      "Your continued use after updated terms become effective means you accept them. If you do not accept a change, stop using Wiza. We may not be able to provide advance notice when an immediate change is needed for security, legal compliance, or service reliability.",
    ],
  },
  {
    id: "suspension",
    title: "13. Suspension and ending use",
    paragraphs: [
      "You may stop using Wiza at any time. We may restrict or suspend access if reasonably necessary to protect users, the service, or our systems; respond to suspected misuse; comply with law; or address a security or operational risk.",
      "Ending access does not automatically erase information that must be retained for a legitimate operational, security, dispute-resolution, or legal purpose. Personal information is handled as described in the Privacy Policy.",
    ],
  },
  {
    id: "disclaimers",
    title: "14. Disclaimers and limits of responsibility",
    paragraphs: [
      "To the extent permitted by applicable law, Wiza is provided on an “as available” basis. EaziWage does not promise uninterrupted access, error-free output, or that any response will meet your needs or produce a particular financial result.",
      "To the extent permitted by applicable law, EaziWage is not responsible for losses arising from a decision you make in reliance on an unverified Wiza response, service interruption, inaccurate information you provide, or a third-party service. Nothing in these terms excludes or limits a right, remedy, or liability that cannot lawfully be excluded or limited, including applicable consumer protections.",
    ],
  },
  {
    id: "law",
    title: "15. Applicable law and questions",
    paragraphs: [
      "These terms are subject to the laws that apply to your use of Wiza and to any mandatory consumer protections available to you. Nothing in this section removes a right you may have to bring a claim before a competent authority or court.",
      "If you have a concern about Wiza or these terms, contact support@eaziwage.com so we can understand and address it.",
    ],
  },
];

export default function AITermsPage() {
  return (
    <AILegalPage
      title="Terms of Service"
      description="Please read these terms before using Wiza, EaziWage's AI financial wellness coach."
      updated="October 15, 2026"
      sections={sections}
      notice={
        <p>
          <strong className="font-semibold text-slate-900 dark:text-white">
            Important:
          </strong>{" "}
          Wiza provides general financial wellness information, not individual
          financial advice, a loan, or approval for an earned wage advance.
          Always check important figures and decisions independently.
        </p>
      }
    />
  );
}
