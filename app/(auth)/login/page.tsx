import { redirect } from "next/navigation";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";
import { AuthFormCard } from "@/components/auth/auth-form-card";
import { AuthShell } from "@/components/auth/auth-shell";
import { getCurrentUser } from "@/lib/auth/get-current-user";

interface LoginPageProps {
  searchParams: Promise<{ next?: string; error?: string; mode?: string; notice?: string; email?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser();
  if (user) {
    redirect("/library");
  }

  const params = await searchParams;
  const nextPath = params.next && params.next.startsWith("/") ? params.next : "/library";
  const mode = params.mode === "signup" ? "signup" : "signin";
  const error = params.error ? String(params.error) : undefined;
  const notice = params.notice ? String(params.notice) : undefined;
  const emailHint = params.email ? String(params.email) : undefined;

  return (
    <AuthShell
      brand={<AuthBrandPanel />}
      form={<AuthFormCard mode={mode} nextPath={nextPath} error={error} notice={notice} emailHint={emailHint} />}
    />
  );
}
