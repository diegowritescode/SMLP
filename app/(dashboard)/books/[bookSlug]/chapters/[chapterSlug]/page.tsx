import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/require-user";
import { getChapterBySlugs } from "@/lib/content/get-chapter";
import { canAccessChapter } from "@/lib/permissions/can-access-chapter";
import { updateProgress } from "@/lib/progress/update-progress";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { extractHeadings } from "@/lib/content/parse-markdown";
import { TableOfContents } from "@/components/reader/table-of-contents";
import { ReaderSettings } from "@/components/reader/reader-settings";
import { ReadingProgressBar } from "@/components/reader/reading-progress-bar";
import { MarkdownReader } from "@/components/reader/markdown-reader";
import { FeedbackBanner } from "@/components/ui/feedback-banner";
import { ChapterVisitTracker } from "@/components/reader/chapter-visit-tracker";

interface ChapterPageProps {
  params: Promise<{ bookSlug: string; chapterSlug: string }>;
  searchParams: Promise<{ ok?: string; error?: string }>;
}

function errorMessage(error: unknown) {
  if (error instanceof Error) return encodeURIComponent(error.message);
  return encodeURIComponent("Unexpected error");
}

async function markCompleted(formData: FormData) {
  "use server";

  const user = await requireUser();
  const bookSlug = String(formData.get("bookSlug") || "");
  const chapterSlug = String(formData.get("chapterSlug") || "");
  const bookId = String(formData.get("bookId") || "");
  const chapterId = String(formData.get("chapterId") || "");
  if (!bookId || !chapterId || !bookSlug || !chapterSlug) {
    redirect(`/books/${bookSlug}/chapters/${chapterSlug}?error=Missing%20chapter%20payload`);
  }

  let actionError: unknown;
  try {
    await updateProgress({
      userId: user.id,
      bookId,
      chapterId,
      progressPercent: 100,
      isCompleted: true,
    });
  } catch (error) {
    actionError = error;
  }

  if (actionError) {
    redirect(`/books/${bookSlug}/chapters/${chapterSlug}?error=${errorMessage(actionError)}`);
  }

  redirect(`/books/${bookSlug}/chapters/${chapterSlug}?ok=completed`);
}

async function completeAndGoNext(formData: FormData) {
  "use server";

  const user = await requireUser();
  const bookSlug = String(formData.get("bookSlug") || "");
  const chapterSlug = String(formData.get("chapterSlug") || "");
  const nextChapterSlug = String(formData.get("nextChapterSlug") || "");
  const bookId = String(formData.get("bookId") || "");
  const chapterId = String(formData.get("chapterId") || "");

  if (!bookSlug || !chapterSlug || !nextChapterSlug || !bookId || !chapterId) {
    redirect(`/books/${bookSlug}/chapters/${chapterSlug}?error=Missing%20navigation%20payload`);
  }

  let actionError: unknown;
  try {
    await updateProgress({
      userId: user.id,
      bookId,
      chapterId,
      progressPercent: 100,
      isCompleted: true,
    });
  } catch (error) {
    actionError = error;
  }

  if (actionError) {
    redirect(`/books/${bookSlug}/chapters/${chapterSlug}?error=${errorMessage(actionError)}`);
  }

  redirect(`/books/${bookSlug}/chapters/${nextChapterSlug}?ok=auto_completed_previous`);
}

export default async function ChapterPage({ params, searchParams }: ChapterPageProps) {
  const user = await requireUser();
  const profile = await getCurrentProfile(user.id);
  const { bookSlug, chapterSlug } = await params;
  const query = await searchParams;

  const chapter = await getChapterBySlugs(bookSlug, chapterSlug, {
    includeUnpublished: profile?.role === "admin",
  });

  if (!chapter) notFound();

  const allowed = await canAccessChapter(user.id, chapter.id);
  if (!allowed) redirect("/forbidden");

  const headings = extractHeadings(chapter.markdown);
  const supabase = await createClient();
  const { data: progress } = await supabase
    .from("reading_progress")
    .select("is_completed")
    .eq("user_id", profile?.id ?? "")
    .eq("chapter_id", chapter.id)
    .maybeSingle();

  const isCompleted = Boolean(progress?.is_completed);

  return (
    <section className="relative space-y-6">
      <ChapterVisitTracker bookId={chapter.bookId} chapterId={chapter.id} />
      <ReadingProgressBar completed={isCompleted} />

      <header className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-900 to-zinc-700 p-6 text-zinc-100 dark:border-zinc-700">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-300">{chapter.bookTitle}</p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight">{chapter.chapterTitle}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-300">
          <span>Tiempo estimado: {chapter.estimatedReadingMinutes ?? 1} min</span>
          <span>•</span>
          <span>{isCompleted ? "Completado" : "En progreso"}</span>
        </div>
      </header>

      {query.ok ? <FeedbackBanner type="success" message="Progreso actualizado correctamente." /> : null}
      {query.error ? <FeedbackBanner type="error" message={decodeURIComponent(query.error)} /> : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <MarkdownReader markdown={chapter.markdown} containerId="reader-content" />

          {!isCompleted ? (
            <form action={markCompleted} className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-950/50">
              <input type="hidden" name="bookSlug" value={chapter.bookSlug} />
              <input type="hidden" name="chapterSlug" value={chapter.chapterSlug} />
              <input type="hidden" name="bookId" value={chapter.bookId} />
              <input type="hidden" name="chapterId" value={chapter.id} />
              <button type="submit" className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                Marcar capitulo como completado
              </button>
            </form>
          ) : (
            <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
              Capitulo completado.
            </div>
          )}

          <nav className="mt-8 flex items-center justify-between gap-3">
            {chapter.previousChapterSlug ? (
              <Link
                href={`/books/${chapter.bookSlug}/chapters/${chapter.previousChapterSlug}`}
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-200"
              >
                Capitulo anterior
              </Link>
            ) : (
              <span />
            )}

            {chapter.nextChapterSlug ? (
              <form action={completeAndGoNext}>
                <input type="hidden" name="bookSlug" value={chapter.bookSlug} />
                <input type="hidden" name="chapterSlug" value={chapter.chapterSlug} />
                <input type="hidden" name="nextChapterSlug" value={chapter.nextChapterSlug} />
                <input type="hidden" name="bookId" value={chapter.bookId} />
                <input type="hidden" name="chapterId" value={chapter.id} />
                <button type="submit" className="rounded-md bg-zinc-900 px-3 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900">
                  Siguiente capitulo
                </button>
              </form>
            ) : (
              <Link
                href={`/books/${chapter.bookSlug}`}
                className="rounded-md bg-zinc-900 px-3 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
              >
                Volver al libro
              </Link>
            )}
          </nav>
        </article>

        <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          <ReaderSettings containerId="reader-content" />
          <TableOfContents headings={headings} />
        </aside>
      </div>
    </section>
  );
}
