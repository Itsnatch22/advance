import { createUIMessageStream, createUIMessageStreamResponse, type UIMessage } from "ai";
import noahKnowledge from "@/data/noah_knowledge.json";

export const maxDuration = 30;

const systemPrompt = `You are Wiza, the friendly and professional AI assistant for EaziWage.
EaziWage enables employees across Africa to access their earned wages before payday.

Your goal is to help users understand EaziWage, its benefits, and how it works.
Be concise, helpful, and professional.

If you don't know the answer, politely direct users to support@eaziwage.com.
Do not reveal sensitive information or PII.`;

const knowledgeBase = noahKnowledge
  .map((item) => {
    const text = Array.isArray(item.text) ? item.text.join(" ") : item.text;
    return `### ${item.title}\n${text}`;
  })
  .join("\n\n");

function extractMessageText(message: UIMessage): string {
  if (!message.parts) return "";

  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join(" ")
    .trim();
}

function extractLatestUserMessage(messages: UIMessage[]): string {
  const latestUserMessage = [...messages].reverse().find((message) => message.role === "user");
  return latestUserMessage ? extractMessageText(latestUserMessage).toLowerCase() : "";
}

function buildGeminiContents(messages: UIMessage[]) {
  return messages
    .filter((message) => message.role === "user" || message.role === "assistant")
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: extractMessageText(message) }],
    }))
    .filter((message) => message.parts[0].text.length > 0);
}

function getFallbackReply(query: string): string {
  if (!query) {
    return "I can help with EaziWage eligibility, fees, countries supported, and how withdrawals work. What would you like to know?";
  }

  const scored = noahKnowledge
    .map((entry) => {
      const text = `${entry.title} ${Array.isArray(entry.text) ? entry.text.join(" ") : entry.text}`.toLowerCase();
      const score = query
        .split(/\s+/)
        .filter((word) => word.length > 2)
        .reduce((acc, word) => (text.includes(word) ? acc + 1 : acc), 0);

      return { entry, score };
    })
    .sort((a, b) => b.score - a.score);

  const best = scored[0];

  if (!best || best.score === 0) {
    return "I couldn't find that in my fallback knowledge right now. Please contact support@eaziwage.com and the team will help quickly.";
  }

  const bestText = Array.isArray(best.entry.text) ? best.entry.text.join(" ") : best.entry.text;
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

async function getGeminiReply(messages: UIMessage[], apiKey: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          role: "system",
          parts: [{ text: `${systemPrompt}\n\nUse this internal knowledge base as your primary context:\n${knowledgeBase}` }],
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

export async function POST(req: Request) {
  const { messages } = await req.json();
  const safeMessages: UIMessage[] = Array.isArray(messages) ? messages : [];

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    return streamAssistantText(getFallbackReply(extractLatestUserMessage(safeMessages)));
  }

  try {
    const reply = await getGeminiReply(safeMessages, apiKey);
    return streamAssistantText(reply);
  } catch {
    return streamAssistantText(getFallbackReply(extractLatestUserMessage(safeMessages)));
  }
}
