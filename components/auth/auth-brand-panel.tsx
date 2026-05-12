import Image from "next/image";

export function AuthBrandPanel() {
  return (
    <aside className="relative h-full overflow-hidden">
      <Image
        src="/auth/auth-study-hero.jpg"
        alt="Study desk with notebook and laptop"
        fill
        priority
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 38vw"
      />
      <div className="absolute inset-0 bg-[linear-gradient(165deg,rgba(8,10,14,0.38)_0%,rgba(8,10,14,0.22)_34%,rgba(8,10,14,0.70)_100%)]" />

      <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white md:p-8 lg:p-10">
        <div>
          <p className="inline-flex items-center rounded-full border border-white/30 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
            Secure Reader
          </p>
        </div>

        <div className="space-y-2 lg:space-y-3">
          <h1 className="max-w-[20ch] text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-4xl">
            Turn every notebook into focused learning.
          </h1>
          <p className="max-w-[52ch] text-sm text-white/85 lg:text-base">
            Private financial notebooks, strategies and learning resources in one secure reader.
          </p>
        </div>
      </div>
    </aside>
  );
}
