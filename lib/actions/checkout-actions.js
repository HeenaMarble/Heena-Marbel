"use server";

import { createClient } from "@/lib/supabase/server";
import { getCustomerSession } from "@/lib/customerSession";
import { getShippingSettings } from "./shipping-actions";
import { redirect } from "next/navigation";

function generateOrderNumber() {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `HM-${rand}`;
}

export async function placeOrder(formData) {
  const supabase = await createClient();
  const customerId = await getCustomerSession();

  if (!customerId) {
    return { error: "Please log in to place an order." };
  }

  const items = JSON.parse(formData.get("items_json") || "[]");
  if (!items.length) return { error: "Your cart is empty." };

  const shipping = await getShippingSettings();
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFee = subtotal >= shipping.free_shipping_above ? 0 : shipping.flat_rate;
  const codFee = shipping.cod_fee;
  const totalAmount = subtotal + shippingFee + codFee;

  const shippingAddress = {
    full_name: formData.get("full_name"),
    phone: formData.get("phone"),
    address_line1: formData.get("address_line1"),
    address_line2: formData.get("address_line2") || null,
    city: formData.get("city"),
    state: formData.get("state"),
    pin_code: formData.get("pin_code"),
  };

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: generateOrderNumber(),
      customer_id: customerId,
      payment_method: "cod",
      order_status: "pending",
      shipping_address: shippingAddress,
      subtotal,
      shipping_fee: shippingFee,
      cod_fee: codFee,
      total_amount: totalAmount,
    })
    .select()
    .single();

  if (orderError) return { error: orderError.message };

  const orderItems = items.map((i) => ({
    order_id: order.id,
    product_id: i.productId,
    variant_id: i.variantId || null,
    product_name: i.name,
    quantity: i.quantity,
    price: i.price,
    variant_snapshot: i.variantId
      ? { color_name: i.colorName || null, dimension_values: i.dimensionValues || null }
      : null,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) return { error: itemsError.message };

  redirect(`/account/orders/${order.id}?new=1`);
}
