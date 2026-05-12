import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  await requireAdmin();
  const supabase = await createClient();

  const [{ count: booksCount }, { count: chaptersCount }, { count: usersCount }, { count: grantsCount }] =
    await Promise.all([
      supabase.from("books").select("id", { count: "exact", head: true }),
      supabase.from("chapters").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("access_grants").select("id", { count: "exact", head: true }),
    ]);

  const cards = [
    { label: "Libros", value: booksCount ?? 0 },
    { label: "Capitulos", value: chaptersCount ?? 0 },
    { label: "Usuarios", value: usersCount ?? 0 },
    { label: "Access Grants", value: grantsCount ?? 0 },
  ];

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Admin</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Gestion base de contenido y accesos.</p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{card.label}</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{card.value}</p>
          </article>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/books" className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900">
          Gestionar libros
        </Link>
        <Link href="/admin/users" className="rounded-md border border-zinc-300 px-4 py-2 text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-200">
          Gestionar usuarios y grants
        </Link>
      </div>
    </section>
  );
}
