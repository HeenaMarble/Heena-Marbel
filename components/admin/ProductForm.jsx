"use client";

import { useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DimensionsInput from "@/components/admin/DimensionsInput";
import SpecificationsInput from "@/components/admin/SpecificationsInput";
import VariantTable from "@/components/admin/VariantTable";
import ColorManager from "@/components/admin/ColorManager";
import TabbedImageUploader from "@/components/admin/TabbedImageUploader";
import VideoUploader from "@/components/admin/VideoUploader";
import { AlertCircle, X } from "lucide-react";

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

export default function ProductForm({ action, categories = [], initialData = {} }) {
  const [state, formAction, pending] = useActionState(action, null);
  const [clientError, setClientError] = useState("");
  const router = useRouter();

  // Toggles
  const [hasVariants, setHasVariants] = useState(
    () => initialData.has_variants ?? false
  );
  const [hasColors, setHasColors] = useState(
    () => initialData.has_colors ?? false
  );
  const [isFeatured, setIsFeatured] = useState(
    () => initialData.is_featured ?? false
  );

  // Variant Dimension Labels (array of {label, unit} objects or strings)
  const [dimensionLabels, setDimensionLabels] = useState(() => {
    if (Array.isArray(initialData.variant_dimension_labels)) {
      return initialData.variant_dimension_labels.map(parseDimensionLabel);
    }
    return [];
  });

  // Dimensions for Simple Product mode (array of {label, value, unit})
  const [dimensions, setDimensions] = useState(() =>
    Array.isArray(initialData.dimensions) ? initialData.dimensions : []
  );

  // Specifications for Simple Product mode (array of {label, value})
  const [specifications, setSpecifications] = useState(() =>
    Array.isArray(initialData.specifications) ? initialData.specifications : []
  );

  // Canonical Colors: [{ name: "White", hex: "#FFFFFF" }, ...]
  const [colors, setColors] = useState(() => {
    const colorMap = {};
    if (Array.isArray(initialData.variants)) {
      initialData.variants.forEach((v) => {
        if (v.color_name && !colorMap[v.color_name]) {
          colorMap[v.color_name] = v.color_hex || "#FFFFFF";
        }
      });
    }
    if (Array.isArray(initialData.images)) {
      initialData.images.forEach((img) => {
        if (img?.color_name && !colorMap[img.color_name]) {
          colorMap[img.color_name] = "#FFFFFF";
        }
      });
    }
    return Object.entries(colorMap).map(([name, hex]) => ({ name, hex }));
  });

  // Variant SKUs
  const [variants, setVariants] = useState(() => {
    if (Array.isArray(initialData.variants) && initialData.variants.length > 0) {
      const hasDefault = initialData.variants.some((v) => v.is_default);
      return initialData.variants.map((v, idx) => ({
        id: v.id || undefined,
        dimension_values: v.dimension_values || {},
        color_name: v.color_name || null,
        color_hex: v.color_hex || null,
        price: v.price ?? "",
        compare_at_price: v.compare_at_price ?? "",
        stock: v.stock ?? 0,
        is_default: hasDefault ? !!v.is_default : idx === 0,
      }));
    }
    return [];
  });

  // Product Video URL (single optional video)
  const [videoUrl, setVideoUrl] = useState(() => initialData.video_url || "");

  // Common Images (flat array of URLs)
  const [commonImages, setCommonImages] = useState(() => {
    if (Array.isArray(initialData.images) && initialData.images.length > 0) {
      return initialData.images
        .filter((img) => (typeof img === "object" ? !img.color_name : true))
        .map((img) => (typeof img === "object" ? img.image_url : img))
        .filter(Boolean);
    }
    return initialData.image_url ? [initialData.image_url] : [];
  });

  // Color Images ({ [colorName]: [urls...] })
  const [colorImages, setColorImages] = useState(() => {
    const map = {};
    if (Array.isArray(initialData.images)) {
      initialData.images.forEach((img) => {
        if (img && typeof img === "object" && img.color_name && img.image_url) {
          if (!map[img.color_name]) map[img.color_name] = [];
          map[img.color_name].push(img.image_url);
        }
      });
    }
    return map;
  });

  useEffect(() => {
    if (state?.success) {
      router.push("/admin/products");
    }
  }, [state?.success, router]);

  function handleSubmit(e) {
    setClientError("");

    if (hasVariants) {
      if (variants.length === 0) {
        e.preventDefault();
        setClientError("Add at least one variant before saving.");
        return;
      }

      // Check if price is provided for each variant
      const missingPrice = variants.some(
        (v) => v.price === "" || v.price === null || v.price === undefined
      );
      if (missingPrice) {
        e.preventDefault();
        setClientError("Please enter a valid price for all variant rows.");
        return;
      }
    }
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      className="max-w-3xl space-y-6"
    >
      {/* Product Name */}
      <div>
        <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">
          Product Name
        </label>
        <input
          name="name"
          required
          defaultValue={initialData.name || ""}
          className="w-full rounded-lg border border-[#e5e0d8] px-3 py-2.5 outline-none focus:border-[#b38b4d] bg-white transition-colors"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">
          Category
        </label>
        <select
          name="category_id"
          defaultValue={initialData.category_id || ""}
          className="w-full rounded-lg border border-[#e5e0d8] px-3 py-2.5 outline-none focus:border-[#b38b4d] bg-white transition-colors cursor-pointer"
        >
          <option value="">Uncategorized</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* 1. Two Independent Toggles: Has Variants & Has Colors */}
      <div className="rounded-xl border border-[#b38b4d]/25 bg-[#faf8f5] p-4 sm:p-5 space-y-3.5 shadow-xs">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="has_variants"
            checked={hasVariants}
            onChange={(e) => setHasVariants(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-[#b38b4d] cursor-pointer"
          />
          <div>
            <span className="block text-sm font-semibold text-[#1a1a1a] group-hover:text-[#b38b4d] transition-colors">
              Has Variants
            </span>
            <span className="block text-xs text-[#1a1a1a]/60 mt-0.5">
              This product comes in multiple priced / stocked options
            </span>
          </div>
        </label>

        <div className="border-t border-[#b38b4d]/15 pt-3">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="has_colors"
              checked={hasColors}
              onChange={(e) => setHasColors(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-[#b38b4d] cursor-pointer"
            />
            <div>
              <span className="block text-sm font-semibold text-[#1a1a1a] group-hover:text-[#b38b4d] transition-colors">
                Has Colors
              </span>
              <span className="block text-xs text-[#1a1a1a]/60 mt-0.5">
                This product comes in multiple colors (with dedicated images)
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">
          Description
        </label>
        <textarea
          name="description"
          rows={4}
          defaultValue={initialData.description || ""}
          className="w-full rounded-lg border border-[#e5e0d8] px-3 py-2.5 outline-none focus:border-[#b38b4d] bg-white transition-colors"
        />
      </div>

      {/* Product-level Price & Stock (Only visible when Has Variants is OFF) */}
      {!hasVariants ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">
              Price (₹) *
            </label>
            <input
              type="number"
              name="price"
              step="0.01"
              min="0"
              required={!hasVariants}
              defaultValue={initialData.price || ""}
              placeholder="e.g. 2999"
              className="w-full rounded-lg border border-[#e5e0d8] px-3 py-2.5 outline-none focus:border-[#b38b4d] bg-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">
              Compare Price (₹)
            </label>
            <input
              type="number"
              name="compare_at_price"
              step="0.01"
              min="0"
              defaultValue={initialData.compare_at_price ?? ""}
              placeholder="e.g. 3999"
              className="w-full rounded-lg border border-[#e5e0d8] px-3 py-2.5 outline-none focus:border-[#b38b4d] bg-white transition-colors"
            />
            <span className="block text-[11px] text-[#1a1a1a]/50 mt-1">
              Optional (strikethrough price)
            </span>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">
              Stock Quantity
            </label>
            <input
              type="number"
              name="stock_quantity"
              min="0"
              defaultValue={initialData.stock_quantity ?? 0}
              className="w-full rounded-lg border border-[#e5e0d8] px-3 py-2.5 outline-none focus:border-[#b38b4d] bg-white transition-colors"
            />
          </div>
        </div>
      ) : (
        /* Hidden inputs to safely submit empty/zero fallback values without confusing server */
        <>
          <input type="hidden" name="price" value="0" />
          <input type="hidden" name="compare_at_price" value="" />
          <input type="hidden" name="stock_quantity" value="0" />
        </>
      )}

      {/* 2. Dimensions / Variants Section */}
      {hasVariants ? (
        <div className="pt-2">
          {/* Hidden JSON serialization for variant dimension labels & variants */}
          <input
            type="hidden"
            name="dimensions_json"
            value="[]"
          />
          <input
            type="hidden"
            name="variant_dimension_labels_json"
            value={JSON.stringify(dimensionLabels)}
          />
          <input
            type="hidden"
            name="variants_json"
            value={JSON.stringify(variants)}
          />

          <VariantTable
            dimensionLabels={dimensionLabels}
            onChangeDimensionLabels={setDimensionLabels}
            hasColors={hasColors}
            colors={colors}
            variants={variants}
            onChangeVariants={setVariants}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <input
            type="hidden"
            name="variant_dimension_labels_json"
            value="[]"
          />
          <input
            type="hidden"
            name="variants_json"
            value="[]"
          />

          {/* Dimensions for Simple Product */}
          <div>
            <label className="block text-sm font-semibold text-[#1a1a1a] mb-0.5">
              Dimensions
            </label>
            <p className="text-[11px] text-[#1a1a1a]/50 mb-2">
              Physical measurements with units (e.g. Height: 12, cm)
            </p>
            <input
              type="hidden"
              name="dimensions_json"
              value={JSON.stringify(dimensions)}
            />
            <DimensionsInput value={dimensions} onChange={setDimensions} />
          </div>
        </div>
      )}

      {/* Specifications (Common across all product types & variants) */}
      <div className="pt-2">
        <label className="block text-sm font-semibold text-[#1a1a1a] mb-0.5">
          Specifications <span className="text-[11px] font-normal text-[#1a1a1a]/50">(Common across all variants)</span>
        </label>
        <p className="text-[11px] text-[#1a1a1a]/50 mb-2">
          Product attributes that apply to all variants (e.g. Material: Makrana Marble, Finish: Polished, Craftsmanship: Hand Carved)
        </p>
        <input
          type="hidden"
          name="specifications_json"
          value={JSON.stringify(specifications)}
        />
        <SpecificationsInput value={specifications} onChange={setSpecifications} />
      </div>

      {/* 3A. Canonical Color List (only shown if Has Colors is ON) */}
      {hasColors && (
        <div className="pt-2">
          <ColorManager colors={colors} onChange={setColors} />
        </div>
      )}

      {/* 3B. Product Images Gallery */}
      <div className="pt-2">
        <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
          Product Images
        </label>

        {/* Hidden inputs serialized for server action */}
        <input
          type="hidden"
          name="images_json"
          value={JSON.stringify(commonImages)}
        />
        {hasColors && (
          <input
            type="hidden"
            name="color_images_json"
            value={JSON.stringify(colorImages)}
          />
        )}

        <TabbedImageUploader
          hasColors={hasColors}
          colors={colors}
          commonImages={commonImages}
          onChangeCommonImages={setCommonImages}
          colorImages={colorImages}
          onChangeColorImages={setColorImages}
          folder="/heena-marble/products"
        />
      </div>

      {/* 3C. Product Video (optional, single video) */}
      <div className="pt-2">
        <label className="block text-sm font-semibold text-[#1a1a1a] mb-1">
          Product Video <span className="text-[11px] font-normal text-[#1a1a1a]/50">(Optional)</span>
        </label>
        <p className="text-[11px] text-[#1a1a1a]/50 mb-3">
          Upload a short product video (MP4 / WebM / MOV, max 50 MB). It will appear on the product page.
        </p>

        {/* Hidden input serialised for server action */}
        <input type="hidden" name="video_url" value={videoUrl} />

        {videoUrl ? (
          /* Video preview with remove button */
          <div className="relative rounded-2xl overflow-hidden border border-[#b38b4d]/30 bg-black/5">
            <video
              src={videoUrl}
              controls
              className="w-full max-h-64 object-contain bg-black"
            />
            <button
              type="button"
              onClick={() => setVideoUrl("")}
              className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-red-600/90 hover:bg-red-700 text-white text-xs font-semibold px-2.5 py-1 transition-colors shadow"
            >
              <X className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        ) : (
          <VideoUploader
            folder="/heena-marble/products/videos"
            onUploadComplete={(url) => setVideoUrl(url)}
          />
        )}
      </div>

      {/* Visibility & Promotion Settings */}
      <div className="rounded-xl border border-[#b38b4d]/25 bg-[#faf8f5] p-4 sm:p-5 space-y-4 shadow-xs">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={initialData.is_active ?? true}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-[#b38b4d] cursor-pointer"
          />
          <div>
            <span className="block text-sm font-semibold text-[#1a1a1a] group-hover:text-[#b38b4d] transition-colors">
              Active (Visible in Shop)
            </span>
            <span className="block text-xs text-[#1a1a1a]/60 mt-0.5">
              Product will be publicly visible and purchasable in the shop catalog
            </span>
          </div>
        </label>

        <div className="border-t border-[#b38b4d]/15 pt-3">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="is_featured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-[#b38b4d] cursor-pointer"
            />
            <div>
              <span className="block text-sm font-semibold text-[#1a1a1a] group-hover:text-[#b38b4d] transition-colors">
                Featured on Homepage
              </span>
              <span className="block text-xs text-[#1a1a1a]/60 mt-0.5">
                Display this product in the Featured Products carousel section on the homepage
              </span>
            </div>
          </label>

          {isFeatured && (
            <div className="mt-3 pl-7">
              <label className="block text-xs font-semibold text-[#1a1a1a] mb-1">
                Featured Display Order (optional)
              </label>
              <input
                type="number"
                name="featured_order"
                defaultValue={initialData.featured_order ?? ""}
                placeholder="e.g. 1, 2, 3... (lower numbers show first)"
                min="0"
                className="w-full sm:w-64 rounded-lg border border-[#e5e0d8] px-3 py-1.5 text-sm outline-none focus:border-[#b38b4d] bg-white transition-colors"
              />
              <span className="block text-[11px] text-[#1a1a1a]/50 mt-1">
                Lower numbers appear first. Leave empty for newest-first order after numbered items.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Client validation error */}
      {clientError && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{clientError}</span>
        </div>
      )}

      {/* Server action error */}
      {state?.error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[#b38b4d] hover:bg-[#967440] text-white font-semibold px-6 py-2.5 transition-colors disabled:opacity-60 cursor-pointer shadow-xs"
      >
        {pending ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}
