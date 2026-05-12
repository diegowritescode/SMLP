import Link from "next/link";
import { BookCard } from "@/components/library/book-card";
import { ContinueReadingCard } from "@/components/library/continue-reading-card";
import { LibraryFilters } from "@/components/library/library-filters";
import { requireUser } from "@/lib/auth/require-user";
import { getLibraryData } from "@/lib/content/get-library-data";

interface LibraryPageProps {
  searchParams: Promise<{ category?: string; language?: string; status?: string; q?: string }>;
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const user = await requireUser();
  const { category, language, status, q } = await searchParams;

  const selectedCategory = category?.trim() || "";
  const selectedLanguage = language?.trim() || "";
  const selectedStatus = status?.trim() || "";
  const selectedQuery = q?.trim().toLowerCase() || "";

  const data = await getLibraryData(user.id);

  const filteredBooks = data.books.filter((book) => {
    const byCategory = !selectedCategory || (book.category ?? "") === selectedCategory;
    const byLanguage = !selectedLanguage || book.language === selectedLanguage;

    const byStatus =
      !selectedStatus ||
      (selectedStatus === "completed" && book.progressPercent >= 100) ||
      (selectedStatus === "in_progress" && book.progressPercent > 0 && book.progressPercent < 100) ||
      (selectedStatus === "not_started" && book.progressPercent === 0);

    const haystack = `${book.title} ${book.description ?? ""} ${book.category ?? ""}`.toLowerCase();
    const byQuery = !selectedQuery || haystack.includes(selectedQuery);

    return byCategory && byLanguage && byStatus && byQuery;
  });

  return (
    <section className="space-y-6 pb-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-[var(--text-main)]">Biblioteca</h1>
          <p className="text-sm text-[var(--text-soft)]">Coleccion privada con experiencia de lectura editorial y calmada.</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-[var(--text-soft)]">
          <span className="rounded-full border border-[var(--line)] bg-white/75 px-3 py-1">{data.books.length} libros</span>
          <span className="rounded-full border border-[var(--line)] bg-white/75 px-3 py-1">{data.categories.length} categorias</span>
          <span className="rounded-full border border-[var(--line)] bg-white/75 px-3 py-1">{data.languages.length} idiomas</span>
        </div>
      </header>

      {data.continueReading ? (
        <ContinueReadingCard item={data.continueReading} />
      ) : (
        <section className="rounded-3xl border border-[var(--line)] bg-[linear-gradient(120deg,rgba(255,255,255,0.88),rgba(233,220,194,0.42))] p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Continue Reading</p>
          <h2 className="mt-2 text-lg font-semibold text-[var(--text-main)]">Tu biblioteca esta lista</h2>
          <p className="mt-1 text-sm text-[var(--text-soft)]">Empieza con cualquier titulo para activar recomendaciones y progreso inteligente.</p>
        </section>
      )}

      <LibraryFilters
        categories={data.categories}
        languages={data.languages}
        selectedCategory={selectedCategory}
        selectedLanguage={selectedLanguage}
        selectedStatus={selectedStatus}
        selectedQuery={selectedQuery}
      />

      {filteredBooks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--line-strong)] bg-[var(--app-surface)]/80 p-10 text-center text-sm text-[var(--text-soft)]">
          No hay libros para este filtro.
        </div>
      ) : filteredBooks.length === 1 ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,320px)_1fr]">
          <BookCard book={filteredBooks[0]} />
          <article className="rounded-3xl border border-[var(--line)] bg-[var(--app-surface)]/85 p-6 shadow-[0_14px_30px_rgba(0,0,0,0.08)]">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Selected Book</p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--text-main)]">{filteredBooks[0].title}</h2>
            <p className="mt-2 max-w-prose text-sm text-[var(--text-soft)]">
              {filteredBooks[0].description || "Este libro ya esta disponible para lectura segura en formato markdown."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--text-soft)]">
              <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1">{filteredBooks[0].progressPercent}% progreso</span>
              <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1">{filteredBooks[0].chaptersCount} capitulos</span>
              <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1">{filteredBooks[0].language.toUpperCase()}</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/books/${filteredBooks[0].slug}`} className="rounded-full bg-[var(--text-main)] px-4 py-2 text-sm text-[var(--paper)]">
                Abrir lector
              </Link>
              <Link href="/progress" className="rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--text-soft)]">
                Ver progreso
              </Link>
            </div>
          </article>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </section>
  );
}
