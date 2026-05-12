import Link from "next/link";
import type { ContinueReadingItem } from "@/lib/content/get-library-data";

interface ContinueReadingCardProps {
  item: ContinueReadingItem;
}

export function ContinueReadingCard({ item }: ContinueReadingCardProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-[var(--line)] bg-[linear-gradient(120deg,rgba(255,255,255,0.95),rgba(233,244,235,0.62))] p-5 shadow-[0_16px_42px_rgba(0,0,0,0.08)]">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Continue Reading</p>
      <div className="mt-3 grid gap-4 sm:grid-cols-[120px_1fr] sm:items-center">
        <div className="book-cover rounded-2xl bg-gradient-to-br from-zinc-700 via-zinc-600 to-zinc-500" />
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-main)]">{item.bookTitle}</h2>
          <p className="mt-1 text-sm text-[var(--text-soft)]">Retoma donde lo dejaste. Progreso actual: {item.progressPercent}%</p>
          <div className="mt-3 h-2 w-full rounded-full bg-white/70">
            <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${item.progressPercent}%` }} />
          </div>
          <Link
            href={`/books/${item.bookSlug}`}
            className="mt-4 inline-flex rounded-full border border-[var(--line)] bg-white/85 px-4 py-2 text-sm text-[var(--text-main)]"
          >
            Reanudar lectura
          </Link>
        </div>
      </div>
    </section>
  );
}
