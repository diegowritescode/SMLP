import { createClient } from "@/lib/supabase/server";
import { canAccessBook } from "@/lib/permissions/can-access-book";

export async function canAccessChapter(userId: string, chapterId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data: chapter } = await supabase
    .from("chapters")
    .select("id, book_id, is_published")
    .eq("id", chapterId)
    .maybeSingle();

  if (!chapter) return false;

  const bookAccess = await canAccessBook(userId, chapter.book_id);
  if (!bookAccess) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle();

  if (profile?.role === "admin") return true;
  return chapter.is_published;
}
