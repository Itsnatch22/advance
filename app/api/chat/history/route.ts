import { NextRequest } from 'next/server';
import { supabaseServer } from '@/lib/supabase/supabase-server';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getUuidString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return UUID_PATTERN.test(trimmed) ? trimmed : null;
}

export async function GET(req: NextRequest): Promise<Response> {
  const sessionId = getUuidString(req.nextUrl.searchParams.get('session_id'));
  const visitorId = getUuidString(req.nextUrl.searchParams.get('visitor_id'));

  if (!sessionId || !visitorId) {
    return Response.json({ error: 'Missing params' }, { status: 400 });
  }

  const { data: session } = await supabaseServer
    .from('wiza_public_sessions')
    .select('id')
    .eq('id', sessionId)
    .eq('visitor_id', visitorId)
    .single();

  if (!session) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  const { data: messages } = await supabaseServer
    .from('wiza_public_messages')
    .select('id, role, content, created_at')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  return Response.json({ messages: messages ?? [] });
}
