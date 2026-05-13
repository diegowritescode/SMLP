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
    <section className="space-y-6 pb-8">
      <header className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_12px_30px_rgba(20,20,16,0.06)]">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Control Center</p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--text-main)]">Admin</h1>
        <p className="mt-1 text-sm text-[var(--text-soft)]">Gestion base de contenido y accesos.</p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.label}
            className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[0_10px_24px_rgba(20,20,16,0.06)]"
          >
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--text-main)]">{card.value}</p>
          </article>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/books"
          className="rounded-full border border-[var(--text-main)] bg-[var(--text-main)] px-4 py-2 text-sm text-[var(--paper)] transition hover:opacity-90"
        >
          Gestionar libros
        </Link>
        <Link
          href="/admin/users"
          className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text-soft)] transition hover:bg-[var(--paper-soft)] hover:text-[var(--text-main)]"
        >
          Gestionar usuarios y grants
        </Link>
      </div>
    </section>
  );
}
