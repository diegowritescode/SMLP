import Link from "next/link";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
}

export function CategoryFilter({ categories, selectedCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/library"
        className={`rounded-full px-3 py-1 text-sm ${
          !selectedCategory
            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
            : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
        }`}
      >
        Todos
      </Link>
      {categories.map((category) => {
        const active = selectedCategory === category;
        return (
          <Link
            key={category}
            href={`/library?category=${encodeURIComponent(category)}`}
            className={`rounded-full px-3 py-1 text-sm ${
              active
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            }`}
          >
            {category}
          </Link>
        );
      })}
    </div>
  );
}
