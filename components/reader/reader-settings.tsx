"use client";

import { useEffect, useState } from "react";

interface ReaderSettingsProps {
  containerId: string;
}

const options = [
  { label: "S", value: "15px" },
  { label: "M", value: "17px" },
  { label: "L", value: "19px" },
];

export function ReaderSettings({ containerId }: ReaderSettingsProps) {
  const [fontSize, setFontSize] = useState(() => {
    if (typeof window === "undefined") return "17px";
    return window.localStorage.getItem("reader-font-size") || "17px";
  });

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.style.fontSize = fontSize;
    window.localStorage.setItem("reader-font-size", fontSize);
  }, [fontSize, containerId]);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Lectura</p>
      <div className="flex items-center gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFontSize(option.value)}
            className={`rounded-md px-3 py-1 text-xs ${fontSize === option.value ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
