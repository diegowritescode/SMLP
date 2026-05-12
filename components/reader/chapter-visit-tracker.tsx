"use client";

import { useEffect } from "react";

interface ChapterVisitTrackerProps {
  bookId: string;
  chapterId: string;
}

export function ChapterVisitTracker({ bookId, chapterId }: ChapterVisitTrackerProps) {
  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/progress/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId, chapterId, progressPercent: 20 }),
      signal: controller.signal,
      keepalive: true,
    }).catch(() => undefined);

    return () => controller.abort();
  }, [bookId, chapterId]);

  return null;
}
