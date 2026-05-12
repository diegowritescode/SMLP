import { BookCard } from "@/components/library/book-card";
import { ContinueReadingCard } from "@/components/library/continue-reading-card";
import { LibraryFilters } from "@/components/library/library-filters";
import { requireUser } from "@/lib/auth/require-user";
import { getLibraryData } from "@/lib/content/get-library-data";

interface LibraryPageProps {
  searchParams: Promise<{ category?: string; language?: string; status?: string }>;
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const user = await requireUser();
  const { category, language, status } = await searchParams;

  const selectedCategory = category?.trim() || "";
  const selectedLanguage = language?.trim() || "";
  const selectedStatus = status?.trim() || "";

  const data = await getLibraryData(user.id);

  const filteredBooks = data.books.filter((book) => {
    const byCategory = !selectedCategory || (book.category ?? "") === selectedCategory;
    const byLanguage = !selectedLanguage || book.language === selectedLanguage;

    const byStatus =
      !selectedStatus ||
      (selectedStatus === "completed" && book.progressPercent >= 100) ||
      (selectedStatus === "in_progress" && book.progressPercent > 0 && book.progressPercent < 100) ||
      (selectedStatus === "not_started" && book.progressPercent === 0);

    return byCategory && byLanguage && byStatus;
  });

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Biblioteca</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Explora tus libros habilitados y continua tu progreso.</p>
      </header>

      {data.continueReading ? <ContinueReadingCard item={data.continueReading} /> : null}

      <LibraryFilters
        categories={data.categories}
        languages={data.languages}
        selectedCategory={selectedCategory}
        selectedLanguage={selectedLanguage}
        selectedStatus={selectedStatus}
      />

      {filteredBooks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
          No hay libros disponibles para este filtro.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </section>
  );
}
