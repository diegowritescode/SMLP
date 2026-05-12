import { signInWithGoogle, signInWithPassword } from "@/app/(auth)/actions";
import { GoogleButton } from "@/components/auth/google-button";

interface LoginFormProps {
  nextPath: string;
}

export function LoginForm({ nextPath }: LoginFormProps) {
  return (
    <div className="space-y-4">
      <form action={signInWithPassword} className="space-y-3">
        <input type="hidden" name="next" value={nextPath} />

        <label className="block space-y-1">
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className="h-11 w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 text-sm text-[var(--text-main)] outline-none transition focus:border-[var(--accent)]"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">Password</span>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            placeholder="Your password"
            className="h-11 w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 text-sm text-[var(--text-main)] outline-none transition focus:border-[var(--accent)]"
          />
        </label>

        <button
          type="submit"
          className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[var(--text-main)] px-4 text-sm font-medium text-[var(--paper)] transition hover:opacity-90"
        >
          Sign in
        </button>
      </form>

      <div className="relative py-1 text-center text-xs text-[var(--text-muted)]">
        <span className="relative z-10 bg-[var(--surface)] px-2">or</span>
        <span className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[var(--line)]" />
      </div>

      <form action={signInWithGoogle}>
        <input type="hidden" name="next" value={nextPath} />
        <GoogleButton label="Sign in with Google" />
      </form>
    </div>
  );
}

