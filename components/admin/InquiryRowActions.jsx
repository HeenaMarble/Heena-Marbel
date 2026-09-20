"use client";

import { useTransition } from "react";
import { Check, RotateCcw, Trash2 } from "lucide-react";
import { toggleInquiryResolved, deleteInquiry } from "@/actions/inquiries";

export default function InquiryRowActions({ id, isResolved }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => startTransition(() => toggleInquiryResolved(id, !isResolved))}
        disabled={pending}
        className={`flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1.5 border disabled:opacity-50 ${
          isResolved ? "text-[#1a1a1a]/60 border-[#e5e0d8] hover:bg-[#1a1a1a]/5" : "text-green-700 border-green-300 hover:bg-green-50"
        }`}
      >
        {isResolved ? <><RotateCcw className="h-3.5 w-3.5" /> Reopen</> : <><Check className="h-3.5 w-3.5" /> Resolve</>}
      </button>
      <button
        onClick={() => {
          if (confirm("Delete this inquiry?")) startTransition(() => deleteInquiry(id));
        }}
        disabled={pending}
        className="flex items-center gap-1.5 text-xs font-semibold text-red-600 border border-red-300 rounded-full px-3 py-1.5 hover:bg-red-50 disabled:opacity-50"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
