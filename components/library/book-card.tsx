import Image from "next/image";
import Link from "next/link";
import type { LibraryBook } from "@/lib/content/get-library-data";

interface BookCardProps {
  book: LibraryBook;
}

function getCoverVariant(seed: string) {
  const value = seed.length % 4;
  if (value === 0) return { src: "/library/resource-cover-01.jpg", objectPosition: "center 26%", tintClass: "bg-[#0f1418]/30" };
  if (value === 1) return { src: "/library/resource-cover-02.jpg", objectPosition: "center 44%", tintClass: "bg-[#172114]/28" };
  if (value === 2) return { src: "/library/resource-cover-03.jpg", objectPosition: "center 62%", tintClass: "bg-[#111318]/34" };
  return { src: "/library/resource-cover-04.jpg", objectPosition: "center 35%", tintClass: "bg-[#141414]/30" };
}

export function BookCard({ book }: BookCardProps) {
  const cover = getCoverVariant(book.slug);

  return (
    <article className="book-card overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--surface)] shadow-[0_12px_28px_rgba(20,20,16,0.08)]">
      <div className="relative aspect-[5/4] overflow-hidden rounded-t-[28px] bg-[#f0f2ec]">
        <Image
          src={cover.src}
          alt={`${book.title} cover`}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1280px) 50vw, 24vw"
          className="object-cover"
          style={{ objectPosition: cover.objectPosition }}
        />
        <div className={`absolute inset-0 ${cover.tintClass}`} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,7,0.03)_20%,rgba(7,7,7,0.52)_100%)]" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/85">{book.category || "Notebook"}</p>
          <h3 className="mt-1 line-clamp-2 text-xl font-semibold leading-tight">{book.title}</h3>
        </div>
      </div>

      <div className="space-y-3 p-5">
        <p className="line-clamp-2 text-base text-[var(--text-soft)]">{book.description || "Private study resource with focused modules and notes."}</p>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm font-medium text-[var(--text-soft)]">
            <span>{book.chaptersCount} modules</span>
            <span>{book.progressPercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--surface-muted)]">
            <div className="h-full rounded-full bg-[var(--text-main)]" style={{ width: `${book.progressPercent}%` }} />
          </div>
        </div>

        <Link href={`/books/${book.slug}`} className="inline-flex rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-base font-medium text-[var(--text-main)] transition hover:bg-[var(--paper-soft)]">
          Open resource
        </Link>
      </div>
    </article>
  );
}
