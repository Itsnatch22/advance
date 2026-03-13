import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";
import fs from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import noahKnowledge from "@/data/noah_knowledge.json";

export const maxDuration = 30;

const SUPPORT_EMAIL = "support@eaziwage.com";
const CONTACT_PAGE = "https://eaziwage.com/contact";

const systemPrompt = `You are Wiza, the friendly and professional AI assistant for EaziWage.
EaziWage enables employees across Africa to access their earned wages before payday.

Your goal is to help users understand EaziWage, its benefits, and how it works.
Be concise, helpful, and professional.

Always greet users warmly when they greet you.
When users request a human, urgent support, or escalation, provide clear human support handoff details.
If you don't know the answer, politely direct users to ${SUPPORT_EMAIL}.
Do not reveal sensitive information or PII.`;

const knowledgeBase = noahKnowledge
  .map((item) => {
    const text = Array.isArray(item.text) ? item.text.join(" ") : item.text;
    return `### ${item.title}\n${text}`;
  })
  .join("\n\n");

type WebsiteSource = {
  title: string;
  route: string;
  filePath: string;
};

const websiteSources: WebsiteSource[] = [
  { title: "Homepage", route: "/", filePath: "app/page.tsx" },
  { title: "FAQ", route: "/faq", filePath: "app/faq/page.tsx" },
  { title: "About", route: "/about", filePath: "app/about/page.tsx" },
  { title: "Contact", route: "/contact", filePath: "app/contact/page.tsx" },
  { title: "Partners", route: "/partners", filePath: "app/partners/page.tsx" },
  { title: "Careers", route: "/careers", filePath: "app/careers/page.tsx" },
  { title: "Culture", route: "/culture", filePath: "app/culture/page.tsx" },
  { title: "Security", route: "/security", filePath: "app/security/page.tsx" },
];

type WebsiteContextChunk = {
  title: string;
  route: string;
  content: string;
};

let cachedWebsiteContext: WebsiteContextChunk[] | null = null;

function extractMessageText(message: UIMessage): string {
  if (!message.parts) return "";

  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join(" ")
    .trim();
}

function extractLatestUserMessage(messages: UIMessage[]): string {
  const latestUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user");
  return latestUserMessage
    ? extractMessageText(latestUserMessage).toLowerCase()
    : "";
}

function buildGeminiContents(messages: UIMessage[]) {
  return messages
    .filter(
      (message) => message.role === "user" || message.role === "assistant"
    )
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: extractMessageText(message) }],
    }))
    .filter((message) => message.parts[0].text.length > 0);
}

function normalizeWebsiteText(raw: string): string {
  return raw
    .replace(/import\s+[^;]+;/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[{}()[\],]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function getWebsiteContext(): Promise<WebsiteContextChunk[]> {
  if (cachedWebsiteContext) {
    return cachedWebsiteContext;
  }

  const chunks = await Promise.all(
    websiteSources.map(async (source) => {
      try {
        const absolutePath = path.join(process.cwd(), source.filePath);
        const file = await fs.readFile(absolutePath, "utf8");
        const content = normalizeWebsiteText(file).slice(0, 5000);
        return { title: source.title, route: source.route, content };
      } catch {
        return { title: source.title, route: source.route, content: "" };
      }
    })
  );

  cachedWebsiteContext = chunks.filter((chunk) => chunk.content.length > 0);
  return cachedWebsiteContext;
}

function scoreTextMatch(query: string, haystack: string): number {
  const words = query.split(/\s+/).filter((word) => word.length > 2);
  return words.reduce(
    (acc, word) => (haystack.includes(word) ? acc + 1 : acc),
    0
  );
}

function isGreeting(query: string): boolean {
  return /\b(hi|hello|hey|good\s(morning|afternoon|evening)|yo|howdy)\b/i.test(
    query
  );
}

function needsHumanIntervention(query: string): boolean {
  return /\b(human|agent|representative|person|escalate|complaint|urgent|call me|speak to someone|customer care)\b/i.test(
    query
  );
}

function getHumanHandoffMessage() {
  return `Absolutely — I can connect you with a human support specialist. Please email ${SUPPORT_EMAIL} or use the contact form at ${CONTACT_PAGE} and include your name, company, and phone number for a faster follow-up.`;
}

async function buildWebsiteContextForQuery(query: string): Promise<string> {
  const context = await getWebsiteContext();

  if (!query || context.length === 0) {
    return "";
  }

  const ranked = context
    .map((chunk) => ({
      ...chunk,
      score: scoreTextMatch(query, chunk.content.toLowerCase()),
    }))
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(
      (chunk) =>
        `### ${chunk.title} (${chunk.route})\n${chunk.content.slice(0, 1000)}`
    )
    .join("\n\n");

  return ranked;
}

async function getFallbackReply(query: string): Promise<string> {
  if (isGreeting(query)) {
    return "Hello! 👋 I'm Wiza. Great to meet you — I can help with eligibility, fees, countries supported, onboarding, and withdrawals. What would you like to know?";
  }

  if (needsHumanIntervention(query)) {
    return getHumanHandoffMessage();
  }

  const websiteContext = await buildWebsiteContextForQuery(query);

  const scoredKnowledge = noahKnowledge
    .map((entry) => {
      const text =
        `${entry.title} ${Array.isArray(entry.text) ? entry.text.join(" ") : entry.text}`.toLowerCase();
      const score = scoreTextMatch(query, text);
      return { entry, score };
    })
    .sort((a, b) => b.score - a.score);

  const best = scoredKnowledge[0];

  if (!query) {
    return "I can help with EaziWage eligibility, fees, countries supported, and how withdrawals work. What would you like to know?";
  }

  if (websiteContext) {
    const topContextLine =
      websiteContext.split("\n")[0]?.replace(/^###\s*/, "") ?? "our website";
    if (!best || best.score === 0) {
      return `From ${topContextLine}, I found relevant information on our website. If you need exact account-specific support, please contact ${SUPPORT_EMAIL}.`;
    }

    const bestText = Array.isArray(best.entry.text)
      ? best.entry.text.join(" ")
      : best.entry.text;
    return `${best.entry.title}: ${bestText}\n\nI also found related context on ${topContextLine}.`;
  }

  if (!best || best.score === 0) {
    return `I couldn't find that confidently right now. Please contact ${SUPPORT_EMAIL} and the team will help quickly.`;
  }

  const bestText = Array.isArray(best.entry.text)
    ? best.entry.text.join(" ")
    : best.entry.text;
  return `${best.entry.title}: ${bestText}`;
}

function streamAssistantText(text: string) {
  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      const textId = "assistant-text";
      writer.write({ type: "start" });
      writer.write({ type: "text-start", id: textId });
      writer.write({ type: "text-delta", id: textId, delta: text });
      writer.write({ type: "text-end", id: textId });
      writer.write({ type: "finish" });
    },
  });

  return createUIMessageStreamResponse({ stream });
}

async function getGeminiReply(
  messages: UIMessage[],
  apiKey: string
): Promise<string> {
  const query = extractLatestUserMessage(messages);
  const websiteContext = await buildWebsiteContextForQuery(query);
  const escalationInstruction = needsHumanIntervention(query)
    ? `\n\nThe user appears to request human intervention. Give a brief helpful response and provide this exact handoff: ${getHumanHandoffMessage()}`
    : "";

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: `${systemPrompt}\n\nUse this internal knowledge base as primary context:\n${knowledgeBase}${websiteContext ? `\n\nWebsite context:\n${websiteContext}` : ""}${escalationInstruction}`,
            },
          ],
        },
        contents: buildGeminiContents(messages),
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 600,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API failed with status ${response.status}`);
  }

  const data = await response.json();
  const text =
    data?.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text ?? "")
      .join("")
      .trim() ?? "";

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  return text;
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { messages } = await req.json();
    const safeMessages: UIMessage[] = Array.isArray(messages) ? messages : [];
    const latestUserQuery = extractLatestUserMessage(safeMessages);

    if (needsHumanIntervention(latestUserQuery)) {
      return streamAssistantText(getHumanHandoffMessage());
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? "";

    if (!apiKey) {
      return streamAssistantText(await getFallbackReply(latestUserQuery));
    }

    const reply = await getGeminiReply(safeMessages, apiKey);
    return streamAssistantText(reply);
  } catch (error) {
    console.error("Wiza chat error", error);
    return streamAssistantText(
      "Sorry, something went wrong. Please contact " + SUPPORT_EMAIL
    );
  }
}
