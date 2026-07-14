import { NextRequest } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/admin/campaigns';
import { sendSuccess, sendError } from '@/lib/utils/response';

export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedAdmin(request);
  if ('error' in auth) return sendError(auth.error, auth.status);
  const { admin } = auth;

  try {
    // Recompute counts per supported country and upsert into coverage_countries
    const codes = ['KE','UG','TZ','RW'];
    const updates: Array<{ code: string; count: number }>= [];
    for (const code of codes) {
      const { count, error } = await admin
        .from('employees')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'Active')
        .eq('country', code);
      if (error) throw error;
      updates.push({ code, count: count ?? 0 });
    }

    // Upsert into coverage_countries
    for (const u of updates) {
      const { error } = await admin.from('coverage_countries').upsert({ code: u.code, name: u.code, last_count: u.count, updated_at: new Date().toISOString() }, { onConflict: 'code' });
      if (error) console.error('Failed upserting coverage_countries', error);
    }

    return sendSuccess({ updated: updates });
  } catch (err) {
    console.error('[admin/coverage/update] error:', err);
    return sendError('Internal error', 500);
  }
}
