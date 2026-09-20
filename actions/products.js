"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

export async function getProducts() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function getProduct(id) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
  if (error) throw new Error(error.message);
  return data;
}

function buildProductPayload(formData) {
  const name = formData.get("name");
  return {
    name,
    slug: slugify(name) + "-" + Date.now().toString(36),
    category_id: formData.get("category_id") || null,
    description: formData.get("description") || "",
    price: parseFloat(formData.get("price")) || 0,
    stock_quantity: parseInt(formData.get("stock_quantity"), 10) || 0,
    image_url: formData.get("image_url") || null,
    is_active: formData.get("is_active") === "on",
  };
}

export async function createProduct(prevState, formData) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("products").insert(buildProductPayload(formData));
  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  return { success: true };
}

export async function updateProduct(id, prevState, formData) {
  const supabase = createAdminClient();
  const name = formData.get("name");
  const payload = {
    name,
    category_id: formData.get("category_id") || null,
    description: formData.get("description") || "",
    price: parseFloat(formData.get("price")) || 0,
    stock_quantity: parseInt(formData.get("stock_quantity"), 10) || 0,
    image_url: formData.get("image_url") || null,
    is_active: formData.get("is_active") === "on",
  };
  const { error } = await supabase.from("products").update(payload).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteProduct(id) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
}
