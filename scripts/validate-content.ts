import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface ChapterMeta {
  title: string;
  slug: string;
  file: string;
  order: number;
  isPublished?: boolean;
}

export interface BookMeta {
  title: string;
  slug: string;
  description?: string;
  category?: string;
  language?: string;
  coverImage?: string | null;
  isPublished?: boolean;
  chapters: ChapterMeta[];
}

export interface ValidatedBook {
  directorySlug: string;
  absoluteDir: string;
  meta: Required<Omit<BookMeta, "coverImage">> & { coverImage: string | null };
}

function assertNonEmptyString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string`);
  }
  return value.trim();
}

function assertSlug(value: string, label: string): string {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    throw new Error(`${label} must be kebab-case (lowercase letters, numbers, hyphen)`);
  }
  return value;
}

function assertPositiveInt(value: unknown, label: string): number {
  if (!Number.isInteger(value) || Number(value) <= 0) {
    throw new Error(`${label} must be a positive integer`);
  }
  return Number(value);
}

function assertChapter(chapter: unknown, index: number): ChapterMeta {
  if (!chapter || typeof chapter !== "object") {
    throw new Error(`chapters[${index}] must be an object`);
  }

  const record = chapter as Record<string, unknown>;
  return {
    title: assertNonEmptyString(record.title, `chapters[${index}].title`),
    slug: assertSlug(assertNonEmptyString(record.slug, `chapters[${index}].slug`), `chapters[${index}].slug`),
    file: assertNonEmptyString(record.file, `chapters[${index}].file`),
    order: assertPositiveInt(record.order, `chapters[${index}].order`),
    isPublished: record.isPublished === undefined ? true : Boolean(record.isPublished),
  };
}

function parseBookJson(absolutePath: string): BookMeta {
  const raw = fs.readFileSync(absolutePath, "utf8");
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`Invalid JSON in ${absolutePath}`);
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error(`book.json at ${absolutePath} must be an object`);
  }

  const record = parsed as Record<string, unknown>;
  const chaptersRaw = record.chapters;

  if (!Array.isArray(chaptersRaw) || chaptersRaw.length === 0) {
    throw new Error(`book.json at ${absolutePath} must contain a non-empty chapters array`);
  }

  return {
    title: assertNonEmptyString(record.title, "book.title"),
    slug: assertSlug(assertNonEmptyString(record.slug, "book.slug"), "book.slug"),
    description: typeof record.description === "string" ? record.description.trim() : "",
    category: typeof record.category === "string" ? record.category.trim() : "",
    language: typeof record.language === "string" && record.language.trim() ? record.language.trim() : "es",
    coverImage: typeof record.coverImage === "string" ? record.coverImage : null,
    isPublished: record.isPublished === undefined ? false : Boolean(record.isPublished),
    chapters: chaptersRaw.map((chapter, index) => assertChapter(chapter, index)),
  };
}

function validateChapterFiles(bookDir: string, chapters: ChapterMeta[]) {
  const orderSet = new Set<number>();
  const slugSet = new Set<string>();

  chapters.forEach((chapter, index) => {
    if (orderSet.has(chapter.order)) {
      throw new Error(`Duplicate chapter order in ${bookDir}: ${chapter.order}`);
    }

    if (slugSet.has(chapter.slug)) {
      throw new Error(`Duplicate chapter slug in ${bookDir}: ${chapter.slug}`);
    }

    orderSet.add(chapter.order);
    slugSet.add(chapter.slug);

    const absoluteChapterPath = path.join(bookDir, chapter.file);
    if (!fs.existsSync(absoluteChapterPath)) {
      throw new Error(`Missing chapter file at index ${index}: ${absoluteChapterPath}`);
    }
  });
}

export function validateContentStructure(baseDir: string): ValidatedBook[] {
  if (!fs.existsSync(baseDir)) {
    throw new Error(`Content directory does not exist: ${baseDir}`);
  }

  const directories = fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  return directories.map((directorySlug) => {
    const absoluteDir = path.join(baseDir, directorySlug);
    const bookJsonPath = path.join(absoluteDir, "book.json");

    if (!fs.existsSync(bookJsonPath)) {
      throw new Error(`Missing book.json in ${absoluteDir}`);
    }

    const meta = parseBookJson(bookJsonPath);
    validateChapterFiles(absoluteDir, meta.chapters);

    if (meta.slug !== directorySlug) {
      throw new Error(`book.slug (${meta.slug}) must match folder name (${directorySlug})`);
    }

    return {
      directorySlug,
      absoluteDir,
      meta: {
        title: meta.title,
        slug: meta.slug,
        description: meta.description ?? "",
        category: meta.category ?? "",
        language: meta.language ?? "es",
        coverImage: meta.coverImage ?? null,
        isPublished: meta.isPublished ?? false,
        chapters: meta.chapters,
      },
    };
  });
}

function runCli() {
  const currentFile = fileURLToPath(import.meta.url);
  const rootDir = path.resolve(path.dirname(currentFile), "..");
  const baseDir = path.join(rootDir, "content", "books");
  const books = validateContentStructure(baseDir);
  console.log(`Validated ${books.length} book(s) in ${baseDir}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    runCli();
  } catch (error) {
    console.error("validate-content failed:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
