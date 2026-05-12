import { createClient } from "@/lib/supabase/server";

interface UpdateProgressInput {
  userId: string;
  bookId: string;
  chapterId: string;
  progressPercent: number;
  isCompleted?: boolean;
}

export async function updateProgress(input: UpdateProgressInput) {
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("id").eq("user_id", input.userId).maybeSingle();
  if (!profile) {
    throw new Error("Profile not found");
  }

  const now = new Date().toISOString();
  const percent = Math.max(0, Math.min(100, Math.round(input.progressPercent)));

  const { error } = await supabase.from("reading_progress").upsert(
    {
      user_id: profile.id,
      book_id: input.bookId,
      chapter_id: input.chapterId,
      progress_percent: percent,
      is_completed: Boolean(input.isCompleted) || percent >= 100,
      completed_at: Boolean(input.isCompleted) || percent >= 100 ? now : null,
      updated_at: now,
    },
    { onConflict: "user_id,chapter_id" },
  );

  if (error) {
    throw new Error(error.message);
  }
}
