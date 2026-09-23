"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

export async function getCategories() {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error) throw new Error(error.message);
  return data;
}

export async function getCategory(id) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("categories").select("*").eq("id", id).single();
  if (error) throw new Error(error.message);
  return data;
}

export async function createCategory(prevState, formData) {
  const supabase = createAdminClient();
  const name = formData.get("name");
  const image_url = formData.get("image_url");

  const { error } = await supabase.from("categories").insert({
    name,
    slug: slugify(name),
    image_url: image_url || null,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function updateCategory(id, prevState, formData) {
  const supabase = createAdminClient();
  const name = formData.get("name");
  const image_url = formData.get("image_url");

  const { error } = await supabase
    .from("categories")
    .update({ name, slug: slugify(name), image_url: image_url || null })
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
