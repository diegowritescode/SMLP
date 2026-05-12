import type { ReactNode } from "react";

interface AuthShellProps {
  brand: ReactNode;
  form: ReactNode;
}

export function AuthShell({ brand, form }: AuthShellProps) {
  return (
    <main className="app-shell">
      <section className="mx-auto grid min-h-[100dvh] w-full max-w-[1320px] items-stretch gap-4 p-4 md:grid-cols-[1.04fr_0.96fr] md:p-6 lg:p-8">
        <div className="hidden md:block">{brand}</div>
        <div className="flex items-center justify-center">{form}</div>
      </section>
    </main>
  );
}

