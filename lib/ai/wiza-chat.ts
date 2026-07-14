import fs from "fs/promises";
import path from "path";
import { supabaseServer } from "@/lib/supabase/supabase-server";
import noahKnowledge from "@/data/noah_knowledge.json";
import type { UIMessage } from "ai";
import { streamWizaReply, buildSystemPrompt, type AttachmentData } from "@/lib/ai/cohere";
import { EMAIL_CONFIG, COMPANY_CONFIG } from '@/constants/config';

type WebsiteSource = { title: string; route: string; filePath: string };
type WebsiteContextChunk = { title: string; route: string; content: string };

type WebsiteContextCache = {
  chunks: WebsiteContextChunk[];
  mtimes: Record<string, number>;
};

const SUPPORT_EMAIL = EMAIL_CONFIG.SUPPORT_EMAIL;
const CONTACT_PAGE = `${COMPANY_CONFIG.HOMEPAGE_URL}/contact`;

const websiteSources: WebsiteSource[] = [
  { title: "Homepage", route: "/", filePath: "app/page.tsx" },
  { title: "About", route: "/about", filePath: "app/about/page.tsx" },
  {
    title: "Calculator",
    route: "/calculator",
    filePath: "app/calculator/page.tsx",
  },
  { title: "Careers", route: "/careers", filePath: "app/careers/page.tsx" },
  { title: "Contact", route: "/contact", filePath: "app/contact/page.tsx" },
  { title: "Culture", route: "/culture", filePath: "app/culture/page.tsx" },
  {
    title: "Employers",
    route: "/employers",
    filePath: "app/employers/page.tsx",
  },
  {
    title: "Employees",
    route: "/employees",
    filePath: "app/employees/page.tsx",
  },
  { title: "FAQ", route: "/faq", filePath: "app/faq/page.tsx" },
  { title: "Partners", route: "/partners", filePath: "app/partners/page.tsx" },
  {
    title: "Resources",
    route: "/resources",
    filePath: "app/resources/page.tsx",
  },
  { title: "Sales", route: "/sales", filePath: "app/sales/page.tsx" },
  { title: "Security", route: "/security", filePath: "app/security/page.tsx" },
  { title: "Status", route: "/status", filePath: "app/status/page.tsx" },
];

const knowledgeBase = noahKnowledge
  .map((item) => {
    const text = Array.isArray(item.text) ? item.text.join(" ") : item.text;
    return `### ${item.title}\n${text}`;
  })
  .join("\n\n");

let cachedWebsiteContext: WebsiteContextCache | null = null;

function extractMessageText(message: UIMessage): string {
  if (!message.parts) return "";
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join(" ")
    .trim();
}

export function extractLatestUserMessage(messages: UIMessage[]) {
  const latest = [...messages].reverse().find((m) => m.role === "user");
  return latest ? extractMessageText(latest).toLowerCase() : "";
}

function normalizeWebsiteText(raw: string) {
  return raw
    .replace(/import\s+[^;]+;/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[{}()[\],]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function shouldRefreshWebsiteContext() {
  if (!cachedWebsiteContext) return true;
  if (process.env.NODE_ENV === "development") return true;

  for (const src of websiteSources) {
    try {
      const stat = await fs.stat(path.join(process.cwd(), src.filePath));
      if (cachedWebsiteContext.mtimes[src.filePath] !== stat.mtimeMs) {
        return true;
      }
    } catch {
      return true;
    }
  }

  return false;
}

async function getWebsiteContext(): Promise<WebsiteContextChunk[]> {
  const refresh = await shouldRefreshWebsiteContext();
  if (!refresh && cachedWebsiteContext) {
    return cachedWebsiteContext.chunks;
  }

  const chunks = await Promise.all(
    websiteSources.map(async (src) => {
      try {
        const file = await fs.readFile(
          path.join(process.cwd(), src.filePath),
          "utf8"
        );
        return {
          title: src.title,
          route: src.route,
          content: normalizeWebsiteText(file).slice(0, 5000),
        };
      } catch {
        return { title: src.title, route: src.route, content: "" };
      }
    })
  );

  const mtimes: Record<string, number> = {};
  await Promise.all(
    websiteSources.map(async (src) => {
      try {
        const stat = await fs.stat(path.join(process.cwd(), src.filePath));
        mtimes[src.filePath] = stat.mtimeMs;
      } catch {
        mtimes[src.filePath] = 0;
      }
    })
  );

  const filteredChunks = chunks.filter((c) => c.content.length > 0);
  cachedWebsiteContext = { chunks: filteredChunks, mtimes };
  return filteredChunks;
}

function scoreTextMatch(query: string, haystack: string) {
  const words = query.split(/\s+/).filter((word) => word.length > 2);
  return words.reduce(
    (score, word) => (haystack.includes(word) ? score + 1 : score),
    0
  );
}

export function needsHumanIntervention(q: string) {
  return /\b(human|agent|representative|person|escalate|complaint|urgent|call me|speak to someone|customer care)\b/i.test(
    q
  );
}

export function getHumanHandoffMessage() {
  return `Absolutely — I can connect you with a human support specialist. Please email ${SUPPORT_EMAIL} or use the contact form at ${CONTACT_PAGE} and include your name, company, and phone number for a faster follow-up.`;
}

async function buildWebsiteContextForQuery(query: string) {
  const context = await getWebsiteContext();
  if (!query || !context.length) return "";

  return context
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
}

async function getFallbackReply(query: string) {
  if (!query) {
    return "I can help with EaziWage eligibility, fees, countries supported, and how withdrawals work. What would you like to know?";
  }

  if (
    /\b(hi|hello|hey|good\s(morning|afternoon|evening)|yo|howdy)\b/i.test(query)
  ) {
    return "Hello! 👋 I'm Wiza. Great to meet you — I can help with eligibility, fees, countries supported, onboarding, and withdrawals. What would you like to know?";
  }

  if (needsHumanIntervention(query)) {
    return getHumanHandoffMessage();
  }

  const websiteContext = await buildWebsiteContextForQuery(query);
  if (websiteContext) {
    const topLine =
      websiteContext.split("\n")[0]?.replace(/^###\s*/, "") ?? "our website";
    return `From ${topLine}, I found relevant information on our website. If you need exact account-specific support, please contact ${SUPPORT_EMAIL}.`;
  }

  const best = noahKnowledge
    .map((entry) => {
      const text =
        `${entry.title} ${Array.isArray(entry.text) ? entry.text.join(" ") : entry.text}`.toLowerCase();
      return { entry, score: scoreTextMatch(query, text) };
    })
    .sort((a, b) => b.score - a.score)[0];

  if (!best || best.score === 0) {
    return `I couldn't find that confidently right now. Please contact ${SUPPORT_EMAIL} and the team will help quickly.`;
  }

  const bestText = Array.isArray(best.entry.text)
    ? best.entry.text.join(" ")
    : best.entry.text;
  return `${best.entry.title}: ${bestText}`;
}

async function getCohereReply(messages: UIMessage[], attachments?: AttachmentData[]) {
  const rawQuery = extractLatestUserMessage(messages);
  const query = rawQuery.startsWith("__gif__") ? "[User shared a GIF]" : rawQuery;
  const websiteContext = await buildWebsiteContextForQuery(query);

  const systemPrompt = buildSystemPrompt({
    employeeName: "there",
    earnedWages: 0,
    advanceLimit: 0,
    upcomingBills: [],
    financialScore: 0,
    countryCode: "KE",
    isGuest: true,
  });

  const enhancedPrompt = `${systemPrompt}\n\n## Internal Knowledge Base\n${knowledgeBase}${websiteContext ? `\n\n## Website Context\n${websiteContext}` : ""}`;

  const geminiHistory = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .slice(0, -1)
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: extractMessageText(m) }],
    }));

  let fullReply = "";
  for await (const chunk of streamWizaReply(
    enhancedPrompt,
    geminiHistory,
    query,
    attachments
  )) {
    fullReply += chunk;
  }

  if (!fullReply) throw new Error("Cohere returned empty response");
  return fullReply;
}

export async function getChatReply(messages: UIMessage[], _apiKey?: string, attachments?: AttachmentData[]) {
  const rawLatest = extractLatestUserMessage(messages);
  const latest = rawLatest.startsWith("__gif__") ? "[User shared a GIF]" : rawLatest;
  if (needsHumanIntervention(latest)) {
    return getHumanHandoffMessage();
  }

  try {
    return await getCohereReply(messages, attachments);
  } catch (err) {
    console.error("[cohere/chat] error", err);
    return await getFallbackReply(latest);
  }
}

export function getUuidString(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    trimmed
  )
    ? trimmed
    : null;
}

export async function getOrCreateSession(
  visitorId: string,
  sessionId: string | null,
  firstUserMessage: string
) {
  if (sessionId) {
    const { data } = await supabaseServer
      .from("wiza_public_sessions")
      .select("id")
      .eq("id", sessionId)
      .eq("visitor_id", visitorId)
      .single();
    if (data) return data.id;
  }

  const title = firstUserMessage.slice(0, 60) || "New conversation";
  const { data, error } = await supabaseServer
    .from("wiza_public_sessions")
    .insert({ visitor_id: visitorId, title })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to create session: ${error.message}`);
  }

  if (!data) {
    throw new Error(
      "Failed to create session: Supabase returned no session row"
    );
  }

  return data.id;
}

export async function saveMessages(
  sessionId: string,
  userContent: string,
  assistantContent: string
) {
  const { error: insertError } = await supabaseServer
    .from("wiza_public_messages")
    .insert([
      { session_id: sessionId, role: "user", content: userContent },
      { session_id: sessionId, role: "assistant", content: assistantContent },
    ]);

  if (insertError) {
    throw new Error(`Failed to save messages: ${insertError.message}`);
  }

  const { error: countError } = await supabaseServer.rpc(
    "increment_message_count",
    {
      sid: sessionId,
    }
  );

  if (countError) {
    throw new Error(
      `Failed to update session message count: ${countError.message}`
    );
  }
}
