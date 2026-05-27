'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type ChatTransport, type UIMessage } from 'ai';

export interface PublicSession {
  id:            string;
  title:         string;
  message_count: number;
  created_at:    string;
  updated_at:    string;
}

type PublicChatPart = {
  type: 'text';
  text: string;
};

type PublicChatMessage = {
  id: string;
  role: 'assistant' | 'system' | 'user';
  parts: PublicChatPart[];
  createdAt?: string;
  created_at?: string;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function createWelcomeMessage(createdAt = new Date().toISOString()): PublicChatMessage {
  return {
    id: 'welcome',
    role: 'assistant',
    parts: [{ type: 'text', text: "Hi! I'm Wiza, your EaziWage AI assistant. How can I help you today?" }],
    createdAt,
  };
}

function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return '';
  const key = 'wiza_visitor_id';
  let id = localStorage.getItem(key);
  if (!id || !UUID_PATTERN.test(id)) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export function useWizaWidgetChat() {
  const [visitorId,      setVisitorId]      = useState<string>('');
  const [sessionId,      setSessionId]      = useState<string | null>(null);
  const [sessions,       setSessions]       = useState<PublicSession[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyLoaded,  setHistoryLoaded]  = useState(false);

  // ── fetchSessions — declared FIRST so it can be referenced everywhere ───
  const fetchSessions = useCallback(async (vid?: string) => {
    const id = vid ?? visitorId;
    if (!id) return;
    try {
      const res  = await fetch(`/api/chat?visitor_id=${id}`);
      const data = await res.json();
      setSessions(data.sessions ?? []);
    } catch { /* silent */ }
  }, [visitorId]);

  // Stable container to hold the latest values for the transport's async callbacks
  // This avoids accessing refs during render and keeps the transport identity stable.
  const stateContainer = useMemo(() => ({
    visitorId: '',
    sessionId: null as string | null,
    fetchSessions: (_vid?: string) => { return Promise.resolve(); }
  }), []);

  useEffect(() => {
    stateContainer.visitorId = visitorId;
    stateContainer.sessionId = sessionId;
    stateContainer.fetchSessions = fetchSessions;
  }, [visitorId, sessionId, fetchSessions, stateContainer]);

  // ── Transport — extends DefaultChatTransport to properly parse SSE ──────
  // DefaultChatTransport inherits HttpChatTransport.sendMessages which calls
  // processResponseStream(response.body) → parses JSON SSE → UIMessageChunk.
  // We use `prepareSendMessagesRequest` to inject visitor_id / session_id,
  // and a custom `fetch` wrapper to read X-Session-Id from response headers.
  const transport = useMemo(() => new DefaultChatTransport<UIMessage>({
    api: '/api/chat',

    fetch: async (url, init) => {
      // Ensure a visitor ID exists before the request
      const effectiveVisitorId = stateContainer.visitorId || getOrCreateVisitorId();
      if (effectiveVisitorId !== stateContainer.visitorId) {
        stateContainer.visitorId = effectiveVisitorId;
        setVisitorId(effectiveVisitorId);
      }

      const response = await globalThis.fetch(url as string, init);

      // Extract session info the API sets via response headers
      const sid = response.headers.get('X-Session-Id');
      const vid = response.headers.get('X-Visitor-Id');
      if (sid && sid !== stateContainer.sessionId) {
        setSessionId(sid);
        stateContainer.sessionId = sid;
        if (vid) stateContainer.fetchSessions(vid);
      }

      return response;
    },

    prepareSendMessagesRequest: ({ messages }) => ({
      body: {
        messages,
        visitor_id: stateContainer.visitorId || getOrCreateVisitorId(),
        session_id: stateContainer.sessionId,
      },
    }),
  }), [stateContainer]);

  const chat = useChat({
    transport: transport as ChatTransport<UIMessage>,
    messages: [createWelcomeMessage() as unknown as UIMessage],
  });

  // ── startNewSession — declared BEFORE deleteSession which depends on it ─
  const startNewSession = useCallback(() => {
    setSessionId(null);
    stateContainer.sessionId = null;
    setHistoryLoaded(false);
    chat.setMessages([createWelcomeMessage() as unknown as UIMessage]);
  }, [chat, stateContainer]);

  // ── Initialise visitor ID (runs once on mount) ──────────────────────────
  useEffect(() => {
    const vid = getOrCreateVisitorId();
    stateContainer.visitorId = vid;
    setVisitorId(vid);
    fetchSessions(vid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Session helpers ─────────────────────────────────────────────────────
  const loadSession = useCallback(async (sid: string) => {
    setLoadingHistory(true);
    setHistoryLoaded(false);
    try {
      const res  = await fetch(`/api/chat/history?session_id=${sid}&visitor_id=${visitorId}`);
      const data = await res.json();

      const loaded = [
        createWelcomeMessage(data.messages?.[0]?.created_at ?? new Date().toISOString()),
        ...(data.messages ?? []).map((m: { id: string; role: string; content: string; created_at: string }) => ({
          id:    m.id,
          role:  m.role as 'assistant' | 'system' | 'user',
          parts: [{ type: 'text' as const, text: m.content }],
          createdAt: m.created_at,
        })),
      ];

      chat.setMessages(loaded);
      setSessionId(sid);
      setHistoryLoaded(true);
    } catch { /* silent */ } finally {
      setLoadingHistory(false);
    }
  }, [visitorId, chat]);

  const deleteSession = useCallback(async (sid: string) => {
    await fetch(`/api/chat?session_id=${sid}&visitor_id=${visitorId}`, { method: 'DELETE' });
    setSessions(prev => prev.filter(s => s.id !== sid));

    // If deleting the active session, start fresh
    if (sid === sessionId) {
      startNewSession();
    }
  }, [sessionId, visitorId, startNewSession]);

  const isLoading = chat.status === 'submitted' || chat.status === 'streaming';

  return {
    // Chat
    messages:      chat.messages,
    sendMessage:   chat.sendMessage,
    regenerate:    chat.regenerate,
    setMessages:   chat.setMessages,
    status:        chat.status,
    error:         chat.error,
    isLoading,
    // Session
    sessionId,
    sessions,
    visitorId,
    loadingHistory,
    historyLoaded,
    // Actions
    loadSession,
    deleteSession,
    startNewSession,
    refreshSessions: () => fetchSessions(),
  };
}
