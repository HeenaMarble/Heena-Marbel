"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "@/actions/orders";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function OrderStatusSelect({ id, currentStatus }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={currentStatus}
      disabled={pending}
      onChange={(e) => startTransition(() => updateOrderStatus(id, e.target.value))}
      className="rounded-lg border border-[#e5e0d8] px-3 py-2 text-sm font-semibold capitalize outline-none focus:border-[#b38b4d] bg-white disabled:opacity-60"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
