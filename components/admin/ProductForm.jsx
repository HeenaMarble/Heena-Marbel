"use client";

import { useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MultiImageUploader from "@/components/admin/MultiImageUploader";
import DimensionsInput from "@/components/admin/DimensionsInput";

export default function ProductForm({ action, categories = [], initialData = {} }) {
  const [state, formAction, pending] = useActionState(action, null);
  const [images, setImages] = useState(
    initialData.images?.length
      ? initialData.images.map((img) => img.image_url)
      : initialData.image_url
      ? [initialData.image_url]
      : []
  );
  const [dimensions, setDimensions] = useState(
    Array.isArray(initialData.dimensions) ? initialData.dimensions : []
  );
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push("/admin/products");
    }
  }, [state?.success, router]);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <div>
        <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">Product Name</label>
        <input
          name="name"
          required
          defaultValue={initialData.name || ""}
          className="w-full rounded-lg border border-[#e5e0d8] px-3 py-2.5 outline-none focus:border-[#b38b4d] bg-white"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">Category</label>
        <select
          name="category_id"
          defaultValue={initialData.category_id || ""}
          className="w-full rounded-lg border border-[#e5e0d8] px-3 py-2.5 outline-none focus:border-[#b38b4d] bg-white"
        >
          <option value="">Uncategorized</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">Description</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={initialData.description || ""}
          className="w-full rounded-lg border border-[#e5e0d8] px-3 py-2.5 outline-none focus:border-[#b38b4d] bg-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">Price (₹)</label>
          <input
            type="number"
            name="price"
            step="0.01"
            min="0"
            required
            defaultValue={initialData.price || ""}
            className="w-full rounded-lg border border-[#e5e0d8] px-3 py-2.5 outline-none focus:border-[#b38b4d] bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">Stock Quantity</label>
          <input
            type="number"
            name="stock_quantity"
            min="0"
            defaultValue={initialData.stock_quantity ?? 0}
            className="w-full rounded-lg border border-[#e5e0d8] px-3 py-2.5 outline-none focus:border-[#b38b4d] bg-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">
          Dimensions & Specifications
        </label>
        <input
          type="hidden"
          name="dimensions_json"
          value={JSON.stringify(dimensions)}
        />
        <DimensionsInput value={dimensions} onChange={setDimensions} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">Product Images</label>
        <input
          type="hidden"
          name="images_json"
          value={JSON.stringify(images)}
        />
        <MultiImageUploader
          value={images}
          onChange={setImages}
          folder="/heena-marble/products"
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-[#1a1a1a]">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={initialData.is_active ?? true}
          className="h-4 w-4 accent-[#b38b4d]"
        />
        Active (visible on the shop)
      </label>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[#b38b4d] hover:bg-[#967440] text-white font-semibold px-6 py-2.5 transition-colors disabled:opacity-60 cursor-pointer"
      >
        {pending ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}
