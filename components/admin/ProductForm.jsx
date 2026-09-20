"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/admin/ImageUploader";

export default function ProductForm({ action, categories = [], initialData = {} }) {
  const [state, formAction, pending] = useActionState(action, null);
  const [imageUrl, setImageUrl] = useState(initialData.image_url || "");
  const router = useRouter();

  if (state?.success) {
    router.push("/admin/products");
  }

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div>
        <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">Product Name</label>
        <input
          name="name"
          required
          defaultValue={initialData.name || ""}
          className="w-full rounded-lg border border-[#e5e0d8] px-3 py-2.5 outline-none focus:border-[#b38b4d]"
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
          className="w-full rounded-lg border border-[#e5e0d8] px-3 py-2.5 outline-none focus:border-[#b38b4d]"
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
            className="w-full rounded-lg border border-[#e5e0d8] px-3 py-2.5 outline-none focus:border-[#b38b4d]"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">Stock Quantity</label>
          <input
            type="number"
            name="stock_quantity"
            min="0"
            defaultValue={initialData.stock_quantity ?? 0}
            className="w-full rounded-lg border border-[#e5e0d8] px-3 py-2.5 outline-none focus:border-[#b38b4d]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">Image</label>
        <input type="hidden" name="image_url" value={imageUrl} />
        <ImageUploader value={imageUrl} onChange={setImageUrl} folder="/heena-marble/products" />
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
        className="rounded-full bg-[#b38b4d] hover:bg-[#967440] text-white font-semibold px-6 py-2.5 transition-colors disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}
