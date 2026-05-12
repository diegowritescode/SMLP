"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function getSafeNextPath(input: FormDataEntryValue | null) {
  const value = String(input || "/library");
  return value.startsWith("/") ? value : "/library";
}

function toErrorCode(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid login credentials")) return "invalid_credentials";
  if (normalized.includes("email not confirmed")) return "email_not_confirmed";
  if (normalized.includes("user already registered")) return "user_exists";
  return "auth_failed";
}

export async function signInWithGoogle(formData: FormData) {
  const supabase = await createClient();
  const headerStore = await headers();
  const nextPath = getSafeNextPath(formData.get("next"));

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

export async function signInWithPassword(formData: FormData) {
  const supabase = await createClient();
  const nextPath = getSafeNextPath(formData.get("next"));
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    redirect(`/login?mode=signin&error=missing_credentials&next=${encodeURIComponent(nextPath)}`);
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const code = toErrorCode(error.message);
    redirect(`/login?mode=signin&error=${code}&next=${encodeURIComponent(nextPath)}`);
  }

  redirect(nextPath);
}

export async function signUpWithPassword(formData: FormData) {
  const supabase = await createClient();
  const headerStore = await headers();
  const nextPath = getSafeNextPath(formData.get("next"));

  const fullName = String(formData.get("full_name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirm_password") || "");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (fullName.length < 2) {
    redirect(`/login?mode=signup&error=name_short&next=${encodeURIComponent(nextPath)}`);
  }

  if (!emailRegex.test(email)) {
    redirect(`/login?mode=signup&error=email_invalid&next=${encodeURIComponent(nextPath)}`);
  }

  if (password.length < 8) {
    redirect(`/login?mode=signup&error=password_short&next=${encodeURIComponent(nextPath)}`);
  }

  if (password !== confirmPassword) {
    redirect(`/login?mode=signup&error=password_mismatch&next=${encodeURIComponent(nextPath)}`);
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL || headerStore.get("origin") || "http://localhost:3000";
  const emailRedirectTo = `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    const code = toErrorCode(error.message);
    redirect(`/login?mode=signup&error=${code}&next=${encodeURIComponent(nextPath)}`);
  }

  if (data.session) {
    redirect(nextPath);
  }

  redirect(`/login?mode=signin&notice=check_email&email=${encodeURIComponent(email)}&next=${encodeURIComponent(nextPath)}`);
}
