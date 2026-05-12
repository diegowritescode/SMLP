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
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";

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
    <section className="reader-root relative space-y-4 pb-36 pt-14 md:pt-16">
      <ChapterVisitTracker bookId={chapter.bookId} chapterId={chapter.id} />
      <ReadingProgressBar completed={isCompleted} />

      <div className="reader-controls-top">
        <div className="floating-control pointer-events-auto flex items-center justify-between gap-2 px-3">
          <div className="flex min-w-0 items-center gap-2">
            <Link href={`/books/${chapter.bookSlug}`} className="icon-button-soft" aria-label="Back to book">
              <ChevronLeftIcon className="size-4" />
            </Link>
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-xs text-[var(--text-soft)]">{chapter.bookTitle}</p>
              <p className="truncate text-[11px] text-[var(--text-muted)]">{chapter.chapterTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TableOfContents headings={headings} />
            <ReaderSettings containerId="reader-content" />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-2 flex w-full max-w-[820px] flex-col gap-2 px-2">
        {query.ok ? <FeedbackBanner type="success" message="Progreso actualizado correctamente." /> : null}
        {query.error ? <FeedbackBanner type="error" message={decodeURIComponent(query.error)} /> : null}
      </div>

      <div className="reader-viewport">
        <div className="reader-spread">
          <div className="reader-page-left" aria-hidden="true" />
          <div className="reader-page-right" aria-hidden="true" />
          <article className="reader-spread-flow">
            <MarkdownReader markdown={chapter.markdown} containerId="reader-content" className="reader-spread-content" />
          </article>
        </div>
      </div>

      <div className="reader-bottom-dock flex items-center justify-between gap-2 px-3 py-2 sm:px-4">
        <div className="flex min-w-[106px] items-center gap-2">
          {chapter.previousChapterSlug ? (
            <Link
              href={`/books/${chapter.bookSlug}/chapters/${chapter.previousChapterSlug}`}
              className="inline-flex h-9 items-center gap-1 rounded-full border border-[var(--line)] bg-white/80 px-3 text-xs text-[var(--text-soft)]"
            >
              <ChevronLeftIcon className="size-3.5" />
              <span className="hidden sm:inline">Anterior</span>
            </Link>
          ) : null}
        </div>

        <div className="hidden min-w-[140px] items-center justify-center rounded-full border border-[var(--line)] bg-white/76 px-3 py-1 text-center text-[11px] text-[var(--text-soft)] md:inline-flex">
          {isCompleted ? "100% completado" : "Lectura en curso"}
        </div>

        {!isCompleted ? (
          <form action={markCompleted}>
            <input type="hidden" name="bookSlug" value={chapter.bookSlug} />
            <input type="hidden" name="chapterSlug" value={chapter.chapterSlug} />
            <input type="hidden" name="bookId" value={chapter.bookId} />
            <input type="hidden" name="chapterId" value={chapter.id} />
            <button type="submit" className="inline-flex h-9 items-center gap-1 rounded-full bg-[var(--accent)] px-3 text-xs font-medium text-zinc-900">
              <CheckIcon className="size-3.5" />
              <span className="hidden sm:inline">Marcar completado</span>
              <span className="sm:hidden">Completar</span>
            </button>
          </form>
        ) : (
          <span className="inline-flex h-9 items-center gap-1 rounded-full bg-white/75 px-3 text-xs text-[var(--success)]">
            <CheckIcon className="size-3.5" />
            Completado
          </span>
        )}

        <div className="flex min-w-[106px] items-center justify-end gap-2">
          {chapter.nextChapterSlug ? (
            <form action={completeAndGoNext}>
              <input type="hidden" name="bookSlug" value={chapter.bookSlug} />
              <input type="hidden" name="chapterSlug" value={chapter.chapterSlug} />
              <input type="hidden" name="nextChapterSlug" value={chapter.nextChapterSlug} />
              <input type="hidden" name="bookId" value={chapter.bookId} />
              <input type="hidden" name="chapterId" value={chapter.id} />
              <button type="submit" className="inline-flex h-9 items-center gap-1 rounded-full bg-[var(--text-main)] px-3 text-xs text-[var(--paper)]">
                <span className="hidden sm:inline">Siguiente</span>
                <span className="sm:hidden">Next</span>
                <ChevronRightIcon className="size-3.5" />
              </button>
            </form>
          ) : (
            <Link
              href={`/books/${chapter.bookSlug}`}
              className="inline-flex h-9 items-center gap-1 rounded-full bg-[var(--text-main)] px-3 text-xs text-[var(--paper)]"
            >
              Terminar libro
              <ChevronRightIcon className="size-3.5" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
