import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth/require-user";
import { createClient } from "@/lib/supabase/server";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { DashboardHeader } from "@/components/layout/dashboard-header";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();
  const isAdmin = profile?.role === "admin";

  return (
    <main className="app-shell">
      <div className="app-frame">
        <div className="grid min-h-[calc(100vh-32px)] md:grid-cols-[210px_1fr]">
          <AppSidebar isAdmin={isAdmin} userEmail={user.email ?? null} />

          <section className="relative px-4 pb-20 pt-4 md:px-8 md:pb-8 md:pt-6">
            <DashboardHeader userEmail={user.email ?? ""} />
            {children}
          </section>
        </div>
      </div>

      <MobileNav isAdmin={isAdmin} />
    </main>
  );
}
