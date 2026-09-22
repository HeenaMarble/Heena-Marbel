"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { updateAnnouncement, deleteAnnouncement } from "@/lib/actions/content-actions";

export default function AnnouncementRowActions({ id, isActive, message }) {
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      try {
        await updateAnnouncement(id, { is_active: !isActive });
      } catch (err) {
        alert(err.message || "Failed to update status");
      }
    });
  }

  function handleDelete() {
    const preview = message.length > 30 ? message.slice(0, 30) + "..." : message;
    if (!confirm(`Are you sure you want to delete announcement "${preview}"?`)) return;
    startTransition(async () => {
      try {
        await deleteAnnouncement(id);
      } catch (err) {
        alert(err.message || "Failed to delete announcement");
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleToggle}
        disabled={pending}
        title={isActive ? "Deactivate banner" : "Activate banner"}
        className={`flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1.5 border transition-all ${
          isActive
            ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
            : "bg-stone-50 text-stone-500 border-stone-300 hover:bg-stone-100"
        } disabled:opacity-50`}
      >
        {isActive ? (
          <>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Active
          </>
        ) : (
          <>
            <XCircle className="h-3.5 w-3.5 text-stone-400" /> Inactive
          </>
        )}
      </button>

      <Link
        href={`/admin/content/announcements/${id}/edit`}
        className="flex items-center gap-1.5 text-xs font-semibold text-[#967440] border border-[#b38b4d]/30 rounded-full px-3 py-1.5 hover:bg-[#b38b4d]/10 transition-colors"
      >
        <Pencil className="h-3.5 w-3.5" /> Edit
      </Link>

      <button
        type="button"
        onClick={handleDelete}
        disabled={pending}
        title="Delete announcement"
        className="flex items-center gap-1.5 text-xs font-semibold text-red-600 border border-red-300 rounded-full px-3 py-1.5 hover:bg-red-50 transition-colors disabled:opacity-50"
      >
        <Trash2 className="h-3.5 w-3.5" /> {pending ? "..." : "Delete"}
      </button>
    </div>
  );
}
