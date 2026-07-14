import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getAuthenticatedAdmin } from '@/lib/admin/campaigns';
import { sendSuccess, sendError } from '@/lib/utils/response';
import { sanitizeCampaignHtml, interpolate, buildCampaignEmailHtml } from '@/lib/campaigns/utils';

const schema = z.object({
  id: z.string().uuid().optional(),
  template_key: z.string().optional(),
  variables: z.record(z.string(), z.string()).optional(),
});

export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedAdmin(request);
  if ('error' in auth) return sendError(auth.error, auth.status);
  const { admin } = auth;

  try {
    const body = await request.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    if (!parsed.success) return sendError('Validation failed', 400, { issues: parsed.error.issues });

    const { id, template_key, variables } = parsed.data;
    if (!id && !template_key) return sendError('id or template_key required', 400);

    const q = id ? admin.from('email_templates').select('*').eq('id', id).limit(1).single() : admin.from('email_templates').select('*').eq('template_key', template_key).limit(1).single();
    const { data: template, error } = await q;
    if (error || !template) return sendError('Template not found', 404);

    // sanitize stored HTML and interpolate with provided variables (supports {{full_name}})
    const sanitized = sanitizeCampaignHtml(template.html_content || '');
    const fullName = (variables && (variables.full_name || variables.name)) ?? null;
    const personalized = interpolate(sanitized, fullName as string | null | undefined);

    // Build full email shell so preview matches sent email
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://eaziwage.com';
    const unsubscribeUrl = `${appUrl}/unsubscribe`; // preview only
    const html = buildCampaignEmailHtml(personalized, template.name || 'Preview', unsubscribeUrl, appUrl);

    return sendSuccess({ html });
  } catch (err) {
    console.error('[admin/templates/preview][POST] error:', err);
    return sendError('Internal error', 500);
  }
}
