import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { toggleBookPublished, toggleChapterPublished } from "@/app/(dashboard)/admin/actions";

export default async function AdminBooksPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: books } = await supabase
    .from("books")
    .select("id, title, slug, is_published, chapters(id, title, order_index, is_published)")
    .order("title", { ascending: true });

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Admin · Libros</h1>
      </header>

      <div className="space-y-4">
        {(books ?? []).map((book) => (
          <article key={book.id} className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{book.title}</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">/{book.slug}</p>
              </div>
              <form action={toggleBookPublished}>
                <input type="hidden" name="id" value={book.id} />
                <input type="hidden" name="isPublished" value={String(book.is_published)} />
                <button className="rounded-md border border-zinc-300 px-3 py-2 text-xs dark:border-zinc-700" type="submit">
                  {book.is_published ? "Ocultar libro" : "Publicar libro"}
                </button>
              </form>
            </div>

            <ul className="space-y-2">
              {(book.chapters ?? [])
                .sort((a, b) => a.order_index - b.order_index)
                .map((chapter) => (
                  <li key={chapter.id} className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 p-3 dark:border-zinc-800">
                    <p className="text-sm text-zinc-800 dark:text-zinc-200">
                      {chapter.order_index}. {chapter.title}
                    </p>
                    <form action={toggleChapterPublished}>
                      <input type="hidden" name="id" value={chapter.id} />
                      <input type="hidden" name="isPublished" value={String(chapter.is_published)} />
                      <button className="rounded-md border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-700" type="submit">
                        {chapter.is_published ? "Ocultar" : "Publicar"}
                      </button>
                    </form>
                  </li>
                ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
