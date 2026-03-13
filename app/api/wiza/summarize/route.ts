// app/api/wiza/summarize/route.ts
// POST { session_id } — triggers the Trigger.dev background job to
// generate + optionally email/SMS a conversation summary.

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { tasks } from '@trigger.dev/sdk';
import type { summarizeWizaSession } from '@/trigger/wiza-summarize';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  // Auth
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { session_id } = await req.json();
  if (!session_id) {
    return NextResponse.json({ error: 'session_id required' }, { status: 400 });
  }

  // Confirm the session belongs to this user
  const { data: session } = await supabase
    .from('wiza_sessions')
    .select('id, employee_id, summary_sent')
    .eq('id', session_id)
    .eq('employee_id', user.id)
    .single();

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  if (session.summary_sent) {
    return NextResponse.json({ message: 'Summary already sent' });
  }

  // Load notification preferences
  const { data: prefs } = await supabase
    .from('employee_onboarding')
    .select('email, phone, notify_summary_email, notify_summary_sms')
    .eq('id', user.id)
    .single();

  // Dispatch Trigger.dev job
  await tasks.trigger<typeof summarizeWizaSession>('summarize-wiza-session', {
    session_id,
    employee_id: user.id,
    send_to_email: prefs?.notify_summary_email ? (prefs.email ?? null) : null,
    send_to_phone: prefs?.notify_summary_sms   ? (prefs.phone ?? null) : null,
  });

  return NextResponse.json({ message: 'Summary job queued' });
}