import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getAuthenticatedAdmin } from '@/lib/admin/campaigns';
import { sendSuccess, sendError } from '@/lib/utils/response';

const createSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  emails: z.array(z.string().email()).optional(),
});

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedAdmin(request);
  if ('error' in auth) return sendError(auth.error, auth.status);
  const { admin } = auth;

  try {
    const { data: lists, error } = await admin.from('recipient_lists').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return sendSuccess({ lists });
  } catch (err) {
    console.error('[admin/recipient-lists][GET] error:', err);
    return sendError('Internal error', 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedAdmin(request);
  if ('error' in auth) return sendError(auth.error, auth.status);
  const { admin, user } = auth;

  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return sendError('Validation failed', 400, { issues: parsed.error.issues });

    const { name, description, emails } = parsed.data;

    const { data: list, error } = await admin.from('recipient_lists').insert({ name, description: description ?? null, created_by: user.id }).select().single();
    if (error) throw error;

    if (emails && emails.length > 0) {
      const members = emails.map((e: string) => ({ list_id: list.id, email: e }));
      await admin.from('recipient_list_members').insert(members);
    }

    return sendSuccess({ list }, 201);
  } catch (err) {
    console.error('[admin/recipient-lists][POST] error:', err);
    return sendError('Internal error', 500);
  }
}
