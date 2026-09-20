"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getOrders() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, customers(name, email)")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function getOrder(id) {
  const supabase = createAdminClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select("*, customers(name, email, phone)")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);

  const { data: items } = await supabase
    .from("order_items")
    .select("*, products(name, image_url)")
    .eq("order_id", id);

  return { ...order, items: items || [] };
}

export async function updateOrderStatus(id, status) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("orders").update({ order_status: status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}
