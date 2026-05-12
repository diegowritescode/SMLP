import { createClient } from "@/lib/supabase/server";

export interface BookWithChapters {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  language: string;
  isPublished: boolean;
  chapters: Array<{
    id: string;
    slug: string;
    title: string;
    orderIndex: number;
    isPublished: boolean;
    estimatedReadingMinutes: number | null;
  }>;
}

export async function getBookBySlug(slug: string): Promise<BookWithChapters | null> {
  const supabase = await createClient();

  const { data: book } = await supabase
    .from("books")
    .select("id, slug, title, description, category, language, is_published")
    .eq("slug", slug)
    .maybeSingle();

  if (!book) return null;

  const { data: chapters } = await supabase
    .from("chapters")
    .select("id, slug, title, order_index, is_published, estimated_reading_minutes")
    .eq("book_id", book.id)
    .order("order_index", { ascending: true });

  return {
    id: book.id,
    slug: book.slug,
    title: book.title,
    description: book.description,
    category: book.category,
    language: book.language,
    isPublished: book.is_published,
    chapters: (chapters ?? []).map((chapter) => ({
      id: chapter.id,
      slug: chapter.slug,
      title: chapter.title,
      orderIndex: chapter.order_index,
      isPublished: chapter.is_published,
      estimatedReadingMinutes: chapter.estimated_reading_minutes,
    })),
  };
}
