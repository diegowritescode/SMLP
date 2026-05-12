import Link from "next/link";
import { ContinueReadingCard } from "@/components/library/continue-reading-card";
import { BookCard } from "@/components/library/book-card";
import { LibraryFilters } from "@/components/library/library-filters";
import { LibraryIcon, LogoutIcon, ProgressIcon, SearchIcon, SettingsIcon, SparkleIcon } from "@/components/ui/icons";
import { signOutAction } from "@/app/(dashboard)/actions";
import { requireUser } from "@/lib/auth/require-user";
import { getLibraryData } from "@/lib/content/get-library-data";

interface LibraryPageProps {
  searchParams: Promise<{ category?: string; language?: string; status?: string; q?: string }>;
}

function collectionPalette(seed: string) {
  const value = seed.length % 6;
  if (value === 0) return "from-emerald-100 to-lime-100 text-emerald-900";
  if (value === 1) return "from-blue-100 to-cyan-100 text-slate-900";
  if (value === 2) return "from-amber-100 to-orange-100 text-amber-900";
  if (value === 3) return "from-violet-100 to-fuchsia-100 text-violet-900";
  if (value === 4) return "from-teal-100 to-sky-100 text-teal-900";
  return "from-rose-100 to-red-100 text-rose-900";
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const user = await requireUser();
  const { category, language, status, q } = await searchParams;

  const selectedCategory = category?.trim() || "";
  const selectedLanguage = language?.trim() || "";
  const selectedStatus = status?.trim() || "";
  const selectedQuery = q?.trim().toLowerCase() || "";

  const data = await getLibraryData(user.id);

  const featuredFallback = data.books.find((book) => book.progressPercent > 0) ?? data.books[0] ?? null;

  const filteredBooks = data.books.filter((book) => {
    const byCategory = !selectedCategory || (book.category ?? "") === selectedCategory;
    const byLanguage = !selectedLanguage || book.language === selectedLanguage;

    const byStatus =
      !selectedStatus ||
      (selectedStatus === "featured" && (book.chaptersCount >= 2 || Boolean(book.description))) ||
      (selectedStatus === "completed" && book.progressPercent >= 100) ||
      (selectedStatus === "in_progress" && book.progressPercent > 0 && book.progressPercent < 100) ||
      (selectedStatus === "not_started" && book.progressPercent === 0);

    const haystack = `${book.title} ${book.description ?? ""} ${book.category ?? ""}`.toLowerCase();
    const byQuery = !selectedQuery || haystack.includes(selectedQuery);

    return byCategory && byLanguage && byStatus && byQuery;
  });

  const continueLearningItems = [...data.books]
    .filter((book) => book.progressPercent > 0 && book.progressPercent < 100)
    .sort((a, b) => {
      const aTime = a.lastUpdatedAt ? new Date(a.lastUpdatedAt).getTime() : 0;
      const bTime = b.lastUpdatedAt ? new Date(b.lastUpdatedAt).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 4);

  const fallbackCollections = ["Finance", "Trading", "Marketing", "Blockchain", "Strategy", "Risk"];
  const learningCollections = data.categories.length > 0 ? data.categories.slice(0, 6) : fallbackCollections;

  const totalResources = data.books.length;
  const inProgressCount = data.books.filter((book) => book.progressPercent > 0 && book.progressPercent < 100).length;
  const completedCount = data.books.filter((book) => book.progressPercent >= 100).length;
  const modulesTotal = data.books.reduce((acc, book) => acc + book.chaptersCount, 0);
  const modulesCompletedApprox = Math.round(
    data.books.reduce((acc, book) => acc + (book.chaptersCount * book.progressPercent) / 100, 0),
  );
  const nextRecommendation =
    data.books.find((book) => book.progressPercent < 100 && book.progressPercent > 0) ??
    data.books.find((book) => book.progressPercent === 0) ??
    null;

  const headerParams = new URLSearchParams();
  if (selectedCategory) headerParams.set("category", selectedCategory);
  if (selectedLanguage) headerParams.set("language", selectedLanguage);
  if (selectedQuery) headerParams.set("q", selectedQuery);

  const makeTabHref = (tabStatus: string) => {
    const params = new URLSearchParams(headerParams);
    params.set("status", tabStatus);
    return `/library?${params.toString()}`;
  };

  return (
    <section className="space-y-6 pb-8">
      <header className="rounded-3xl border border-[var(--line)] bg-[var(--surface-elevated)]/82 p-4 shadow-[0_14px_40px_rgba(20,20,16,0.08)] backdrop-blur-xl md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-dark)]">
              <LibraryIcon className="size-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Secure Reader</p>
              <h1 className="text-xl font-semibold text-[var(--text-main)]">Learning Library</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/progress" className="icon-button-soft" aria-label="Study Progress">
              <ProgressIcon className="size-4" />
            </Link>
            <Link href="/settings" className="icon-button-soft" aria-label="Reader Settings">
              <SettingsIcon className="size-4" />
            </Link>
            <form action={signOutAction}>
              <button className="floating-control inline-flex h-10 items-center gap-2 px-4 text-sm text-[var(--text-soft)]" type="submit">
                <LogoutIcon className="size-4" />
                Logout
              </button>
            </form>
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <form method="get" className="relative">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              name="q"
              defaultValue={selectedQuery}
              placeholder="Search resources, topics, notebooks..."
              className="h-12 w-full rounded-full border border-[var(--line)] bg-[var(--paper)]/94 pl-11 pr-4 text-sm text-[var(--text-main)] outline-none placeholder:text-[var(--text-muted)]"
            />
            {selectedCategory ? <input type="hidden" name="category" value={selectedCategory} /> : null}
            {selectedLanguage ? <input type="hidden" name="language" value={selectedLanguage} /> : null}
            {selectedStatus ? <input type="hidden" name="status" value={selectedStatus} /> : null}
          </form>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Link
              href={makeTabHref("not_started")}
              className={`rounded-full border px-3 py-1.5 ${selectedStatus === "not_started" ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-dark)]" : "border-[var(--line)] bg-[var(--paper)] text-[var(--text-soft)]"}`}
            >
              New
            </Link>
            <Link
              href={makeTabHref("featured")}
              className={`rounded-full border px-3 py-1.5 ${selectedStatus === "featured" ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-dark)]" : "border-[var(--line)] bg-[var(--paper)] text-[var(--text-soft)]"}`}
            >
              Featured
            </Link>
            <Link
              href={makeTabHref("in_progress")}
              className={`rounded-full border px-3 py-1.5 ${selectedStatus === "in_progress" ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-dark)]" : "border-[var(--line)] bg-[var(--paper)] text-[var(--text-soft)]"}`}
            >
              In Progress
            </Link>
            <Link
              href={makeTabHref("completed")}
              className={`rounded-full border px-3 py-1.5 ${selectedStatus === "completed" ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-dark)]" : "border-[var(--line)] bg-[var(--paper)] text-[var(--text-soft)]"}`}
            >
              Completed
            </Link>
          </div>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-6">
          <section id="continue-learning" className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xl font-semibold text-[var(--text-main)]">Continue Learning</h2>
              <span className="text-xs text-[var(--text-muted)]">{inProgressCount} active resources</span>
            </div>

            {continueLearningItems.length > 0 ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {continueLearningItems.map((book) => (
                  <ContinueReadingCard
                    key={book.id}
                    item={{
                      bookSlug: book.slug,
                      bookTitle: book.title,
                      progressPercent: book.progressPercent,
                    }}
                  />
                ))}
              </div>
            ) : (
              <section className="rounded-3xl border border-[var(--line)] bg-[linear-gradient(130deg,rgba(255,255,255,0.95),rgba(228,239,227,0.66))] p-5 shadow-[0_16px_42px_rgba(0,0,0,0.08)]">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Continue Learning</p>
                <h3 className="mt-2 text-lg font-semibold text-[var(--text-main)]">Your learning library is ready</h3>
                <p className="mt-1 text-sm text-[var(--text-soft)]">
                  Start with any resource to unlock study recommendations and adaptive progress insights.
                </p>
                {featuredFallback ? (
                  <Link
                    href={`/books/${featuredFallback.slug}`}
                    className="mt-4 inline-flex rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 py-2 text-sm text-[var(--text-main)]"
                  >
                    Open First Resource
                  </Link>
                ) : null}
              </section>
            )}
          </section>

          <section id="learning-collections" className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xl font-semibold text-[var(--text-main)]">Learning Collections</h2>
              <span className="text-xs text-[var(--text-muted)]">Curated by domain</span>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {learningCollections.map((collection) => (
                <Link
                  key={collection}
                  href={`/library?category=${encodeURIComponent(collection)}`}
                  className={`rounded-2xl border border-[var(--line)] bg-gradient-to-br p-4 text-sm font-medium shadow-[0_8px_24px_rgba(20,20,16,0.08)] ${collectionPalette(collection)}`}
                >
                  {collection}
                </Link>
              ))}
            </div>
          </section>

          <LibraryFilters
            categories={data.categories}
            languages={data.languages}
            selectedCategory={selectedCategory}
            selectedLanguage={selectedLanguage}
            selectedStatus={selectedStatus}
            selectedQuery={selectedQuery}
          />

          <section id="your-resources" className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xl font-semibold text-[var(--text-main)]">Your Resources</h2>
              <span className="text-xs text-[var(--text-muted)]">{filteredBooks.length} resources</span>
            </div>

            {featuredFallback ? (
              <article className="rounded-3xl border border-[var(--line)] bg-[var(--paper)]/90 p-5 shadow-[0_12px_34px_rgba(20,20,16,0.08)]">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Featured Notebook</p>
                <h3 className="mt-2 text-xl font-semibold text-[var(--text-main)]">{featuredFallback.title}</h3>
                <p className="mt-1 text-sm text-[var(--text-soft)]">
                  {featuredFallback.description || "Professional resource designed for practical and secure study sessions."}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--text-soft)]">
                  <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1">{featuredFallback.chaptersCount} modules</span>
                  <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1">{featuredFallback.language.toUpperCase()}</span>
                  <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1">{featuredFallback.progressPercent}% complete</span>
                </div>
              </article>
            ) : null}

            {filteredBooks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--line-strong)] bg-[var(--app-surface)]/80 p-10 text-center text-sm text-[var(--text-soft)]">
                No resources available for this filter.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {filteredBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="hidden space-y-4 xl:block">
          <article className="rounded-2xl border border-[var(--line)] bg-[var(--paper)]/92 p-4 shadow-[0_10px_30px_rgba(20,20,16,0.08)]">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Study Progress</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--text-main)]">
              {modulesTotal > 0 ? Math.round((modulesCompletedApprox / modulesTotal) * 100) : 0}%
            </p>
            <p className="mt-1 text-sm text-[var(--text-soft)]">
              {modulesCompletedApprox}/{modulesTotal} modules completed
            </p>
          </article>

          <article className="rounded-2xl border border-[var(--line)] bg-[var(--paper)]/92 p-4 shadow-[0_10px_30px_rgba(20,20,16,0.08)]">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Learning Stats</p>
            <ul className="mt-3 space-y-2 text-sm text-[var(--text-soft)]">
              <li className="flex items-center justify-between">
                <span>Total resources</span>
                <span className="font-medium text-[var(--text-main)]">{totalResources}</span>
              </li>
              <li className="flex items-center justify-between">
                <span>In progress</span>
                <span className="font-medium text-[var(--text-main)]">{inProgressCount}</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Completed</span>
                <span className="font-medium text-[var(--text-main)]">{completedCount}</span>
              </li>
            </ul>
          </article>

          <article className="rounded-2xl border border-[var(--line)] bg-[var(--paper)]/92 p-4 shadow-[0_10px_30px_rgba(20,20,16,0.08)]">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Next Recommendation</p>
            {nextRecommendation ? (
              <div className="mt-2 space-y-2">
                <p className="text-sm font-medium text-[var(--text-main)]">{nextRecommendation.title}</p>
                <p className="text-xs text-[var(--text-soft)]">{nextRecommendation.progressPercent}% completed</p>
                <Link
                  href={`/books/${nextRecommendation.slug}`}
                  className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--paper)] px-3 py-1.5 text-xs text-[var(--text-main)]"
                >
                  <SparkleIcon className="size-3.5" />
                  Continue
                </Link>
              </div>
            ) : (
              <p className="mt-2 text-sm text-[var(--text-soft)]">No recommendation yet. Start a resource to build your study path.</p>
            )}
          </article>
        </aside>
      </div>
    </section>
  );
}

