import { createClient } from "@/lib/supabase/server";

export interface LibraryBook {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  language: string;
  isPublished: boolean;
  chaptersCount: number;
  progressPercent: number;
  lastUpdatedAt: string | null;
}

export interface ContinueReadingItem {
  bookSlug: string;
  bookTitle: string;
  progressPercent: number;
}

export interface LibraryData {
  books: LibraryBook[];
  categories: string[];
  languages: string[];
  continueReading: ContinueReadingItem | null;
}

function clampPercent(value: number) {
  if (value < 0) return 0;
  if (value > 100) return 100;
  return Math.round(value);
}

export async function getLibraryData(userId: string): Promise<LibraryData> {
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("user_id", userId)
    .maybeSingle();

  if (profileError) {
    throw new Error(`Failed to load profile: ${profileError.message}`);
  }

  if (!profile) {
    return { books: [], categories: [], languages: [], continueReading: null };
  }

  const isAdmin = profile.role === "admin";
  const nowIso = new Date().toISOString();

  let allowedBookIds: string[] | null = null;

  if (!isAdmin) {
    const { data: grants, error: grantsError } = await supabase
      .from("access_grants")
      .select("book_id")
      .eq("user_id", profile.id)
      .lte("starts_at", nowIso)
      .or(`expires_at.is.null,expires_at.gt.${nowIso}`);

    if (grantsError) {
      throw new Error(`Failed to load access grants: ${grantsError.message}`);
    }

    allowedBookIds = (grants ?? []).map((grant) => grant.book_id);
    if (allowedBookIds.length === 0) {
      return { books: [], categories: [], languages: [], continueReading: null };
    }
  }

  let booksQuery = supabase
    .from("books")
    .select("id, slug, title, description, category, language, is_published")
    .order("title", { ascending: true });

  if (!isAdmin) {
    booksQuery = booksQuery.eq("is_published", true).in("id", allowedBookIds ?? []);
  }

  const { data: booksRaw, error: booksError } = await booksQuery;

  if (booksError) {
    throw new Error(`Failed to load books: ${booksError.message}`);
  }

  const books = booksRaw ?? [];

  if (books.length === 0) {
    return { books: [], categories: [], languages: [], continueReading: null };
  }

  const bookIds = books.map((book) => book.id);

  const [{ data: chaptersRaw, error: chaptersError }, { data: progressRaw, error: progressError }] =
    await Promise.all([
      supabase.from("chapters").select("id, book_id").in("book_id", bookIds),
      supabase
        .from("reading_progress")
        .select("book_id, progress_percent, is_completed, updated_at")
        .eq("user_id", profile.id)
        .in("book_id", bookIds),
    ]);

  if (chaptersError) {
    throw new Error(`Failed to load chapters: ${chaptersError.message}`);
  }

  if (progressError) {
    throw new Error(`Failed to load reading progress: ${progressError.message}`);
  }

  const chaptersByBook = new Map<string, number>();
  for (const chapter of chaptersRaw ?? []) {
    chaptersByBook.set(chapter.book_id, (chaptersByBook.get(chapter.book_id) ?? 0) + 1);
  }

  const progressByBook = new Map<
    string,
    {
      sumPercent: number;
      count: number;
      lastUpdatedAt: string | null;
      hasIncomplete: boolean;
    }
  >();

  for (const progress of progressRaw ?? []) {
    const current = progressByBook.get(progress.book_id) ?? {
      sumPercent: 0,
      count: 0,
      lastUpdatedAt: null,
      hasIncomplete: false,
    };

    const percent = Number(progress.progress_percent ?? 0);
    current.sumPercent += percent;
    current.count += 1;
    if (!progress.is_completed) {
      current.hasIncomplete = true;
    }

    if (!current.lastUpdatedAt || new Date(progress.updated_at).getTime() > new Date(current.lastUpdatedAt).getTime()) {
      current.lastUpdatedAt = progress.updated_at;
    }

    progressByBook.set(progress.book_id, current);
  }

  const libraryBooks: LibraryBook[] = books.map((book) => {
    const progress = progressByBook.get(book.id);
    const avgPercent = progress && progress.count > 0 ? progress.sumPercent / progress.count : 0;

    return {
      id: book.id,
      slug: book.slug,
      title: book.title,
      description: book.description,
      category: book.category,
      language: book.language,
      isPublished: book.is_published,
      chaptersCount: chaptersByBook.get(book.id) ?? 0,
      progressPercent: clampPercent(avgPercent),
      lastUpdatedAt: progress?.lastUpdatedAt ?? null,
    };
  });

  const continueCandidate = [...libraryBooks]
    .filter((book) => book.progressPercent > 0 && book.progressPercent < 100)
    .sort((a, b) => {
      const aTime = a.lastUpdatedAt ? new Date(a.lastUpdatedAt).getTime() : 0;
      const bTime = b.lastUpdatedAt ? new Date(b.lastUpdatedAt).getTime() : 0;
      return bTime - aTime;
    })[0];

  const categories = [...new Set(libraryBooks.map((book) => book.category).filter(Boolean) as string[])].sort();
  const languages = [...new Set(libraryBooks.map((book) => book.language).filter(Boolean))].sort();

  return {
    books: libraryBooks,
    categories,
    languages,
    continueReading: continueCandidate
      ? {
          bookSlug: continueCandidate.slug,
          bookTitle: continueCandidate.title,
          progressPercent: continueCandidate.progressPercent,
        }
      : null,
  };
}
