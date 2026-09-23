"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

export async function getCategories() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*, products(count)")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data || []).map((c) => ({ ...c, product_count: c.products?.[0]?.count ?? 0 }));
}

export async function getCategory(id) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("categories").select("*").eq("id", id).single();
  if (error) throw new Error(error.message);
  return data;
}

function buildCategoryPayload(formData) {
  const name = formData.get("name");
  return {
    name,
    slug: slugify(name),
    image_url: formData.get("image_url") || null,
    description: formData.get("description") || "",
    sort_order: parseInt(formData.get("sort_order"), 10) || 0,
    is_visible: formData.get("is_visible") === "on",
  };
}

export async function createCategory(prevState, formData) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("categories").insert(buildCategoryPayload(formData));
  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function updateCategory(id, prevState, formData) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("categories")
    .update(buildCategoryPayload(formData))
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(id) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/categories");
}
