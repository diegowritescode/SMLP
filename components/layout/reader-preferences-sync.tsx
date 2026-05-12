"use client";

import { useEffect } from "react";
import {
  READER_PREFERENCES_KEY,
  READER_PREFERENCES_EVENT,
  applyReaderPreferences,
  defaultReaderPreferences,
  loadReaderPreferences,
  normalizeReaderPreferences,
  type ReaderPreferences,
} from "@/lib/reader/preferences";

export function ReaderPreferencesSync() {
  useEffect(() => {
    applyReaderPreferences(loadReaderPreferences());

    function onStorage(event: StorageEvent) {
      if (event.key !== null && event.key !== READER_PREFERENCES_KEY) return;
      applyReaderPreferences(loadReaderPreferences());
    }

    function onUpdate(event: Event) {
      const detail = (event as CustomEvent<ReaderPreferences>).detail;
      applyReaderPreferences(normalizeReaderPreferences(detail ?? defaultReaderPreferences));
    }

    window.addEventListener("storage", onStorage);
    window.addEventListener(READER_PREFERENCES_EVENT, onUpdate as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(READER_PREFERENCES_EVENT, onUpdate as EventListener);
    };
  }, []);

  return null;
}
