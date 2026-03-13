// app/api/wiza/stream/route.ts
// SSE endpoint: POST { session_id, content }
// → creates/reuses session, saves user message, streams Gemini reply,
//   saves completed AI message, returns session_id on first event.

import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { streamWizaReply, buildSystemPrompt } from '@/lib/gemini';
import type { WizaMessage, StreamEvent } from '@/types/wiza';
import type { Content } from '@google/generative-ai';

// Service-role client — bypasses RLS for server writes
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const HISTORY_LIMIT = 20; // last N messages fed to Gemini

export async function POST(req: NextRequest) {
  // ── 1. Auth (Optional for preview) ────────────────────────────────────────
  const authHeader = req.headers.get('Authorization');
  let employeeId: string | null = null;

  if (authHeader?.startsWith('Bearer ')) {
    // Verify JWT with Supabase auth helper
    const userClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user } } = await userClient.auth.getUser();
    if (user) employeeId = user.id;
  }

  // ── 2. Parse body ──────────────────────────────────────────────────────────
  const body = await req.json();
  const { session_id: incomingSessionId, content } = body as {
    session_id: string | null;
    content: string;
  };

  if (!content?.trim()) {
    return new Response('content is required', { status: 400 });
  }

  // ── 3. Load employee context for system prompt ─────────────────────────────
  let systemPrompt: string;

  if (employeeId) {
    const { data: profile } = await supabase
      .from('employee_onboarding')
      .select('first_name, last_name, financial_health_score')
      .eq('id', employeeId)
      .single();

    // Earned wages — read from latest payroll record
    const { data: payroll } = await supabase
      .from('payroll_records')
      .select('net_pay, earned_wages')
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Upcoming bills
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
      dueInDays: Math.ceil(
        (new Date(b.due_date).getTime() - Date.now()) / 86_400_000,
      ),
    }));

    systemPrompt = buildSystemPrompt({
      employeeName: profile
        ? `${profile.first_name} ${profile.last_name}`
        : 'there',
      earnedWages,
      advanceLimit,
      upcomingBills,
      financialScore: profile?.financial_health_score ?? 75,
    });
  } else {
    // Guest mode defaults
    systemPrompt = buildSystemPrompt({
      employeeName: 'there',
      earnedWages: 50000,
      advanceLimit: 30000,
      upcomingBills: [
        { label: 'Rent', amount: 15000, dueInDays: 5 },
        { label: 'Electricity', amount: 2000, dueInDays: 12 },
      ],
      financialScore: 82,
    });
  }

  // ── 4. Get or create session ────────────────────────────────────────────────
  let sessionId = incomingSessionId;

  if (employeeId) {
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

    // ── 5. Save user message ─────────────────────────────────────────────────
    await supabase.from('wiza_messages').insert({
      session_id: sessionId,
      role: 'user',
      content: content.trim(),
    });
  }

  // ── 6. Load conversation history ───────────────────────────────────────────
  let geminiHistory: Content[] = [];

  if (employeeId && sessionId) {
    const { data: history } = await supabase
      .from('wiza_messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(HISTORY_LIMIT);

    // Convert to Gemini Content format (exclude the last user message — sent separately)
    geminiHistory = (history ?? [])
      .slice(0, -1) // all except the message we just inserted
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));
  }

  // ── 7. Stream SSE response ─────────────────────────────────────────────────
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: StreamEvent) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(event)}\n\n`),
        );
      };

      try {
        // First event — tell client which session this is (if any)
        if (sessionId) send({ type: 'session_id', session_id: sessionId! });

        let fullReply = '';

        for await (const chunk of streamWizaReply(
          systemPrompt,
          geminiHistory,
          content.trim(),
        )) {
          fullReply += chunk;
          send({ type: 'chunk', text: chunk });
        }

        // ── 8. Persist completed AI message (if authenticated) ───────────────
        if (employeeId && sessionId) {
          await supabase.from('wiza_messages').insert({
            session_id: sessionId,
            role: 'model',
            content: fullReply,
          });

          // Update session updated_at
          await supabase
            .from('wiza_sessions')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', sessionId);
        }

        send({ type: 'done' });
      } catch (err) {
        console.error('[wiza/stream] error', err);
        send({ type: 'error', message: 'Something went wrong. Please try again.' });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection:      'keep-alive',
      'X-Accel-Buffering': 'no', // disable Nginx proxy buffering
    },
  });
}