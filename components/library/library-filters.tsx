import Link from "next/link";
import { FilterIcon } from "@/components/ui/icons";

interface LibraryFiltersProps {
  categories: string[];
  languages: string[];
  selectedCategory: string;
  selectedLanguage: string;
  selectedStatus: string;
  selectedQuery: string;
  resourcesCount: number;
}

export function LibraryFilters({
  categories,
  languages,
  selectedCategory,
  selectedLanguage,
  selectedStatus,
  selectedQuery,
  resourcesCount,
}: LibraryFiltersProps) {
  if (resourcesCount <= 1) return null;

  return (
    <details className="group rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 shadow-[0_8px_20px_rgba(20,20,16,0.06)]">
      <summary className="flex cursor-pointer list-none items-center gap-2 text-base font-semibold text-[var(--text-main)]">
        <span className="inline-flex size-9 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--paper-soft)]">
          <FilterIcon className="size-4.5" />
        </span>
        Filters
        <span className="ml-auto text-sm text-[var(--text-muted)] group-open:hidden">Show</span>
        <span className="ml-auto hidden text-sm text-[var(--text-muted)] group-open:inline">Hide</span>
      </summary>

      <form method="get" className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto]">
        {selectedQuery ? <input type="hidden" name="q" value={selectedQuery} /> : null}

        <select
          name="category"
          defaultValue={selectedCategory}
          className="h-11 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 text-base font-medium text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/18"
        >
          <option value="">All collections</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          name="language"
          defaultValue={selectedLanguage}
          className="h-11 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 text-base font-medium text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/18"
        >
          <option value="">All languages</option>
          {languages.map((language) => (
            <option key={language} value={language}>
              {language.toUpperCase()}
            </option>
          ))}
        </select>

        <select
          name="status"
          defaultValue={selectedStatus}
          className="h-11 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 text-base font-medium text-[var(--text-main)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/18"
        >
          <option value="">Any progress</option>
          <option value="not_started">Not started</option>
          <option value="in_progress">In progress</option>
          <option value="completed">Completed</option>
        </select>

        <div className="flex items-center gap-2">
          <button type="submit" className="inline-flex h-11 items-center rounded-full bg-[var(--text-main)] px-4 text-base font-semibold text-[var(--paper)]">
            Apply
          </button>
          <Link href="/library" className="inline-flex h-11 items-center rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 text-base font-medium text-[var(--text-soft)]">
            Clear
          </Link>
        </div>
      </form>
    </details>
  );
}
