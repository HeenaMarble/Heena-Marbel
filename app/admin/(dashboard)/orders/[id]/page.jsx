import { getOrder } from "@/actions/orders";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export default async function OrderDetailPage({ params }) {
  const { id } = await params;
  const order = await getOrder(id);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#b38b4d]/20 pb-6">
        <div>
          <h1 className="text-3xl font-semibold text-[#1a1a1a]">{order.order_number}</h1>
          <p className="text-base text-[#1a1a1a]/50 mt-1">{new Date(order.created_at).toLocaleString("en-IN")}</p>
        </div>
        <OrderStatusSelect id={order.id} currentStatus={order.order_status} />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
        <div className="rounded-[2rem] border border-[#b38b4d]/20 bg-white/85 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">Items</h2>
          <ul className="divide-y divide-[#b38b4d]/10">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-3">
                <div className="h-12 w-12 rounded-lg overflow-hidden bg-[#1a1a1a]/5 shrink-0">
                  {item.products?.image_url && (
                    <img src={item.products.image_url} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1a1a1a] truncate">{item.products?.name || "Deleted product"}</p>
                  <p className="text-xs text-[#1a1a1a]/50">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-[#1a1a1a]">₹{Number(item.price).toLocaleString("en-IN")}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-[#b38b4d]/10 flex justify-between font-semibold text-[#1a1a1a]">
            <span>Total</span>
            <span>₹{Number(order.total_amount).toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#b38b4d]/20 bg-white/85 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">Customer</h2>
          <p className="font-semibold text-[#1a1a1a]">{order.customers?.name || "Guest"}</p>
          <p className="text-sm text-[#1a1a1a]/60">{order.customers?.email}</p>
          <p className="text-sm text-[#1a1a1a]/60">{order.customers?.phone}</p>

          {order.shipping_address && (
            <>
              <h3 className="text-sm font-semibold text-[#1a1a1a] mt-5 mb-2">Shipping Address</h3>
              <p className="text-sm text-[#1a1a1a]/70 whitespace-pre-line">
                {typeof order.shipping_address === "string"
                  ? order.shipping_address
                  : JSON.stringify(order.shipping_address, null, 2)}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
