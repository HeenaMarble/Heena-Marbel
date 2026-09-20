"use client";

import { useTransition } from "react";
import { Check, Trash2 } from "lucide-react";
import { approveReview, deleteReview } from "@/actions/reviews";

export default function ReviewRowActions({ id, isApproved }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      {!isApproved && (
        <button
          onClick={() => startTransition(() => approveReview(id))}
          disabled={pending}
          className="flex items-center gap-1.5 text-xs font-semibold text-green-700 border border-green-300 rounded-full px-3 py-1.5 hover:bg-green-50 disabled:opacity-50"
        >
          <Check className="h-3.5 w-3.5" /> Approve
        </button>
      )}
      <button
        onClick={() => {
          if (confirm("Delete this review?")) startTransition(() => deleteReview(id));
        }}
        disabled={pending}
        className="flex items-center gap-1.5 text-xs font-semibold text-red-600 border border-red-300 rounded-full px-3 py-1.5 hover:bg-red-50 disabled:opacity-50"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
