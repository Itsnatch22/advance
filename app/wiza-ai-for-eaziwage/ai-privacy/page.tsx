import type { Metadata } from "next";
import AILegalPage, { type LegalSection } from "@/components/legal/AILegalPage";

export const metadata: Metadata = {
  title: "Wiza AI Privacy Policy",
  description:
    "Learn what information Wiza processes, why it is used, and the choices available to you.",
};

const sections: LegalSection[] = [
  {
    id: "scope-controller",
    title: "1. Scope and who is responsible",
    paragraphs: [
      "This Privacy Policy explains how EaziWage handles personal information when you use Wiza, the AI financial wellness coach on the EaziWage website. It covers Wiza conversations, optional file attachments, conversation summaries, and related technical information. Other EaziWage services may have separate privacy notices.",
      "EaziWage is responsible for deciding how information is used for Wiza. For questions or requests about this policy, contact support@eaziwage.com. Where local law gives you specific rights, those rights apply in addition to the choices described here.",
    ],
  },
  {
    id: "information-collected",
    title: "2. Information we process",
    subsections: [
      {
        heading: "Information you provide",
        paragraphs: [
          "We process the text and other content you send to Wiza, including financial details you choose to share, questions, feedback, and any files or images you attach. If you request a summary by email or SMS, we process the destination email address or phone number you enter.",
        ],
      },
      {
        heading: "Account and financial context",
        paragraphs: [
          "If you are signed in to an EaziWage account, Wiza may receive relevant account information to tailor its response. Depending on your account and the service, this can include your name, country, earned-wage and advance-limit figures, recent advance activity, KYC status, and budget categories. Wiza may also use available account email or phone information when you choose a summary-delivery option.",
        ],
      },
      {
        heading: "Technical and service information",
        paragraphs: [
          "Our website and providers may process basic device, browser, network, security, and service-usage information needed to deliver the site, prevent abuse, diagnose errors, and maintain security. The website also stores your cookie-consent choice. Analytics are enabled only when the applicable analytics consent has been given.",
        ],
      },
    ],
  },
  {
    id: "how-information-used",
    title: "3. How we use information",
    paragraphs: ["We use information as needed to:"],
    items: [
      "Generate and deliver Wiza responses, calculations, and conversation summaries you request.",
      "Use relevant EaziWage account context to personalize a response when you are signed in.",
      "Send a summary to the email address or phone number you choose, when you request that delivery.",
      "Operate, secure, troubleshoot, and maintain Wiza and the services it depends on.",
      "Detect misuse, investigate incidents, comply with legal obligations, and respond to user requests.",
      "Measure website performance using analytics only where you have enabled analytics cookies or otherwise provided the required consent.",
    ],
  },
  {
    id: "legal-bases",
    title: "4. Legal grounds for processing",
    paragraphs: [
      "Where applicable privacy law requires a legal ground for processing, we rely on the ground that fits the purpose and circumstances. This may include providing the service you request or taking steps at your request, your consent (for example, for analytics), our legitimate interests in operating, securing, and supporting Wiza, or compliance with a legal obligation.",
      "Where we rely on consent, you can withdraw it for future processing. Withdrawal does not affect processing that took place before withdrawal or processing that has another lawful basis. You may also stop using optional features such as email or SMS summary delivery.",
    ],
  },
  {
    id: "ai-processing",
    title: "5. AI processing and conversation storage",
    paragraphs: [
      "To generate a response, your message and relevant conversation context are sent to Google’s generative AI service. If you attach a file, its content may also be sent for processing. For signed-in users, relevant account details described above may be included in the information used to prepare a response. Avoid submitting information that is not needed for your question.",
      "When a question benefits from current public information, Wiza may use Google Search grounding to find and cite publicly available web sources. Search queries are generated from the conversation to retrieve relevant information. Wiza is instructed not to include names, account details, or other personal financial information in search queries, but you should avoid including information that is not needed for your question.",
      "For visitors who are not signed in, Wiza uses the conversation held in the current browser page to provide context for follow-up messages. The Wiza coach does not create a persistent chat history for those guest conversations. If you choose email or SMS delivery of a guest summary, the conversation is processed to create the summary and the requested summary is sent through the relevant provider.",
      "For signed-in users, Wiza stores conversation messages and session details in EaziWage's Supabase-hosted database so the service can maintain the account conversation and generate or deliver summaries. A summary may also be saved with the relevant session. Account chat records are handled under EaziWage's applicable data-retention and account-management processes.",
      "Google and other providers process data under their own terms and privacy practices. We do not promise that a provider will use or retain data in a particular way beyond the protections and settings applicable to our service arrangement. Please consult the relevant provider information for details.",
    ],
  },
  {
    id: "sharing",
    title: "6. When information is shared",
    paragraphs: [
      "We do not sell your Wiza conversation content. We share personal information only as needed to provide Wiza, at your direction, or where required or permitted by law.",
    ],
    subsections: [
      {
        heading: "Service providers",
        paragraphs: [
          "Wiza uses service providers to operate its features. Depending on what you use, relevant information may be processed by Google for AI responses and, when useful, Google Search grounding; Supabase for signed-in account conversation storage; Resend for requested email summaries; Africa's Talking for requested SMS summaries; Trigger.dev for processing certain signed-in summary-delivery requests; and Vercel for website analytics when you have consented. Providers receive information needed to perform their services and may process it under their own terms and our applicable arrangements.",
        ],
      },
      {
        heading: "Legal, safety, and business changes",
        paragraphs: [
          "We may disclose information when reasonably necessary to comply with law or legal process, protect people or the service, investigate suspected fraud or security incidents, or establish or defend legal rights. If EaziWage undergoes a business reorganization, merger, or transfer, information may be handled as part of that transaction subject to applicable privacy requirements.",
        ],
      },
    ],
  },
  {
    id: "retention",
    title: "7. How long information is kept",
    paragraphs: [
      "Guest coach conversations are held in the active page session and are not saved as a Wiza chat history by the coach. Information needed to deliver a summary may still be processed by the AI and messaging providers involved in that request.",
      "Signed-in Wiza conversations and any saved summaries are kept in the account service for as long as needed to operate the feature and for legitimate operational, security, dispute-resolution, and legal purposes. The time may depend on your account status, the nature of the information, and applicable legal requirements. Provider records may be subject to the provider's own retention practices.",
      "When information is no longer needed, it is deleted or de-identified where reasonably practicable, unless it must be retained by law or for another permitted purpose.",
    ],
  },
  {
    id: "transfers",
    title: "8. Processing in other countries",
    paragraphs: [
      "EaziWage and its providers may process information in countries other than the one where you live. Privacy and data-protection rules in those countries may differ. Where required, we use appropriate safeguards for cross-border transfers and take steps intended to protect information in accordance with applicable law.",
    ],
  },
  {
    id: "security",
    title: "9. Security",
    paragraphs: [
      "We use administrative, technical, and organizational measures designed to protect information against unauthorized access, loss, misuse, or alteration. No website, transmission, or storage system can be guaranteed completely secure. Please protect your account credentials and avoid sending passwords, one-time codes, full payment-card details, or unrelated sensitive documents to Wiza.",
      "If you believe your Wiza information or account has been exposed or accessed without authorization, contact support@eaziwage.com promptly.",
    ],
  },
  {
    id: "cookies",
    title: "10. Cookies and analytics choices",
    paragraphs: [
      "The EaziWage website uses cookies or similar storage for site operation and to remember your cookie choices. Analytics are enabled only when you consent to analytics. You can change your cookie preferences through the site's cookie controls, where available, or adjust your browser settings. Disabling necessary storage may affect site functionality.",
      "The Wiza coach does not use the persistent visitor identifier used by the separate EaziWage chat widget. If you use other parts of the website, those features may process information under their own applicable notices.",
    ],
  },
  {
    id: "your-choices",
    title: "11. Your privacy choices and rights",
    paragraphs: [
      "Depending on where you live and the laws that apply, you may have the right to ask for access to, correction of, deletion of, or a copy of your personal information. You may also be able to object to or restrict certain processing, withdraw consent where processing is based on consent, or complain to your local data-protection authority.",
      "To make a request, email support@eaziwage.com and describe the request and how you used Wiza. We may need to verify your identity and may ask for additional information to locate the relevant account or records. We will respond within the period required by applicable law. Some information may need to be retained where the law permits or requires it.",
      "You can avoid sending personal financial details in a prompt, end a guest conversation by leaving or refreshing the page, and choose not to request email or SMS delivery of a summary. If you are signed in and want to ask about account conversation records, contact support.",
    ],
  },
  {
    id: "children",
    title: "12. Children",
    paragraphs: [
      "Wiza is not designed for children who are not legally able to use the service under the laws that apply to them. We do not knowingly seek to collect children's personal information through Wiza. If you believe a child has submitted information, contact us so we can assess and address the request in accordance with applicable law.",
    ],
  },
  {
    id: "external-services",
    title: "13. Third-party sites and services",
    paragraphs: [
      "Wiza may rely on or link to services that EaziWage does not operate. This policy does not govern a third party's independent website or service. Review the relevant provider's privacy information to understand its own collection, use, and retention practices.",
    ],
  },
  {
    id: "policy-updates",
    title: "14. Changes to this policy",
    paragraphs: [
      "We may update this policy as Wiza, our practices, or applicable requirements change. The updated date at the top of this page shows when the latest version took effect. If a change materially affects how we handle information, we will provide additional notice where required by law.",
    ],
  },
  {
    id: "contact",
    title: "15. Contact us",
    paragraphs: [
      "For questions, requests, or concerns about this policy or Wiza's use of personal information, contact support@eaziwage.com. Please do not include passwords, authentication codes, or unnecessary financial details in your email.",
    ],
  },
];

export default function AIPrivacyPage() {
  return (
    <AILegalPage
      title="Privacy Policy"
      description="This policy explains what information Wiza processes, how it is used, and the choices available to you."
      updated="October 15, 2026"
      sections={sections}
    />
  );
}
