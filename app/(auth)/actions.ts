"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signInWithGoogle(formData: FormData) {
  const supabase = await createClient();
  const headerStore = await headers();
  const nextPath = String(formData.get("next") || "/library");

  const origin = process.env.NEXT_PUBLIC_APP_URL || headerStore.get("origin") || "http://localhost:3000";
  const callbackUrl = `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl,
    },
  });

  if (error || !data.url) {
    redirect("/login?error=oauth_start_failed");
  }

  redirect(data.url);
}
