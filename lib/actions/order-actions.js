"use server";

import { createClient } from "@/lib/supabase/server";
import { getCustomerSession } from "@/lib/customerSession";

export async function getOrderDetails(orderId) {
  const supabase = await createClient();
  const customerId = await getCustomerSession();
  if (!customerId) return null;

  const { data: order, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .eq("customer_id", customerId) // security: only owner can view
    .single();

  if (error || !order) return null;

  if (Array.isArray(order.order_items) && order.order_items.length > 0) {
    const productIds = Array.from(
      new Set(order.order_items.map((i) => i.product_id).filter(Boolean))
    );
    if (productIds.length > 0) {
      const { data: products } = await supabase
        .from("products")
        .select("id, image_url")
        .in("id", productIds);

      if (products && products.length > 0) {
        const imgMap = Object.fromEntries(products.map((p) => [p.id, p.image_url]));
        order.order_items = order.order_items.map((item) => ({
          ...item,
          image_url: imgMap[item.product_id] || null,
        }));
      }
    }
  }

  return order;
}

export async function getMyOrders() {
  const supabase = await createClient();
  const customerId = await getCustomerSession();
  if (!customerId) return [];

  const { data, error } = await supabase
    .from("orders")
    .select("id, order_number, order_status, total_amount, created_at")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  return error ? [] : data;
}
