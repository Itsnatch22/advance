# Employer Dashboard Backend

This backend implementation replaces the mock data in the Employer Dashboard with real API endpoints powered by Supabase.

## Table of Contents

1. [Setup](#setup)
2. [Database Schema](#database-schema)
3. [API Routes](#api-routes)
4. [Authentication](#authentication)
5. [Disbursement](#disbursement)

## Setup

### 1. Migrations

Run the SQL migrations located in `supabase/migrations` against your Supabase instance.

- `20250109000000_init_dashboard.sql` (Schema)
- `20250109000001_rls_policies.sql` (Security)

### 2. Environment Variables

Ensure `.env.local` contains:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET` (if using custom JWT auth)

### 3. Seed Data

Run the seeding script to populate the database with a test company and employees:

```bash
npx tsx scripts/seed_employer_dashboard.ts
```

**Important**: The script will output a `Company ID`. Use this ID to test the API endpoints.

## Database Schema

Tables created:

- `companies`: Company profiles and funding balance.
- `users`: Users linked to companies.
- `employees`: Employee roster with salaries and bank info.
- `advance_requests`: Wage access requests (PENDING -> APPROVED -> DISBURSED).
- `transactions`: Ledger of all money movements.
- `company_settings`: specific config (auto-approval limits).

## API Routes

Base path: `/api/employer/[companyId]`

- `GET /overview`: Dashboard stats and charts.
- `GET /employees`: Employee directory with search.
- `GET /transactions`: Financial history.
- `GET /pending-approvals`: Action items.
- `POST /requests/[requestId]/approve`: Approve and trigger disbursement.
- `POST /requests/[requestId]/reject`: Reject request.
- `GET /payroll`: Cycle info.
- `GET /settings`: Company policies.

## Authentication

APIs are protected using a JWT cookie pattern.

- The `lib/auth.ts` helper `requireCompanyAccess(companyId)` ensures the authenticated user belongs to the requested company.
- RLS policies provide a second layer of defense at the database level.

## Disbursement

Disbursement logic is abstracted in `lib/disburse.ts`.

- Currently uses `MockDisbursementProvider` which logs to console and simulates success.
- To switch to production (e.g., M-Pesa), implement the `DisbursementProvider` interface and update the factory in `lib/disburse.ts`.

## Testing

To verify the full flow:

1. Seed the DB.
2. Log in (or mock session).
3. Call `GET /pending-approvals` to find a request.
4. Call `POST /requests/.../approve`.
5. Verify `GET /overview` stats update (Pending count decreases, Disbursed amount increases).
