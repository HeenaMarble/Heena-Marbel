import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getOrders } from "@/actions/orders";

const STATUS_STYLES = {
  pending: "bg-[#1a1a1a]/10 text-[#1a1a1a]/70",
  processing: "bg-[#b38b4d]/15 text-[#967440]",
  shipped: "bg-blue-400/15 text-blue-600",
  delivered: "bg-green-400/15 text-green-600",
  cancelled: "bg-red-400/15 text-red-600",
};

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <div className="border-b border-[#b38b4d]/20 pb-6">
        <h1 className="text-3xl font-semibold text-[#1a1a1a]">Orders</h1>
        <p className="text-base text-[#1a1a1a]/50 mt-1">Track and manage customer orders.</p>
      </div>

      <div className="mt-8 rounded-[2rem] border border-[#b38b4d]/20 bg-white/85 overflow-hidden shadow-sm">
        {orders.length === 0 ? (
          <p className="text-center py-12 text-[#1a1a1a]/50 font-semibold">No orders yet.</p>
        ) : (
          <ul className="divide-y divide-[#b38b4d]/10">
            {orders.map((o) => (
              <li key={o.id}>
                <Link href={`/admin/orders/${o.id}`} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-5 py-4 hover:bg-[#1a1a1a]/[0.02]">
                  <div>
                    <p className="font-semibold text-[#1a1a1a]">{o.order_number}</p>
                    <p className="text-xs text-[#1a1a1a]/50">{o.customers?.name || "Guest"} • {new Date(o.created_at).toLocaleDateString("en-IN")}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#1a1a1a]/80 font-semibold">₹{Number(o.total_amount).toLocaleString("en-IN")}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[o.order_status] || ""}`}>
                      {o.order_status}
                    </span>
                    <ChevronRight className="h-4 w-4 text-[#1a1a1a]/30" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
