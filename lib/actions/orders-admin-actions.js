"use server";

import { createAdminClient } from "@/lib/supabase/server";

export async function getOrdersOverview() {
  // Use createAdminClient (service-role) so admin can read customer profile data bypassing customer RLS
  const supabase = createAdminClient();

  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      created_at,
      payment_method,
      order_status,
      total_amount,
      shipping_address,
      customers ( name, email, phone )
    `)
    .order("created_at", { ascending: false });

  if (error) return { orders: [], stats: { total: 0, pending: 0, shipped: 0, cancelled: 0 } };

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.order_status === "pending").length,
    shipped: orders.filter((o) => o.order_status === "shipped").length,
    cancelled: orders.filter((o) => o.order_status === "cancelled").length,
  };

  return { orders, stats };
}
