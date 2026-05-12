import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@/lib/supabase/server";

export interface ChapterDetail {
  id: string;
  bookId: string;
  bookSlug: string;
  bookTitle: string;
  chapterSlug: string;
  chapterTitle: string;
  orderIndex: number;
  estimatedReadingMinutes: number | null;
  markdown: string;
  previousChapterSlug: string | null;
  nextChapterSlug: string | null;
}

export async function getChapterBySlugs(bookSlug: string, chapterSlug: string): Promise<ChapterDetail | null> {
  const supabase = await createClient();

  const { data: book } = await supabase.from("books").select("id, slug, title").eq("slug", bookSlug).maybeSingle();
  if (!book) return null;

  const { data: chapters } = await supabase
    .from("chapters")
    .select("id, slug, title, order_index, file_path, estimated_reading_minutes")
    .eq("book_id", book.id)
    .order("order_index", { ascending: true });

  const list = chapters ?? [];
  const chapter = list.find((entry) => entry.slug === chapterSlug);
  if (!chapter) return null;

  const currentIndex = list.findIndex((entry) => entry.id === chapter.id);
  const previous = currentIndex > 0 ? list[currentIndex - 1] : null;
  const next = currentIndex < list.length - 1 ? list[currentIndex + 1] : null;

  const root = process.cwd();
  const absolutePath = path.join(root, chapter.file_path);
  const markdown = await fs.readFile(absolutePath, "utf8");

  return {
    id: chapter.id,
    bookId: book.id,
    bookSlug: book.slug,
    bookTitle: book.title,
    chapterSlug: chapter.slug,
    chapterTitle: chapter.title,
    orderIndex: chapter.order_index,
    estimatedReadingMinutes: chapter.estimated_reading_minutes,
    markdown,
    previousChapterSlug: previous?.slug ?? null,
    nextChapterSlug: next?.slug ?? null,
  };
}
