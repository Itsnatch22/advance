import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import noahKnowledge from "@/data/noah_knowledge.json";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Format knowledge base for the system prompt
  const knowledgeBase = noahKnowledge
    .map((item) => {
      const text = Array.isArray(item.text) ? item.text.join(" ") : item.text;
      return `### ${item.title}\n${text}`;
    })
    .join("\n\n");

  const result = await streamText({
    model: openai("gpt-4o"),
    system: `You are Wiza, the friendly and professional AI assistant for EaziWage. 
    EaziWage enables employees across Africa to access their earned wages before payday.
    
    Your goal is to help users understand EaziWage, its benefits, and how it works.
    Be concise, helpful, and professional.
    
    Use the following context to answer questions:
    ${knowledgeBase}
    
    If you don't know the answer, politely direct them to contact our support team at support@eaziwage.com.
    Do not reveal sensitive information or PII.`,
    messages,
  });

  return result.toUIMessageStreamResponse();
}
