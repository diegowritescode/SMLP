import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-6 px-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold">Secure Markdown Reader</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Acceso privado por invitacion.</p>
      </div>
      <button
        type="button"
        className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
      >
        Continuar con Google (placeholder)
      </button>
      <Link href="/library" className="text-sm text-zinc-600 underline dark:text-zinc-300">
        Ir a la biblioteca
      </Link>
    </main>
  );
}
