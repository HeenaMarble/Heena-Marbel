"use server";

import { createClient } from "@/lib/supabase/server";

function mapProduct(row, images = [], variants = []) {
  if (!row) return null;

  const hasVariants = !!row.has_variants && variants.length > 0;
  const defaultVariant = hasVariants
    ? variants.find((v) => v.is_default) || variants[0]
    : null;

  const effectivePrice = defaultVariant ? Number(defaultVariant.price) : Number(row.price) || 0;
  const effectiveCompareAt = defaultVariant
    ? (defaultVariant.compare_at_price ? Number(defaultVariant.compare_at_price) : null)
    : (row.compare_at_price ? Number(row.compare_at_price) : null);
  const effectiveStock = defaultVariant ? defaultVariant.stock : row.stock_quantity;

  const galleryUrls = images.length > 0 ? images.map((i) => i.image_url) : [row.image_url].filter(Boolean);

  return {
    id: row.id,
    title: row.name,
    price: effectivePrice || 0,
    compare_at_price: effectiveCompareAt,
    img: row.image_url || "/placeholder-product.jpg",
    images: galleryUrls,
    imageObjects: images, // [{ image_url, color_name, display_order }]
    desc: row.description || "",
    dimensions: Array.isArray(row.dimensions) ? row.dimensions : [],
    category_id: row.category_id,
    category_name: row.categories?.name || null,
    category_slug: row.categories?.slug || null,
    stock_quantity: effectiveStock,
    has_variants: hasVariants,
    has_colors: !!row.has_colors,
    variant_dimension_labels: Array.isArray(row.variant_dimension_labels) ? row.variant_dimension_labels : [],
    variants,
  };
}

export async function getShopProducts(categorySlug) {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*, categories(name, slug)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (categorySlug) {
    query = query.eq("categories.slug", categorySlug);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const rows = categorySlug ? (data || []).filter((r) => r.categories?.slug === categorySlug) : (data || []);

  const variantProductIds = rows.filter((r) => r.has_variants).map((r) => r.id);
  let defaultVariantsByProduct = {};

  if (variantProductIds.length > 0) {
    const { data: defaultVariants } = await supabase
      .from("product_variants")
      .select("*")
      .in("product_id", variantProductIds)
      .eq("is_default", true);

    for (const v of defaultVariants || []) {
      defaultVariantsByProduct[v.product_id] = [v];
    }
  }

  return rows.map((row) => mapProduct(row, [], defaultVariantsByProduct[row.id] || []));
}

export async function getShopProduct(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name, slug)")
    .eq("id", id)
    .eq("is_active", true)
    .single();
  if (error) return null;

  const { data: images } = await supabase
    .from("product_images")
    .select("image_url, color_name, display_order")
    .eq("product_id", id)
    .order("display_order", { ascending: true });

  const { data: variants } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", id)
    .order("display_order", { ascending: true });

  return mapProduct(data, images || [], variants || []);
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

export async function getVisibleCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, image_url")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });
  if (error) return [];
  return data || [];
}
