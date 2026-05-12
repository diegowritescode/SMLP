import type { ReactNode } from "react";
import Link from "next/link";
import { requireUser } from "@/lib/auth/require-user";
import { signOutAction } from "@/app/(dashboard)/actions";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("role").eq("user_id", user.id).maybeSingle();
  const isAdmin = profile?.role === "admin";

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Secure Markdown Reader</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/library" className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700">
            Library
          </Link>
          {isAdmin ? (
            <Link href="/admin" className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700">
              Admin
            </Link>
          ) : null}
          <form action={signOutAction}>
            <button className="rounded-md bg-zinc-900 px-3 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900" type="submit">
              Logout
            </button>
          </form>
        </div>
      </header>
      {children}
    </main>
  );
}
