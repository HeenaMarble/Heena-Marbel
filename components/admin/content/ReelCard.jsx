"use client";

import { useState, useTransition } from "react";
import { Pencil, Check, X, AlertCircle, Trash2 } from "lucide-react";
import { updateReel, deleteReel } from "@/lib/actions/content-actions";

export default function ReelCard({ reel, index }) {
  const [isEditing, setIsEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    url: reel.url || "",
    label: reel.label || "",
  });

  function handleSave(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.url.trim()) {
      setError("Please provide an Instagram reel link.");
      return;
    }

    startTransition(async () => {
      try {
        await updateReel(reel.id, {
          url: formData.url.trim(),
          label: formData.label.trim(),
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
    setFormData({ url: reel.url || "", label: reel.label || "" });
    setError("");
    setIsEditing(false);
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
        className="rounded-2xl border border-[#b38b4d]/20 bg-white/90 p-5 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between border-b border-[#b38b4d]/15 pb-3">
          <span className="text-xs font-semibold text-[#b38b4d] uppercase tracking-wider">
            Editing Reel #{index + 1}
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

        <div>
          <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">
            Instagram Reel Link <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="w-full rounded-xl border border-[#e5e0d8] bg-white px-3.5 py-2 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">
            Label (optional)
          </label>
          <input
            type="text"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            className="w-full rounded-xl border border-[#e5e0d8] bg-white px-3.5 py-2 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
          />
        </div>

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
    );
  }

  return (
    <div className="rounded-2xl border border-[#b38b4d]/20 bg-white/90 p-4 flex items-center justify-between gap-4 shadow-sm hover:border-[#b38b4d]/40 transition-all">
      <div className="min-w-0 flex items-center gap-3">
        <span className="shrink-0 h-8 w-8 rounded-full bg-[#b38b4d]/10 text-[#967440] text-xs font-bold flex items-center justify-center">
          {index + 1}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#1a1a1a] truncate">{reel.label}</p>
          <a
            href={reel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#967440] font-mono truncate block max-w-md hover:underline"
          >
            {reel.url}
          </a>
          {success && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-700 mt-1">
              <Check className="h-3 w-3" /> Updated
            </span>
          )}
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#967440] border border-[#b38b4d]/30 rounded-full px-3 py-1.5 hover:bg-[#b38b4d]/10 transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" /> Replace
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          title="Remove reel"
          className="flex items-center gap-1.5 text-xs font-semibold text-red-600 border border-red-300 rounded-full px-3 py-1.5 hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" /> {pending ? "..." : "Remove"}
        </button>
      </div>
    </div>
  );
}
