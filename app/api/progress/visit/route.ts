import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getCurrentProfile(user.id);
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 400 });
  }

  const body = (await request.json().catch(() => null)) as
    | { bookId?: string; chapterId?: string; progressPercent?: number }
    | null;

  const bookId = body?.bookId?.trim() ?? "";
  const chapterId = body?.chapterId?.trim() ?? "";
  const incomingPercent = Math.max(1, Math.min(95, Math.round(body?.progressPercent ?? 20)));

  if (!bookId || !chapterId) {
    return NextResponse.json({ error: "Missing bookId/chapterId" }, { status: 400 });
  }

  const { data: existing, error: selectError } = await supabase
    .from("reading_progress")
    .select("progress_percent, is_completed")
    .eq("user_id", profile.id)
    .eq("chapter_id", chapterId)
    .maybeSingle();

  if (selectError) {
    return NextResponse.json({ error: selectError.message }, { status: 500 });
  }

  const existingPercent = Number(existing?.progress_percent ?? 0);
  const percent = existing?.is_completed ? 100 : Math.max(existingPercent, incomingPercent);

  const { error: upsertError } = await supabase.from("reading_progress").upsert(
    {
      user_id: profile.id,
      book_id: bookId,
      chapter_id: chapterId,
      progress_percent: percent,
      is_completed: Boolean(existing?.is_completed),
      completed_at: existing?.is_completed ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,chapter_id" },
  );

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
