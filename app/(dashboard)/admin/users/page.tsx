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

export default async function AdminUsersPage() {
  await requireAdmin();
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
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Admin · Usuarios y Access Grants</h1>
      </header>

      <article className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">Crear grant manual</h2>
        <form action={createAccessGrant} className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <select name="userId" required className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900">
            <option value="">Selecciona usuario</option>
            {(users ?? []).map((user) => (
              <option key={user.id} value={user.id}>
                {user.email}
              </option>
            ))}
          </select>

          <select name="bookId" required className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900">
            <option value="">Selecciona libro</option>
            {(books ?? []).map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>

          <select name="accessType" className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900">
            <option value="manual">manual</option>
            <option value="trial">trial</option>
            <option value="subscription">subscription</option>
            <option value="admin">admin</option>
          </select>

          <input type="datetime-local" name="expiresAt" className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />

          <button type="submit" className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900 md:col-span-4">
            Guardar grant
          </button>
        </form>
      </article>

      <article className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">Usuarios</h2>
        <ul className="space-y-2">
          {(users ?? []).map((user) => (
            <li key={user.id} className="rounded-md border border-zinc-200 p-3 text-sm dark:border-zinc-800">
              <span className="font-medium text-zinc-900 dark:text-zinc-100">{user.email}</span>
              <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">({user.role})</span>
            </li>
          ))}
        </ul>
      </article>

      <article className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">Grants activos</h2>
        <ul className="space-y-2">
          {grants.map((grant) => {
            const profileEmail = Array.isArray(grant.profiles) ? grant.profiles[0]?.email : grant.profiles?.email;
            const bookTitle = Array.isArray(grant.books) ? grant.books[0]?.title : grant.books?.title;
            return (
            <li key={grant.id} className="flex flex-col gap-2 rounded-md border border-zinc-200 p-3 text-sm dark:border-zinc-800 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">
                  {profileEmail ?? "usuario"} → {bookTitle ?? "libro"}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {grant.access_type} | inicio: {new Date(grant.starts_at).toLocaleString()} | expira: {grant.expires_at ? new Date(grant.expires_at).toLocaleString() : "sin expiracion"}
                </p>
              </div>
              <form action={revokeAccessGrant}>
                <input type="hidden" name="id" value={grant.id} />
                <button type="submit" className="rounded-md border border-red-300 px-3 py-2 text-xs text-red-600 dark:border-red-700 dark:text-red-400">
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
