import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { streamWizaReply, buildSystemPrompt } from '@/lib/gemini';
import type { StreamEvent } from '@/types/wiza';
import type { Content } from '@google/generative-ai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const HISTORY_LIMIT = 20; // last N messages fed to Gemini

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

  let body;
  try {
    const text = await req.text();
    console.log('Raw request body:', text);
    body = JSON.parse(text);
    console.log('Parsed body:', body);
  } catch (error) {
    console.error('JSON parse error:', error);
    return new Response(`Invalid JSON: ${error}`, { status: 400 });
  }
  
  const { session_id: incomingSessionId, content } = body as {
    session_id: string | null;
    content: string;
  };

  if (!content?.trim()) {
    return new Response('content is required', { status: 400 });
  }

  let systemPrompt: string;

  if (isAuthenticated && employeeId) {
    const { data: profile } = await supabase
      .from('employee_onboarding')
      .select('first_name, last_name, financial_health_score, country_code')
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
      countryCode: profile?.country_code ?? 'KE',
    });
  } else {
    // Guest user — no personal financial data available.
    // Use a general-purpose prompt so Wiza can coach based on
    // whatever the visitor shares in the conversation.
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

  // ── 4. Get or create session (only if authenticated) ───────────────────────
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
      content: content.trim(),
    });
  }

  let geminiHistory: Content[] = [];

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

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: StreamEvent) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(event)}\n\n`),
        );
      };

      try {
        // First event — tell client which session this is (if authenticated)
        if (sessionId && isAuthenticated) {
          send({ type: 'session_id', session_id: sessionId });
        }

        let fullReply = '';

        for await (const chunk of streamWizaReply(
          systemPrompt,
          geminiHistory,
          content.trim(),
        )) {
          fullReply += chunk;
          send({ type: 'chunk', text: chunk });
        }

        if (isAuthenticated && employeeId && sessionId) {
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