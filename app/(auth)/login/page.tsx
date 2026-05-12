import { signInWithGoogle } from "@/app/(auth)/actions";

interface LoginPageProps {
  searchParams: Promise<{ next?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params.next && params.next.startsWith("/") ? params.next : "/library";

  return (
    <main className="app-shell">
      <section className="mx-auto flex min-h-[calc(100vh-32px)] w-full max-w-xl items-center justify-center">
        <div className="w-full rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.12)]">
          <div className="space-y-2 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Private Library</p>
            <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Secure Markdown Reader</h1>
            <p className="text-sm text-[var(--text-secondary)]">Acceso privado por invitacion.</p>
          </div>

          <form action={signInWithGoogle} className="mt-6 w-full">
            <input type="hidden" name="next" value={nextPath} />
            <button type="submit" className="w-full rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-medium text-zinc-900">
              Continuar con Google
            </button>
          </form>

          {params.error ? (
            <p className="mt-3 text-center text-xs text-[var(--danger)]">No se pudo iniciar sesion con Google. Intenta nuevamente.</p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
