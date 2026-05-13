"use client";

import { isValidElement, useEffect, useMemo, useState, type ReactNode } from "react";
import { READER_PREFERENCES_EVENT, loadReaderPreferences } from "@/lib/reader/preferences";

interface CollapsibleCodeBlockProps {
  children?: ReactNode;
}

function toPlainText(value: ReactNode): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (!value) return "";
  if (Array.isArray(value)) return value.map(toPlainText).join("");
  if (isValidElement<{ children?: ReactNode }>(value)) {
    return toPlainText(value.props.children);
  }
  return "";
}

function extractCode(children?: ReactNode) {
  const nodes = Array.isArray(children) ? children : [children];
  const childElement = nodes.find((node) => isValidElement(node));

  if (isValidElement<{ className?: string; children?: ReactNode }>(childElement)) {
    const text = toPlainText(childElement.props.children).replace(/\n$/, "");
    return { text, className: childElement.props.className ?? "" };
  }

  return { text: toPlainText(children).replace(/\n$/, ""), className: "" };
}

export function CollapsibleCodeBlock({ children }: CollapsibleCodeBlockProps) {
  const [codeMode, setCodeMode] = useState(() => {
    if (typeof window === "undefined") return "notebook";
    return loadReaderPreferences().codeMode;
  });

  useEffect(() => {
    const onUpdate = () => {
      setCodeMode(loadReaderPreferences().codeMode);
    };

    window.addEventListener(READER_PREFERENCES_EVENT, onUpdate as EventListener);
    return () => window.removeEventListener(READER_PREFERENCES_EVENT, onUpdate as EventListener);
  }, []);

  const { text, className } = useMemo(() => extractCode(children), [children]);
  const lineCount = Math.max(1, text.split("\n").length);

  if (codeMode === "notebook") {
    return (
      <pre>
        <code className={className}>{text}</code>
      </pre>
    );
  }

  return (
    <details className="reader-code-collapsible">
      <summary>
        <span>Codigo ({lineCount} lineas)</span>
        <span className="reader-code-collapsible-hint">Expandir</span>
      </summary>
      <pre>
        <code className={className}>{text}</code>
      </pre>
    </details>
  );
}
