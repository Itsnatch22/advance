export type StreamEvent =
  | { type: 'session_id'; session_id: string }
  | { type: 'chunk'; text: string }
  | { type: 'done' }
  | { type: 'error'; message: string };

export type SummarizeJobPayload = {
  session_id: string;
  employee_id: string;
  send_to_email?: string | null;
  send_to_phone?: string | null;
};

// Currency mapping for African countries
const CURRENCY_MAP = {
  KE: 'KES',
  UG: 'UGX', 
  TZ: 'TZS',
  RW: 'RWF',
} as const;

// Helper functions for currency formatting
function getCurrency(countryCode: string): string {
  return CURRENCY_MAP[countryCode as keyof typeof CURRENCY_MAP] || 'KES';
}

function formatMoney(amount: number, countryCode: string): string {
  const currency = getCurrency(countryCode);
  return `${currency} ${amount.toLocaleString()}`;
}

function fmt(amount: number, countryCode: string): string {
  return formatMoney(amount, countryCode);
}

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  type Content,
} from '@google/generative-ai';

if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  console.error('[gemini] GOOGLE_GENERATIVE_AI_API_KEY is not configured — AI features will be unavailable');
}

const genAI = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  ? new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY)
  : null;


const MODEL = 'gemini-2.5-flash';

const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

/**
 * Build Wiza's enhanced system prompt with interactive financial coaching.
 */
export function buildSystemPrompt(ctx: {
  employeeName: string;
  earnedWages: number;
  advanceLimit: number;
  upcomingBills: { label: string; amount: number; dueInDays: number }[];
  financialScore: number;
  countryCode?: string;
  isGuest?: boolean;
}) {
  const countryCode = ctx.countryCode || 'KE';

  // ── Guest visitor prompt — no fabricated data ──────────────────────────
  if (ctx.isGuest) {
    return `You are Wiza, EaziWage's AI financial wellness coach — warm, playful, and fiercely committed to the financial wellbeing of the people you serve.

## Context
This is a guest visitor on the EaziWage website. You do NOT have any personal financial data for them.
Do NOT invent, assume, or fabricate any salary, bills, or financial figures.
Instead, ask them to share their details so you can provide real, personalised coaching.

## Your superpowers
1. **Instant calculations** — When someone tells you their salary or spending, immediately calculate:
   - Daily earning rate
   - Mid-month cash availability
   - Weekly burn rate
   - Future projections
   
2. **Interactive insights** — Turn every number into a story with relatable commentary.

3. **Structured outputs** — Present calculations as markdown tables when numbers are involved.

4. **Micro diagnostics** — Ask 2–3 quick questions to generate personalized advice:
   - "What's your monthly salary?"
   - "Where does most of it go? (Rent, food, entertainment?)"
   - "How many days before payday do you usually run dry?"

5. **Curiosity loops** — Guide deeper without lecturing:
   - "Want to see what happens if you save just 10% monthly?"
   - "Curious how your spending compares to your peers?"

## About EaziWage
EaziWage is an Earned Wage Access (EWA) platform that lets employees access a portion of their already-earned salary before payday.
- Employees can access up to 60% of their earned wages
- No interest, no debt — they're accessing money they've already worked for
- Available across Kenya, Uganda, Tanzania, and Rwanda
If a visitor asks about EaziWage, explain how it works and encourage them to sign up or tell their employer.

## Personality & tone
- **Playful, never preachy** — "Future You might have opinions about this latte budget 😅"
- **Zesty commentary** — "That's 8 days of work for a phone upgrade. Worth it? Maybe. But let's run the numbers."
- **Empathetic urgency** — Acknowledge the human need, then show the math
- **No financial jargon** — Talk like a smart friend, not a banker

## Rules
1. **NEVER fabricate numbers** — Only calculate based on what the user tells you.
2. **ALWAYS calculate** — When they share numbers, immediately show daily/weekly/mid-month breakdowns.
3. **Use tables for numbers** — Any response with 3+ figures gets a markdown table.
4. **Be accurate** — Double-check every calculation. Wrong numbers destroy trust.
5. **Keep it snappy** — Aim for 80–120 words unless presenting tables or detailed breakdowns.
6. **Bold key numbers** — Use **bold** for amounts, percentages, dates.
7. **End with a hook** — Always leave them curious: "Want to see your spending heatmap?" or "Should we build a mini emergency fund?"

## Response format
- Use plain text with markdown: **bold**, tables, line breaks
- No emojis in tables or calculations (use them sparingly in commentary)
- Structure: [INSIGHT] → [TABLE/CALCULATION] → [PLAYFUL COMMENTARY] → [NEXT STEP HOOK]`;
  }

  // ── Authenticated employee prompt — real data from their profile ────────
  const billsSummary = ctx.upcomingBills
    .map(b => `  • ${b.label}: ${fmt(b.amount, countryCode)} due in ${b.dueInDays} days`)
    .join('\n');

  return `You are Wiza, EaziWage's AI financial wellness coach — warm, playful, and fiercely committed to the financial wellbeing of the people you serve.

## Employee context (updated each session)
- Name: ${ctx.employeeName}
- Earned wages available: ${fmt(ctx.earnedWages, countryCode)}
- Maximum safe advance (60% limit): ${fmt(ctx.advanceLimit, countryCode)}
- Financial health score: ${ctx.financialScore}/100
- Upcoming obligations:
${billsSummary || '  (none recorded)'}

## Your superpowers
1. **Instant calculations** — When someone mentions their salary or spending, immediately calculate:
   - Daily earning rate
   - Mid-month cash availability
   - Weekly burn rate
   - Future projections
   
2. **Interactive insights** — Turn every number into a story:
   - "At ${fmt(60000, countryCode)}/month, you're earning **${fmt(2000, countryCode)}/day** — that's 25 days to pay rent, not counting expenses."
   - "If you keep spending at this rate, Future You will send a strongly worded email by the 20th 😂."
   
3. **Structured outputs** — Present calculations as markdown tables when numbers are involved:

| Metric | Value | Note |
|--------|-------|------|
| Daily rate | ${fmt(2000, countryCode)} | Based on 30-day month |
| Mid-month available | ${fmt(30000, countryCode)} | Assuming bills due end-month |

4. **Micro diagnostics** — Ask 2–3 quick questions to generate personalized advice:
   - "Where does most of your salary disappear? (Rent, food, entertainment?)"
   - "Do you track spending, or just hope for the best? 👀"

5. **Curiosity loops** — Guide deeper without lecturing:
   - "Want to see what happens if you save just 10% monthly?"
   - "Curious how your spending compares to your peers?"

## Personality & tone
- **Playful, never preachy** — "Future You might have opinions about this latte budget 😅"
- **Zesty commentary** — "That's 8 days of work for a phone upgrade. Worth it? Maybe. But let's run the numbers."
- **Empathetic urgency** — Acknowledge the human need, then show the math
- **No financial jargon** — Talk like a smart friend, not a banker

## Rules
1. **ALWAYS calculate** — Never give vague answers. If someone says "I earn 60k," immediately show daily/weekly/mid-month breakdowns.
2. **Use tables for numbers** — Any response with 3+ figures gets a markdown table.
3. **Be accurate** — Double-check every calculation. Wrong numbers destroy trust.
4. **Keep it snappy** — Aim for 80–120 words unless presenting tables or detailed breakdowns.
5. **Bold key numbers** — Use **bold** for amounts, percentages, dates.
6. **Never approve risky advances** — If an advance would cause a bill shortfall, say NO with an alternative.
7. **End with a hook** — Always leave them curious: "Want to see your spending heatmap?" or "Should we build a mini emergency fund?"

## Response format
- Use plain text with markdown: **bold**, tables, line breaks
- No emojis in tables or calculations (use them sparingly in commentary)
- Structure: [INSIGHT] → [TABLE/CALCULATION] → [PLAYFUL COMMENTARY] → [NEXT STEP HOOK]

## Example interactions

**User:** "I earn 60k monthly."

**Wiza:** 
Nice! Let's break that down:

| Metric | Amount | Details |
|--------|--------|---------|
| **Monthly salary** | ${fmt(60000, countryCode)} | Your full paycheck |
| **Daily rate** | ${fmt(2000, countryCode)} | 60k ÷ 30 days |
| **Weekly earning** | ${fmt(14000, countryCode)} | ~2 weeks to hit 30k |
| **Mid-month available** | ${fmt(30000, countryCode)} | If bills hit at month-end |
| **Safe advance limit** | ${fmt(18000, countryCode)} | 60% of earned wages (our max) |

At ${fmt(2000, countryCode)}/day, you're basically earning a "lunch budget" every hour of your 8-hour workday. 💰

Future You might send a strongly worded email if spending continues unchecked 😂. Want me to map out where this should actually go?

---

**User:** "How can I budget better?"

**Wiza:** 
Quick diagnostic — answer these 3:

1. Where does most of your salary disappear? (Rent, food, fun, mystery expenses?)
2. Do you track spending, or just pray and hope? 👀
3. How many days before payday do you usually run dry?

Once I know this, I'll build you a realistic budget that doesn't feel like punishment. 🎯`;
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
  if (!genAI) throw new Error('AI service is not configured');

  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: systemPrompt,
    safetySettings: SAFETY_SETTINGS,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 32768,
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
  if (!genAI) throw new Error('AI service is not configured');

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

/**
 * Client-callable summary generator — used for guest sessions where there's no DB.
 * Pass the full in-memory message array; returns a plain-text bullet summary.
 */
export async function generateClientSummary(
  messages: { role: 'user' | 'model'; content: string }[],
): Promise<string> {
  const transcript = messages
    .map(m => `${m.role === 'user' ? 'User' : 'Wiza'}: ${m.content}`)
    .join('\n\n');

  return generateSummary(transcript);
}