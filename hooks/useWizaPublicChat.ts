// hooks/useWizaPublicChat.ts
// Manages visitor identity, session list, history loading, and delete.
// No auth required — visitor_id is a UUID stored in localStorage.

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

export interface PublicSession {
  id:            string;
  title:         string;
  message_count: number;
  created_at:    string;
  updated_at:    string;
}

// ── Visitor ID — create once, persist forever ─────────────────────────────
function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return '';
  const key = 'wiza_visitor_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export function useWizaPublicChat() {
  const [visitorId,      setVisitorId]      = useState<string>('');
  const [sessionId,      setSessionId]      = useState<string | null>(null);
  const [sessions,       setSessions]       = useState<PublicSession[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyLoaded,  setHistoryLoaded]  = useState(false);

  // Track current session so we can send it with each message
  const sessionIdRef = useRef<string | null>(null);
  sessionIdRef.current = sessionId;

  // ── AI SDK useChat — keep all existing transport logic intact ─────────
  const chat = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      // Inject visitor_id + session_id into every request body
      body: () => ({
        visitor_id: visitorId,
        session_id: sessionIdRef.current,
      }),
      // Read session_id back from response headers
      onResponse: (res: { headers: { get: (arg0: string) => any; }; }) => {
        const sid = res.headers.get('X-Session-Id');
        const vid = res.headers.get('X-Visitor-Id');
        if (sid && sid !== sessionIdRef.current) {
          setSessionId(sid);
          sessionIdRef.current = sid;
          // Refresh session list so new session appears in sidebar
          if (vid) fetchSessions(vid);
        }
      },
    } as any),
    messages: [
      {
        id:    'welcome',
        role:  'assistant',
        parts: [{ type: 'text', text: "Hi! I'm Wiza, your EaziWage AI assistant. How can I help you today?" }],
      } as any,
    ],
  });

  // ── Init visitor ID on mount ─────────────────────────────────────────
  useEffect(() => {
    const vid = getOrCreateVisitorId();
    setVisitorId(vid);
    fetchSessions(vid);
  }, []);

  // ── Fetch session list ───────────────────────────────────────────────
  const fetchSessions = useCallback(async (vid?: string) => {
    const id = vid ?? visitorId;
    if (!id) return;
    try {
      const res  = await fetch(`/api/chat?visitor_id=${id}`);
      const data = await res.json();
      setSessions(data.sessions ?? []);
    } catch { /* silent */ }
  }, [visitorId]);

  // ── Load a past session's messages ──────────────────────────────────
  const loadSession = useCallback(async (sid: string) => {
    setLoadingHistory(true);
    setHistoryLoaded(false);
    try {
      const res  = await fetch(`/api/chat/history?session_id=${sid}&visitor_id=${visitorId}`);
      const data = await res.json();

      const loaded = [
        {
          id:    'welcome',
          role:  'assistant',
          parts: [{ type: 'text', text: "Hi! I'm Wiza, your EaziWage AI assistant. How can I help you today?" }],
        } as any,
        ...(data.messages ?? []).map((m: { id: string; role: string; content: string }) => ({
          id:    m.id,
          role:  m.role,
          parts: [{ type: 'text', text: m.content }],
        })),
      ];

      chat.setMessages(loaded);
      setSessionId(sid);
      setHistoryLoaded(true);
    } catch { /* silent */ } finally {
      setLoadingHistory(false);
    }
  }, [visitorId, chat]);

  // ── Delete a session ─────────────────────────────────────────────────
  const deleteSession = useCallback(async (sid: string) => {
    await fetch(`/api/chat?session_id=${sid}&visitor_id=${visitorId}`, { method: 'DELETE' });
    setSessions(prev => prev.filter(s => s.id !== sid));

    // If deleting the active session, start fresh
    if (sid === sessionId) {
      startNewSession();
    }
  }, [sessionId, visitorId]);

  // ── Start a brand-new conversation ──────────────────────────────────
  const startNewSession = useCallback(() => {
    setSessionId(null);
    sessionIdRef.current = null;
    setHistoryLoaded(false);
    chat.setMessages([
      {
        id:    'welcome',
        role:  'assistant',
        parts: [{ type: 'text', text: "Hi! I'm Wiza, your EaziWage AI assistant. How can I help you today?" }],
      } as any,
    ]);
  }, [chat]);

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