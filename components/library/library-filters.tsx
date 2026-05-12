import Link from "next/link";
import { FilterIcon, SearchIcon } from "@/components/ui/icons";

interface LibraryFiltersProps {
  categories: string[];
  languages: string[];
  selectedCategory: string;
  selectedLanguage: string;
  selectedStatus: string;
  selectedQuery: string;
}

export function LibraryFilters({
  categories,
  languages,
  selectedCategory,
  selectedLanguage,
  selectedStatus,
  selectedQuery,
}: LibraryFiltersProps) {
  return (
    <form
      method="get"
      className="grid grid-cols-1 gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-elevated)]/84 p-4 backdrop-blur-xl lg:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))_auto]"
    >
      <label className="relative block">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          name="q"
          defaultValue={selectedQuery}
          placeholder="Search resources, topics, notebooks..."
          className="h-10 w-full rounded-full border border-[var(--line)] bg-white/85 pl-10 pr-4 text-sm text-[var(--text-main)] outline-none ring-0 placeholder:text-[var(--text-muted)]"
        />
      </label>

      <select name="category" defaultValue={selectedCategory} className="h-10 rounded-full border border-[var(--line)] bg-white/85 px-3 text-sm text-[var(--text-soft)]">
        <option value="">Collections</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select name="language" defaultValue={selectedLanguage} className="h-10 rounded-full border border-[var(--line)] bg-white/85 px-3 text-sm text-[var(--text-soft)]">
        <option value="">Languages</option>
        {languages.map((language) => (
          <option key={language} value={language}>
            {language.toUpperCase()}
          </option>
        ))}
      </select>

      <select name="status" defaultValue={selectedStatus} className="h-10 rounded-full border border-[var(--line)] bg-white/85 px-3 text-sm text-[var(--text-soft)]">
        <option value="">Study State</option>
        <option value="not_started">Not started</option>
        <option value="in_progress">In progress</option>
        <option value="completed">Completed</option>
      </select>

      <div className="flex items-center gap-2">
        <button type="submit" className="inline-flex h-10 items-center gap-2 rounded-full bg-[var(--accent)] px-4 text-sm font-medium text-zinc-900">
          <FilterIcon className="size-4" />
          Apply
        </button>
        <Link href="/library" className="inline-flex h-10 items-center rounded-full border border-[var(--line)] px-4 text-sm text-[var(--text-soft)]">
          Clear
        </Link>
      </div>
    </form>
  );
}
