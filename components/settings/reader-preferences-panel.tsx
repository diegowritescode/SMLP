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
    <article className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Preferencias de lectura</h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">Tamaño de fuente preferido para los capitulos.</p>

      <div className="mt-4 flex items-center gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => apply(option.value)}
            className={`rounded-md px-3 py-1 text-xs ${fontSize === option.value ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"}`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <button type="button" onClick={reset} className="mt-4 rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700">
        Restablecer preferencias
      </button>
    </article>
  );
}
