import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";

export async function registerUser(formData: any) {
    const { email, password, name, role, company, designation, profession } = formData;

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: user, error: useError } = await supabase
        .from("users")
        .insert([{ name, email, password: hashedPassword, role }])
        .select()
        .single();

    if (useError) {
        throw new Error(useError.message);
    }

    if (role === "employer") {
        await supabase.from("employers").insert([
            { user_id: user.id, company, designation },
        ]);
    } else if (role === "employees") {
        await supabase.from("professionals").insert([
            { user_id: user.id, profession, designation },
        ]);
    }

    return user;
}