"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/actions/products";

export default function DeleteProductButton({ id }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    startTransition(() => deleteProduct(id));
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="flex items-center gap-1.5 text-xs font-semibold text-red-600 border border-red-300 rounded-full px-3 py-1.5 hover:bg-red-50 disabled:opacity-50"
    >
      <Trash2 className="h-3.5 w-3.5" /> {pending ? "..." : "Delete"}
    </button>
  );
}
