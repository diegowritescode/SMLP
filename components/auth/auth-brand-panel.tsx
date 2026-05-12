export function AuthBrandPanel() {
  return (
    <aside className="relative h-full overflow-hidden rounded-[30px] border border-[var(--line)] bg-[linear-gradient(155deg,rgba(255,255,255,0.92),rgba(228,242,233,0.7))] p-8 shadow-[0_30px_80px_rgba(20,20,16,0.10)]">
      <div className="absolute -left-14 top-10 size-48 rounded-full bg-[var(--accent-soft)]/70 blur-2xl" />
      <div className="absolute bottom-8 right-0 size-56 rounded-full bg-white/55 blur-2xl" />

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)]/90 px-4 py-2 text-xs tracking-[0.18em] text-[var(--text-muted)]">
            SECURE READER
          </div>

          <div className="space-y-4">
            <h1 className="max-w-[18ch] text-4xl font-semibold leading-tight text-[var(--text-main)] lg:text-5xl">
              Learning library for serious study work.
            </h1>
            <p className="max-w-[52ch] text-sm text-[var(--text-soft)] lg:text-base">
              Access financial notebooks, strategy guides and private learning resources with invitation-based permissions.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <article className="rounded-2xl border border-[var(--line)] bg-[var(--paper)]/88 p-4">
            <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Protected</p>
            <p className="mt-1 text-sm font-medium text-[var(--text-main)]">Private resources</p>
          </article>
          <article className="rounded-2xl border border-[var(--line)] bg-[var(--paper)]/88 p-4">
            <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Track</p>
            <p className="mt-1 text-sm font-medium text-[var(--text-main)]">Study progress</p>
          </article>
          <article className="rounded-2xl border border-[var(--line)] bg-[var(--paper)]/88 p-4">
            <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Focused</p>
            <p className="mt-1 text-sm font-medium text-[var(--text-main)]">Editorial reader</p>
          </article>
        </div>
      </div>
    </aside>
  );
}

