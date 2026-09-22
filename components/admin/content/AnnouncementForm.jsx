"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Info, Link2, Megaphone } from "lucide-react";
import { createAnnouncement, updateAnnouncement } from "@/lib/actions/content-actions";

export default function AnnouncementForm({ initialData = null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const isEditing = !!initialData?.id;

  const [formData, setFormData] = useState({
    message: initialData?.message || "",
    link_url: initialData?.link_url || "",
    is_active: initialData?.is_active ?? true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.message.trim()) {
      setError("Please provide an announcement message.");
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          message: formData.message.trim(),
          link_url: formData.link_url.trim() || null,
          is_active: Boolean(formData.is_active),
        };

        if (isEditing) {
          await updateAnnouncement(initialData.id, payload);
        } else {
          await createAnnouncement(payload);
        }

        router.push("/admin/content/announcements");
        router.refresh();
      } catch (err) {
        setError(err.message || "Failed to save announcement.");
      }
    });
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link
          href="/admin/content/announcements"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#967440] hover:text-[#b38b4d] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Announcements
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[#b38b4d]/20 bg-white/90 p-6 md:p-8 shadow-sm space-y-6"
      >
        <div className="border-b border-[#b38b4d]/15 pb-4">
          <h2 className="text-xl font-semibold text-[#1a1a1a]">
            {isEditing ? "Edit Announcement" : "New Announcement Banner"}
          </h2>
          <p className="text-xs text-[#1a1a1a]/50 mt-0.5">
            {isEditing
              ? "Update banner text, optional link, and active status."
              : "Create a promotional or notice banner for the website top bar."}
          </p>
        </div>

        {/* Informational Note */}
        <div className="flex items-start gap-2.5 p-3.5 bg-amber-500/10 border border-amber-500/25 rounded-xl text-xs text-amber-900 leading-relaxed">
          <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <span>
            <strong>Display Hint:</strong> Announcements appear as the top bar strip on the live website. Typically, only <strong>one</strong> announcement should be active at a time.
          </span>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
            {error}
          </div>
        )}

        {/* Banner Message */}
        <div>
          <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">
            Announcement Message <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            placeholder="e.g. ✨ Exclusive Offer: Complimentary consultation & marble design showcase this weekend."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full rounded-xl border border-[#e5e0d8] bg-white px-4 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
          />
        </div>

        {/* Link URL */}
        <div>
          <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">
            Link URL (Optional)
          </label>
          <div className="relative">
            <Link2 className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="e.g. /products/italian-marble or https://example.com"
              value={formData.link_url}
              onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
              className="w-full rounded-xl border border-[#e5e0d8] bg-white pl-10 pr-4 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#b38b4d] focus:ring-1 focus:ring-[#b38b4d]"
            />
          </div>
          <p className="text-xs text-[#1a1a1a]/40 mt-1">
            If provided, clicking the banner will navigate visitors to this URL.
          </p>
        </div>

        {/* Is Active Toggle */}
        <div className="pt-2">
          <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">
            Banner Status
          </label>
          <label className="relative inline-flex items-center cursor-pointer mt-1">
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
              {formData.is_active ? "Active (Shown on storefront)" : "Inactive (Hidden)"}
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-[#b38b4d]/15 flex items-center justify-end gap-3">
          <Link
            href="/admin/content/announcements"
            className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-[#b38b4d] hover:bg-[#967440] text-white font-semibold px-6 py-2.5 text-sm transition-colors disabled:opacity-60 shadow-sm"
          >
            {pending ? "Saving..." : isEditing ? "Update Banner" : "Create Banner"}
          </button>
        </div>
      </form>
    </div>
  );
}
