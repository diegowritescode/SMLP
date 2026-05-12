import type { ReactNode } from "react";

interface AuthShellProps {
  brand: ReactNode;
  form: ReactNode;
}

export function AuthShell({ brand, form }: AuthShellProps) {
  return (
    <main className="min-h-[100dvh] bg-[#f7f7f4]">
      <section className="grid min-h-[100dvh] w-full lg:grid-cols-[minmax(360px,38vw)_1fr]">
        <div className="hidden lg:block">{brand}</div>
        <div className="flex min-h-[100dvh] flex-col bg-white">
          <div className="relative h-48 overflow-hidden lg:hidden">{brand}</div>
          <div className="flex flex-1 items-center justify-center px-6 py-8 sm:px-10">{form}</div>
        </div>
      </section>
    </main>
  );
}
