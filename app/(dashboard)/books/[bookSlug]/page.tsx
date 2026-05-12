import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/require-user";
import { getBookBySlug } from "@/lib/content/get-book";
import { canAccessBook } from "@/lib/permissions/can-access-book";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";

interface BookPageProps {
  params: Promise<{ bookSlug: string }>;
}

export default async function BookPage({ params }: BookPageProps) {
  const user = await requireUser();
  const { bookSlug } = await params;

  const book = await getBookBySlug(bookSlug);
  if (!book) notFound();

  const allowed = await canAccessBook(user.id, book.id);
  if (!allowed) redirect("/forbidden");

  const profile = await getCurrentProfile(user.id);
  const visibleChapters = profile?.role === "admin" ? book.chapters : book.chapters.filter((chapter) => chapter.isPublished);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{book.title}</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">{book.description || "Sin descripcion"}</p>
      </header>

      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {visibleChapters.map((chapter) => (
            <li key={chapter.id} className="flex items-center justify-between gap-3 p-4">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {chapter.orderIndex}. {chapter.title}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {chapter.estimatedReadingMinutes ?? 1} min lectura
                </p>
              </div>
              <Link
                href={`/books/${book.slug}/chapters/${chapter.slug}`}
                className="rounded-md bg-zinc-900 px-3 py-2 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
              >
                Leer
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
