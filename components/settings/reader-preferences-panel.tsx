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
  {
    value: "github-slate",
    label: "GitHub Slate",
    description: "Oscuro gris-azul estilo GitHub, ideal para sesiones nocturnas.",
    colors: ["#0f1722", "#1f2937", "#2f81f7"],
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
    `rounded-full border px-3.5 py-2 text-sm font-medium transition-colors ${
      active
        ? "border-[var(--text-main)] bg-[var(--text-main)] text-[var(--paper)]"
        : "border-[var(--line)] bg-[var(--surface)] text-[var(--text-soft)] hover:text-[var(--text-main)] hover:bg-[var(--paper-soft)]"
    }`;

  return (
    <article className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_10px_24px_rgba(20,20,16,0.06)]">
      <h2 className="text-xl font-semibold text-[var(--text-main)]">Apariencia de lectura</h2>
      <p className="mt-1 text-base text-[var(--text-soft)]">Tema, tipografía y maquetación para contenido financiero/técnico.</p>

      <section className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">Temas</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {themeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPrefs((prev) => ({ ...prev, theme: option.value }))}
                className={`rounded-xl border p-3 text-left transition ${
                  prefs.theme === option.value
                  ? "border-[var(--text-main)] bg-[var(--paper-soft)]"
                  : "border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--paper-soft)]"
                }`}
              >
              <span
                className="mb-2 block h-10 w-full rounded-lg border border-[var(--line)]"
                style={{
                  background: `linear-gradient(120deg, ${option.colors[0]} 0%, ${option.colors[1]} 68%)`,
                }}
              />
              <p className="text-base font-semibold text-[var(--text-main)]">{option.label}</p>
              <p className="mt-1 text-sm text-[var(--text-soft)]">{option.description}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">Tipografía</p>
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">Tamaño</p>
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">Interlineado</p>
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">Columnas</p>
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
        className="mt-5 rounded-full border border-[var(--line)] px-4 py-2 text-base font-medium text-[var(--text-soft)] hover:bg-[var(--paper-soft)]"
      >
        Restablecer preferencias
      </button>

      <p className="mt-3 text-sm text-[var(--text-muted)]">
        Persistencia actual: localStorage (MVP). Opcional futuro: migrar a tabla `user_reader_preferences` por usuario.
      </p>
    </article>
  );
}
