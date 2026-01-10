// scripts/seed_employer_dashboard.ts
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seed() {
  console.log("🌱 Starting seed...");

  // 1. Create Company
  const { data: company, error: compError } = await supabase
    .from("companies")
    .insert({
      name: "Acme Corporation",
      domain: "acme.com",
      employee_count: 128,
      funding_balance: 500000.0,
      verified: true,
    })
    .select()
    .single();

  if (compError) throw compError;
  console.log("✅ Created Company:", company.name, company.id);

  // 2. Create Settings
  await supabase.from("company_settings").insert({
    company_id: company.id,
    withdrawal_limit_percent: 0.5,
    auto_approve_enabled: true,
    auto_approve_threshold: 500,
  });

  // 3. Create Admin User (Mock)
  // In real world, this links to auth.users. We just insert into public.users
  const adminId = crypto.randomUUID();
  await supabase.from("users").insert({
    id: adminId,
    email: "admin@acme.com",
    full_name: "Admin User",
    role: "employer",
    company_id: company.id,
  });

  // 4. Create Employees
  const roles = [
    "Software Engineer",
    "Product Manager",
    "Designer",
    "Sales Rep",
    "HR Specialist",
  ];
  const employees = [];

  for (let i = 1; i <= 20; i++) {
    const salary = Math.floor(Math.random() * 50000) + 30000;
    employees.push({
      company_id: company.id,
      employee_identifier: `EW-${String(i).padStart(3, "0")}`,
      name: `Employee ${i}`,
      email: `user${i}@acme.com`,
      role: roles[Math.floor(Math.random() * roles.length)],
      salary: salary,
      status: "Active",
    });
  }

  const { data: insertedEmployees, error: empError } = await supabase
    .from("employees")
    .insert(employees)
    .select();

  if (empError) throw empError;
  console.log(`✅ Created ${insertedEmployees.length} employees`);

  // 5. Create History (Transactions) - Last 3 months
  const transactionTypes = ["DISBURSEMENT", "REPAYMENT"];
  const transactions = [];

  for (const emp of insertedEmployees) {
    // 50% chance of having activity
    if (Math.random() > 0.5) {
      const amount = Math.floor(Math.random() * 5000) + 1000;
      transactions.push({
        company_id: company.id,
        employee_id: emp.id,
        type: "DISBURSEMENT",
        amount: amount,
        created_at: new Date(
          Date.now() - Math.floor(Math.random() * 1000000000)
        ).toISOString(),
        status: "COMPLETED",
        reference: `tx_${Math.random().toString(36).substring(7)}`,
      });
    }
  }

  await supabase.from("transactions").insert(transactions);
  console.log(`✅ Created ${transactions.length} transactions`);

  // 6. Create Pending Requests
  const pendingRequests = [];
  // Pick 3 random employees
  for (let i = 0; i < 3; i++) {
    const emp = insertedEmployees[i];
    pendingRequests.push({
      company_id: company.id,
      employee_id: emp.id,
      amount: Math.floor(Math.random() * 2000) + 500,
      status: "PENDING",
      requested_at: new Date().toISOString(),
    });
  }

  await supabase.from("advance_requests").insert(pendingRequests);
  console.log(`✅ Created ${pendingRequests.length} pending requests`);

  // 7. Create Payroll Cycle
  await supabase.from("payroll_cycles").insert({
    company_id: company.id,
    period_start: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ).toISOString(),
    period_end: new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    ).toISOString(),
    status: "ACTIVE",
  });

  console.log("🎉 Seed complete!");
  console.log("------------------------------------------------");
  console.log("Use this Company ID for API calls:", company.id);
  console.log("Use this User ID for Cookie mocking:", adminId);
  console.log("------------------------------------------------");
}

seed().catch(console.error);
