import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">404</p>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Recurso no encontrado</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-300">La ruta solicitada no existe o ya no esta disponible.</p>
      <Link href="/library" className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900">
        Ir a biblioteca
      </Link>
    </main>
  );
}
