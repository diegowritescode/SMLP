import { requireUser } from "@/lib/auth/require-user";
import { ReaderPreferencesPanel } from "@/components/settings/reader-preferences-panel";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Settings</h1>
        <p className="text-sm text-[var(--text-secondary)]">Configuracion de experiencia de lectura y cuenta.</p>
      </header>

      <article className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)]/80 p-4 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Cuenta</p>
        <p className="mt-1 text-sm text-[var(--text-primary)]">{user.email}</p>
      </article>

      <ReaderPreferencesPanel />
    </section>
  );
}
