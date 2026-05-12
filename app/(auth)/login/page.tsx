import { signInWithGoogle } from "@/app/(auth)/actions";

interface LoginPageProps {
  searchParams: Promise<{ next?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params.next && params.next.startsWith("/") ? params.next : "/library";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-6 px-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold">Secure Markdown Reader</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Acceso privado por invitacion.</p>
      </div>

      <form action={signInWithGoogle} className="w-full">
        <input type="hidden" name="next" value={nextPath} />
        <button
          type="submit"
          className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Continuar con Google
        </button>
      </form>

      {params.error ? (
        <p className="text-xs text-red-600 dark:text-red-400">No se pudo iniciar sesion con Google. Intenta nuevamente.</p>
      ) : null}
    </main>
  );
}
