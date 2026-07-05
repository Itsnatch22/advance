import { CohereClient } from "cohere-ai";
import { getCurrencyFromCountry, type CountryCode } from "../currency/currency";

// ── Types ─────────────────────────────────────────────────────────────────────

export type StreamEvent =
  | { type: "session_id"; session_id: string }
  | { type: "chunk"; text: string }
  | { type: "done" }
  | { type: "error"; message: string };

export type SummarizeJobPayload = {
  session_id: string;
  employee_id: string;
  send_to_email?: string | null;
  send_to_phone?: string | null;
};

export type AttachmentData = {
  mimeType: string;
  base64: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatMoney(amount: number, countryCode: CountryCode): string {
  const currency = getCurrencyFromCountry(countryCode)?.code;
  return `${currency} ${amount.toLocaleString()}`;
}

// ── Client ────────────────────────────────────────────────────────────────────

if (!process.env.COHERE_API_KEY) {
  console.error(
    "[cohere] COHERE_API_KEY is not configured — AI features will be unavailable"
  );
}

const cohere = process.env.COHERE_API_KEY
  ? new CohereClient({ token: process.env.COHERE_API_KEY })
  : null;

const MODEL = "command-a-03-2025";

// ── System prompt ─────────────────────────────────────────────────────────────

export function buildSystemPrompt(ctx: {
  employeeName: string;
  earnedWages: number;
  advanceLimit: number;
  dailyRate?: number;
  daysElapsed?: number;
  paydayDate?: string | null;
  upcomingBills?: { label: string; amount: number; dueInDays: number }[];
  upcomingAdvances?: {
    amount?: number | null;
    net_amount?: number | null;
    fee_amount?: number | null;
    status?: string | null;
    requested_at?: string | null;
    currency?: string | null;
  }[];
  budgetCategories?: unknown;
  financialScore: number;
  countryCode?: CountryCode;
  isGuest?: boolean;
  pendingKyc?: boolean;
}) {
  const countryCode = (ctx.countryCode || "KE") as CountryCode;

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
8. **Escalate when truly stuck** — If a query is completely outside your ability to help (e.g. technical account errors, payment disputes, employer integration issues), respond warmly, briefly explain you can't help with that specific thing, then append the exact token \`__ESCALATE__\` on its own line at the very end. Do NOT include \`__ESCALATE__\` for anything you can partially help with.

## Response format
- Use plain text with markdown: **bold**, tables, line breaks
- No emojis in tables or calculations (use them sparingly in commentary)
- Structure: [INSIGHT] → [TABLE/CALCULATION] → [PLAYFUL COMMENTARY] → [NEXT STEP HOOK]`;
  }

  const billsSummary = (ctx.upcomingBills ?? [])
    .map(
      (b) =>
        `  • ${b.label}: ${formatMoney(b.amount, countryCode)} due in ${b.dueInDays} days`
    )
    .join("\n");
  const advancesSummary = (ctx.upcomingAdvances ?? [])
    .map((advance) => {
      const amount = advance.net_amount ?? advance.amount ?? 0;
      const status = advance.status ?? "unknown";
      const date = advance.requested_at
        ? new Date(advance.requested_at).toLocaleDateString()
        : "recently";
      return `  • ${formatMoney(amount, countryCode)} (${status}) requested ${date}`;
    })
    .join("\n");
  const budgetSummary =
    ctx.budgetCategories && typeof ctx.budgetCategories === "object"
      ? JSON.stringify(ctx.budgetCategories)
      : null;
  const kycLine = ctx.pendingKyc
    ? "- KYC status: pending approval. Do not expose account-specific financial data yet.\n"
    : "";

  return `You are Wiza, EaziWage's AI financial wellness coach — warm, playful, and fiercely committed to the financial wellbeing of the people you serve.

## Employee context (updated each session)
- Name: ${ctx.employeeName}
- Earned wages available: ${formatMoney(ctx.earnedWages, countryCode)}
- Maximum safe advance (60% limit): ${formatMoney(ctx.advanceLimit, countryCode)}
- Daily earning rate: ${formatMoney(ctx.dailyRate ?? 0, countryCode)}
- Days elapsed in pay period: ${ctx.daysElapsed ?? 0}
- Payday date: ${ctx.paydayDate ?? "not available"}
- Financial health score: ${ctx.financialScore}/100
${kycLine}- Recent advances:
${advancesSummary || "  (none recorded)"}
- Upcoming obligations:
${billsSummary || "  (none recorded)"}
- Budget categories: ${budgetSummary || "not recorded"}

## Your superpowers
1. **Instant calculations** — When someone mentions their salary or spending, immediately calculate:
   - Daily earning rate
   - Mid-month cash availability
   - Weekly burn rate
   - Future projections

2. **Interactive insights** — Turn every number into a story.

3. **Structured outputs** — Present calculations as markdown tables when numbers are involved.

4. **Micro diagnostics** — Ask 2–3 quick questions to generate personalized advice.

5. **Curiosity loops** — Guide deeper without lecturing.

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
7. **End with a hook** — Always leave them curious.
8. **Escalate when truly stuck** — If a query is completely outside your ability to help (e.g. technical account errors, payment disputes, employer integration issues), respond warmly, briefly explain you can't help with that specific thing, then append the exact token \`__ESCALATE__\` on its own line at the very end.

## Response format
- Use plain text with markdown: **bold**, tables, line breaks
- No emojis in tables or calculations (use them sparingly in commentary)
- Structure: [INSIGHT] → [TABLE/CALCULATION] → [PLAYFUL COMMENTARY] → [NEXT STEP HOOK]`;
}

// ── Streaming reply ───────────────────────────────────────────────────────────

const MAX_RETRIES = 3;

function isRetryable(err: unknown): boolean {
  if (err && typeof err === "object" && "status" in err) {
    const status = (err as { status: number }).status;
    return status === 503 || status === 429 || status === 500;
  }
  return false;
}

async function withRetry<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (!isRetryable(err) || attempt === retries) break;
      const delay = Math.min(1000 * 2 ** attempt + Math.random() * 500, 8000);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw lastErr;
}

export async function* streamWizaReply(
  systemPrompt: string,
  history: Array<{ role: string; parts: Array<{ text: string }> }>,
  userMessage: string,
  attachments?: AttachmentData[]
): AsyncGenerator<string> {
  if (!cohere) throw new Error("AI service is not configured");

  const chatHistory = history.map((h) => ({
    role: h.role === "user" ? ("USER" as const) : ("CHATBOT" as const),
    message: h.parts.map((p) => p.text).join(""),
  }));

  // Cohere v1 chatStream is text-only; describe image attachments in the message
  const imageCount = (attachments ?? []).filter((a) =>
    a.mimeType.startsWith("image/")
  ).length;
  const finalMessage =
    imageCount > 0
      ? `${userMessage}\n\n[User attached ${imageCount} image(s) — image analysis is not available in this interface, but please acknowledge the attachment and respond to any text context provided.]`
      : userMessage;

  const stream = await withRetry(() =>
    Promise.resolve(
      cohere!.chatStream({
        model: MODEL,
        preamble: systemPrompt,
        chatHistory,
        message: finalMessage,
      })
    )
  );

  for await (const event of stream) {
    if (event.eventType === "text-generation") {
      yield event.text;
    }
  }
}

// ── Summary generation ────────────────────────────────────────────────────────

export async function generateSummary(transcript: string): Promise<string> {
  if (!cohere) throw new Error("AI service is not configured");

  const response = await withRetry(() =>
    cohere!.chat({
      model: MODEL,
      message: `Summarise this financial coaching conversation in 3–5 bullet points.
Focus on: advice given, key numbers mentioned, decisions made, and recommended next steps.
Keep each bullet to one sentence. Use plain text, no markdown headers.

TRANSCRIPT:
${transcript}`,
    })
  );

  return response.text ?? "";
}

export async function generateClientSummary(
  messages: { role: "user" | "model"; content: string }[]
): Promise<string> {
  const transcript = messages
    .map((m) => `${m.role === "user" ? "User" : "Wiza"}: ${m.content}`)
    .join("\n\n");

  return generateSummary(transcript);
}
