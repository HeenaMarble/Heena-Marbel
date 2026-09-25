"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteReel } from "@/lib/actions/content-actions";

export default function ReelRowActions({ id, label }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Remove reel "${label}" from the storefront?`)) return;
    startTransition(async () => {
      try {
        await deleteReel(id);
      } catch (err) {
        alert(err.message || "Failed to delete reel");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      title="Remove reel"
      className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-red-600 border border-red-300 rounded-full px-3 py-1.5 hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      <Trash2 className="h-3.5 w-3.5" /> {pending ? "..." : "Remove"}
    </button>
  );
}
