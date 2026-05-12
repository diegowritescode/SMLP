import type { MarkdownHeading } from "@/lib/content/parse-markdown";

interface TableOfContentsProps {
  headings: MarkdownHeading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length === 0) return null;

  return (
    <aside className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Contenido</p>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li key={`${heading.id}-${heading.level}`} className={heading.level === 1 ? "pl-0" : heading.level === 2 ? "pl-3" : "pl-6"}>
            <a href={`#${heading.id}`} className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100">
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
