// lib/db/schema.ts

// This file contains the SQL for creating the database tables.
// It is not executed directly by the application, but serves as a reference
// for the database schema. It can be used to set up the database initially.

export const schema = `

-- ROLES
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('employer', 'employee');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'company_join_status') THEN
        CREATE TYPE company_join_status AS ENUM ('joined', 'pending');
    END IF;
END$$;


-- COMPANIES TABLE
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    size INTEGER NOT NULL,
    domain VARCHAR(255) NOT NULL UNIQUE,
    created_by UUID REFERENCES auth.users(id),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    role user_role NOT NULL,
    email VARCHAR(255) UNIQUE,
    company_id UUID REFERENCES companies(id),
    company_join_status company_join_status,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- EMPLOYEE INVITES TABLE
CREATE TABLE IF NOT EXISTS employee_invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    company_id UUID NOT NULL REFERENCES companies(id),
    invite_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(email, company_id)
);

`;
