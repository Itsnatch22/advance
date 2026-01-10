-- Migration: 20250109000001_rls_policies.sql
-- Description: Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's company_id from public.users
-- Assumes auth.uid() matches public.users.id
CREATE OR REPLACE FUNCTION get_my_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM public.users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER;

-- 1. COMPANIES
-- Users can view their own company
CREATE POLICY "Users can view their own company"
ON companies FOR SELECT
USING (id = get_my_company_id());

-- 2. USERS
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = id);

-- Admins/Employers can view other users in their company
CREATE POLICY "Company admins can view company users"
ON users FOR SELECT
USING (company_id = get_my_company_id());

-- 3. EMPLOYEES
-- Users can view employees of their company
CREATE POLICY "View company employees"
ON employees FOR SELECT
USING (company_id = get_my_company_id());

-- 4. ADVANCE REQUESTS
-- Employees can view their own requests
CREATE POLICY "Employees view own requests"
ON advance_requests FOR SELECT
USING (auth.uid() = (SELECT user_id FROM employees WHERE id = advance_requests.employee_id));

-- Employers can view all requests in their company
CREATE POLICY "Employers view company requests"
ON advance_requests FOR SELECT
USING (company_id = get_my_company_id());

-- Employers can update status of requests in their company
CREATE POLICY "Employers update company requests"
ON advance_requests FOR UPDATE
USING (company_id = get_my_company_id());

-- 5. TRANSACTIONS
-- View transactions for own company
CREATE POLICY "View company transactions"
ON transactions FOR SELECT
USING (company_id = get_my_company_id());

-- 6. PAYROLL CYCLES
-- View company payroll cycles
CREATE POLICY "View company payroll cycles"
ON payroll_cycles FOR SELECT
USING (company_id = get_my_company_id());

-- 7. SETTINGS
-- View company settings
CREATE POLICY "View company settings"
ON company_settings FOR SELECT
USING (company_id = get_my_company_id());

-- Update company settings (Admins/Employers only)
CREATE POLICY "Update company settings"
ON company_settings FOR UPDATE
USING (company_id = get_my_company_id());

-- 8. PENDING TASKS
-- View tasks for company
CREATE POLICY "View company pending tasks"
ON pending_tasks FOR SELECT
USING (company_id = get_my_company_id());

-- 9. AUDIT LOGS
-- detailed access might be restricted to super-admins, but for now allow viewing own company logs
CREATE POLICY "View company audit logs"
ON audit_logs FOR SELECT
USING (company_id = get_my_company_id());
