import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  type Content,
} from '@google/generative-ai';

if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  throw new Error('Missing env: GOOGLE_GENERATIVE_AI_API_KEY');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

const MODEL = 'gemini-2.5-flash';

const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

/**
 * Build Wiza's system prompt with employee context injected.
 */
export function buildSystemPrompt(ctx: {
  employeeName: string;
  earnedWages: number;       // KES
  advanceLimit: number;      // KES — typically 60% of earned wages
  upcomingBills: { label: string; amount: number; dueInDays: number }[];
  financialScore: number;    // 0–100
}) {
  const billsSummary = ctx.upcomingBills
    .map(b => `  • ${b.label}: KES ${b.amount.toLocaleString()} due in ${b.dueInDays} days`)
    .join('\n');

  return `You are Wiza, EaziWage's AI financial wellness coach — warm, direct, and deeply caring about the financial wellbeing of the people you serve.

## Employee context (updated each session)
- Name: ${ctx.employeeName}
- Earned wages available: KES ${ctx.earnedWages.toLocaleString()}
- Maximum safe advance (60% limit): KES ${ctx.advanceLimit.toLocaleString()}
- Financial health score: ${ctx.financialScore}/100
- Upcoming obligations:
${billsSummary || '  (none recorded)'}

## Your job
1. Analyse every advance request against the employee's earned wages, upcoming bills, and 60% limit.
2. Give a clear SAFE / CAUTION / RISKY verdict with a one-line reason.
3. Suggest an alternative amount if the request is risky.
4. Keep responses concise (≤ 120 words). Use **bold** for key numbers.
5. Never approve an advance that would cause a shortfall for critical bills (rent, school fees, utilities).
6. Be empathetic — always acknowledge the human need behind the request before the financial analysis.
7. End with a single actionable next step.

## Format
Respond in plain text with light markdown (**bold** only). No bullet points unless listing obligations. No emojis.`;
}

/**
 * Stream a Gemini response given a full conversation history.
 * Returns an async generator that yields text chunks.
 */
export async function* streamWizaReply(
  systemPrompt: string,
  history: Content[],       // previous turns: [{role, parts}]
  userMessage: string,
): AsyncGenerator<string> {
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: systemPrompt,
    safetySettings: SAFETY_SETTINGS,
    generationConfig: {
      temperature: 0.4,    // lower = more consistent financial advice
      topP: 0.9,
      maxOutputTokens: 512,
    },
  });

  const chat = model.startChat({ history });
  const result = await chat.sendMessageStream(userMessage);

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) yield text;
  }
}

/**
 * Non-streaming call used by the summary Trigger.dev job.
 */
export async function generateSummary(transcript: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: MODEL });
  const result = await model.generateContent(
    `Summarise this financial coaching conversation in 3–5 bullet points. 
Focus on: advice given, key numbers mentioned, decisions made, and recommended next steps.
Keep each bullet to one sentence. Use plain text, no markdown headers.

TRANSCRIPT:
${transcript}`
  );
  return result.response.text();
}