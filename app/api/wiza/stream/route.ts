import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createUIMessageStream, createUIMessageStreamResponse } from 'ai';
import { streamWizaReply, buildSystemPrompt } from '@/lib/ai/gemini';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const HISTORY_LIMIT = 20; // last N messages fed to Gemini

function extractLatestUserMessage(messages: unknown): string {
  if (!Array.isArray(messages)) return '';
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i] as { role?: string; parts?: Array<{ type?: string; text?: string }> };
    if (message?.role !== 'user') continue;
    if (!Array.isArray(message.parts)) continue;
    return message.parts
      .filter(part => part?.type === 'text' && typeof part.text === 'string')
      .map(part => part.text)
      .join(' ')
      .trim();
  }
  return '';
}

export async function POST(req: NextRequest) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.error('[wiza/stream] GOOGLE_GENERATIVE_AI_API_KEY is not configured');
    return new Response('AI service is not configured', { status: 503 });
  }

  const authHeader = req.headers.get('Authorization');
  let employeeId: string | null = null;
  let isAuthenticated = false;

  if (authHeader?.startsWith('Bearer ')) {
    const userClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user } } = await userClient.auth.getUser();
    if (user) {
      employeeId = user.id;
      isAuthenticated = true;
    }
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch (error) {
    console.error('JSON parse error:', error);
    return new Response(`Invalid JSON: ${error}`, { status: 400 });
  }

  const incomingSessionId = body.session_id as string | null;
  const content = typeof body.content === 'string' && body.content.trim()
    ? body.content.trim()
    : extractLatestUserMessage(body.messages).trim();

  if (!content) {
    return new Response('content is required', { status: 400 });
  }

  let systemPrompt: string;

  if (isAuthenticated && employeeId) {
    const { data: profile } = await supabase
      .from('employee_onboarding')
      .select('first_name, last_name, financial_health_score, country_code')
      .eq('id', employeeId)
      .single();

    const { data: payroll } = await supabase
      .from('payroll_records')
      .select('net_pay, earned_wages')
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const { data: bills } = await supabase
      .from('employee_bills')
      .select('label, amount, due_date')
      .eq('employee_id', employeeId)
      .gte('due_date', new Date().toISOString())
      .order('due_date')
      .limit(5);

    const earnedWages = payroll?.earned_wages ?? 0;
    const advanceLimit = Math.floor(earnedWages * 0.6);
    const upcomingBills = (bills ?? []).map(b => ({
      label: b.label,
      amount: b.amount,
      dueInDays: Math.ceil((new Date(b.due_date).getTime() - Date.now()) / 86_400_000),
    }));

    systemPrompt = buildSystemPrompt({
      employeeName: profile
        ? `${profile.first_name} ${profile.last_name}`
        : 'there',
      earnedWages,
      advanceLimit,
      upcomingBills,
      financialScore: profile?.financial_health_score ?? 75,
      countryCode: profile?.country_code ?? 'KE',
    });
  } else {
    systemPrompt = buildSystemPrompt({
      employeeName: 'there',
      earnedWages: 0,
      advanceLimit: 0,
      upcomingBills: [],
      financialScore: 0,
      countryCode: 'KE',
      isGuest: true,
    });
  }

  let sessionId = incomingSessionId;

  if (isAuthenticated && employeeId) {
    if (!sessionId) {
      const { data: newSession, error: sessionErr } = await supabase
        .from('wiza_sessions')
        .insert({
          employee_id: employeeId,
          title: content.slice(0, 80),
        })
        .select('id')
        .single();

      if (sessionErr || !newSession) {
        return new Response('Failed to create session', { status: 500 });
      }
      sessionId = newSession.id;
    }

    await supabase.from('wiza_messages').insert({
      session_id: sessionId,
      role: 'user',
      content,
    });
  }

  let geminiHistory: Array<{ role: string; parts: Array<{ text: string }> }> = [];

  if (isAuthenticated && employeeId && sessionId) {
    const { data: history } = await supabase
      .from('wiza_messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(HISTORY_LIMIT);

    geminiHistory = (history ?? [])
      .slice(0, -1)
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));
  }

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      try {
        writer.write({ type: 'start' });
        writer.write({ type: 'text-start', id: 'assistant-text' });

        let fullReply = '';
        for await (const chunk of streamWizaReply(systemPrompt, geminiHistory, content)) {
          fullReply += chunk;
          writer.write({ type: 'text-delta', id: 'assistant-text', delta: chunk });
        }

        writer.write({ type: 'text-end', id: 'assistant-text' });
        writer.write({ type: 'finish' });

        if (isAuthenticated && employeeId && sessionId) {
          await supabase.from('wiza_messages').insert({
            session_id: sessionId,
            role: 'model',
            content: fullReply,
          });

          await supabase
            .from('wiza_sessions')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', sessionId);
        }
      } catch (err) {
        console.error('[wiza/stream] error', err);
        writer.write({ type: 'text-start', id: 'assistant-text' });
        writer.write({ type: 'text-delta', id: 'assistant-text', delta: 'Something went wrong. Please try again.' });
        writer.write({ type: 'text-end', id: 'assistant-text' });
        writer.write({ type: 'finish' });
      }
    },
  });

  const response = createUIMessageStreamResponse({ stream });
  response.headers.set('Content-Type', 'text/event-stream');
  response.headers.set('Cache-Control', 'no-cache, no-transform');
  response.headers.set('Connection', 'keep-alive');
  response.headers.set('X-Accel-Buffering', 'no');

  if (sessionId && isAuthenticated) {
    response.headers.set('X-Session-Id', sessionId);
  }

  return response;
}
