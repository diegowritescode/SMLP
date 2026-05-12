import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateContentStructure } from "@/scripts/validate-content";

function estimateReadingMinutes(markdown: string): number {
  const words = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/[#>*_\-\[\]()]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 220));
}

async function main() {
  const currentFile = fileURLToPath(import.meta.url);
  const rootDir = path.resolve(path.dirname(currentFile), "..");
  loadEnv({ path: path.join(rootDir, ".env.local") });
  const contentDir = path.join(rootDir, "content", "books");

  const books = validateContentStructure(contentDir);

  if (books.length === 0) {
    console.log("No books found in content/books.");
    return;
  }

  const supabase = createAdminClient();
  let booksCount = 0;
  let chaptersCount = 0;

  for (const book of books) {
    const { data: bookRow, error: bookError } = await supabase
      .from("books")
      .upsert(
        {
          title: book.meta.title,
          slug: book.meta.slug,
          description: book.meta.description || null,
          category: book.meta.category || null,
          language: book.meta.language,
          cover_image: book.meta.coverImage,
          is_published: book.meta.isPublished,
        },
        { onConflict: "slug" },
      )
      .select("id, slug")
      .single();

    if (bookError || !bookRow) {
      throw new Error(`Failed to upsert book ${book.meta.slug}: ${bookError?.message ?? "Unknown error"}`);
    }

    booksCount += 1;

    for (const chapter of book.meta.chapters) {
      const chapterPath = path.join(book.absoluteDir, chapter.file);
      const markdown = await import("node:fs/promises").then((fs) => fs.readFile(chapterPath, "utf8"));
      const estimatedMinutes = estimateReadingMinutes(markdown);
      const filePath = path.posix.join("content", "books", book.directorySlug, chapter.file);

      const { error: chapterError } = await supabase.from("chapters").upsert(
        {
          book_id: bookRow.id,
          title: chapter.title,
          slug: chapter.slug,
          order_index: chapter.order,
          file_path: filePath,
          estimated_reading_minutes: estimatedMinutes,
          is_published: chapter.isPublished ?? true,
        },
        { onConflict: "book_id,slug" },
      );

      if (chapterError) {
        throw new Error(
          `Failed to upsert chapter ${book.meta.slug}/${chapter.slug}: ${chapterError.message}`,
        );
      }

      chaptersCount += 1;
    }

    console.log(`Synced book: ${book.meta.slug} (${book.meta.chapters.length} chapters)`);
  }

  console.log(`Done. Books synced: ${booksCount}. Chapters synced: ${chaptersCount}.`);
}

main().catch((error) => {
  console.error("sync-content failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
