import { requireUser } from "@/lib/auth/require-user";
import { ReaderPreferencesPanel } from "@/components/settings/reader-preferences-panel";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Settings</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Configuracion de experiencia de lectura y cuenta.</p>
      </header>

      <article className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Cuenta</p>
        <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">{user.email}</p>
      </article>

      <ReaderPreferencesPanel />
    </section>
  );
}
