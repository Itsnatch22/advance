CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS wiza_public_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visitor_id UUID NOT NULL,
    title TEXT NOT NULL DEFAULT 'New conversation',
    message_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wiza_public_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES wiza_public_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wiza_public_sessions_visitor_updated
ON wiza_public_sessions(visitor_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_wiza_public_messages_session_created
ON wiza_public_messages(session_id, created_at);

CREATE OR REPLACE FUNCTION increment_message_count(sid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE wiza_public_sessions
  SET
    message_count = message_count + 2,
    updated_at = NOW()
  WHERE id = sid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER TABLE wiza_public_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wiza_public_messages ENABLE ROW LEVEL SECURITY;
