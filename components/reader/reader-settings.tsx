"use client";

import { useEffect, useRef, useState } from "react";
import { TypeIcon } from "@/components/ui/icons";

interface ReaderSettingsProps {
  containerId: string;
}

const fontOptions = [
  { label: "S", value: "1.02rem" },
  { label: "M", value: "1.12rem" },
  { label: "L", value: "1.22rem" },
];

const lineHeightOptions = [
  { label: "Compacto", value: "1.62" },
  { label: "Normal", value: "1.72" },
  { label: "Amplio", value: "1.82" },
];

export function ReaderSettings({ containerId }: ReaderSettingsProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const [fontSize, setFontSize] = useState(() => {
    if (typeof window === "undefined") return "1.12rem";
    return window.localStorage.getItem("reader-font-size") || "1.12rem";
  });

  const [lineHeight, setLineHeight] = useState(() => {
    if (typeof window === "undefined") return "1.72";
    return window.localStorage.getItem("reader-line-height") || "1.72";
  });

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.style.setProperty("--reader-font-size", fontSize);
    window.localStorage.setItem("reader-font-size", fontSize);
  }, [fontSize, containerId]);

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.style.setProperty("--reader-line-height", lineHeight);
    window.localStorage.setItem("reader-line-height", lineHeight);
  }, [lineHeight, containerId]);

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

  return (
    <div className="relative" ref={panelRef}>
      <button type="button" onClick={() => setOpen((value) => !value)} className="icon-button-soft" aria-label="Reader settings">
        <TypeIcon className="size-4" />
      </button>

      {open ? (
        <div className="floating-panel absolute right-0 top-[calc(100%+10px)] z-50 w-[280px] p-4">
          <p className="mb-2 text-xs uppercase tracking-wide text-[var(--text-muted)]">Ajustes</p>

          <div className="mb-3">
            <p className="mb-2 text-xs text-[var(--text-soft)]">Tamaño</p>
            <div className="flex gap-2">
              {fontOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFontSize(option.value)}
                  className={`rounded-full px-3 py-1 text-xs ${fontSize === option.value ? "bg-[var(--accent)] text-zinc-900" : "bg-white/80 text-[var(--text-soft)]"}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs text-[var(--text-soft)]">Interlineado</p>
            <div className="flex flex-wrap gap-2">
              {lineHeightOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setLineHeight(option.value)}
                  className={`rounded-full px-3 py-1 text-xs ${lineHeight === option.value ? "bg-[var(--accent)] text-zinc-900" : "bg-white/80 text-[var(--text-soft)]"}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
