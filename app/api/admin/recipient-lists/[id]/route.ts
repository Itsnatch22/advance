import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getAuthenticatedAdmin, requireAdminWrite } from '@/lib/admin/campaigns';
import { sendSuccess, sendError } from '@/lib/utils/response';

const updateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  emails: z.array(z.string().email()).optional(),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedAdmin(request);
  if ('error' in auth) return sendError(auth.error, auth.status);
  const { admin } = auth;
  const { id } = await params;

  try {
    const { data: list, error } = await admin.from('recipient_lists').select('*').eq('id', id).single();
    if (error || !list) return sendError('List not found', 404);
    const { data: members } = await admin.from('recipient_list_members').select('*').eq('list_id', id).order('created_at', { ascending: true });
    return sendSuccess({ list, members });
  } catch (err) {
    console.error('[admin/recipient-lists/[id]][GET] error:', err);
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
    if (parsed.data.description !== undefined) updates.description = parsed.data.description;

    const { data: updated, error } = await admin.from('recipient_lists').update(updates).eq('id', id).select().single();
    if (error) throw error;

    if (parsed.data.emails) {
      // Replace members: delete existing then insert new
      await admin.from('recipient_list_members').delete().eq('list_id', id);
      const members = parsed.data.emails.map((e: string) => ({ list_id: id, email: e }));
      if (members.length > 0) await admin.from('recipient_list_members').insert(members);
    }

    // Fire-and-forget audit log
    try {
      const { logAdminAction } = await import('@/lib/admin/audit');
      logAdminAction(user.id, 'recipient_list.update', {
        objectType: 'recipient_list',
        objectId: id,
        meta: { updates: Object.keys(updates), emailsReplaced: !!parsed.data.emails },
      });
    } catch (e) {
      console.warn('[admin/recipient-lists/[id]][PATCH] audit log failed', String(e));
    }

    return sendSuccess({ list: updated });
  } catch (err) {
    console.error('[admin/recipient-lists/[id]][PATCH] error:', err);
    return sendError('Internal error', 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminWrite(request);
  if ('error' in auth) return sendError(auth.error, auth.status);
  const { admin, user } = auth;
  const { id } = await params;

  try {
    const { error } = await admin.from('recipient_lists').delete().eq('id', id);
    if (error) throw error;

    // Fire-and-forget audit log
    try {
      const { logAdminAction } = await import('@/lib/admin/audit');
      logAdminAction(user.id, 'recipient_list.delete', {
        objectType: 'recipient_list',
        objectId: id,
      });
    } catch (e) {
      console.warn('[admin/recipient-lists/[id]][DELETE] audit log failed', String(e));
    }

    return new Response(null, { status: 204 });
  } catch (err) {
    console.error('[admin/recipient-lists/[id]][DELETE] error:', err);
    return sendError('Internal error', 500);
  }
}
