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
    <section className="space-y-6 pb-8">
      <header className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_12px_30px_rgba(20,20,16,0.06)]">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Learning Library</p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--text-main)]">Study Progress</h1>
        <p className="mt-1 text-sm text-[var(--text-soft)]">Resumen de avance por recurso y actividad reciente.</p>
      </header>

      <article className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_10px_24px_rgba(20,20,16,0.06)]">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Overview</p>
        <p className="mt-2 text-3xl font-semibold text-[var(--text-main)]">{globalProgress}%</p>
        <p className="text-sm text-[var(--text-soft)]">Progreso global de aprendizaje</p>
        <div className="mt-4 h-2 w-full rounded-full bg-[var(--surface-muted)]">
          <div className="h-full rounded-full bg-[var(--text-main)]" style={{ width: `${globalProgress}%` }} />
        </div>
      </article>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_10px_24px_rgba(20,20,16,0.06)]">
          <h2 className="mb-3 text-base font-semibold text-[var(--text-main)]">Por recurso</h2>
          {overview.books.length === 0 ? (
            <p className="text-sm text-[var(--text-soft)]">Aun no tienes progreso registrado.</p>
          ) : (
            <ul className="space-y-3">
              {overview.books.map((book) => (
                <li key={book.bookId} className="rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-3.5">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <Link href={`/books/${book.bookSlug}`} className="text-sm font-medium text-[var(--text-main)] hover:underline">
                      {book.title}
                    </Link>
                    <span className="text-xs text-[var(--text-muted)]">{book.progressPercent}%</span>
                  </div>
                  <div className="mb-2 h-2 w-full rounded-full bg-[var(--surface-muted)]">
                    <div className="h-full rounded-full bg-[var(--text-main)]" style={{ width: `${book.progressPercent}%` }} />
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">
                    {book.completedChapters}/{book.totalChapters} capitulos completados
                  </p>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_10px_24px_rgba(20,20,16,0.06)]">
          <h2 className="mb-3 text-base font-semibold text-[var(--text-main)]">Actividad reciente</h2>
          {overview.recentChapters.length === 0 ? (
            <p className="text-sm text-[var(--text-soft)]">Aun no hay actividad de lectura para mostrar.</p>
          ) : (
            <ul className="space-y-3">
              {overview.recentChapters.map((entry, index) => (
                <li key={`${entry.bookSlug}-${entry.chapterTitle}-${index}`} className="rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-3.5 text-sm">
                  <p className="font-medium text-[var(--text-main)]">{entry.bookTitle}</p>
                  <p className="text-[var(--text-soft)]">{entry.chapterTitle}</p>
                  <p className="text-xs text-[var(--text-muted)]">
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
