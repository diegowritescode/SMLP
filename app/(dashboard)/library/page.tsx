import { CategoryFilter } from "@/components/library/category-filter";
import { BookCard } from "@/components/library/book-card";
import { ContinueReadingCard } from "@/components/library/continue-reading-card";
import { requireUser } from "@/lib/auth/require-user";
import { getLibraryData } from "@/lib/content/get-library-data";

interface LibraryPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const user = await requireUser();
  const { category } = await searchParams;
  const selectedCategory = category?.trim() || null;

  const data = await getLibraryData(user.id);

  const filteredBooks = selectedCategory
    ? data.books.filter((book) => (book.category ?? "") === selectedCategory)
    : data.books;

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Biblioteca</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Explora tus libros habilitados y continua tu progreso.</p>
      </header>

      {data.continueReading ? <ContinueReadingCard item={data.continueReading} /> : null}

      <CategoryFilter categories={data.categories} selectedCategory={selectedCategory} />

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
