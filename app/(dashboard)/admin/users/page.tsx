import { FeedbackBanner } from "@/components/ui/feedback-banner";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { createAccessGrant, revokeAccessGrant } from "@/app/(dashboard)/admin/actions";

interface GrantRow {
  id: string;
  access_type: string;
  starts_at: string;
  expires_at: string | null;
  profiles: { email: string }[] | { email: string } | null;
  books: { title: string }[] | { title: string } | null;
}

interface AdminUsersPageProps {
  searchParams: Promise<{ ok?: string; error?: string }>;
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  await requireAdmin();
  const params = await searchParams;
  const supabase = await createClient();

  const [{ data: users }, { data: books }, { data: grantsRaw }] = await Promise.all([
    supabase.from("profiles").select("id, email, role").order("email", { ascending: true }),
    supabase.from("books").select("id, title").order("title", { ascending: true }),
    supabase
      .from("access_grants")
      .select("id, access_type, starts_at, expires_at, profiles(email), books(title)")
      .order("created_at", { ascending: false }),
  ]);
  const grants = (grantsRaw ?? []) as unknown as GrantRow[];

  return (
    <section className="space-y-6 pb-8">
      <header className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_12px_30px_rgba(20,20,16,0.06)]">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold text-[var(--text-main)]">Usuarios y Access Grants</h1>
      </header>

      {params.ok ? <FeedbackBanner type="success" message="Operacion completada correctamente." /> : null}
      {params.error ? <FeedbackBanner type="error" message={decodeURIComponent(params.error)} /> : null}

      <article className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_10px_24px_rgba(20,20,16,0.06)]">
        <h2 className="mb-3 text-xl font-semibold text-[var(--text-main)]">Crear grant manual</h2>
        <form action={createAccessGrant} className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <select
            name="userId"
            required
            className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-base font-medium text-[var(--text-main)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/18"
          >
            <option value="">Selecciona usuario</option>
            {(users ?? []).map((user) => (
              <option key={user.id} value={user.id}>
                {user.email}
              </option>
            ))}
          </select>

          <select
            name="bookId"
            required
            className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-base font-medium text-[var(--text-main)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/18"
          >
            <option value="">Selecciona libro</option>
            {(books ?? []).map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>

          <select
            name="accessType"
            className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-base font-medium text-[var(--text-main)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/18"
          >
            <option value="manual">manual</option>
            <option value="trial">trial</option>
            <option value="subscription">subscription</option>
            <option value="admin">admin</option>
          </select>

          <input
            type="datetime-local"
            name="expiresAt"
            className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-base font-medium text-[var(--text-main)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/18"
          />

          <button
            type="submit"
            className="rounded-xl border border-[var(--text-main)] bg-[var(--text-main)] px-4 py-2 text-base font-semibold text-[var(--paper)] transition hover:opacity-90 md:col-span-4"
          >
            Guardar grant
          </button>
        </form>
      </article>

      <article className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_10px_24px_rgba(20,20,16,0.06)]">
        <h2 className="mb-3 text-xl font-semibold text-[var(--text-main)]">Usuarios</h2>
        <ul className="space-y-2">
          {(users ?? []).map((user) => (
            <li key={user.id} className="rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-3.5 text-base">
              <span className="font-semibold text-[var(--text-main)]">{user.email}</span>
              <span className="ml-2 text-sm text-[var(--text-muted)]">({user.role})</span>
            </li>
          ))}
        </ul>
      </article>

      <article className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_10px_24px_rgba(20,20,16,0.06)]">
        <h2 className="mb-3 text-xl font-semibold text-[var(--text-main)]">Grants activos</h2>
        <ul className="space-y-2">
          {grants.map((grant) => {
            const profileEmail = Array.isArray(grant.profiles) ? grant.profiles[0]?.email : grant.profiles?.email;
            const bookTitle = Array.isArray(grant.books) ? grant.books[0]?.title : grant.books?.title;
            return (
              <li
                key={grant.id}
                className="flex flex-col gap-2 rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-3.5 text-base md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-semibold text-[var(--text-main)]">
                    {profileEmail ?? "usuario"} → {bookTitle ?? "libro"}
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">
                    {grant.access_type} | inicio: {new Date(grant.starts_at).toLocaleString()} | expira: {grant.expires_at ? new Date(grant.expires_at).toLocaleString() : "sin expiracion"}
                  </p>
                </div>
                <form action={revokeAccessGrant}>
                  <input type="hidden" name="id" value={grant.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2 text-sm font-medium text-[var(--text-soft)] transition hover:bg-[var(--paper-soft)] hover:text-[var(--text-main)]"
                  >
                    Revocar
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      </article>
    </section>
  );
}
