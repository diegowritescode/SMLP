import Link from "next/link";
import type { LibraryBook } from "@/lib/content/get-library-data";

interface BookCardProps {
  book: LibraryBook;
}

function coverPalette(seed: string) {
  const value = seed.length % 4;
  if (value === 0) return "from-slate-700 via-slate-600 to-stone-500";
  if (value === 1) return "from-emerald-700 via-lime-700 to-teal-600";
  if (value === 2) return "from-amber-700 via-orange-600 to-stone-600";
  return "from-indigo-700 via-sky-700 to-cyan-600";
}

export function BookCard({ book }: BookCardProps) {
  return (
    <article className="book-card rounded-3xl border border-[var(--line)] bg-[var(--app-surface)] p-3 shadow-[0_18px_40px_rgba(0,0,0,0.10)]">
      <div className={`book-cover relative overflow-hidden bg-gradient-to-br ${coverPalette(book.slug)}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.3),transparent_36%)]" />
        <div className="absolute inset-y-0 right-0 w-[20%] bg-gradient-to-l from-black/18 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/80">{book.category ?? "Library"}</p>
          <h3 className="mt-1 line-clamp-3 text-base font-semibold leading-tight">{book.title}</h3>
        </div>
      </div>

      <div className="px-2 pb-2 pt-3">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] text-[var(--text-muted)]">
          <span className="rounded-full bg-[var(--surface-muted)] px-2 py-1">{book.chaptersCount} caps</span>
          <span className="rounded-full bg-[var(--surface-muted)] px-2 py-1">{book.language.toUpperCase()}</span>
          <span className="rounded-full bg-[var(--surface-muted)] px-2 py-1">{book.progressPercent}%</span>
        </div>
        <p className="line-clamp-2 text-sm text-[var(--text-soft)]">{book.description || "Sin descripcion"}</p>

        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-muted)]">
          <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${book.progressPercent}%` }} />
        </div>

        <Link
          href={`/books/${book.slug}`}
          className="mt-4 inline-flex rounded-full border border-[var(--line)] bg-white/85 px-4 py-2 text-sm text-[var(--text-main)]"
        >
          Abrir libro
        </Link>
      </div>
    </article>
  );
}
