"use server";

import { createAdminClient } from "@/lib/supabase/server";

export async function getCustomers() {
  const supabase = createAdminClient();

  // Fetch all customers
  const { data: customers, error } = await supabase
    .from("customers")
    .select("id, name, email, phone, created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  if (!customers || customers.length === 0) return [];

  // Fetch order stats per customer
  const { data: orders } = await supabase
    .from("orders")
    .select("customer_id, total_amount");

  // Build a map: customerId → { order_count, total_spend }
  const statsMap = {};
  for (const order of orders || []) {
    if (!statsMap[order.customer_id]) {
      statsMap[order.customer_id] = { order_count: 0, total_spend: 0 };
    }
    statsMap[order.customer_id].order_count += 1;
    statsMap[order.customer_id].total_spend += Number(order.total_amount) || 0;
  }

  return customers.map((c) => ({
    ...c,
    order_count: statsMap[c.id]?.order_count ?? 0,
    total_spend: statsMap[c.id]?.total_spend ?? 0,
  }));
}
