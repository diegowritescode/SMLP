"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";

export async function toggleBookPublished(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const id = String(formData.get("id") || "");
  const isPublished = String(formData.get("isPublished") || "") === "true";
  if (!id) throw new Error("Missing book id");

  const { error } = await supabase.from("books").update({ is_published: !isPublished }).eq("id", id);
  if (error) throw new Error(`Unable to update book publication: ${error.message}`);

  revalidatePath("/admin");
  revalidatePath("/admin/books");
  revalidatePath("/library");
}

export async function toggleChapterPublished(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const id = String(formData.get("id") || "");
  const isPublished = String(formData.get("isPublished") || "") === "true";
  if (!id) throw new Error("Missing chapter id");

  const { error } = await supabase.from("chapters").update({ is_published: !isPublished }).eq("id", id);
  if (error) throw new Error(`Unable to update chapter publication: ${error.message}`);

  revalidatePath("/admin");
  revalidatePath("/admin/books");
}

export async function createAccessGrant(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const userId = String(formData.get("userId") || "");
  const bookId = String(formData.get("bookId") || "");
  const accessType = String(formData.get("accessType") || "manual");
  const expiresAt = String(formData.get("expiresAt") || "").trim();

  if (!userId || !bookId) throw new Error("Missing user or book for grant");

  const { error } = await supabase.from("access_grants").upsert(
    {
      user_id: userId,
      book_id: bookId,
      access_type: accessType,
      starts_at: new Date().toISOString(),
      expires_at: expiresAt.length > 0 ? new Date(expiresAt).toISOString() : null,
    },
    { onConflict: "user_id,book_id,access_type" },
  );

  if (error) throw new Error(`Unable to create access grant: ${error.message}`);

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  revalidatePath("/library");
}

export async function revokeAccessGrant(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Missing grant id");

  const { error } = await supabase.from("access_grants").delete().eq("id", id);
  if (error) throw new Error(`Unable to revoke access grant: ${error.message}`);

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  revalidatePath("/library");
}
