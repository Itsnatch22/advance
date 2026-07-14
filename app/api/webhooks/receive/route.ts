import { NextRequest } from 'next/server';
import { sendSuccess, sendError } from '@/lib/utils/response';

// Import provider-specific webhook handlers
import * as resendHandler from '@/app/api/webhooks/resend/route';
import * as calendlyHandler from '@/app/api/webhooks/route';

/**
 * Generic webhook receiver that dispatches to provider-specific handlers
 * based on headers present. This provides a single URL that can be used
 * for multiple providers (if desired) and acts as a simple router.
 */
export async function POST(req: NextRequest) {
  try {
    const h = req.headers;

    // Priority: Resend signature header
    if (h.get('x-resend-signature') || h.get('resend-signature')) {
      // Delegate to resend handler
      // @ts-ignore
      return await resendHandler.POST(req as any);
    }

    // Calendly signature header
    if (h.get('calendly-webhook-signature')) {
      // Delegate to Calendly handler
      // @ts-ignore
      return await calendlyHandler.POST(req as any);
    }

    // Unknown provider: attempt to parse body and do a minimal acknowledgement
    const raw = await req.text();
    try {
      JSON.parse(raw);
    } catch (e) {
      return sendError('Invalid JSON payload', 400);
    }

    // For unknown providers, just ack — provider-specific handlers should be
    // registered here if needed for custom processing.
    return sendSuccess({ received: true });
  } catch (err) {
    console.error('[webhooks/receive] unexpected error', err);
    return sendError('Internal server error', 500);
  }
}
