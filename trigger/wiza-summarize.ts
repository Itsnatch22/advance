// trigger/wiza-summarize.ts
// Background job: fetch transcript → Gemini summary → save + notify

import { task, logger } from '@trigger.dev/sdk/v3';
import { createClient } from '@supabase/supabase-js';
import { generateSummary } from '@/lib/gemini';
import type { SummarizeJobPayload } from '@/types/wiza';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export const summarizeWizaSession = task({
  id: 'summarize-wiza-session',
  maxDuration: 120, // seconds

  run: async (payload: SummarizeJobPayload) => {
    const { session_id, employee_id, send_to_email, send_to_phone } = payload;

    logger.info('Starting Wiza summary', { session_id, employee_id });

    // ── 1. Load all messages ──────────────────────────────────────────────
    const { data: messages, error } = await supabase
      .from('wiza_messages')
      .select('role, content, created_at')
      .eq('session_id', session_id)
      .order('created_at', { ascending: true });

    if (error || !messages?.length) {
      throw new Error(`No messages found for session ${session_id}`);
    }

    // ── 2. Build plain-text transcript ────────────────────────────────────
    const transcript = messages
      .map(m => `${m.role === 'user' ? 'Employee' : 'Wiza'}: ${m.content}`)
      .join('\n\n');

    // ── 3. Generate summary via Gemini ────────────────────────────────────
    logger.info('Calling Gemini for summary', { messageCount: messages.length });
    const summary = await generateSummary(transcript);
    logger.info('Summary generated', { charCount: summary.length });

    // ── 4. Persist summary + mark sent ───────────────────────────────────
    const { error: updateError } = await supabase
      .from('wiza_sessions')
      .update({ summary, summary_sent: true })
      .eq('id', session_id);

    if (updateError) throw new Error('Failed to save summary');

    // ── 5. Send email if opted in ─────────────────────────────────────────
    if (send_to_email) {
      logger.info('Sending summary email', { to: send_to_email });

      // Using Supabase Edge Function or your preferred email provider.
      // Example with Resend (swap for your provider):
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from:    'Wiza <wiza@eaziwage.com>',
          to:      send_to_email,
          subject: 'Your Wiza session summary',
          html: `
            <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
              <h2 style="color: #0f172a;">Your Wiza conversation summary</h2>
              <p style="color: #475569;">Here's a recap of what Wiza advised in your recent session:</p>
              <div style="background: #f8fafc; border-left: 3px solid #10b981; padding: 16px 20px; border-radius: 4px; white-space: pre-line; color: #1e293b;">
${summary}
              </div>
              <p style="color: #94a3b8; font-size: 13px; margin-top: 24px;">
                Wiza — EaziWage financial wellness coach<br/>
                To update your notification preferences, visit the EaziWage app settings.
              </p>
            </div>
          `,
        }),
      });
    }

    // ── 6. Send SMS if opted in ───────────────────────────────────────────
    if (send_to_phone) {
      logger.info('Sending summary SMS', { to: send_to_phone });

      // Truncate summary to ~300 chars for SMS
      const smsText = `Wiza summary:\n${summary.slice(0, 280)}${summary.length > 280 ? '…' : ''}`;

      // Example with Africa's Talking (common in East Africa):
      const atParams = new URLSearchParams({
        username: process.env.AT_USERNAME!,
        to:       send_to_phone,
        message:  smsText,
        from:     process.env.AT_SENDER_ID ?? '',
      });

      await fetch('https://api.africastalking.com/version1/messaging', {
        method:  'POST',
        headers: {
          apiKey:         process.env.AT_API_KEY!,
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept:         'application/json',
        },
        body: atParams,
      });
    }

    logger.info('Wiza summary job complete', { session_id });
    return { session_id, summary_length: summary.length };
  },
});