import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";

type AuthMode = "signin" | "signup";

interface AuthFormCardProps {
  mode: AuthMode;
  nextPath: string;
  error?: string;
  notice?: string;
  emailHint?: string;
}

function copyForError(error?: string) {
  if (!error) return null;
  if (error === "missing_credentials") return "Please enter your email and password.";
  if (error === "invalid_credentials") return "Incorrect email or password. Try again.";
  if (error === "email_not_confirmed") return "Please confirm your email before signing in.";
  if (error === "name_short") return "Full name must have at least 2 characters.";
  if (error === "email_invalid") return "Use a valid email address.";
  if (error === "password_short") return "Password must be at least 8 characters.";
  if (error === "password_mismatch") return "Passwords do not match.";
  if (error === "user_exists") return "This account already exists. Try signing in.";
  if (error === "oauth_start_failed") return "Unable to start Google sign-in. Try again.";
  return "We couldn't complete authentication. Please retry.";
}

function copyForNotice(notice?: string, emailHint?: string) {
  if (!notice) return null;
  if (notice === "check_email") {
    return `Check your inbox${emailHint ? ` (${emailHint})` : ""} and confirm your account to continue.`;
  }
  if (notice === "account_created") return "Account created successfully.";
  return null;
}

export function AuthFormCard({ mode, nextPath, error, notice, emailHint }: AuthFormCardProps) {
  const errorMessage = copyForError(error);
  const noticeMessage = copyForNotice(notice, emailHint);

  const signinHref = `/login?mode=signin&next=${encodeURIComponent(nextPath)}`;
  const signupHref = `/login?mode=signup&next=${encodeURIComponent(nextPath)}`;

  return (
    <section className="w-full max-w-[560px] rounded-[30px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_30px_80px_rgba(20,20,16,0.12)] md:p-8">
      <div className="mb-6 space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Learning Library</p>
        <h2 className="text-3xl font-semibold text-[var(--text-main)]">{mode === "signup" ? "Create your account" : "Welcome back"}</h2>
        <p className="text-sm text-[var(--text-soft)]">
          {mode === "signup"
            ? "Create a secure account to access notebooks and study guides."
            : "Sign in to continue your private study workflow."}
        </p>
      </div>

      <div className="mb-5 inline-flex rounded-full border border-[var(--line)] bg-[var(--paper)] p-1 text-sm">
        <Link
          href={signinHref}
          className={`rounded-full px-4 py-2 transition ${mode === "signin" ? "bg-[var(--text-main)] text-[var(--paper)]" : "text-[var(--text-soft)]"}`}
        >
          Sign in
        </Link>
        <Link
          href={signupHref}
          className={`rounded-full px-4 py-2 transition ${mode === "signup" ? "bg-[var(--text-main)] text-[var(--paper)]" : "text-[var(--text-soft)]"}`}
        >
          Create account
        </Link>
      </div>

      {noticeMessage ? (
        <p className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-800">{noticeMessage}</p>
      ) : null}
      {errorMessage ? <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700">{errorMessage}</p> : null}

      {mode === "signup" ? <RegisterForm nextPath={nextPath} /> : <LoginForm nextPath={nextPath} />}
    </section>
  );
}

