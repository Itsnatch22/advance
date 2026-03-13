// hooks/useWizaChat.ts
// Manages SSE connection, message state, and session lifecycle.
// Works in both guest mode (no auth) and authenticated mode.

import { useState, useCallback, useRef } from 'react';
import type { StreamEvent } from '@/types/wiza';
import { supabaseUser } from '@/lib/supabase/server';

export interface ChatMessage {
  id:      string;
  role:    'user' | 'model';
  content: string;
  pending: boolean; // true while the AI chunk is still streaming in
}

export function useWizaChat() {
  const [messages,   setMessages]   = useState<ChatMessage[]>([]);
  const [sessionId,  setSessionId]  = useState<string | null>(null);
  const [streaming,  setStreaming]  = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const supabase = supabaseUser;

  // ── Send a message ──────────────────────────────────────────────────────
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || streaming) return;

    setError(null);
    setStreaming(true);

    // Optimistically add the user bubble
    const userMsg: ChatMessage = {
      id:      crypto.randomUUID(),
      role:    'user',
      content: content.trim(),
      pending: false,
    };

    // Add a pending AI bubble
    const aiPlaceholderId = crypto.randomUUID();
    const aiPlaceholder: ChatMessage = {
      id:      aiPlaceholderId,
      role:    'model',
      content: '',
      pending: true,
    };

    setMessages(prev => [...prev, userMsg, aiPlaceholder]);

    // Grab auth token (optional — works in guest mode without it)
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    abortRef.current = new AbortController();

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/wiza/stream', {
        method:  'POST',
        headers,
        body:   JSON.stringify({ session_id: sessionId, content: content.trim() }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let   buffer  = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // SSE lines are separated by \n\n
        const parts = buffer.split('\n\n');
        buffer = parts.pop() ?? '';

        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith('data:')) continue;

          const raw = line.slice(5).trim();
          let event: StreamEvent;
          try { event = JSON.parse(raw); } catch { continue; }

          switch (event.type) {
            case 'session_id':
              setSessionId(event.session_id);
              break;

            case 'chunk':
              setMessages(prev =>
                prev.map(m =>
                  m.id === aiPlaceholderId
                    ? { ...m, content: m.content + event.text }
                    : m,
                ),
              );
              break;

            case 'done':
              setMessages(prev =>
                prev.map(m =>
                  m.id === aiPlaceholderId ? { ...m, pending: false } : m,
                ),
              );
              break;

            case 'error':
              setError(event.message);
              setMessages(prev => prev.filter(m => m.id !== aiPlaceholderId));
              break;
          }
        }
      }
    } catch (err: unknown) {
      if ((err as Error).name !== 'AbortError') {
        setError('Connection lost. Please try again.');
        setMessages(prev => prev.filter(m => m.id !== aiPlaceholderId));
      }
    } finally {
      setStreaming(false);
    }
  }, [sessionId, streaming, supabase]);

  // ── Request summary ─────────────────────────────────────────────────────
  // Authenticated: dispatches Trigger.dev background job (email/SMS delivery)
  // Guest: sends message history to the API, injects summary into chat
  const requestSummary = useCallback(async (): Promise<string> => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    // ── Authenticated path ────────────────────────────────────────────────
    if (token && sessionId) {
      const res = await fetch('/api/wiza/summarize', {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify({ session_id: sessionId }),
      });
      const json = await res.json();
      return json.message ?? 'Summary request sent.';
    }

    // ── Guest path: summarise from in-memory messages ─────────────────────
    const completedMessages = messages.filter(m => !m.pending);
    if (!completedMessages.length) return 'Nothing to summarise yet.';

    try {
      const res = await fetch('/api/wiza/summarize', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        // No Authorization header — route detects guest mode
        body: JSON.stringify({
          messages: completedMessages.map(m => ({
            role:    m.role,
            content: m.content,
          })),
        }),
      });

      const json = await res.json();

      if (json.summary) {
        // Inject the summary as a Wiza message so it's visible in the chat
        setMessages(prev => [
          ...prev,
          {
            id:      crypto.randomUUID(),
            role:    'model',
            content: `📋 **Session Summary**\n\n${json.summary}`,
            pending: false,
          },
        ]);
        return 'Summary ready!';
      }

      return json.error ?? 'Could not generate summary.';
    } catch {
      return 'Failed to generate summary. Please try again.';
    }
  }, [sessionId, messages, supabase]);

  // ── Start fresh session ──────────────────────────────────────────────────
  const newSession = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setSessionId(null);
    setError(null);
    setStreaming(false);
  }, []);

  return { messages, sessionId, streaming, error, sendMessage, requestSummary, newSession };
}