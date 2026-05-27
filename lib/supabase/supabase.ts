import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables. Check your .env file.");
  if (process.env.NODE_ENV === "production") {
    throw new Error("Missing critical Supabase configuration in production.");
  }
}

export const supabaseUser = createClient(supabaseUrl || "", supabaseKey || "");
export const supabaseAdmin = createClient(supabaseUrl || "", supabaseServiceKey || "");