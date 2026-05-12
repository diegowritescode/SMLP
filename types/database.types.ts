export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      books: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          category: string | null;
          language: string;
          cover_image: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          category?: string | null;
          language?: string;
          cover_image?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["books"]["Insert"]>;
        Relationships: [];
      };
      chapters: {
        Row: {
          id: string;
          book_id: string;
          title: string;
          slug: string;
          order_index: number;
          file_path: string;
          estimated_reading_minutes: number | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          book_id: string;
          title: string;
          slug: string;
          order_index: number;
          file_path: string;
          estimated_reading_minutes?: number | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["chapters"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
