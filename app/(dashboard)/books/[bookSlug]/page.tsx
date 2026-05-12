import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/require-user";
import { getBookBySlug } from "@/lib/content/get-book";
import { canAccessBook } from "@/lib/permissions/can-access-book";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { createClient } from "@/lib/supabase/server";

interface BookPageProps {
  params: Promise<{ bookSlug: string }>;
}

export default async function BookPage({ params }: BookPageProps) {
  const user = await requireUser();
  const { bookSlug } = await params;

  const book = await getBookBySlug(bookSlug);
  if (!book) notFound();

  const allowed = await canAccessBook(user.id, book.id);
  if (!allowed) redirect("/forbidden");

  const profile = await getCurrentProfile(user.id);
  const visibleChapters = profile?.role === "admin" ? book.chapters : book.chapters.filter((chapter) => chapter.isPublished);

  const supabase = await createClient();
  const chapterIds = visibleChapters.map((chapter) => chapter.id);
  const { data: progressRows } =
    chapterIds.length > 0
      ? await supabase
          .from("reading_progress")
          .select("chapter_id, progress_percent, is_completed, updated_at")
          .eq("user_id", profile?.id ?? "")
          .in("chapter_id", chapterIds)
      : { data: [] as Array<{ chapter_id: string; progress_percent: number; is_completed: boolean; updated_at: string }> };

  const progressMap = new Map(
    (progressRows ?? []).map((row) => [
      row.chapter_id,
      {
        percent: Number(row.progress_percent ?? 0),
        isCompleted: Boolean(row.is_completed),
        updatedAt: row.updated_at,
      },
    ]),
  );

  const firstInProgress = visibleChapters.find((chapter) => {
    const p = progressMap.get(chapter.id);
    return p && !p.isCompleted && p.percent > 0;
  });
  const firstUnread = visibleChapters.find((chapter) => !progressMap.has(chapter.id));
  const continueChapter = firstInProgress ?? firstUnread ?? visibleChapters[0];

  return (
    <section className="space-y-6">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-[var(--text-main)]">{book.title}</h1>
        <p className="max-w-prose text-sm text-[var(--text-soft)]">{book.description || "Sin descripcion"}</p>
        {continueChapter ? (
          <Link href={`/books/${book.slug}/chapters/${continueChapter.slug}`} className="inline-flex rounded-full bg-[var(--text-main)] px-4 py-2 text-sm font-medium text-[var(--paper)]">
            Continuar en: {continueChapter.title}
          </Link>
        ) : null}
      </header>

      <div className="rounded-3xl border border-[var(--line)] bg-[var(--app-surface)]/90">
        <ul className="divide-y divide-[var(--line)]">
          {visibleChapters.map((chapter) => {
            const progress = progressMap.get(chapter.id);
            const isCompleted = progress?.isCompleted ?? false;
            const isInProgress = !isCompleted && (progress?.percent ?? 0) > 0;
            const label = isCompleted ? "Completado" : isInProgress ? "En curso" : "Pendiente";

            return (
              <li key={chapter.id} className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="text-sm font-medium text-[var(--text-main)]">
                    {chapter.orderIndex}. {chapter.title}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <span>{chapter.estimatedReadingMinutes ?? 1} min</span>
                    <span>•</span>
                    <span className={isCompleted ? "text-[var(--success)]" : isInProgress ? "text-[var(--accent-dark)]" : ""}>{label}</span>
                  </div>
                </div>
                <Link
                  href={`/books/${book.slug}/chapters/${chapter.slug}`}
                  className="rounded-full border border-[var(--line)] bg-white/85 px-3 py-2 text-xs font-medium text-[var(--text-main)]"
                >
                  {isCompleted ? "Releer" : isInProgress ? "Continuar" : "Leer"}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
