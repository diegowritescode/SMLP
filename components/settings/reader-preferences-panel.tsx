"use client";

import { useMemo, useState } from "react";

const options = [
  { label: "S", value: "15px" },
  { label: "M", value: "17px" },
  { label: "L", value: "19px" },
];

export function ReaderPreferencesPanel() {
  const initialFontSize = useMemo(() => {
    if (typeof window === "undefined") return "17px";
    return window.localStorage.getItem("reader-font-size") || "17px";
  }, []);

  const [fontSize, setFontSize] = useState(initialFontSize);

  const apply = (value: string) => {
    setFontSize(value);
    window.localStorage.setItem("reader-font-size", value);
  };

  const reset = () => {
    setFontSize("17px");
    window.localStorage.removeItem("reader-font-size");
  };

  return (
    <article className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)]/80 p-4 backdrop-blur-xl">
      <h2 className="text-base font-semibold text-[var(--text-primary)]">Preferencias de lectura</h2>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">Tamaño de fuente preferido para los capitulos.</p>

      <div className="mt-4 flex items-center gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => apply(option.value)}
            className={`rounded-full px-3 py-1 text-xs ${fontSize === option.value ? "bg-[var(--accent)] text-zinc-900" : "bg-white/70 text-[var(--text-secondary)]"}`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-full border border-[var(--border-subtle)] px-4 py-2 text-sm text-[var(--text-secondary)]"
      >
        Restablecer preferencias
      </button>
    </article>
  );
}
