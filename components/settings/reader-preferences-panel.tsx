"use client";

import { useEffect, useState } from "react";
import {
  applyReaderPreferences,
  defaultReaderPreferences,
  loadReaderPreferences,
  resetReaderPreferences,
  saveReaderPreferences,
  type ReaderColumnsMode,
  type ReaderFontFamily,
  type ReaderPreferences,
  type ReaderTheme,
} from "@/lib/reader/preferences";

const themeOptions: Array<{ value: ReaderTheme; label: string; description: string; colors: [string, string, string] }> = [
  {
    value: "clean-paper",
    label: "Clean Paper",
    description: "Blanco limpio y balanceado para lectura diaria.",
    colors: ["#e8f1ec", "#fffdf8", "#9bc455"],
  },
  {
    value: "warm-sepia",
    label: "Warm Sepia",
    description: "Tono cálido para sesiones largas sin fatiga.",
    colors: ["#efe9de", "#fffcf5", "#b79e57"],
  },
  {
    value: "sage-green",
    label: "Sage Green",
    description: "Tema suave con acento verde editorial.",
    colors: ["#e5efe8", "#fffdf7", "#89b05f"],
  },
  {
    value: "graphite-night",
    label: "Graphite Night",
    description: "Contraste alto para lectura nocturna.",
    colors: ["#131518", "#21252a", "#aacd69"],
  },
  {
    value: "focus-ink",
    label: "Focus Ink",
    description: "Fondo neutro y texto tinta para análisis técnico.",
    colors: ["#edf1f4", "#ffffff", "#5f9d5f"],
  },
];

const fontOptions: Array<{ value: ReaderFontFamily; label: string }> = [
  { value: "source-serif", label: "Source Serif 4" },
  { value: "lora", label: "Lora" },
  { value: "merriweather", label: "Merriweather" },
  { value: "noto-serif", label: "Noto Serif" },
  { value: "ibm-plex-serif", label: "IBM Plex Serif" },
  { value: "inter", label: "Inter (Tech)" },
  { value: "ibm-plex-sans", label: "IBM Plex Sans (Tech)" },
];

const sizeOptions = [
  { value: "1.02rem", label: "S" },
  { value: "1.1rem", label: "M" },
  { value: "1.18rem", label: "L" },
  { value: "1.26rem", label: "XL" },
];

const lineHeightOptions = [
  { value: "1.65", label: "Compacto" },
  { value: "1.72", label: "Normal" },
  { value: "1.8", label: "Amplio" },
];

const columnsOptions: Array<{ value: ReaderColumnsMode; label: string }> = [
  { value: "spread", label: "Doble columna" },
  { value: "single", label: "Columna única" },
];

export function ReaderPreferencesPanel() {
  const [prefs, setPrefs] = useState<ReaderPreferences>(() => {
    if (typeof window === "undefined") return defaultReaderPreferences;
    return loadReaderPreferences();
  });

  useEffect(() => {
    const saved = saveReaderPreferences(prefs);
    applyReaderPreferences(saved);
  }, [prefs]);

  const isSelectedPill = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-xs transition-colors ${
      active
        ? "border-[var(--accent)] bg-[var(--accent)] text-zinc-900"
        : "border-[var(--line)] bg-[var(--paper)] text-[var(--text-soft)] hover:text-[var(--text-main)]"
    }`;

  return (
    <article className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)]/80 p-5 backdrop-blur-xl">
      <h2 className="text-base font-semibold text-[var(--text-primary)]">Apariencia de lectura</h2>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">Tema, tipografía y maquetación para contenido financiero/técnico.</p>

      <section className="mt-5">
        <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Temas</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {themeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPrefs((prev) => ({ ...prev, theme: option.value }))}
              className={`rounded-xl border p-3 text-left transition ${
                prefs.theme === option.value
                  ? "border-[var(--accent)] bg-[var(--accent-soft)]/70"
                  : "border-[var(--line)] bg-[var(--paper)]/75 hover:bg-[var(--paper)]"
              }`}
            >
              <span
                className="mb-2 block h-10 w-full rounded-lg border border-[var(--line)]"
                style={{
                  background: `linear-gradient(120deg, ${option.colors[0]} 0%, ${option.colors[1]} 68%)`,
                }}
              />
              <p className="text-sm font-medium text-[var(--text-main)]">{option.label}</p>
              <p className="mt-1 text-xs text-[var(--text-soft)]">{option.description}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-5">
        <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Tipografía</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {fontOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPrefs((prev) => ({ ...prev, fontFamily: option.value }))}
              className={isSelectedPill(prefs.fontFamily === option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Tamaño</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {sizeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setPrefs((prev) => ({ ...prev, fontSize: option.value }))}
                className={isSelectedPill(prefs.fontSize === option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Interlineado</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {lineHeightOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setPrefs((prev) => ({ ...prev, lineHeight: option.value }))}
                className={isSelectedPill(prefs.lineHeight === option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Columnas</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {columnsOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setPrefs((prev) => ({ ...prev, columns: option.value }))}
                className={isSelectedPill(prefs.columns === option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={() => setPrefs(resetReaderPreferences())}
        className="mt-5 rounded-full border border-[var(--border-subtle)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--paper)]"
      >
        Restablecer preferencias
      </button>

      <p className="mt-3 text-xs text-[var(--text-muted)]">
        Persistencia actual: localStorage (MVP). Opcional futuro: migrar a tabla `user_reader_preferences` por usuario.
      </p>
    </article>
  );
}
