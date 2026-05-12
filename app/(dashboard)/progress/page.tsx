import Link from "next/link";
import { requireUser } from "@/lib/auth/require-user";
import { getProgressOverview } from "@/lib/progress/get-progress-overview";

export default async function ProgressPage() {
  const user = await requireUser();
  const overview = await getProgressOverview(user.id);

  const globalProgress =
    overview.books.length > 0
      ? Math.round(overview.books.reduce((acc, book) => acc + book.progressPercent, 0) / overview.books.length)
      : 0;

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Progreso</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Resumen de avance por libro y actividad reciente.</p>
      </header>

      <article className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Progreso global</p>
        <p className="mt-1 text-3xl font-semibold text-zinc-900 dark:text-zinc-100">{globalProgress}%</p>
        <div className="mt-3 h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${globalProgress}%` }} />
        </div>
      </article>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">Por libro</h2>
          {overview.books.length === 0 ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-300">Aun no tienes progreso registrado.</p>
          ) : (
            <ul className="space-y-3">
              {overview.books.map((book) => (
                <li key={book.bookId} className="rounded-md border border-zinc-200 p-3 dark:border-zinc-800">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <Link href={`/books/${book.bookSlug}`} className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {book.title}
                    </Link>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{book.progressPercent}%</span>
                  </div>
                  <div className="mb-2 h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${book.progressPercent}%` }} />
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {book.completedChapters}/{book.totalChapters} capitulos completados
                  </p>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">Actividad reciente</h2>
          {overview.recentChapters.length === 0 ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-300">Aun no hay actividad de lectura para mostrar.</p>
          ) : (
            <ul className="space-y-3">
              {overview.recentChapters.map((entry, index) => (
                <li key={`${entry.bookSlug}-${entry.chapterTitle}-${index}`} className="rounded-md border border-zinc-200 p-3 text-sm dark:border-zinc-800">
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{entry.bookTitle}</p>
                  <p className="text-zinc-600 dark:text-zinc-300">{entry.chapterTitle}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {entry.progressPercent}% · {entry.isCompleted ? "completado" : "en curso"} · {new Date(entry.updatedAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>
    </section>
  );
}
