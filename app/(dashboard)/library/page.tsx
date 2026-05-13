import Link from "next/link";
import { BookCard } from "@/components/library/book-card";
import { ContinueReadingCard } from "@/components/library/continue-reading-card";
import { LibraryFilters } from "@/components/library/library-filters";
import { LibraryIcon, LogoutIcon, ProgressIcon, SearchIcon, SettingsIcon } from "@/components/ui/icons";
import { signOutAction } from "@/app/(dashboard)/actions";
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

  const leadResource =
    data.continueReading
      ? data.books.find((book) => book.slug === data.continueReading?.bookSlug) || null
      : data.books.find((book) => book.progressPercent > 0) || data.books[0] || null;

  const inProgressCount = data.books.filter((book) => book.progressPercent > 0 && book.progressPercent < 100).length;
  const modulesTotal = data.books.reduce((acc, book) => acc + book.chaptersCount, 0);
  const modulesCompletedApprox = Math.round(
    data.books.reduce((acc, book) => acc + (book.chaptersCount * book.progressPercent) / 100, 0),
  );
  const overallProgress = modulesTotal > 0 ? Math.round((modulesCompletedApprox / modulesTotal) * 100) : 0;

  return (
    <section className="space-y-6 pb-8">
      <header className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[0_12px_30px_rgba(20,20,16,0.06)] md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="inline-flex size-11 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] text-[var(--text-main)]">
              <LibraryIcon className="size-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Secure Reader</p>
              <h1 className="text-2xl font-semibold text-[var(--text-main)]">Learning Library</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/progress" className="icon-button-soft bg-[var(--surface)]" aria-label="Study Progress">
              <ProgressIcon className="size-5" />
            </Link>
            <Link href="/settings" className="icon-button-soft bg-[var(--surface)]" aria-label="Settings">
              <SettingsIcon className="size-5" />
            </Link>
            <form action={signOutAction}>
              <button className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 text-base font-medium text-[var(--text-soft)]" type="submit">
                <LogoutIcon className="size-5" />
                Logout
              </button>
            </form>
          </div>
        </div>

        <form method="get" className="mt-4">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              name="q"
              defaultValue={selectedQuery}
              placeholder="Search resources, topics, notebooks..."
              className="h-12 w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] pl-12 pr-4 text-base font-medium text-[var(--text-main)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/18"
            />
          </div>
          {selectedCategory ? <input type="hidden" name="category" value={selectedCategory} /> : null}
          {selectedLanguage ? <input type="hidden" name="language" value={selectedLanguage} /> : null}
          {selectedStatus ? <input type="hidden" name="status" value={selectedStatus} /> : null}
        </form>
      </header>

      {leadResource ? (
        <section id="continue-learning">
          <ContinueReadingCard
            item={{
              bookSlug: leadResource.slug,
              bookTitle: leadResource.title,
              progressPercent: leadResource.progressPercent,
            }}
            description={leadResource.description}
            modulesCount={leadResource.chaptersCount}
          />
        </section>
      ) : (
        <section className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_12px_30px_rgba(20,20,16,0.06)]">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Continue Learning</p>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--text-main)]">Your learning library is ready</h2>
          <p className="mt-1 text-base text-[var(--text-soft)]">Your account is active. Access appears here as soon as your first resource grant is enabled.</p>
        </section>
      )}

      <section className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_10px_24px_rgba(20,20,16,0.06)]">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Study Progress</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <article className="rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-4">
            <p className="text-sm font-medium text-[var(--text-soft)]">Overall progress</p>
            <p className="mt-1 text-3xl font-semibold text-[var(--text-main)]">{overallProgress}%</p>
          </article>
          <article className="rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-4">
            <p className="text-sm font-medium text-[var(--text-soft)]">Completed modules</p>
            <p className="mt-1 text-3xl font-semibold text-[var(--text-main)]">
              {modulesCompletedApprox}/{modulesTotal}
            </p>
          </article>
          <article className="rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-4">
            <p className="text-sm font-medium text-[var(--text-soft)]">Active resources</p>
            <p className="mt-1 text-3xl font-semibold text-[var(--text-main)]">{inProgressCount}</p>
          </article>
        </div>
      </section>

      <LibraryFilters
        categories={data.categories}
        languages={data.languages}
        selectedCategory={selectedCategory}
        selectedLanguage={selectedLanguage}
        selectedStatus={selectedStatus}
        selectedQuery={selectedQuery}
        resourcesCount={data.books.length}
      />

      <section id="your-resources" className="space-y-4">
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Learning Library</p>
            <h2 className="text-3xl font-semibold text-[var(--text-main)]">Your resources</h2>
          </div>
          <span className="text-sm font-medium text-[var(--text-muted)]">{filteredBooks.length} resources</span>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)] p-10 text-center text-base text-[var(--text-soft)]">
            No resources found for this filter.
          </div>
        ) : (
          <div
            className={`grid gap-5 ${
              filteredBooks.length === 1
                ? "max-w-[460px] grid-cols-1"
                : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
            }`}
          >
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
