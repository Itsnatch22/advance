import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Minimal Resend webhook handler — updates email_campaign_logs by provider_message_id
// Expected event shapes vary; this handler handles common message.* events.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET; // optional

function verifySignature(rawBody: string, header: string | null, secret: string) {
  if (!header) return false;
  try {
    // Resend signs payload with HMAC-SHA256 using the secret, header contains signature in hex
    const sig = header;
    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(sig, 'hex'));
  } catch (e) {
    console.warn('Failed to verify resend signature', e);
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const rawBody = await request.text();
  // optional: X-Resend-Signature header or similar
  const sigHeader = request.headers.get('x-resend-signature') || request.headers.get('resend-signature') || null;
  if (RESEND_WEBHOOK_SECRET) {
    if (!verifySignature(rawBody, sigHeader, RESEND_WEBHOOK_SECRET)) {
      console.warn('Resend webhook signature verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Support array or single event
  const events = Array.isArray(payload) ? payload : [payload];

  for (const ev of events) {
    try {
      const type: string = ev.type || ev.event || ev.name || '';
      const data = ev.data ?? ev;
      // Provider message id — common field name is id
      const providerId = data?.id ?? data?.message?.id ?? data?.message_id ?? null;
      const recipient = (data?.recipient?.email ?? data?.to?.[0]?.email ?? data?.email ?? null) as string | null;

      if (!providerId) {
        console.warn('Resend webhook event missing provider id', { ev });
        continue;
      }

      let update: Record<string, any> = {};
      if (type.includes('bounced') || type.includes('bounce')) {
        update.delivery_status = 'bounced';
        update.error_message = data?.reason ?? data?.bounce?.reason ?? JSON.stringify(data).slice(0, 1000);
      } else if (type.includes('delivered')) {
        update.delivery_status = 'sent';
        update.sent_at = new Date().toISOString();
      } else if (type.includes('failed') || type.includes('permanent')) {
        update.delivery_status = 'failed';
        update.error_message = data?.reason ?? JSON.stringify(data).slice(0, 1000);
      } else if (type.includes('opened') || type.includes('clicked')) {
        // ignore for now — could be used to track opens/clicks later
        continue;
      } else {
        // Unhandled event type — continue
        continue;
      }

      // Update rows matching provider_message_id
      const { error: updateErr } = await supabase
        .from('email_campaign_logs')
        .update(update)
        .eq('provider_message_id', providerId);

      if (updateErr) {
        console.error('Failed updating email_campaign_logs for provider id', providerId, updateErr);
      }
    } catch (e) {
      console.error('Error processing resend webhook event', e);
      continue;
    }
  }

  return NextResponse.json({ received: true });
}
