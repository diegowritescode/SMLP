import Image from "next/image";
import Link from "next/link";
import type { ContinueReadingItem } from "@/lib/content/get-library-data";

interface ContinueReadingCardProps {
  item: ContinueReadingItem;
  description?: string | null;
  modulesCount?: number;
}

export function ContinueReadingCard({ item, description, modulesCount }: ContinueReadingCardProps) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--surface)] shadow-[0_20px_40px_rgba(20,20,16,0.08)]">
      <div className="grid gap-0 md:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4 p-6 md:p-8">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">Continue Learning</p>
          <h2 className="text-3xl font-semibold leading-tight text-[var(--text-main)] md:text-4xl">{item.bookTitle}</h2>
          <p className="max-w-[46ch] text-base text-[var(--text-soft)]">
            {description || "Resume this notebook and keep your study momentum with focused modules and practical notes."}
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-medium text-[var(--text-soft)]">
              <span>{modulesCount ? `${modulesCount} modules` : "Learning notebook"}</span>
              <span>{item.progressPercent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--surface-muted)]">
              <div className="h-full rounded-full bg-[var(--text-main)]" style={{ width: `${item.progressPercent}%` }} />
            </div>
          </div>

          <Link
            href={`/books/${item.bookSlug}`}
            className="inline-flex rounded-full bg-[var(--text-main)] px-5 py-2.5 text-base font-semibold text-[var(--paper)] transition hover:opacity-90"
          >
            Continue studying
          </Link>
        </div>

        <div className="relative min-h-[230px] md:min-h-full">
          <Image src="/library/library-hero.jpg" alt="Study notebook cover visual" fill className="object-cover" sizes="(max-width: 768px) 100vw, 28vw" />
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(0,0,0,0.06)_0%,rgba(0,0,0,0.34)_100%)]" />
        </div>
      </div>
    </section>
  );
}
