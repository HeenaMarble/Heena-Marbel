"use client";

import { useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DimensionsInput from "@/components/admin/DimensionsInput";
import SpecificationsInput from "@/components/admin/SpecificationsInput";
import VariantTable from "@/components/admin/VariantTable";
import ColorManager from "@/components/admin/ColorManager";
import TabbedImageUploader from "@/components/admin/TabbedImageUploader";
import { AlertCircle } from "lucide-react";

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

  // Variant Dimension Labels (array of strings, e.g. ["Height", "Width"])
  const [dimensionLabels, setDimensionLabels] = useState(() =>
    Array.isArray(initialData.variant_dimension_labels)
      ? initialData.variant_dimension_labels
      : []
  );

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

      {/* 2. Dimensions / Specifications Section */}
      {hasVariants ? (
        <div className="pt-2">
          {/* Hidden JSON serialization for variant dimension labels & variants */}
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
        <div className="space-y-5">
          {/* Dimensions */}
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

          {/* Specifications */}
          <div>
            <label className="block text-sm font-semibold text-[#1a1a1a] mb-0.5">
              Specifications
            </label>
            <p className="text-[11px] text-[#1a1a1a]/50 mb-2">
              Product attributes without units (e.g. Material: Makrana Marble)
            </p>
            <input
              type="hidden"
              name="specifications_json"
              value={JSON.stringify(specifications)}
            />
            <SpecificationsInput value={specifications} onChange={setSpecifications} />
          </div>
        </div>
      )}

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

      {/* Active Checkbox */}
      <label className="flex items-center gap-2 text-sm font-semibold text-[#1a1a1a] cursor-pointer">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={initialData.is_active ?? true}
          className="h-4 w-4 accent-[#b38b4d] cursor-pointer"
        />
        Active (visible on the shop)
      </label>

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
