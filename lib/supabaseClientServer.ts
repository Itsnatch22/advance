import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}
export const supabaseServer = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
});