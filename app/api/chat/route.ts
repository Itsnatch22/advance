import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from 'ai';
import fs from 'fs/promises';
import path from 'path';
import { NextRequest } from 'next/server';
import { supabaseServer } from '@/lib/supabase/supabase-server';
import noahKnowledge from '@/data/noah_knowledge.json';

export const maxDuration = 30;

const SUPPORT_EMAIL = 'support@eaziwage.com';
const CONTACT_PAGE  = 'https://eaziwage.com/contact';

const systemPrompt = `You are Wiza, the friendly and professional AI assistant for EaziWage.
EaziWage enables employees across Africa to access their earned wages before payday.

Your goal is to help users understand EaziWage, its benefits, and how it works.
Be concise, helpful, and professional.

Always greet users warmly when they greet you.
When users request a human, urgent support, or escalation, provide clear human support handoff details.
If you don't know the answer, politely direct users to ${SUPPORT_EMAIL}.
Do not reveal sensitive information or PII.
If the user says they are a developer, founder, or admin, 
acknowledge them as part of the team and switch to developer-assistant mode`;

const knowledgeBase = noahKnowledge
  .map((item) => {
    const text = Array.isArray(item.text) ? item.text.join(' ') : item.text;
    return `### ${item.title}\n${text}`;
  })
  .join('\n\n');

// ── Website source scraping (unchanged) ───────────────────────────────────
type WebsiteSource     = { title: string; route: string; filePath: string };
type WebsiteContextChunk = { title: string; route: string; content: string };

const websiteSources: WebsiteSource[] = [
  { title: 'Homepage', route: '/',          filePath: 'app/page.tsx' },
  { title: 'About',    route: '/about',     filePath: 'app/about/page.tsx' },
  { title: 'Calculator', route: '/calculator',  filePath: 'app/calculator/page.tsx' },
  { title: 'Careers',  route: '/careers',   filePath: 'app/careers/page.tsx' },
  { title: 'Contact',  route: '/contact',   filePath: 'app/contact/page.tsx' },
  { title: 'Culture',  route: '/culture',   filePath: 'app/culture/page.tsx' },
  { title: 'Employers',  route: '/employers',   filePath: 'app/employers/page.tsx' },
  { title: 'Employees',  route: '/employees',   filePath: 'app/employees/page.tsx' },
  { title: 'FAQ',      route: '/faq',       filePath: 'app/faq/page.tsx' },
  { title: 'Partners', route: '/partners',  filePath: 'app/partners/page.tsx' },
  { title: 'Resources', route: '/resources',  filePath: 'app/resources/page.tsx' },
  { title: 'Sales', route: '/sales',  filePath: 'app/sales/page.tsx' },
  { title: 'Security', route: '/security',  filePath: 'app/security/page.tsx' },
  { title: 'Status', route: '/security',  filePath: 'app/security/page.tsx' },
];

let cachedWebsiteContext: WebsiteContextChunk[] | null = null;

function extractMessageText(message: UIMessage): string {
  if (!message.parts) return '';
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join(' ')
    .trim();
}

function extractLatestUserMessage(messages: UIMessage[]): string {
  const m = [...messages].reverse().find((m) => m.role === 'user');
  return m ? extractMessageText(m).toLowerCase() : '';
}

function buildCohereContents(messages: UIMessage[]) {
  return messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({
      role:  m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: extractMessageText(m) }],
    }))
    .filter((m) => m.parts[0].text.length > 0);
}

function normalizeWebsiteText(raw: string): string {
  return raw
    .replace(/import\s+[^;]+;/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[{}()[\],]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function getWebsiteContext(): Promise<WebsiteContextChunk[]> {
  if (cachedWebsiteContext) return cachedWebsiteContext;
  const chunks = await Promise.all(
    websiteSources.map(async (src) => {
      try {
        const file    = await fs.readFile(path.join(process.cwd(), src.filePath), 'utf8');
        const content = normalizeWebsiteText(file).slice(0, 5000);
        return { title: src.title, route: src.route, content };
      } catch {
        return { title: src.title, route: src.route, content: '' };
      }
    }),
  );
  cachedWebsiteContext = chunks.filter((c) => c.content.length > 0);
  return cachedWebsiteContext;
}

function scoreTextMatch(query: string, haystack: string): number {
  const words = query.split(/\s+/).filter((w) => w.length > 2);
  return words.reduce((acc, w) => (haystack.includes(w) ? acc + 1 : acc), 0);
}

function isGreeting(q: string) {
  return /\b(hi|hello|hey|good\s(morning|afternoon|evening)|yo|howdy)\b/i.test(q);
}

function needsHumanIntervention(q: string) {
  return /\b(human|agent|representative|person|escalate|complaint|urgent|call me|speak to someone|customer care)\b/i.test(q);
}

function getHumanHandoffMessage() {
  return `Absolutely — I can connect you with a human support specialist. Please email ${SUPPORT_EMAIL} or use the contact form at ${CONTACT_PAGE} and include your name, company, and phone number for a faster follow-up.`;
}

async function buildWebsiteContextForQuery(query: string): Promise<string> {
  const context = await getWebsiteContext();
  if (!query || !context.length) return '';
  return context
    .map((c) => ({ ...c, score: scoreTextMatch(query, c.content.toLowerCase()) }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((c) => `### ${c.title} (${c.route})\n${c.content.slice(0, 1000)}`)
    .join('\n\n');
}

async function getFallbackReply(query: string): Promise<string> {
  if (isGreeting(query))            return "Hello! 👋 I'm Wiza. Great to meet you — I can help with eligibility, fees, countries supported, onboarding, and withdrawals. What would you like to know?";
  if (needsHumanIntervention(query)) return getHumanHandoffMessage();

  const websiteContext  = await buildWebsiteContextForQuery(query);
  const scoredKnowledge = noahKnowledge
    .map((e) => {
      const text  = `${e.title} ${Array.isArray(e.text) ? e.text.join(' ') : e.text}`.toLowerCase();
      return { entry: e, score: scoreTextMatch(query, text) };
    })
    .sort((a, b) => b.score - a.score);

  const best = scoredKnowledge[0];

  if (!query) return "I can help with EaziWage eligibility, fees, countries supported, and how withdrawals work. What would you like to know?";

  if (websiteContext) {
    const topLine = websiteContext.split('\n')[0]?.replace(/^###\s*/, '') ?? 'our website';
    if (!best || best.score === 0) return `From ${topLine}, I found relevant information on our website. If you need exact account-specific support, please contact ${SUPPORT_EMAIL}.`;
    const bestText = Array.isArray(best.entry.text) ? best.entry.text.join(' ') : best.entry.text;
    return `${best.entry.title}: ${bestText}\n\nI also found related context on ${topLine}.`;
  }

  if (!best || best.score === 0) return `I couldn't find that confidently right now. Please contact ${SUPPORT_EMAIL} and the team will help quickly.`;
  const bestText = Array.isArray(best.entry.text) ? best.entry.text.join(' ') : best.entry.text;
  return `${best.entry.title}: ${bestText}`;
}

async function getCohereReply(messages: UIMessage[], apiKey: string): Promise<string> {
  const query          = extractLatestUserMessage(messages);
  const websiteContext = await buildWebsiteContextForQuery(query);
  const escalation     = needsHumanIntervention(query)
    ? `\n\nThe user appears to request human intervention. Give a brief helpful response and provide this exact handoff: ${getHumanHandoffMessage()}`
    : '';

  const systemContent = `${systemPrompt}\n\nUse this internal knowledge base as primary context:\n${knowledgeBase}${websiteContext ? `\n\nWebsite context:\n${websiteContext}` : ''}${escalation}`;

  const cohereMessages = [
    { role: 'system', content: systemContent },
    ...messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: extractMessageText(m),
      }))
      .filter((m) => m.content.length > 0),
  ];

  const res = await fetch('https://api.cohere.com/v2/chat', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },
    body: JSON.stringify({
      model: 'command-r-plus-08-2024',
      messages: cohereMessages,
      temperature: 0.4,
      max_tokens: 600,
    }),
  });

  if (!res.ok) throw new Error(`Cohere API ${res.status}`);

  const data = await res.json();
  // v2 response shape: data.message.content[0].text
  const text = (data?.message?.content?.[0]?.text ?? '').toString().trim();

  if (!text) throw new Error('Cohere returned empty response');
  return text;
}

// ── Supabase helpers ──────────────────────────────────────────────────────

async function getOrCreateSession(
  visitorId: string,
  sessionId: string | null,
  firstUserMessage: string,
): Promise<string> {
  // Reuse existing session if provided and it belongs to this visitor
  if (sessionId) {
    const { data } = await supabaseServer
      .from('wiza_public_sessions')
      .select('id')
      .eq('id', sessionId)
      .eq('visitor_id', visitorId)
      .single();
    if (data) return data.id;
  }

  // Create new session — title = first 60 chars of first user message
  const title = firstUserMessage.slice(0, 60) || 'New conversation';
  const { data, error } = await supabaseServer
    .from('wiza_public_sessions')
    .insert({ visitor_id: visitorId, title })
    .select('id')
    .single();

  if (error || !data) throw new Error('Failed to create session');
  return data.id;
}

async function saveMessages(
  sessionId: string,
  userContent: string,
  assistantContent: string,
) {
  await supabaseServer.from('wiza_public_messages').insert([
    { session_id: sessionId, role: 'user',      content: userContent },
    { session_id: sessionId, role: 'assistant', content: assistantContent },
  ]);

  // Bump updated_at + message_count
  await supabaseServer.rpc('increment_message_count', { sid: sessionId });
}

// ── Main handler ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    const safeMessages: UIMessage[] = Array.isArray(body.messages) ? body.messages : [];
    const visitorId:  string        = body.visitor_id  ?? crypto.randomUUID();
    const sessionId:  string | null = body.session_id  ?? null;

    const latestUserQuery = extractLatestUserMessage(safeMessages);

    // ── Resolve reply ─────────────────────────────────────────────────────
    let reply: string;

    if (needsHumanIntervention(latestUserQuery)) {
      reply = getHumanHandoffMessage();
    } else {
      const apiKey = process.env.COHERE_API_KEY ?? '';
      reply = apiKey
        ? await getCohereReply(safeMessages, apiKey)
        : await getFallbackReply(latestUserQuery);
    }

    // ── Persist to Supabase ───────────────────────────────────────────────
    let resolvedSessionId = sessionId;
    try {
      resolvedSessionId = await getOrCreateSession(visitorId, sessionId, latestUserQuery);
      await saveMessages(resolvedSessionId, latestUserQuery, reply);
    } catch (dbErr) {
      // Non-fatal — chat still works even if persistence fails
      console.error('[wiza/chat] Supabase error', dbErr);
    }

    // ── Stream response ───────────────────────────────────────────────────
    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        const textId = 'assistant-text';
        writer.write({ type: 'start' });
        writer.write({ type: 'text-start', id: textId });
        writer.write({ type: 'text-delta', id: textId, delta: reply });
        writer.write({ type: 'text-end',   id: textId });
        writer.write({ type: 'finish' });
      },
    });

    const response = createUIMessageStreamResponse({ stream });

    // Pass session info back so the client can persist it
    response.headers.set('X-Session-Id',  resolvedSessionId ?? '');
    response.headers.set('X-Visitor-Id',  visitorId);

    return response;
  } catch (err) {
    console.error('Wiza chat error', err);
    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        const id = 'err';
        writer.write({ type: 'start' });
        writer.write({ type: 'text-start', id });
        writer.write({ type: 'text-delta', id, delta: `Sorry, something went wrong. Please contact ${SUPPORT_EMAIL}` });
        writer.write({ type: 'text-end',   id });
        writer.write({ type: 'finish' });
      },
    });
    return createUIMessageStreamResponse({ stream });
  }
}

// ── Session management endpoints ──────────────────────────────────────────

/** GET /api/chat?visitor_id=xxx — list all sessions for a visitor */
export async function GET(req: NextRequest): Promise<Response> {
  const visitorId = req.nextUrl.searchParams.get('visitor_id');
  if (!visitorId) return Response.json({ sessions: [] });

  const { data } = await supabaseServer
    .from('wiza_public_sessions')
    .select('id, title, message_count, created_at, updated_at')
    .eq('visitor_id', visitorId)
    .order('updated_at', { ascending: false })
    .limit(50);

  return Response.json({ sessions: data ?? [] });
}

/** DELETE /api/chat?session_id=xxx&visitor_id=xxx — delete one session */
export async function DELETE(req: NextRequest): Promise<Response> {
  const sessionId = req.nextUrl.searchParams.get('session_id');
  const visitorId = req.nextUrl.searchParams.get('visitor_id');
  if (!sessionId || !visitorId) return Response.json({ error: 'Missing params' }, { status: 400 });

  const { error } = await supabaseServer
    .from('wiza_public_sessions')
    .delete()
    .eq('id', sessionId)
    .eq('visitor_id', visitorId);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ deleted: true });
}