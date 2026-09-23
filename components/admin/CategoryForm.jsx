"use client";

import { useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/admin/ImageUploader";

export default function CategoryForm({ action, initialData = {} }) {
  const [state, formAction, pending] = useActionState(action, null);
  const [imageUrl, setImageUrl] = useState(initialData.image_url || "");
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push("/admin/categories");
    }
  }, [state?.success, router]);

  return (
    <form action={formAction} className="max-w-lg space-y-5">
      <div>
        <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">Category Name</label>
        <input
          name="name"
          required
          defaultValue={initialData.name || ""}
          className="w-full rounded-lg border border-[#e5e0d8] px-3 py-2.5 outline-none focus:border-[#b38b4d]"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">Image</label>
        <input type="hidden" name="image_url" value={imageUrl} />
        <ImageUploader value={imageUrl} onChange={setImageUrl} folder="/heena-marble/categories" />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[#b38b4d] hover:bg-[#967440] text-white font-semibold px-6 py-2.5 transition-colors disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save Category"}
      </button>
    </form>
  );
}
