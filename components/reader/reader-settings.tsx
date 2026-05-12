"use client";

import { useEffect, useRef, useState } from "react";
import { TypeIcon } from "@/components/ui/icons";
import {
  applyReaderPreferences,
  defaultReaderPreferences,
  loadReaderPreferences,
  saveReaderPreferences,
  type ReaderColumnsMode,
  type ReaderFontFamily,
  type ReaderPreferences,
  type ReaderTheme,
} from "@/lib/reader/preferences";

const themeOptions: Array<{ value: ReaderTheme; label: string; colors: [string, string, string] }> = [
  { value: "clean-paper", label: "Clean", colors: ["#e8f1ec", "#fffdf8", "#9bc455"] },
  { value: "warm-sepia", label: "Sepia", colors: ["#efe9de", "#fffcf5", "#b79e57"] },
  { value: "sage-green", label: "Green", colors: ["#e5efe8", "#fffdf7", "#89b05f"] },
  { value: "graphite-night", label: "Night", colors: ["#131518", "#21252a", "#aacd69"] },
  { value: "focus-ink", label: "Focus", colors: ["#edf1f4", "#ffffff", "#5f9d5f"] },
];

const fontOptions: Array<{ value: ReaderFontFamily; label: string }> = [
  { value: "source-serif", label: "Source Serif" },
  { value: "literata", label: "Literata" },
  { value: "lora", label: "Lora" },
];

const fontSizeOptions = [
  { label: "S", value: "1.02rem" },
  { label: "M", value: "1.1rem" },
  { label: "L", value: "1.18rem" },
  { label: "XL", value: "1.26rem" },
];

const lineHeightOptions = [
  { label: "1.65", value: "1.65" },
  { label: "1.72", value: "1.72" },
  { label: "1.80", value: "1.8" },
];

const columnOptions: Array<{ label: string; value: ReaderColumnsMode }> = [
  { label: "2 columnas", value: "spread" },
  { label: "1 columna", value: "single" },
];

export function ReaderSettings() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [prefs, setPrefs] = useState<ReaderPreferences>(() => {
    if (typeof window === "undefined") return defaultReaderPreferences;
    return loadReaderPreferences();
  });

  useEffect(() => {
    const saved = saveReaderPreferences(prefs);
    applyReaderPreferences(saved);
  }, [prefs]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", onPointerDown);
      return () => document.removeEventListener("mousedown", onPointerDown);
    }

    return;
  }, [open]);

  const isActivePill = (active: boolean) =>
    `rounded-full border px-3 py-1 text-xs transition-colors ${
      active
        ? "border-[var(--accent)] bg-[var(--accent)] text-zinc-900"
        : "border-[var(--line)] bg-[var(--paper)] text-[var(--text-soft)] hover:text-[var(--text-main)]"
    }`;

  return (
    <div className="relative" ref={panelRef}>
      <button type="button" onClick={() => setOpen((value) => !value)} className="icon-button-soft" aria-label="Reader settings">
        <TypeIcon className="size-4" />
      </button>

      {open ? (
        <section className="floating-panel absolute right-0 top-[calc(100%+10px)] z-50 w-[340px] max-w-[calc(100vw-20px)] p-4">
          <p className="mb-3 text-xs uppercase tracking-wide text-[var(--text-muted)]">Apariencia de lectura</p>

          <div className="space-y-2">
            <p className="text-xs text-[var(--text-soft)]">Tema</p>
            <div className="grid grid-cols-5 gap-2">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPrefs((prev) => ({ ...prev, theme: option.value }))}
                  className={`reader-theme-swatch p-1 ${prefs.theme === option.value ? "ring-2 ring-[var(--accent)] ring-offset-1 ring-offset-transparent" : ""}`}
                  title={option.label}
                  aria-label={`Tema ${option.label}`}
                >
                  <span
                    className="block h-7 w-full rounded-[10px]"
                    style={{
                      background: `linear-gradient(120deg, ${option.colors[0]} 0%, ${option.colors[1]} 70%)`,
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-xs text-[var(--text-soft)]">Fuente</p>
            <div className="flex flex-wrap gap-2">
              {fontOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPrefs((prev) => ({ ...prev, fontFamily: option.value }))}
                  className={isActivePill(prefs.fontFamily === option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-xs text-[var(--text-soft)]">Tamaño</p>
            <div className="flex flex-wrap gap-2">
              {fontSizeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPrefs((prev) => ({ ...prev, fontSize: option.value }))}
                  className={isActivePill(prefs.fontSize === option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-xs text-[var(--text-soft)]">Interlineado</p>
            <div className="flex flex-wrap gap-2">
              {lineHeightOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPrefs((prev) => ({ ...prev, lineHeight: option.value }))}
                  className={isActivePill(prefs.lineHeight === option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-xs text-[var(--text-soft)]">Columnas</p>
            <div className="flex flex-wrap gap-2">
              {columnOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPrefs((prev) => ({ ...prev, columns: option.value }))}
                  className={isActivePill(prefs.columns === option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
