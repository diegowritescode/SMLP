import { createClient } from "@/lib/supabase/server";

export interface CurrentProfile {
  id: string;
  role: "admin" | "reader";
}

export async function getCurrentProfile(userId: string): Promise<CurrentProfile | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("id, role").eq("user_id", userId).maybeSingle();

  if (!data) return null;
  if (data.role !== "admin" && data.role !== "reader") return null;

  return {
    id: data.id,
    role: data.role,
  };
}
