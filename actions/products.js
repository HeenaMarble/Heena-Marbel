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

function safeParseObject(jsonStr) {
  if (!jsonStr) return {};
  try {
    const parsed = JSON.parse(jsonStr);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export async function getProducts() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  const variantProductIds = (data || []).filter((p) => p.has_variants).map((p) => p.id);
  let variantsByProduct = {};

  if (variantProductIds.length > 0) {
    const { data: allVariants } = await supabase
      .from("product_variants")
      .select("*")
      .in("product_id", variantProductIds);

    for (const v of allVariants || []) {
      if (!variantsByProduct[v.product_id]) variantsByProduct[v.product_id] = [];
      variantsByProduct[v.product_id].push(v);
    }
  }

  return (data || []).map((p) => {
    if (!p.has_variants) return p;
    const variants = variantsByProduct[p.id] || [];
    if (variants.length === 0) return p;
    const defaultVariant = variants.find((v) => v.is_default) || variants[0];
    const totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);
    return {
      ...p,
      price: defaultVariant.price,
      compare_at_price: defaultVariant.compare_at_price ?? p.compare_at_price,
      stock_quantity: totalStock,
      variant_count: variants.length,
    };
  });
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

  const { data: variants } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", id)
    .order("display_order", { ascending: true });

  return { ...product, images: images || [], variants: variants || [] };
}

function parseDimensionLabel(item) {
  if (!item) return { label: "", unit: "" };
  let current = item;

  while (typeof current === "string") {
    const trimmed = current.trim();
    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      try {
        current = JSON.parse(current);
      } catch {
        break;
      }
    } else {
      break;
    }
  }

  if (typeof current === "object" && current !== null && !Array.isArray(current)) {
    let label = current.label ?? "";
    let unit = current.unit ?? "";

    while (typeof label === "string") {
      const trimmed = label.trim();
      if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        try {
          const parsed = JSON.parse(label);
          if (parsed && typeof parsed === "object") {
            label = parsed.label ?? "";
            if (!unit && parsed.unit) unit = parsed.unit;
          } else {
            break;
          }
        } catch {
          break;
        }
      } else {
        break;
      }
    }

    return { label: String(label || ""), unit: String(unit || "") };
  }

  return { label: String(current || ""), unit: "" };
}

function buildProductFields(formData) {
  const name = formData.get("name");
  const dimensions = safeParseArray(formData.get("dimensions_json"));
  const specifications = safeParseArray(formData.get("specifications_json"));
  const rawDimensionLabels = safeParseArray(formData.get("variant_dimension_labels_json"));
  const variantDimensionLabels = rawDimensionLabels.map(parseDimensionLabel);
  const compareAtPriceRaw = formData.get("compare_at_price");
  const compareAtPrice = compareAtPriceRaw && !isNaN(parseFloat(compareAtPriceRaw))
    ? parseFloat(compareAtPriceRaw)
    : null;
  const videoUrl = formData.get("video_url") || null;
  const isFeatured = formData.get("is_featured") === "on";
  const featuredOrderRaw = formData.get("featured_order");
  const featuredOrder = isFeatured && featuredOrderRaw !== null && featuredOrderRaw !== "" && !isNaN(parseInt(featuredOrderRaw, 10))
    ? parseInt(featuredOrderRaw, 10)
    : null;

  return {
    name,
    category_id: formData.get("category_id") || null,
    description: formData.get("description") || "",
    price: parseFloat(formData.get("price")) || 0,
    compare_at_price: compareAtPrice,
    stock_quantity: parseInt(formData.get("stock_quantity"), 10) || 0,
    is_active: formData.get("is_active") === "on",
    is_featured: isFeatured,
    featured_order: featuredOrder,
    dimensions,
    specifications,
    has_variants: formData.get("has_variants") === "on",
    has_colors: formData.get("has_colors") === "on",
    variant_dimension_labels: variantDimensionLabels,
    video_url: videoUrl,
  };
}

async function syncProductImages(supabase, productId, images, colorImages) {
  await supabase.from("product_images").delete().eq("product_id", productId);

  const rows = [];
  let order = 0;

  for (const image_url of images) {
    rows.push({ product_id: productId, image_url, color_name: null, display_order: order++ });
  }

  for (const [colorName, urls] of Object.entries(colorImages || {})) {
    for (const image_url of urls) {
      rows.push({ product_id: productId, image_url, color_name: colorName, display_order: order++ });
    }
  }

  if (rows.length > 0) {
    const { error } = await supabase.from("product_images").insert(rows);
    if (error) throw new Error(error.message);
  }
}

async function syncProductVariants(supabase, productId, variants) {
  const { data: existingVariants } = await supabase
    .from("product_variants")
    .select("id")
    .eq("product_id", productId);

  const existingIds = (existingVariants || []).map((v) => v.id);
  const incomingIds = (variants || []).map((v) => v.id).filter(Boolean);

  // 1. Delete removed variants (if any)
  const idsToDelete = existingIds.filter((id) => !incomingIds.includes(id));
  for (const id of idsToDelete) {
    const { error } = await supabase.from("product_variants").delete().eq("id", id);
    if (error) {
      console.warn(`Could not delete removed variant ${id} (possibly referenced by orders):`, error.message);
    }
  }

  // 2. Temporarily set is_default = false on existing variants to avoid unique constraint collision during updates
  if (existingIds.length > 0) {
    await supabase
      .from("product_variants")
      .update({ is_default: false })
      .eq("product_id", productId);
  }

  // 3. Upsert / update submitted variants
  if (variants && variants.length > 0) {
    const explicitDefaultIndex = variants.findIndex((v) => !!v.is_default);
    const defaultIndex = explicitDefaultIndex >= 0 ? explicitDefaultIndex : 0;

    for (let index = 0; index < variants.length; index++) {
      const v = variants[index];
      const payload = {
        product_id: productId,
        color_name: v.color_name || null,
        color_hex: v.color_hex || null,
        dimension_values: v.dimension_values || {},
        price: parseFloat(v.price) || 0,
        compare_at_price: v.compare_at_price ? parseFloat(v.compare_at_price) : null,
        stock: parseInt(v.stock, 10) || 0,
        is_default: index === defaultIndex,
        display_order: index,
      };

      if (v.id && existingIds.includes(v.id)) {
        const { error } = await supabase
          .from("product_variants")
          .update(payload)
          .eq("id", v.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase
          .from("product_variants")
          .insert(payload);
        if (error) throw new Error(error.message);
      }
    }
  }
}

async function resolveCoverImage(supabase, productId, images, colorImages, variants) {
  if (variants.length === 0) {
    return images[0] || null;
  }
  const defaultVariant = variants.find((v) => v.is_default) || variants[0];
  const colorName = defaultVariant?.color_name;
  if (colorName && colorImages?.[colorName]?.length > 0) {
    return colorImages[colorName][0];
  }
  return images[0] || null;
}

export async function createProduct(prevState, formData) {
  const supabase = createAdminClient();
  const images = safeParseArray(formData.get("images_json"));
  const colorImages = safeParseObject(formData.get("color_images_json"));
  const variants = safeParseArray(formData.get("variants_json"));
  const name = formData.get("name");

  const fields = buildProductFields(formData);
  const coverImage = await resolveCoverImage(supabase, null, images, colorImages, variants);

  let payload = {
    ...fields,
    slug: slugify(name) + "-" + Date.now().toString(36),
    image_url: coverImage,
  };

  let { data, error } = await supabase.from("products").insert(payload).select("id").single();
  if (error && error.message?.includes("compare_at_price")) {
    delete payload.compare_at_price;
    const retry = await supabase.from("products").insert(payload).select("id").single();
    data = retry.data;
    error = retry.error;
  }
  if (error) return { error: error.message };

  try {
    await syncProductImages(supabase, data.id, images, colorImages);
    await syncProductVariants(supabase, data.id, variants);
  } catch (e) {
    return { error: e.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/shop");
  return { success: true };
}

export async function updateProduct(id, prevState, formData) {
  const supabase = createAdminClient();
  const images = safeParseArray(formData.get("images_json"));
  const colorImages = safeParseObject(formData.get("color_images_json"));
  const variants = safeParseArray(formData.get("variants_json"));

  const fields = buildProductFields(formData);
  const coverImage = await resolveCoverImage(supabase, id, images, colorImages, variants);

  let payload = {
    ...fields,
    image_url: coverImage,
  };

  let { error } = await supabase.from("products").update(payload).eq("id", id);
  if (error && error.message?.includes("compare_at_price")) {
    delete payload.compare_at_price;
    const retry = await supabase.from("products").update(payload).eq("id", id);
    error = retry.error;
  }
  if (error) return { error: error.message };

  try {
    await syncProductImages(supabase, id, images, colorImages);
    await syncProductVariants(supabase, id, variants);
  } catch (e) {
    return { error: e.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/shop");
  return { success: true };
}

export async function deleteProduct(id) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/shop");
}
