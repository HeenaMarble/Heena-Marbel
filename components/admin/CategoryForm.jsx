"use client";

import { useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/admin/ImageUploader";

function slugify(text = "") {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default function CategoryForm({ action, initialData = {} }) {
  const [state, formAction, pending] = useActionState(action, null);
  const [name, setName] = useState(initialData.name || "");
  const [imageUrl, setImageUrl] = useState(initialData.image_url || "");
  const [isVisible, setIsVisible] = useState(initialData.is_visible ?? true);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push("/admin/categories");
    }
  }, [state?.success, router]);

  useEffect(() => {
    if (initialData.name !== undefined) setName(initialData.name || "");
    if (initialData.image_url !== undefined) setImageUrl(initialData.image_url || "");
    if (initialData.is_visible !== undefined) setIsVisible(initialData.is_visible);
  }, [initialData.name, initialData.image_url, initialData.is_visible]);

  const computedSlug = slugify(name);

  return (
    <form action={formAction} className="max-w-xl space-y-6">
      {/* 1. Category Name & Live Slug Preview */}
      <div>
        <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">
          Category Name <span className="text-red-500">*</span>
        </label>
        <input
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Marble Mandirs"
          className="w-full rounded-lg border border-[#e5e0d8] px-3 py-2.5 outline-none focus:border-[#b38b4d] bg-white text-[#1a1a1a]"
        />
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#777777]">
          <span>URL Preview:</span>
          <span className="font-mono text-[#1a1a1a] bg-[#f8f6f2] border border-[#e5e0d8] px-2 py-0.5 rounded">
            /shop?category={computedSlug || "<slug>"}
          </span>
        </div>
      </div>

      {/* 2. Image */}
      <div>
        <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">Image</label>
        <input type="hidden" name="image_url" value={imageUrl} />
        <ImageUploader value={imageUrl} onChange={setImageUrl} folder="/heena-marble/categories" />
      </div>

      {/* 3. Description */}
      <div>
        <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">Description</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={initialData.description || ""}
          placeholder="Brief description of this marble category..."
          className="w-full rounded-lg border border-[#e5e0d8] px-3 py-2.5 outline-none focus:border-[#b38b4d] bg-white text-[#1a1a1a]"
        />
      </div>

      {/* 4. Sort Order */}
      <div>
        <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">Sort Order</label>
        <input
          type="number"
          name="sort_order"
          min="0"
          defaultValue={initialData.sort_order ?? 0}
          className="w-full rounded-lg border border-[#e5e0d8] px-3 py-2.5 outline-none focus:border-[#b38b4d] bg-white text-[#1a1a1a]"
        />
        <p className="mt-1 text-xs text-[#777777]">
          Lower numbers appear first on the store.
        </p>
      </div>

      {/* 5. Visibility Toggle Switch */}
      <div>
        <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">Visibility</label>
        <label className="inline-flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            name="is_visible"
            checked={isVisible}
            onChange={(e) => setIsVisible(e.target.checked)}
            className="sr-only"
          />
          <div
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isVisible ? "bg-emerald-600" : "bg-stone-300"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                isVisible ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
          <span className={`text-sm font-semibold ${isVisible ? "text-emerald-700" : "text-stone-500"}`}>
            {isVisible ? "Visible" : "Hidden"}
          </span>
        </label>
      </div>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[#b38b4d] hover:bg-[#967440] text-white font-semibold px-6 py-2.5 transition-colors disabled:opacity-60 cursor-pointer shadow-sm"
        >
          {pending ? "Saving..." : "Save Category"}
        </button>
      </div>
    </form>
  );
}
