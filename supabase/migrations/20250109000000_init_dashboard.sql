-- Migration: 20250109000000_init_dashboard.sql
-- Description: Initial schema for Employer Dashboard

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Companies Table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    domain TEXT,
    verified BOOLEAN DEFAULT FALSE,
    employee_count INTEGER DEFAULT 0,
    funding_balance DECIMAL(15, 2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'KES',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE companies IS 'Stores registered company profiles and their funding balance.';

-- 2. Users Table (Extends Supabase Auth or Standalone)
-- Note: In a real Supabase app, we might trigger off auth.users. 
-- For this exercise, we maintain a public users table often linked to auth.users.
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY, -- Should match auth.users.id
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    company_id UUID REFERENCES companies(id),
    role VARCHAR(20) CHECK (role IN ('admin', 'employer', 'employee')),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE users IS 'Application users linked to companies. ID should match auth.users ID.';

-- 3. Employees Table
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id),
    user_id UUID REFERENCES users(id), -- Optional link if employee has login access
    employee_identifier TEXT NOT NULL, -- e.g. EW-001
    name TEXT NOT NULL,
    email TEXT,
    role TEXT, -- e.g. "Software Engineer"
    department TEXT,
    salary DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'KES',
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'On Leave', 'Terminated', 'Suspended')),
    bank_account JSONB DEFAULT '{}'::JSONB, -- { "bank_name": "...", "account_number": "..." }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, employee_identifier)
);

COMMENT ON TABLE employees IS 'Employee records belonging to a company. Contains salary info for limits.';

-- 4. Advance Requests
CREATE TABLE IF NOT EXISTS advance_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id),
    company_id UUID NOT NULL REFERENCES companies(id),
    amount DECIMAL(15, 2) NOT NULL,
    fee DECIMAL(15, 2) DEFAULT 0.00,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'DISBURSED', 'PAID_BACK')),
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    disbursed_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    disbursement_reference TEXT, -- External ref from payment provider
    payroll_deduction_date DATE -- When this should be deducted
);

COMMENT ON TABLE advance_requests IS 'Requests for wage availability. Tracks lifecycle from pending to disbursed.';

-- 5. Transactions
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id),
    employee_id UUID REFERENCES employees(id), -- Nullable for company-level funding txns
    type VARCHAR(20) NOT NULL CHECK (type IN ('DISBURSEMENT', 'REPAYMENT', 'FUNDING', 'FEE')),
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'KES',
    reference TEXT, -- Internal or external reference
    status VARCHAR(20) DEFAULT 'COMPLETED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE transactions IS 'Ledger of all money movements: Funding in, Disbursements out, Repayments in.';

-- 6. Payroll Cycles
CREATE TABLE IF NOT EXISTS payroll_cycles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_net DECIMAL(15, 2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'UPCOMING' CHECK (status IN ('UPCOMING', 'ACTIVE', 'PROCESSING', 'COMPLETED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE payroll_cycles IS 'Tracks pay periods to manage deduction dates.';

-- 7. Company Settings
CREATE TABLE IF NOT EXISTS company_settings (
    company_id UUID PRIMARY KEY REFERENCES companies(id),
    withdrawal_limit_percent DECIMAL(5, 2) DEFAULT 0.50, -- 0.50 = 50%
    auto_approve_enabled BOOLEAN DEFAULT FALSE,
    auto_approve_threshold DECIMAL(15, 2) DEFAULT 0.00,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE company_settings IS 'Configuration for business rules per company.';

-- 8. Pending Tasks / Approvals
-- Used for the dashboard "Pending Approvals" list or other admin actions
CREATE TABLE IF NOT EXISTS pending_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id),
    type VARCHAR(50) NOT NULL, -- 'APPROVAL_REQUEST', 'FUNDING_LOW'
    ref_id UUID, -- Links to advance_requests.id typically
    payload JSONB, -- Snapshot of data needed for display
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_to UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'RESOLVED', 'IGNORED'))
);

COMMENT ON TABLE pending_tasks IS 'Queue of items requiring employer attention.';

-- 9. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id),
    actor_id UUID, -- User who performed action
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE audit_logs IS 'Compliance trail for all sensitive actions.';

-- Indices for performance
CREATE INDEX idx_employees_company ON employees(company_id);
CREATE INDEX idx_advance_requests_company ON advance_requests(company_id);
CREATE INDEX idx_advance_requests_status ON advance_requests(status);
CREATE INDEX idx_transactions_company ON transactions(company_id);
CREATE INDEX idx_pending_tasks_company_status ON pending_tasks(company_id, status);
