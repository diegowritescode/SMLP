import Link from "next/link";

interface LibraryFiltersProps {
  categories: string[];
  languages: string[];
  selectedCategory: string;
  selectedLanguage: string;
  selectedStatus: string;
}

export function LibraryFilters({
  categories,
  languages,
  selectedCategory,
  selectedLanguage,
  selectedStatus,
}: LibraryFiltersProps) {
  return (
    <form method="get" className="grid grid-cols-1 gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 md:grid-cols-4">
      <select name="category" defaultValue={selectedCategory} className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900">
        <option value="">Todas las categorias</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select name="language" defaultValue={selectedLanguage} className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900">
        <option value="">Todos los idiomas</option>
        {languages.map((language) => (
          <option key={language} value={language}>
            {language.toUpperCase()}
          </option>
        ))}
      </select>

      <select name="status" defaultValue={selectedStatus} className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900">
        <option value="">Todos los estados</option>
        <option value="not_started">Pendiente</option>
        <option value="in_progress">En curso</option>
        <option value="completed">Completado</option>
      </select>

      <div className="flex items-center gap-2">
        <button type="submit" className="rounded-md bg-zinc-900 px-3 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900">
          Aplicar
        </button>
        <Link href="/library" className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700">
          Limpiar
        </Link>
      </div>
    </form>
  );
}
