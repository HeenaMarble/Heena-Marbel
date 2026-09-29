"use client";

import { useState, useTransition } from "react";
import {
  Pencil,
  Check,
  X,
  AlertCircle,
  Trash2,
  ChevronUp,
  ChevronDown,
  Star,
  ExternalLink,
  Video,
  UploadCloud,
} from "lucide-react";
import {
  updateReel,
  deleteReel,
  moveReelOrder,
  toggleFeaturedReel,
} from "@/lib/actions/content-actions";
import VideoUploader from "@/components/admin/VideoUploader";

export default function ReelCard({
  reel,
  index,
  totalCount,
  isFirst = false,
  isLast = false,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState("link"); // 'link' | 'upload'
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    url: reel.url || "",
    label: reel.label || "",
    display_order: reel.display_order ?? index + 1,
    is_featured: !!reel.is_featured,
  });

  const isDirectVideo =
    typeof reel.url === "string" &&
    (/\.(mp4|webm|mov)(\?.*)?$/i.test(reel.url) ||
      reel.url.includes("ik.imagekit.io") ||
      !reel.url.includes("instagram.com"));

  function handleVideoUploaded(videoUrl) {
    setFormData((prev) => ({ ...prev, url: videoUrl }));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  function handleSave(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.url.trim()) {
      setError("Please provide a video URL or upload a video file.");
      return;
    }

    startTransition(async () => {
      try {
        await updateReel(reel.id, {
          url: formData.url.trim(),
          label: formData.label.trim(),
          display_order: Number(formData.display_order) || index + 1,
          is_featured: formData.is_featured,
        });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        setIsEditing(false);
      } catch (err) {
        setError(err.message || "Failed to update reel.");
      }
    });
  }

  function handleCancel() {
    setFormData({
      url: reel.url || "",
      label: reel.label || "",
      display_order: reel.display_order ?? index + 1,
      is_featured: !!reel.is_featured,
    });
    setError("");
    setIsEditing(false);
  }

  function handleMove(direction) {
    startTransition(async () => {
      try {
        await moveReelOrder(reel.id, direction);
      } catch (err) {
        alert(err.message || "Failed to reorder reel");
      }
    });
  }

  function handleToggleFeatured() {
    startTransition(async () => {
      try {
        await toggleFeaturedReel(reel.id, !reel.is_featured);
      } catch (err) {
        alert(err.message || "Failed to update featured status");
      }
    });
  }

  function handleDelete() {
    const preview = reel.label || reel.url;
    if (!confirm(`Remove reel "${preview}" from the storefront?`)) return;
    startTransition(async () => {
      try {
        await deleteReel(reel.id);
      } catch (err) {
        alert(err.message || "Failed to delete reel");
      }
    });
  }

  if (isEditing) {
    return (
      <form
        onSubmit={handleSave}
        className="rounded-2xl border-2 border-[#b38b4d]/40 bg-white p-5 shadow-md space-y-4"
      >
        <div className="flex items-center justify-between border-b border-[#b38b4d]/15 pb-3">
          <span className="text-xs font-semibold text-[#b38b4d] uppercase tracking-wider flex items-center gap-2">
            Editing Reel (Display Rank #{reel.display_order ?? index + 1})
          </span>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg bg-stone-100 p-0.5 border border-stone-200 text-xs">
              <button
                type="button"
                onClick={() => setEditMode("link")}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  editMode === "link"
                    ? "bg-white text-[#b38b4d] shadow-sm"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Link
              </button>
              <button
                type="button"
                onClick={() => setEditMode("upload")}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  editMode === "upload"
                    ? "bg-white text-[#b38b4d] shadow-sm"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Upload File
              </button>
            </div>

            <button
              type="button"
              onClick={handleCancel}
              className="text-stone-400 hover:text-stone-600 p-1 rounded-lg hover:bg-stone-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}

        {editMode === "upload" && (
          <div className="space-y-2">
            <VideoUploader
              folder="/heena-marble/reels"
              onUploadComplete={handleVideoUploaded}
              disabled={pending}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">
              Video / Instagram URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              className="w-full rounded-xl border border-[#e5e0d8] bg-white px-3.5 py-2 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">
              Label (e.g. Makrana Slab Laying)
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) =>
                setFormData({ ...formData, label: e.target.value })
              }
              className="w-full rounded-xl border border-[#e5e0d8] bg-white px-3.5 py-2 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">
              Display Order / Rank (1 = First)
            </label>
            <input
              type="number"
              min="1"
              value={formData.display_order}
              onChange={(e) =>
                setFormData({ ...formData, display_order: e.target.value })
              }
              className="w-full rounded-xl border border-[#e5e0d8] bg-white px-3.5 py-2 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-[#b38b4d]/10 flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) =>
                setFormData({ ...formData, is_featured: e.target.checked })
              }
              className="h-4 w-4 rounded text-[#b38b4d] border-stone-300 focus:ring-[#b38b4d] accent-[#b38b4d]"
            />
            <span className="text-xs font-medium text-[#1a1a1a]">
              Feature on Homepage (Option 1 Showcase Section)
            </span>
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={pending}
              className="rounded-full border border-stone-300 px-4 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-[#b38b4d] hover:bg-[#967440] text-white font-semibold px-5 py-1.5 text-xs transition-colors disabled:opacity-60 shadow-sm cursor-pointer"
            >
              {pending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div className="rounded-2xl border border-[#b38b4d]/20 bg-white/95 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-[#b38b4d]/50 hover:shadow-md transition-all">
      {/* Left Area: Rank Reorder Controls & Details */}
      <div className="min-w-0 flex items-center gap-3">
        {/* Reorder Buttons & Display Rank */}
        <div className="flex flex-col items-center justify-center shrink-0 bg-stone-50 border border-stone-200 rounded-xl p-1">
          <button
            type="button"
            onClick={() => handleMove("up")}
            disabled={isFirst || pending}
            title="Move Up"
            className="p-1 text-stone-500 hover:text-[#b38b4d] hover:bg-white rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <span className="text-[11px] font-bold text-[#b38b4d] px-1.5 py-0.5">
            #{reel.display_order ?? index + 1}
          </span>
          <button
            type="button"
            onClick={() => handleMove("down")}
            disabled={isLast || pending}
            title="Move Down"
            className="p-1 text-stone-500 hover:text-[#b38b4d] hover:bg-white rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Reel Metadata */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-[#1a1a1a] truncate">
              {reel.label || `Reel ${reel.display_order ?? index + 1}`}
            </p>

            {/* Video Type Badge (Direct MP4 vs Instagram) */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                isDirectVideo
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-purple-50 text-purple-800 border-purple-200"
              }`}
            >
              {isDirectVideo ? (
                <>
                  <Video className="h-3 w-3 text-emerald-600" /> Clean MP4 Video
                </>
              ) : (
                <>
                  <svg className="h-3 w-3 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  Instagram Link
                </>
              )}
            </span>

            {/* Featured Badge / Quick Toggle */}
            <button
              type="button"
              onClick={handleToggleFeatured}
              disabled={pending}
              title={
                reel.is_featured
                  ? "Click to remove from homepage"
                  : "Click to feature on homepage"
              }
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all border cursor-pointer ${
                reel.is_featured
                  ? "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                  : "bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100 hover:text-stone-700"
              }`}
            >
              <Star
                className={`h-3 w-3 ${
                  reel.is_featured
                    ? "fill-amber-500 text-amber-500"
                    : "text-stone-400"
                }`}
              />
              {reel.is_featured ? "Featured on Home" : "Feature on Home"}
            </button>
          </div>

          <a
            href={reel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#967440] font-mono truncate flex items-center gap-1 max-w-sm sm:max-w-md hover:underline mt-1"
          >
            <span className="truncate">{reel.url}</span>
            <ExternalLink className="h-3 w-3 shrink-0 opacity-60" />
          </a>

          {success && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-700 mt-1">
              <Check className="h-3 w-3" /> Updated
            </span>
          )}
        </div>
      </div>

      {/* Right Area: Action Buttons */}
      <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#967440] border border-[#b38b4d]/30 rounded-full px-3 py-1.5 hover:bg-[#b38b4d]/10 transition-colors cursor-pointer"
        >
          <Pencil className="h-3.5 w-3.5" /> Edit / Replace
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          title="Remove reel"
          className="flex items-center gap-1.5 text-xs font-semibold text-red-600 border border-red-300 rounded-full px-3 py-1.5 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" /> {pending ? "..." : "Remove"}
        </button>
      </div>
    </div>
  );
}
