import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";

interface ProgressBook {
  bookId: string;
  bookSlug: string;
  title: string;
  progressPercent: number;
  completedChapters: number;
  totalChapters: number;
  lastUpdatedAt: string | null;
}

interface RecentChapter {
  bookSlug: string;
  bookTitle: string;
  chapterTitle: string;
  progressPercent: number;
  updatedAt: string;
  isCompleted: boolean;
}

export interface ProgressOverview {
  books: ProgressBook[];
  recentChapters: RecentChapter[];
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export async function getProgressOverview(userId: string): Promise<ProgressOverview> {
  const supabase = await createClient();
  const profile = await getCurrentProfile(userId);
  if (!profile) return { books: [], recentChapters: [] };

  const isAdmin = profile.role === "admin";
  const nowIso = new Date().toISOString();

  let allowedBookIds: string[] | null = null;
  if (!isAdmin) {
    const { data: grants } = await supabase
      .from("access_grants")
      .select("book_id")
      .eq("user_id", profile.id)
      .lte("starts_at", nowIso)
      .or(`expires_at.is.null,expires_at.gt.${nowIso}`);

    allowedBookIds = (grants ?? []).map((g) => g.book_id);
    if (allowedBookIds.length === 0) return { books: [], recentChapters: [] };
  }

  let booksQuery = supabase.from("books").select("id, slug, title, is_published").order("title", { ascending: true });
  if (!isAdmin) {
    booksQuery = booksQuery.eq("is_published", true).in("id", allowedBookIds ?? []);
  }

  const { data: booksRaw } = await booksQuery;
  const books = booksRaw ?? [];
  if (books.length === 0) return { books: [], recentChapters: [] };

  const bookIds = books.map((b) => b.id);

  const [chaptersResponse, progressResponse] = await Promise.all([
    supabase
      .from("chapters")
      .select("id, book_id, title, is_published")
      .in("book_id", bookIds),
    supabase
      .from("reading_progress")
      .select("chapter_id, book_id, progress_percent, is_completed, updated_at")
      .eq("user_id", profile.id)
      .in("book_id", bookIds),
  ]);

  const chaptersRaw = chaptersResponse.data ?? [];
  const progressRaw = progressResponse.data ?? [];

  const chapterMap = new Map(chaptersRaw.map((c) => [c.id, c]));

  const chaptersByBook = new Map<string, number>();
  for (const chapter of chaptersRaw) {
    if (!isAdmin && !chapter.is_published) continue;
    chaptersByBook.set(chapter.book_id, (chaptersByBook.get(chapter.book_id) ?? 0) + 1);
  }

  const progressByBook = new Map<
    string,
    { totalPercent: number; count: number; completed: number; lastUpdatedAt: string | null }
  >();

  for (const row of progressRaw) {
    const chapter = chapterMap.get(row.chapter_id);
    if (!chapter) continue;
    if (!isAdmin && !chapter.is_published) continue;

    const current = progressByBook.get(row.book_id) ?? {
      totalPercent: 0,
      count: 0,
      completed: 0,
      lastUpdatedAt: null,
    };

    current.totalPercent += Number(row.progress_percent ?? 0);
    current.count += 1;
    if (row.is_completed) current.completed += 1;
    if (!current.lastUpdatedAt || new Date(row.updated_at).getTime() > new Date(current.lastUpdatedAt).getTime()) {
      current.lastUpdatedAt = row.updated_at;
    }

    progressByBook.set(row.book_id, current);
  }

  const resultBooks: ProgressBook[] = books.map((book) => {
    const metrics = progressByBook.get(book.id);
    const totalChapters = chaptersByBook.get(book.id) ?? 0;
    const progressPercent = metrics && metrics.count > 0 ? clamp(metrics.totalPercent / metrics.count) : 0;

    return {
      bookId: book.id,
      bookSlug: book.slug,
      title: book.title,
      progressPercent,
      completedChapters: metrics?.completed ?? 0,
      totalChapters,
      lastUpdatedAt: metrics?.lastUpdatedAt ?? null,
    };
  });

  const recentChapters: RecentChapter[] = progressRaw
    .map((row) => {
      const chapter = chapterMap.get(row.chapter_id);
      const book = books.find((b) => b.id === row.book_id);
      if (!chapter || !book) return null;
      if (!isAdmin && !chapter.is_published) return null;

      return {
        bookSlug: book.slug,
        bookTitle: book.title,
        chapterTitle: chapter.title,
        progressPercent: clamp(Number(row.progress_percent ?? 0)),
        updatedAt: row.updated_at,
        isCompleted: row.is_completed,
      };
    })
    .filter((item): item is RecentChapter => Boolean(item))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 8);

  return {
    books: resultBooks,
    recentChapters,
  };
}
