"use client";

import { useEffect, useRef, useState } from "react";
import type { MarkdownHeading } from "@/lib/content/parse-markdown";
import { TocIcon } from "@/components/ui/icons";

interface TableOfContentsProps {
  headings: MarkdownHeading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

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

  if (headings.length === 0) return null;

  return (
    <div className="relative" ref={panelRef}>
      <button type="button" onClick={() => setOpen((value) => !value)} className="icon-button-soft" aria-label="Table of contents">
        <TocIcon className="size-4" />
      </button>

      {open ? (
        <aside className="floating-panel absolute right-0 top-[calc(100%+10px)] z-50 max-h-[340px] w-[300px] overflow-auto p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Contenido</p>
          <ul className="space-y-2 text-sm">
            {headings.map((heading) => (
              <li key={`${heading.id}-${heading.level}`} className={heading.level === 1 ? "pl-0" : heading.level === 2 ? "pl-3" : "pl-6"}>
                <a
                  href={`#${heading.id}`}
                  onClick={() => setOpen(false)}
                  className="text-[var(--text-soft)] hover:text-[var(--text-main)]"
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
    </div>
  );
}
