import Link from "next/link";
import type { ContinueReadingItem } from "@/lib/content/get-library-data";

interface ContinueReadingCardProps {
  item: ContinueReadingItem;
}

export function ContinueReadingCard({ item }: ContinueReadingCardProps) {
  return (
    <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/30">
      <p className="text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Continuar leyendo</p>
      <h2 className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{item.bookTitle}</h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">Progreso actual: {item.progressPercent}%</p>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-900/70">
        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${item.progressPercent}%` }} />
      </div>
      <Link
        href={`/books/${item.bookSlug}`}
        className="mt-4 inline-flex rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
      >
        Reanudar
      </Link>
    </section>
  );
}
