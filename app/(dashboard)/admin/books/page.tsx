import { FeedbackBanner } from "@/components/ui/feedback-banner";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { toggleBookPublished, toggleChapterPublished } from "@/app/(dashboard)/admin/actions";

interface AdminBooksPageProps {
  searchParams: Promise<{ ok?: string; error?: string }>;
}

export default async function AdminBooksPage({ searchParams }: AdminBooksPageProps) {
  await requireAdmin();
  const params = await searchParams;
  const supabase = await createClient();

  const { data: books } = await supabase
    .from("books")
    .select("id, title, slug, is_published, chapters(id, title, order_index, is_published)")
    .order("title", { ascending: true });

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--text-main)]">Admin · Libros</h1>
      </header>

      {params.ok ? <FeedbackBanner type="success" message="Actualizacion aplicada correctamente." /> : null}
      {params.error ? <FeedbackBanner type="error" message={decodeURIComponent(params.error)} /> : null}

      <div className="space-y-4">
        {(books ?? []).map((book) => (
          <article
            key={book.id}
            className="rounded-2xl border border-[var(--line)] bg-[var(--paper)]/90 p-4 shadow-[0_10px_30px_rgba(20,20,16,0.08)]"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-main)]">{book.title}</h2>
                <p className="text-xs text-[var(--text-muted)]">/{book.slug}</p>
              </div>
              <form action={toggleBookPublished}>
                <input type="hidden" name="id" value={book.id} />
                <input type="hidden" name="isPublished" value={String(book.is_published)} />
                <button
                  className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-xs text-[var(--text-soft)] transition hover:text-[var(--text-main)]"
                  type="submit"
                >
                  {book.is_published ? "Ocultar libro" : "Publicar libro"}
                </button>
              </form>
            </div>

            <ul className="space-y-2">
              {(book.chapters ?? [])
                .sort((a, b) => a.order_index - b.order_index)
                .map((chapter) => (
                  <li
                    key={chapter.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface)]/72 p-3"
                  >
                    <p className="text-sm text-[var(--text-main)]">
                      {chapter.order_index}. {chapter.title}
                    </p>
                    <form action={toggleChapterPublished}>
                      <input type="hidden" name="id" value={chapter.id} />
                      <input type="hidden" name="isPublished" value={String(chapter.is_published)} />
                      <button
                        className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-3 py-1 text-xs text-[var(--text-soft)] transition hover:text-[var(--text-main)]"
                        type="submit"
                      >
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
