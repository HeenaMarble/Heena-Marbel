"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, ArrowLeft } from "lucide-react";
import { createTestimonial, updateTestimonial } from "@/lib/actions/content-actions";

export default function TestimonialForm({ initialData = null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const isEditing = !!initialData?.id;

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    location: initialData?.location || "",
    rating: initialData?.rating ?? 5,
    message: initialData?.message || "",
    display_order: initialData?.display_order ?? 0,
    is_active: initialData?.is_active ?? true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Please provide a customer name.");
      return;
    }
    if (!formData.message.trim()) {
      setError("Please provide a testimonial message.");
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          name: formData.name.trim(),
          location: formData.location.trim(),
          rating: Number(formData.rating),
          message: formData.message.trim(),
          display_order: Number(formData.display_order) || 0,
          is_active: Boolean(formData.is_active),
        };

        if (isEditing) {
          await updateTestimonial(initialData.id, payload);
        } else {
          await createTestimonial(payload);
        }

        router.push("/admin/content/testimonials");
        router.refresh();
      } catch (err) {
        setError(err.message || "An unexpected error occurred while saving.");
      }
    });
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link
          href="/admin/content/testimonials"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#967440] hover:text-[#b38b4d] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Testimonials
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[#b38b4d]/20 bg-white/90 p-6 md:p-8 shadow-sm space-y-6"
      >
        <div className="border-b border-[#b38b4d]/15 pb-4">
          <h2 className="text-xl font-semibold text-[#1a1a1a]">
            {isEditing ? "Edit Testimonial" : "Create New Testimonial"}
          </h2>
          <p className="text-xs text-[#1a1a1a]/50 mt-0.5">
            {isEditing
              ? "Update details of this client review."
              : "Add a new client review to showcase on the website."}
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
            {error}
          </div>
        )}

        {/* Customer Name */}
        <div>
          <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">
            Customer / Client Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Rajesh & Priya Sharma"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-xl border border-[#e5e0d8] bg-white px-4 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">
            Location / City
          </label>
          <input
            type="text"
            placeholder="e.g. Bandra West, Mumbai"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full rounded-xl border border-[#e5e0d8] bg-white px-4 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">
            Rating (Stars)
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, rating: star })}
                className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors focus:outline-none"
              >
                <Star
                  className={`h-6 w-6 transition-colors ${
                    star <= formData.rating
                      ? "fill-[#b38b4d] text-[#b38b4d]"
                      : "text-stone-300"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm font-semibold text-[#b38b4d]">
              {formData.rating} out of 5 stars
            </span>
          </div>
        </div>

        {/* Testimonial Message */}
        <div>
          <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">
            Testimonial Message <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            placeholder="Write the client's review or experience..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full rounded-xl border border-[#e5e0d8] bg-white px-4 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
          />
        </div>

        {/* Display Order & Is Active */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">
              Display Order
            </label>
            <input
              type="number"
              min="0"
              value={formData.display_order}
              onChange={(e) =>
                setFormData({ ...formData, display_order: parseInt(e.target.value, 10) || 0 })
              }
              className="w-full rounded-xl border border-[#e5e0d8] bg-white px-4 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
            />
            <p className="text-xs text-[#1a1a1a]/40 mt-1">Lower numbers appear first.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">
              Status Visibility
            </label>
            <label className="relative inline-flex items-center cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#b38b4d]"></div>
              <span className="ml-3 text-sm font-medium text-[#1a1a1a]">
                {formData.is_active ? "Active (Visible)" : "Inactive (Hidden)"}
              </span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-[#b38b4d]/15 flex items-center justify-end gap-3">
          <Link
            href="/admin/content/testimonials"
            className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-[#b38b4d] hover:bg-[#967440] text-white font-semibold px-6 py-2.5 text-sm transition-colors disabled:opacity-60 shadow-sm"
          >
            {pending ? "Saving..." : isEditing ? "Update Testimonial" : "Create Testimonial"}
          </button>
        </div>
      </form>
    </div>
  );
}
