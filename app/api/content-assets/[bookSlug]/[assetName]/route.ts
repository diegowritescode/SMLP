import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { canAccessBook } from "@/lib/permissions/can-access-book";
import { createClient } from "@/lib/supabase/server";

const MIME_BY_EXTENSION = new Map<string, string>([
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".svg", "image/svg+xml"],
]);

function sanitizeBookSlug(value: string): string | null {
  const trimmed = value.trim().toLowerCase();
  return /^[a-z0-9-]+$/.test(trimmed) ? trimmed : null;
}

function sanitizeAssetName(value: string): string | null {
  const trimmed = value.trim().toLowerCase();
  if (!/^[a-z0-9._-]+$/.test(trimmed)) return null;
  const base = path.posix.basename(trimmed);
  return base === trimmed ? trimmed : null;
}

export async function GET(_request: Request, context: { params: Promise<{ bookSlug: string; assetName: string }> }) {
  const { bookSlug: incomingBookSlug, assetName: incomingAssetName } = await context.params;
  const bookSlug = sanitizeBookSlug(incomingBookSlug);
  const assetName = sanitizeAssetName(incomingAssetName);

  if (!bookSlug || !assetName) {
    return NextResponse.json({ error: "Invalid asset path" }, { status: 400 });
  }

  const extension = path.extname(assetName).toLowerCase();
  const mimeType = MIME_BY_EXTENSION.get(extension);
  if (!mimeType) {
    return NextResponse.json({ error: "Unsupported asset type" }, { status: 415 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: book } = await supabase.from("books").select("id").eq("slug", bookSlug).maybeSingle();
  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  const allowed = await canAccessBook(user.id, book.id);
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const assetsRoot = path.join(process.cwd(), "content", "books", bookSlug, "assets");
  const absolutePath = path.resolve(assetsRoot, assetName);
  const rootWithSeparator = assetsRoot.endsWith(path.sep) ? assetsRoot : `${assetsRoot}${path.sep}`;
  if (!absolutePath.startsWith(rootWithSeparator)) {
    return NextResponse.json({ error: "Invalid asset path" }, { status: 400 });
  }

  let data: Buffer;
  try {
    data = await fs.readFile(absolutePath);
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && (error as { code?: string }).code === "ENOENT") {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Unable to read asset" }, { status: 500 });
  }

  const body = Uint8Array.from(data);

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": mimeType,
      "Cache-Control": "private, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
