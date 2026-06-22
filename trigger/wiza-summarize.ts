import { task, logger } from '@trigger.dev/sdk/v3';
import { createClient } from '@supabase/supabase-js';
import { generateSummary } from '@/lib/ai/gemini';
import type { SummarizeJobPayload } from '@/types/wiza';


const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export const summarizeWizaSession = task({
  id: 'summarize-wiza-session',
  maxDuration: 120, 

  run: async (payload: SummarizeJobPayload) => {
    const { session_id, employee_id, send_to_email, send_to_phone } = payload;

    logger.info('Starting Wiza summary', { session_id, employee_id });

    
    let messages = null;
    let attempts = 0;
    const maxAttempts = 6;
    
    while (attempts < maxAttempts) {
      const { data: msgs, error } = await supabase
        .from('wiza_messages')
        .select('role, content, created_at')
        .eq('session_id', session_id)
        .order('created_at', { ascending: true });
      
      if (!error && msgs) {
        const hasUserMessage = msgs.some(m => m.role === 'user');
        const hasModelMessage = msgs.some(m => m.role === 'model');
        
        if (hasUserMessage && hasModelMessage) {
          messages = msgs;
          logger.info('Found both user and model messages', { messageCount: messages.length, attempts: attempts + 1 });
          break;
        }
      }
      
      attempts++;
      if (attempts < maxAttempts) {
        const delay = Math.pow(2, attempts) * 1000; 
        logger.info('Waiting for messages, polling again...', { attempt: attempts, delay, maxAttempts });
        await wait(delay);
      }
    }
    
    if (!messages) {
      throw new Error(`No complete conversation found for session ${session_id} after ${maxAttempts} attempts`);
    }

    const transcript = messages
      .map(m => `${m.role === 'user' ? 'Employee' : 'Wiza'}: ${m.content}`)
      .join('\n\n');

    logger.info('Calling Gemini for summary', { messageCount: messages.length });
    const summary = await generateSummary(transcript);
    logger.info('Summary generated', { charCount: summary.length });

    const { error: updateError } = await supabase
      .from('wiza_sessions')
      .update({ summary, summary_sent: true })
      .eq('id', session_id);

    if (updateError) throw new Error('Failed to save summary');

    if (send_to_email) {
      logger.info('Sending summary email', { to: send_to_email });

      await fetch('https:
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

    if (send_to_phone) {
      logger.info('Sending summary SMS', { to: send_to_phone });

      const smsText = `Wiza summary:\n${summary.slice(0, 280)}${summary.length > 280 ? '…' : ''}`;

      const atParams = new URLSearchParams({
        username: process.env.AT_USERNAME!,
        to:       send_to_phone,
        message:  smsText,
      });
      
      
      if (process.env.AT_SENDER_ID) {
        atParams.set('from', process.env.AT_SENDER_ID);
      }
      
      
      if (!process.env.AT_USERNAME || !process.env.AT_API_KEY) {
        logger.warn('Africa\'s Talking credentials missing, skipping SMS', { 
          hasUsername: !!process.env.AT_USERNAME,
          hasApiKey: !!process.env.AT_API_KEY,
          hasSenderId: !!process.env.AT_SENDER_ID
        });
      } else {
        await fetch('https:
          method:  'POST',
          headers: {
            apiKey:         process.env.AT_API_KEY!,
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept:         'application/json',
          },
          body: atParams,
        });
      }
    }

    logger.info('Wiza summary job complete', { session_id });
    return { session_id, summary_length: summary.length };
  },
});