"use server";

import { createClient } from "@/lib/supabase/server";

function mapProduct(row, images = []) {
  if (!row) return null;
  const galleryUrls = images.length > 0 ? images.map((i) => i.image_url) : [row.image_url].filter(Boolean);
  return {
    id: row.id,
    title: row.name,
    price: Number(row.price) || 0,
    img: row.image_url || "/placeholder-product.jpg",
    images: galleryUrls,
    desc: row.description || "",
    dimensions: Array.isArray(row.dimensions) ? row.dimensions : [],
    category_id: row.category_id,
    category_name: row.categories?.name || null,
    stock_quantity: row.stock_quantity,
  };
}

export async function getShopProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []).map((row) => mapProduct(row));
}

export async function getShopProduct(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("id", id)
    .eq("is_active", true)
    .single();
  if (error) return null;

  const { data: images } = await supabase
    .from("product_images")
    .select("image_url")
    .eq("product_id", id)
    .order("display_order", { ascending: true });

  return mapProduct(data, images || []);
}

export async function getRelatedProducts(currentId, categoryId) {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .neq("id", currentId)
    .limit(4);
  if (categoryId) query = query.eq("category_id", categoryId);
  const { data, error } = await query;
  if (error) return [];
  return (data || []).map((row) => mapProduct(row));
}
