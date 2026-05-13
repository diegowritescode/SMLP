import { getNextHeadingId } from "@/lib/content/heading-ids";

export interface MarkdownHeading {
  level: 1 | 2 | 3;
  text: string;
  id: string;
}

export function extractHeadings(markdown: string): MarkdownHeading[] {
  const seen = new Map<string, number>();

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
        id: getNextHeadingId(text, seen),
      };
    })
    .filter((entry) => entry.text.length > 0);
}
