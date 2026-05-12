"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";

function asErrorMessage(error: unknown) {
  if (error instanceof Error) return encodeURIComponent(error.message);
  return encodeURIComponent("Unexpected error");
}

export async function toggleBookPublished(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const id = String(formData.get("id") || "");
  const isPublished = String(formData.get("isPublished") || "") === "true";
  if (!id) {
    redirect("/admin/books?error=Missing%20book%20id");
  }

  let actionError: unknown;
  try {
    const { error } = await supabase.from("books").update({ is_published: !isPublished }).eq("id", id);
    if (error) throw new Error(`Unable to update book publication: ${error.message}`);
  } catch (error) {
    actionError = error;
  }

  if (actionError) {
    redirect(`/admin/books?error=${asErrorMessage(actionError)}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/books");
  revalidatePath("/library");
  redirect("/admin/books?ok=book_updated");
}

export async function toggleChapterPublished(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const id = String(formData.get("id") || "");
  const isPublished = String(formData.get("isPublished") || "") === "true";
  if (!id) {
    redirect("/admin/books?error=Missing%20chapter%20id");
  }

  let actionError: unknown;
  try {
    const { error } = await supabase.from("chapters").update({ is_published: !isPublished }).eq("id", id);
    if (error) throw new Error(`Unable to update chapter publication: ${error.message}`);
  } catch (error) {
    actionError = error;
  }

  if (actionError) {
    redirect(`/admin/books?error=${asErrorMessage(actionError)}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/books");
  redirect("/admin/books?ok=chapter_updated");
}

export async function createAccessGrant(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const userId = String(formData.get("userId") || "");
  const bookId = String(formData.get("bookId") || "");
  const accessType = String(formData.get("accessType") || "manual");
  const expiresAt = String(formData.get("expiresAt") || "").trim();

  if (!userId || !bookId) {
    redirect("/admin/users?error=Missing%20user%20or%20book%20for%20grant");
  }

  let actionError: unknown;
  try {
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
  } catch (error) {
    actionError = error;
  }

  if (actionError) {
    redirect(`/admin/users?error=${asErrorMessage(actionError)}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  revalidatePath("/library");
  redirect("/admin/users?ok=grant_created");
}

export async function revokeAccessGrant(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const id = String(formData.get("id") || "");
  if (!id) {
    redirect("/admin/users?error=Missing%20grant%20id");
  }

  let actionError: unknown;
  try {
    const { error } = await supabase.from("access_grants").delete().eq("id", id);
    if (error) throw new Error(`Unable to revoke access grant: ${error.message}`);
  } catch (error) {
    actionError = error;
  }

  if (actionError) {
    redirect(`/admin/users?error=${asErrorMessage(actionError)}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  revalidatePath("/library");
  redirect("/admin/users?ok=grant_revoked");
}
