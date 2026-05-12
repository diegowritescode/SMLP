import Link from "next/link";
import type { LibraryBook } from "@/lib/content/get-library-data";

interface BookCardProps {
  book: LibraryBook;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{book.title}</h3>
        <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
          {book.progressPercent}%
        </span>
      </div>

      <p className="mb-4 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-300">{book.description || "Sin descripcion"}</p>

      <div className="mb-4 flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span>{book.chaptersCount} capitulos</span>
        <span>•</span>
        <span>{book.language.toUpperCase()}</span>
        {book.category ? (
          <>
            <span>•</span>
            <span>{book.category}</span>
          </>
        ) : null}
      </div>

      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${book.progressPercent}%` }} />
      </div>

      <Link
        href={`/books/${book.slug}`}
        className="inline-flex rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
      >
        Abrir libro
      </Link>
    </article>
  );
}
