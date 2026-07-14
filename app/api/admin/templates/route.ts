import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { createRouteHandlerClient } from '@/lib/supabase/route-handler';
import { getAuthenticatedAdmin, requireAdminWrite } from '@/lib/admin/campaigns';
import { sendSuccess, sendError } from '@/lib/utils/response';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const createSchema = z.object({
  template_key: z.string().max(80),
  name: z.string().min(1).max(200),
  html_content: z.string().min(1),
  plain_text_content: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedAdmin(request);
  if ('error' in auth) return sendError(auth.error, auth.status);
  const { admin } = auth;

  try {
    const { data: templates, error } = await admin.from('email_templates').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return sendSuccess({ templates });
  } catch (err) {
    console.error('[admin/templates][GET] error:', err);
    return sendError('Internal error', 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminWrite(request);
  if ('error' in auth) return sendError(auth.error, auth.status);
  const { admin, user } = auth;

  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return sendError('Validation failed', 400, { issues: parsed.error.issues });

    const { template_key, name, html_content, plain_text_content } = parsed.data;
    const { data: template, error } = await admin.from('email_templates').insert({ template_key, name, html_content, plain_text_content: plain_text_content ?? null, created_by: user.id }).select().single();
    if (error) throw error;
    return sendSuccess({ template }, 201);
  } catch (err) {
    console.error('[admin/templates][POST] error:', err);
    return sendError('Internal error', 500);
  }
}
