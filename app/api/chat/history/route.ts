// app/api/chat/history/route.ts
// GET /api/chat/history?session_id=xxx&visitor_id=xxx

import { NextRequest } from 'next/server';
import { supabaseServer } from '@/lib/supabase/supabase-server';

export async function GET(req: NextRequest): Promise<Response> {
  const sessionId = req.nextUrl.searchParams.get('session_id');
  const visitorId = req.nextUrl.searchParams.get('visitor_id');

  if (!sessionId || !visitorId) {
    return Response.json({ error: 'Missing params' }, { status: 400 });
  }

  // Verify session belongs to this visitor
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