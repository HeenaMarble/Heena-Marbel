"use client";

import { useState, useTransition } from "react";
import { Pencil, Check, X, AlertCircle } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import { updateService } from "@/lib/actions/content-actions";

export default function ServiceCard({ service, index }) {
  const [isEditing, setIsEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: service.title || "",
    description: service.description || "",
    image_url: service.image_url || "",
  });

  const handleSave = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.title.trim()) {
      setError("Please provide a service title.");
      return;
    }

    startTransition(async () => {
      try {
        await updateService(service.id, {
          title: formData.title.trim(),
          description: formData.description.trim(),
          image_url: formData.image_url,
        });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        setIsEditing(false);
      } catch (err) {
        setError(err.message || "Failed to update service.");
      }
    });
  };

  const handleCancel = () => {
    setFormData({
      title: service.title || "",
      description: service.description || "",
      image_url: service.image_url || "",
    });
    setError("");
    setIsEditing(false);
  };

  return (
    <div className="rounded-2xl border border-[#b38b4d]/20 bg-white/90 p-5 md:p-6 shadow-sm transition-all hover:border-[#b38b4d]/40 flex flex-col justify-between">
      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#b38b4d]/15 pb-3">
            <span className="text-xs font-semibold text-[#b38b4d] uppercase tracking-wider">
              Editing Service #{index + 1}
            </span>
            <button
              type="button"
              onClick={handleCancel}
              className="text-stone-400 hover:text-stone-600 p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          {/* Image Uploader */}
          <div>
            <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">
              Service Image
            </label>
            <ImageUploader
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              folder="/heena-marble/services"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">
              Service Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-xl border border-[#e5e0d8] bg-white px-3.5 py-2 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">
              Description
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl border border-[#e5e0d8] bg-white px-3.5 py-2 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#b38b4d]/10">
            <button
              type="button"
              onClick={handleCancel}
              disabled={pending}
              className="rounded-full border border-stone-300 px-4 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-[#b38b4d] hover:bg-[#967440] text-white font-semibold px-5 py-1.5 text-xs transition-colors disabled:opacity-60 shadow-sm"
            >
              {pending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col h-full justify-between">
          <div>
            {/* Header Badge & Edit button */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center text-xs font-semibold text-[#b38b4d] bg-[#b38b4d]/10 rounded-full px-2.5 py-0.5">
                Service #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#967440] border border-[#b38b4d]/30 rounded-full px-3 py-1 hover:bg-[#b38b4d]/10 transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
            </div>

            {/* Image display */}
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-[#1a1a1a]/5 mb-4 border border-[#b38b4d]/15">
              {service.image_url ? (
                <img
                  src={service.image_url}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#1a1a1a]/30 text-xs">
                  No image set
                </div>
              )}
            </div>

            {/* Title & Description */}
            <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">
              {service.title || "Untitled Service"}
            </h3>
            <p className="text-sm text-[#1a1a1a]/70 leading-relaxed line-clamp-4">
              {service.description || "No description provided."}
            </p>
          </div>

          {/* Bottom Success note if recently updated */}
          {success && (
            <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">
              <Check className="h-3.5 w-3.5" /> Updated successfully!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
