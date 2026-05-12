export type ReaderTheme = "clean-paper" | "warm-sepia" | "sage-green" | "graphite-night" | "focus-ink";
export type ReaderFontFamily = "source-serif" | "literata" | "lora";
export type ReaderColumnsMode = "spread" | "single";

export interface ReaderPreferences {
  theme: ReaderTheme;
  fontFamily: ReaderFontFamily;
  fontSize: string;
  lineHeight: string;
  columns: ReaderColumnsMode;
}

export const READER_PREFERENCES_KEY = "reader-preferences-v1";
export const READER_PREFERENCES_EVENT = "reader-preferences-updated";

export const defaultReaderPreferences: ReaderPreferences = {
  theme: "clean-paper",
  fontFamily: "source-serif",
  fontSize: "1.1rem",
  lineHeight: "1.72",
  columns: "spread",
};

const allowedThemes = new Set<ReaderTheme>(["clean-paper", "warm-sepia", "sage-green", "graphite-night", "focus-ink"]);
const allowedFonts = new Set<ReaderFontFamily>(["source-serif", "literata", "lora"]);
const allowedColumns = new Set<ReaderColumnsMode>(["spread", "single"]);
const allowedFontSizes = new Set(["1.02rem", "1.1rem", "1.18rem", "1.26rem"]);
const allowedLineHeights = new Set(["1.65", "1.72", "1.8"]);

function readRaw(): Partial<ReaderPreferences> {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(READER_PREFERENCES_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as Partial<ReaderPreferences>;
    return parsed;
  } catch {
    return {};
  }
}

export function normalizeReaderPreferences(input: Partial<ReaderPreferences> | null | undefined): ReaderPreferences {
  const source = input ?? {};

  return {
    theme: allowedThemes.has(source.theme as ReaderTheme) ? (source.theme as ReaderTheme) : defaultReaderPreferences.theme,
    fontFamily: allowedFonts.has(source.fontFamily as ReaderFontFamily)
      ? (source.fontFamily as ReaderFontFamily)
      : defaultReaderPreferences.fontFamily,
    fontSize: allowedFontSizes.has(source.fontSize ?? "") ? (source.fontSize as string) : defaultReaderPreferences.fontSize,
    lineHeight: allowedLineHeights.has(source.lineHeight ?? "")
      ? (source.lineHeight as string)
      : defaultReaderPreferences.lineHeight,
    columns: allowedColumns.has(source.columns as ReaderColumnsMode)
      ? (source.columns as ReaderColumnsMode)
      : defaultReaderPreferences.columns,
  };
}

export function loadReaderPreferences(): ReaderPreferences {
  const persisted = readRaw();
  return normalizeReaderPreferences(persisted);
}

export function saveReaderPreferences(next: Partial<ReaderPreferences>): ReaderPreferences {
  if (typeof window === "undefined") {
    return normalizeReaderPreferences(next);
  }

  const current = loadReaderPreferences();
  const merged = normalizeReaderPreferences({ ...current, ...next });
  window.localStorage.setItem(READER_PREFERENCES_KEY, JSON.stringify(merged));
  window.dispatchEvent(new CustomEvent(READER_PREFERENCES_EVENT, { detail: merged }));
  return merged;
}

function fontFamilyValue(font: ReaderFontFamily): string {
  if (font === "literata") return "var(--font-reader-literata)";
  if (font === "lora") return "var(--font-reader-lora)";
  return "var(--font-reader-source-serif)";
}

export function applyReaderPreferences(preferences: ReaderPreferences) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  root.dataset.readerTheme = preferences.theme;
  root.dataset.readerColumns = preferences.columns;
  root.style.setProperty("--reader-font-size", preferences.fontSize);
  root.style.setProperty("--reader-line-height", preferences.lineHeight);
  root.style.setProperty("--reader-font-family", fontFamilyValue(preferences.fontFamily));
}

export function resetReaderPreferences(): ReaderPreferences {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(READER_PREFERENCES_KEY);
  }

  const defaults = { ...defaultReaderPreferences };
  applyReaderPreferences(defaults);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(READER_PREFERENCES_EVENT, { detail: defaults }));
  }
  return defaults;
}

