import { slugify } from "@/lib/utils/slugify";

export interface MarkdownHeading {
  level: 1 | 2 | 3;
  text: string;
  id: string;
}

export function extractHeadings(markdown: string): MarkdownHeading[] {
  return markdown
    .split("\n")
    .map((line) => line.match(/^(#{1,3})\s+(.*)$/))
    .filter(Boolean)
    .map((match) => {
      const hashes = match?.[1] ?? "#";
      const text = (match?.[2] ?? "").trim();
      const level = hashes.length as 1 | 2 | 3;
      return {
        level,
        text,
        id: slugify(text),
      };
    })
    .filter((entry) => entry.text.length > 0);
}
