import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import rehypeSanitize from "rehype-sanitize";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { requireUser } from "@/lib/auth/require-user";
import { getChapterBySlugs } from "@/lib/content/get-chapter";
import { canAccessChapter } from "@/lib/permissions/can-access-chapter";
import { updateProgress } from "@/lib/progress/update-progress";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";

interface ChapterPageProps {
  params: Promise<{ bookSlug: string; chapterSlug: string }>;
}

async function markCompleted(formData: FormData) {
  "use server";

  const user = await requireUser();
  const bookId = String(formData.get("bookId") || "");
  const chapterId = String(formData.get("chapterId") || "");
  if (!bookId || !chapterId) return;

  await updateProgress({
    userId: user.id,
    bookId,
    chapterId,
    progressPercent: 100,
    isCompleted: true,
  });
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const user = await requireUser();
  const profile = await getCurrentProfile(user.id);
  const { bookSlug, chapterSlug } = await params;
  const chapter = await getChapterBySlugs(bookSlug, chapterSlug, {
    includeUnpublished: profile?.role === "admin",
  });

  if (!chapter) notFound();

  const allowed = await canAccessChapter(user.id, chapter.id);
  if (!allowed) redirect("/forbidden");

  return (
    <article className="mx-auto w-full max-w-3xl space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{chapter.bookTitle}</p>
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">{chapter.chapterTitle}</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Tiempo estimado: {chapter.estimatedReadingMinutes ?? 1} min</p>
      </header>

      <div className="prose prose-zinc dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
          {chapter.markdown}
        </ReactMarkdown>
      </div>

      <form action={markCompleted} className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <input type="hidden" name="bookId" value={chapter.bookId} />
        <input type="hidden" name="chapterId" value={chapter.id} />
        <button
          type="submit"
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Marcar capitulo como completado
        </button>
      </form>

      <nav className="flex items-center justify-between gap-3">
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
          <Link
            href={`/books/${chapter.bookSlug}/chapters/${chapter.nextChapterSlug}`}
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            Siguiente capitulo
          </Link>
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
  );
}
