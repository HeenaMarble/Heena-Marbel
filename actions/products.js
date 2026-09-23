"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

function safeParseArray(jsonStr) {
  if (!jsonStr) return [];
  try {
    const parsed = JSON.parse(jsonStr);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
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
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);

  const { data: images } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", id)
    .order("display_order", { ascending: true });

  return { ...product, images: images || [] };
}

function buildProductFields(formData) {
  const name = formData.get("name");
  const dimensions = safeParseArray(formData.get("dimensions_json"));
  return {
    name,
    category_id: formData.get("category_id") || null,
    description: formData.get("description") || "",
    price: parseFloat(formData.get("price")) || 0,
    stock_quantity: parseInt(formData.get("stock_quantity"), 10) || 0,
    is_active: formData.get("is_active") === "on",
    dimensions,
  };
}

async function syncProductImages(supabase, productId, images) {
  // images: ordered array of URL strings, first = cover
  await supabase.from("product_images").delete().eq("product_id", productId);
  if (images.length > 0) {
    const rows = images.map((image_url, index) => ({
      product_id: productId,
      image_url,
      display_order: index,
    }));
    const { error } = await supabase.from("product_images").insert(rows);
    if (error) throw new Error(error.message);
  }
}

export async function createProduct(prevState, formData) {
  const supabase = createAdminClient();
  const images = safeParseArray(formData.get("images_json"));
  const name = formData.get("name");

  const payload = {
    ...buildProductFields(formData),
    slug: slugify(name) + "-" + Date.now().toString(36),
    image_url: images[0] || null,
  };

  const { data, error } = await supabase.from("products").insert(payload).select("id").single();
  if (error) return { error: error.message };

  try {
    await syncProductImages(supabase, data.id, images);
  } catch (e) {
    return { error: e.message };
  }

  revalidatePath("/admin/products");
  return { success: true };
}

export async function updateProduct(id, prevState, formData) {
  const supabase = createAdminClient();
  const images = safeParseArray(formData.get("images_json"));

  const payload = {
    ...buildProductFields(formData),
    image_url: images[0] || null,
  };

  const { error } = await supabase.from("products").update(payload).eq("id", id);
  if (error) return { error: error.message };

  try {
    await syncProductImages(supabase, id, images);
  } catch (e) {
    return { error: e.message };
  }

  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteProduct(id) {
  const supabase = createAdminClient();
  // product_images rows auto-delete via ON DELETE CASCADE
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
}
