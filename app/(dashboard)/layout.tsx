import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth/require-user";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await requireUser();

  return <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8">{children}</main>;
}
