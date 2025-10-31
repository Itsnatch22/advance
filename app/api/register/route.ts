// app/api/register/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin"; // ensure this exists and uses service role key

const baseSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["employer", "employee"]),
});

const employerSchema = baseSchema.extend({
  company: z.string().min(2),
  designation: z.string().min(2),
});

const employeeSchema = baseSchema.extend({
  designation: z.string().min(2),
  profession: z.string().min(2),
  employerId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Choose correct schema
    const parsedBase = baseSchema.safeParse(body);
    if (!parsedBase.success) {
      return NextResponse.json({ message: "Invalid base fields", errors: parsedBase.error.flatten() }, { status: 422 });
    }

    const role = parsedBase.data.role;

    const parsed = role === "employer" ? employerSchema.safeParse(body) : employeeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid fields", errors: parsed.error.flatten() }, { status: 422 });
    }

    const { name, email, password } = parsed.data;

    // Check existing user by email
    const { data: existingUser, error: existingError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingError) {
      console.error(existingError);
      return NextResponse.json({ message: "DB error checking user" }, { status: 500 });
    }
    if (existingUser) {
      return NextResponse.json({ message: "Email already registered" }, { status: 409 });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create user
    const { data: userData, error: insertUserErr } = await supabaseAdmin
      .from("users")
      .insert([{ name, email, password_hash, role }])
      .select()
      .single();

    if (insertUserErr) {
      console.error(insertUserErr);
      return NextResponse.json({ message: "Failed creating user" }, { status: 500 });
    }

    const userId = userData.id;

    if (role === "employer") {
      const { company, designation } = parsed.data as z.infer<typeof employerSchema>;
      // create employers row and set owner_user_id
      const { data: empData, error: empErr } = await supabaseAdmin
        .from("employers")
        .insert([{ company, owner_user_id: userId, designation }])
        .select()
        .single();

      if (empErr) {
        console.error(empErr);
        return NextResponse.json({ message: "Failed creating employer record" }, { status: 500 });
      }

      return NextResponse.json({ ok: true, role: "employer", user: userData, employer: empData }, { status: 201 });
    } else {
      // employee
      const { designation, profession, employerId } = parsed.data as z.infer<typeof employeeSchema>;

      // verify employer exists
      const { data: employerRow, error: empFindErr } = await supabaseAdmin
        .from("employers")
        .select("id, company")
        .eq("id", employerId)
        .maybeSingle();

      if (empFindErr) {
        console.error(empFindErr);
        return NextResponse.json({ message: "DB error checking employer" }, { status: 500 });
      }
      if (!employerRow) {
        return NextResponse.json({ message: "Selected employer not found" }, { status: 404 });
      }

      const { data: employeeRow, error: employeeInsertErr } = await supabaseAdmin
        .from("employees")
        .insert([{ user_id: userId, employer_id: employerId, profession, designation }])
        .select()
        .single();

      if (employeeInsertErr) {
        console.error(employeeInsertErr);
        return NextResponse.json({ message: "Failed creating employee record" }, { status: 500 });
      }

      return NextResponse.json({ ok: true, role: "employee", user: userData, employee: employeeRow }, { status: 201 });
    }
  } catch (err: any) {
    console.error("Register route error:", err);
    return NextResponse.json({ message: err?.message ?? "Server error" }, { status: 500 });
  }
}
