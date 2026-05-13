import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@/lib/supabase/server";
import { normalizeNotebookMarkdown } from "@/lib/content/normalize-notebook-markdown";

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

interface ChapterQueryOptions {
  includeUnpublished?: boolean;
}

export async function getChapterBySlugs(
  bookSlug: string,
  chapterSlug: string,
  options?: ChapterQueryOptions,
): Promise<ChapterDetail | null> {
  const supabase = await createClient();

  const { data: book } = await supabase.from("books").select("id, slug, title").eq("slug", bookSlug).maybeSingle();
  if (!book) return null;

  const { data: chapters } = await supabase
    .from("chapters")
    .select("id, slug, title, order_index, file_path, estimated_reading_minutes, is_published")
    .eq("book_id", book.id)
    .order("order_index", { ascending: true });

  const includeUnpublished = options?.includeUnpublished ?? false;
  const list = (chapters ?? []).filter((entry) => includeUnpublished || entry.is_published);
  const chapter = list.find((entry) => entry.slug === chapterSlug);
  if (!chapter) return null;

  const currentIndex = list.findIndex((entry) => entry.id === chapter.id);
  const previous = currentIndex > 0 ? list[currentIndex - 1] : null;
  const next = currentIndex < list.length - 1 ? list[currentIndex + 1] : null;

  const absolutePath = path.join(process.cwd(), chapter.file_path);
  const markdownRaw = await fs.readFile(absolutePath, "utf8");
  const markdown = normalizeNotebookMarkdown(markdownRaw);

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
