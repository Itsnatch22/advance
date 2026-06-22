import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createUIMessageStream, createUIMessageStreamResponse } from 'ai';
import { streamWizaReply, buildSystemPrompt } from '@/lib/ai/gemini';
import type { CountryCode } from '@/lib/currency/currency';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const HISTORY_LIMIT = 20;

function extractLatestUserMessage(messages: unknown): string {
  if (!Array.isArray(messages)) return '';
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i] as {
      role?: string;
      parts?: Array<{ type?: string; text?: string }>;
    };
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

  // ── Auth ────────────────────────────────────────────────────────────────────
  const authHeader = req.headers.get('Authorization');
  let employeeAuthId: string | null = null;
  let isAuthenticated = false;

  if (authHeader?.startsWith('Bearer ')) {
    const userClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user } } = await userClient.auth.getUser();
    if (user) {
      employeeAuthId = user.id;
      isAuthenticated = true;
    }
  }

  // ── Parse body ──────────────────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch (error) {
    console.error('[wiza/stream] JSON parse error:', error);
    return new Response(`Invalid JSON: ${error}`, { status: 400 });
  }

  const incomingSessionId = body.session_id as string | null;
  const content =
    typeof body.content === 'string' && body.content.trim()
      ? body.content.trim()
      : extractLatestUserMessage(body.messages).trim();

  if (!content) {
    return new Response('content is required', { status: 400 });
  }

  // ── Build system prompt ─────────────────────────────────────────────────────
  let systemPrompt: string;

  if (isAuthenticated && employeeAuthId) {
    // 1. Live employee record — keyed by user_id, only approved employees get data
    const { data: employee, error: employeeErr } = await supabase
      .from('employees')
      .select('id, full_name, monthly_salary, earned_wages, advance_limit, country, employer_id, kyc_status')
      .eq('user_id', employeeAuthId)
      .single();

    if (employeeErr || !employee) {
      // User exists in auth but not yet in employees (pending onboarding) — serve guest prompt
      systemPrompt = buildSystemPrompt({
        employeeName: 'there',
        earnedWages: 0,
        advanceLimit: 0,
        dailyRate: 0,
        daysElapsed: 0,
        paydayDate: null,
        upcomingAdvances: [],
        budgetCategories: null,
        financialScore: 0,
        countryCode: 'KE',
        isGuest: true,
      });
} else if (employee.kyc_status !== 'approved') {
      // KYC not approved — serve guest prompt, never expose financial data
      systemPrompt = buildSystemPrompt({
        employeeName: employee.full_name ?? 'there',
        earnedWages: 0,
        advanceLimit: 0,
        dailyRate: 0,
        daysElapsed: 0,
        paydayDate: null,
        upcomingAdvances: [],
        budgetCategories: null,
        financialScore: 0,
        countryCode: (employee.country ?? 'KE') as CountryCode,
        isGuest: true,
        pendingKyc: true,
      });
    } else {
       // 2. Current earnings snapshot — single source of truth for earned wages & daily rate
      const { data: snapshot } = await supabase
        .from('earnings_snapshots')
        .select(
          'earned_to_date, remaining_withdrawable, daily_rate, days_elapsed, payday_date, ' +
          'withdrawable_amount, withdrawn_this_month, current_salary, pay_period_start, pay_period_end',
        )
        .eq('employee_id', employee.id)
        .eq('is_current', true)
        .single();

      // 3. Recent advances (last 3 months) — gives Wiza context on spending behaviour
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const { data: recentAdvances } = await supabase
        .from('advances')
        .select('amount, net_amount, fee_amount, status, requested_at, currency')
        .eq('employee_id', employee.id)
        .gte('requested_at', threeMonthsAgo.toISOString())
        .order('requested_at', { ascending: false })
        .limit(5);

      // 4. User budget (optional — may not exist yet)
      const { data: budget } = await supabase
        .from('user_budgets')
        .select('monthly_income, categories')
        .eq('user_id', employeeAuthId)
        .single();

      // Resolve earned wages: prefer live snapshot, fall back to employees column
      const earnedWages   = (snapshot as { remaining_withdrawable?: number })?.remaining_withdrawable ?? employee.earned_wages ?? 0;
      // Resolve advance limit: use employees column — it reflects employer-specific overrides
      const advanceLimit  = employee.advance_limit ?? 0;
      const dailyRate     = (snapshot as { daily_rate?: number })?.daily_rate ?? 0;
      const daysElapsed   = (snapshot as { days_elapsed?: number })?.days_elapsed ?? 0;
      const paydayDate    = (snapshot as { payday_date?: string })?.payday_date ?? null;

      systemPrompt = buildSystemPrompt({
        employeeName:      employee.full_name,
        earnedWages,
        advanceLimit,
        dailyRate,
        daysElapsed,
        paydayDate,
        upcomingAdvances:  recentAdvances ?? [],
        budgetCategories:  budget?.categories ?? null,
        financialScore:    0, // extend when a score column is added
        countryCode:       (employee.country ?? 'KE') as CountryCode,
        isGuest:           false,
      });
    }
  } else {
    systemPrompt = buildSystemPrompt({
      employeeName:     'there',
      earnedWages:      0,
      advanceLimit:     0,
      dailyRate:        0,
      daysElapsed:      0,
      paydayDate:       null,
      upcomingAdvances: [],
      budgetCategories: null,
      financialScore:   0,
      countryCode:      'KE',
      isGuest:          true,
    });
  }

  // ── Session handling ────────────────────────────────────────────────────────
  let sessionId = incomingSessionId;

  if (isAuthenticated && employeeAuthId) {
    if (!sessionId) {
      const { data: newSession, error: sessionErr } = await supabase
        .from('wiza_sessions')
        .insert({
          employee_id: employeeAuthId,
          title: content.slice(0, 80),
        })
        .select('id')
        .single();

      if (sessionErr || !newSession) {
        console.error('[wiza/stream] Failed to create session:', sessionErr);
        return new Response('Failed to create session', { status: 500 });
      }
      sessionId = newSession.id;
    }

    await supabase.from('wiza_messages').insert({
      session_id: sessionId,
      role:       'user',
      content,
    });
  }

  // ── Conversation history ────────────────────────────────────────────────────
  let geminiHistory: Array<{ role: string; parts: Array<{ text: string }> }> = [];

  if (isAuthenticated && employeeAuthId && sessionId) {
    const { data: history } = await supabase
      .from('wiza_messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(HISTORY_LIMIT);

    geminiHistory = (history ?? [])
      .slice(0, -1) // exclude the message we just inserted
      .map(m => ({
        role:  m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));
  }

  // ── Stream ──────────────────────────────────────────────────────────────────
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

        if (isAuthenticated && employeeAuthId && sessionId) {
          await supabase.from('wiza_messages').insert({
            session_id: sessionId,
            role:       'model',
            content:    fullReply,
          });

          await supabase
            .from('wiza_sessions')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', sessionId);
        }
      } catch (err) {
        console.error('[wiza/stream] streaming error:', err);
        writer.write({ type: 'text-start',  id: 'assistant-text' });
        writer.write({ type: 'text-delta',  id: 'assistant-text', delta: 'Something went wrong. Please try again.' });
        writer.write({ type: 'text-end',    id: 'assistant-text' });
        writer.write({ type: 'finish' });
      }
    },
  });

  const response = createUIMessageStreamResponse({ stream });
  response.headers.set('Content-Type',      'text/event-stream');
  response.headers.set('Cache-Control',     'no-cache, no-transform');
  response.headers.set('Connection',        'keep-alive');
  response.headers.set('X-Accel-Buffering', 'no');

  if (sessionId && isAuthenticated) {
    response.headers.set('X-Session-Id', sessionId);
  }

  return response;
}