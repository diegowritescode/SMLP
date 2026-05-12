import { createClient } from "@/lib/supabase/server";

export async function canAccessBook(userId: string, bookId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("user_id", userId)
    .maybeSingle();

  if (!profile) return false;
  if (profile.role === "admin") return true;

  const { data: book } = await supabase.from("books").select("is_published").eq("id", bookId).maybeSingle();
  if (!book || !book.is_published) return false;

  const nowIso = new Date().toISOString();
  const { data: grant } = await supabase
    .from("access_grants")
    .select("id")
    .eq("user_id", profile.id)
    .eq("book_id", bookId)
    .lte("starts_at", nowIso)
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
    .maybeSingle();

  return Boolean(grant);
}
