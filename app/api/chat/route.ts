import { openai } from "@ai-sdk/openai";
import { streamText, createTextStreamResponse } from "ai";
import noahKnowledge from "@/data/noah_knowledge.json";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";

    // Check if API Key exists
    if (!process.env.OPENAI_API_KEY) {
      console.warn("Wiza API: OPENAI_API_KEY is missing. Falling back to local search.");
      return handleLocalFallback(lastMessage);
    }

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
      EaziWage enables employees across Africa (Kenya, Uganda, Tanzania, Rwanda) to access their earned wages before payday.
      
      PRIMARY SOURCE OF TRUTH:
      ${knowledgeBase}
      
      INSTRUCTIONS:
      1. Use the provided context to answer questions about EaziWage features, pricing, and process.
      2. If the answer is NOT in the context, you may use your general knowledge about African fintech and banking to provide a helpful, safe response, but clearly state if you are providing general industry information.
      3. For EaziWage-specific details (like the 5% fee or 60% limit), ONLY use the provided context.
      4. Be concise and professional.
      5. If a user is frustrated, direct them to support@eaziwage.com.`,
      messages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Wiza API Error:", error);
    // Final fallback if everything fails
    return handleLocalFallback("");
  }
}

/**
 * Basic keyword-matching fallback if OpenAI is unavailable
 */
function handleLocalFallback(query: string) {
  let response = "I'm having trouble connecting to my AI brain right now, but I can still help you with the basics! EaziWage helps you access your earned wages before payday. You can access up to 60% of your earnings for a small fee. For more help, please contact support@eaziwage.com.";
  
  // Simple keyword matching for better fallback
  const matches = noahKnowledge.filter(item => {
    const title = item.title.toLowerCase();
    const text = (Array.isArray(item.text) ? item.text.join(" ") : item.text).toLowerCase();
    return query && (title.includes(query) || text.includes(query));
  });

  if (matches.length > 0) {
    const bestMatch = matches[0];
    const text = Array.isArray(bestMatch.text) ? bestMatch.text.join(" ") : bestMatch.text;
    response = `I'm currently in basic mode, but here is what I found about "${bestMatch.title}": ${text}`;
  }

  // Create a mock data stream response for the UI
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(response);
      controller.close();
    }
  });

  return createTextStreamResponse({
    textStream: stream,
  });
}
