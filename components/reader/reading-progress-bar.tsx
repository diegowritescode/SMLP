"use client";

import { useEffect, useState } from "react";

interface ReadingProgressBarProps {
  completed: boolean;
}

export function ReadingProgressBar({ completed }: ReadingProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (completed) return;

    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const percent = Math.min(100, Math.max(0, Math.round((window.scrollY / total) * 100)));
      setProgress(percent);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [completed]);

  return (
    <div className="sticky top-0 z-30 h-1 w-full bg-[var(--surface-muted)]/80">
      <div className="h-full bg-[var(--accent)] transition-[width] duration-150" style={{ width: `${completed ? 100 : progress}%` }} />
    </div>
  );
}
