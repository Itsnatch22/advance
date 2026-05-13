import { useState, useCallback, useRef } from 'react';
import type { StreamEvent } from '@/types/wiza';

export interface ChatMessage {
  id:      string;
  role:    'user' | 'model';
  content: string;
  pending: boolean;
  createdAt: string;
}

export function useWizaChat() {
  const [messages,   setMessages]   = useState<ChatMessage[]>([]);
  const [sessionId,  setSessionId]  = useState<string | null>(null);
  const [streaming,  setStreaming]  = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || streaming) return;

    setError(null);
    setStreaming(true);

    const userMsg: ChatMessage = {
      id:      crypto.randomUUID(),
      role:    'user',
      content: content.trim(),
      pending: false,
      createdAt: new Date().toISOString(),
    };

    const aiPlaceholderId = crypto.randomUUID();
    const aiPlaceholder: ChatMessage = {
      id:      aiPlaceholderId,
      role:    'model',
      content: '',
      pending: true,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg, aiPlaceholder]);

    abortRef.current = new AbortController();

    try {
      const res = await fetch('/api/wiza/stream', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
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
  }, [sessionId, streaming]);

  const requestSummary = useCallback(async (): Promise<string> => {
    const completedMessages = messages.filter(m => !m.pending);
    if (!completedMessages.length) return 'Nothing to summarise yet.';

    try {
      const res = await fetch('/api/wiza/summarize', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          messages: completedMessages.map(m => ({
            role:    m.role,
            content: m.content,
          })),
        }),
      });

      const json = await res.json();

      if (json.summary) {
        setMessages(prev => [
          ...prev,
          {
            id:      crypto.randomUUID(),
            role:    'model',
            content: `📋 **Session Summary**\n\n${json.summary}`,
            pending: false,
            createdAt: new Date().toISOString(),
          },
        ]);
        return 'Summary ready!';
      }

      return json.message ?? json.error ?? 'Could not generate summary.';
    } catch {
      return 'Failed to generate summary. Please try again.';
    }
  }, [sessionId, messages]);

  const newSession = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setSessionId(null);
    setError(null);
    setStreaming(false);
  }, []);

  return { messages, sessionId, streaming, error, sendMessage, requestSummary, newSession };
}

