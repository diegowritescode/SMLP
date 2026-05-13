import { requireUser } from "@/lib/auth/require-user";
import { ReaderPreferencesPanel } from "@/components/settings/reader-preferences-panel";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <section className="space-y-6 pb-8">
      <header className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_12px_30px_rgba(20,20,16,0.06)]">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Learning Library</p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--text-main)]">Settings</h1>
        <p className="mt-1 text-sm text-[var(--text-soft)]">Configuracion de experiencia de lectura y cuenta.</p>
      </header>

      <article className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_10px_24px_rgba(20,20,16,0.06)]">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Cuenta</p>
        <p className="mt-2 text-sm text-[var(--text-main)]">{user.email}</p>
      </article>

      <ReaderPreferencesPanel />
    </section>
  );
}
