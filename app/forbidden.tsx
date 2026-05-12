import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">403</p>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">No tienes acceso a este recurso</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-300">
        Si crees que esto es un error, solicita acceso al administrador.
      </p>
      <Link href="/library" className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900">
        Volver a la biblioteca
      </Link>
    </main>
  );
}
