import { slugify } from "@/lib/utils/slugify";

export function getNextHeadingId(text: string, seen: Map<string, number>) {
  const base = slugify(text) || "section";
  const count = seen.get(base) ?? 0;
  seen.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
}
