import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { getAuthenticatedAdmin, requireAdminWrite } from '@/lib/admin/campaigns';
import { sendSuccess, sendError } from '@/lib/utils/response';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const updateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  html_content: z.string().optional(),
  plain_text_content: z.string().optional(),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedAdmin(request);
  if ('error' in auth) return sendError(auth.error, auth.status);
  const { admin } = auth;
  const { id } = await params;

  try {
    const { data: template, error } = await admin.from('email_templates').select('*').eq('id', id).single();
    if (error || !template) return sendError('Template not found', 404);
    return sendSuccess({ template });
  } catch (err) {
    console.error('[admin/templates/[id]][GET] error:', err);
    return sendError('Internal error', 500);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminWrite(request);
  if ('error' in auth) return sendError(auth.error, auth.status);
  const { admin, user } = auth;
  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return sendError('Validation failed', 400, { issues: parsed.error.issues });

    const updates: Record<string, unknown> = {};
    if (parsed.data.name !== undefined) updates.name = parsed.data.name;
    if (parsed.data.html_content !== undefined) updates.html_content = parsed.data.html_content;
    if (parsed.data.plain_text_content !== undefined) updates.plain_text_content = parsed.data.plain_text_content;

    const { data: updated, error } = await admin.from('email_templates').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return sendSuccess({ template: updated });
  } catch (err) {
    console.error('[admin/templates/[id]][PATCH] error:', err);
    return sendError('Internal error', 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminWrite(request);
  if ('error' in auth) return sendError(auth.error, auth.status);
  const { admin } = auth;
  const { id } = await params;

  try {
    const { error } = await admin.from('email_templates').delete().eq('id', id);
    if (error) throw error;
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error('[admin/templates/[id][DELETE] error:', err);
    return sendError('Internal error', 500);
  }
}
