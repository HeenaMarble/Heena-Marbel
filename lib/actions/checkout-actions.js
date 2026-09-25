"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getCustomerSession } from "@/lib/customerSession";
import { getShippingSettings } from "./shipping-actions";
import { validateCoupon } from "./coupons";
import { getActiveQuantityDiscount, computeQuantityDiscount } from "./quantity-discount";
import { redirect } from "next/navigation";

function generateOrderNumber() {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `HM-${rand}`;
}

export async function placeOrder(formData) {
  const customerId = await getCustomerSession();

  if (!customerId) {
    return { error: "Please log in to place an order." };
  }

  const rawItems = JSON.parse(formData.get("items_json") || "[]");
  if (!rawItems.length) return { error: "Your cart is empty." };

  const supabase = createAdminClient();

  // ── 1. Fetch fresh DB prices & validate items ──────────────────────
  const variantIds = rawItems.map((i) => i.variantId).filter(Boolean);
  const productIds = rawItems.map((i) => i.productId).filter(Boolean);

  let variantsMap = {};
  if (variantIds.length > 0) {
    const { data: variantsData } = await supabase
      .from("product_variants")
      .select("id, product_id, price, stock")
      .in("id", variantIds);
    if (variantsData) {
      variantsMap = Object.fromEntries(variantsData.map((v) => [v.id, v]));
    }
  }

  let productsMap = {};
  if (productIds.length > 0) {
    const { data: productsData } = await supabase
      .from("products")
      .select("id, name, price, stock_quantity")
      .in("id", productIds);
    if (productsData) {
      productsMap = Object.fromEntries(productsData.map((p) => [p.id, p]));
    }
  }

  const verifiedItems = [];
  for (const item of rawItems) {
    const qty = Math.max(1, Number(item.quantity) || 1);
    let unitPrice = 0;
    let productName = item.name || "Makrana Marble Artifact";

    if (item.variantId) {
      const variant = variantsMap[item.variantId];
      if (!variant) {
        return { error: `Product variant "${item.name || "Item"}" is no longer available.` };
      }
      if (typeof variant.stock === "number" && variant.stock < qty) {
        return {
          error: variant.stock <= 0
            ? `"${item.name || "Selected variant"}" is currently out of stock.`
            : `Only ${variant.stock} units of "${item.name || "Item"}" available.`,
        };
      }
      unitPrice = Number(variant.price) || 0;
      if (variant.product_id && productsMap[variant.product_id]) {
        productName = productsMap[variant.product_id].name || productName;
      }
    } else if (item.productId) {
      const prod = productsMap[item.productId];
      if (!prod) {
        return { error: `Product "${item.name || "Item"}" is no longer available.` };
      }
      if (typeof prod.stock_quantity === "number" && prod.stock_quantity < qty) {
        return {
          error: prod.stock_quantity <= 0
            ? `"${item.name || "Product"}" is currently out of stock.`
            : `Only ${prod.stock_quantity} units of "${item.name || "Item"}" available.`,
        };
      }
      unitPrice = Number(prod.price) || 0;
      productName = prod.name || productName;
    } else {
      return { error: "Invalid product item in cart." };
    }

    verifiedItems.push({
      ...item,
      name: productName,
      price: unitPrice,
      quantity: qty,
    });
  }

  // ── 2. Recompute Subtotal & Discounts Server-Side ──────────────────
  const subtotal = verifiedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = verifiedItems.reduce((sum, i) => sum + i.quantity, 0);

  // Recompute quantity discount from active rules
  let quantityDiscount = 0;
  const qdRules = await getActiveQuantityDiscount();
  if (qdRules?.enabled && Array.isArray(qdRules?.tiers) && qdRules.tiers.length > 0) {
    quantityDiscount = await computeQuantityDiscount(totalItems, qdRules.tiers);
    quantityDiscount = Math.max(0, Number(quantityDiscount) || 0);
  }

  // Recompute coupon discount from coupon validation
  let couponDiscount = 0;
  const couponCode = formData.get("coupon_code")?.toString().trim().toUpperCase() || null;
  if (couponCode) {
    const couponRes = await validateCoupon(couponCode, subtotal);
    if (couponRes?.valid) {
      couponDiscount = Math.max(0, Number(couponRes.discount) || 0);
    }
  }

  const shipping = await getShippingSettings();
  const freeShippingAbove = Number(shipping?.free_shipping_above) || 1499;
  const flatRate = Number(shipping?.flat_rate) || 79;
  const codFee = Number(shipping?.cod_fee) || 40;

  const discountedSubtotal = Math.max(0, subtotal - quantityDiscount - couponDiscount);
  const shippingFee = subtotal >= freeShippingAbove ? 0 : flatRate;
  const totalAmount = discountedSubtotal + shippingFee + codFee;

  const shippingAddress = {
    full_name: formData.get("full_name"),
    phone: formData.get("phone"),
    address_line1: formData.get("address_line1"),
    address_line2: formData.get("address_line2") || null,
    city: formData.get("city"),
    state: formData.get("state"),
    pin_code: formData.get("pin_code"),
  };

  // ── 3. Validate & Decrement Stock ──────────────────────────────────
  const decrementedItems = [];
  for (const item of verifiedItems) {
    const qty = item.quantity;
    let success = false;

    if (item.variantId) {
      // 1. Try RPC first
      const res = await supabase.rpc("decrement_variant_stock", {
        p_variant_id: item.variantId,
        p_qty: qty,
      });

      if (!res.error && res.data) {
        success = true;
      } else {
        // Fallback: Direct DB decrement
        const variant = variantsMap[item.variantId];
        const currentStock = typeof variant?.stock === "number" ? variant.stock : 0;
        if (currentStock >= qty) {
          const { error: updateErr } = await supabase
            .from("product_variants")
            .update({ stock: Math.max(0, currentStock - qty) })
            .eq("id", item.variantId);
          if (!updateErr) {
            success = true;
            // Also sync product total stock if product_id exists
            if (variant.product_id) {
              const prod = productsMap[variant.product_id];
              if (prod && typeof prod.stock_quantity === "number") {
                await supabase
                  .from("products")
                  .update({ stock_quantity: Math.max(0, prod.stock_quantity - qty) })
                  .eq("id", variant.product_id);
              }
            }
          }
        }
      }
    } else if (item.productId) {
      // 1. Try RPC first
      const res = await supabase.rpc("decrement_stock", {
        p_product_id: item.productId,
        p_qty: qty,
      });

      if (!res.error && res.data) {
        success = true;
      } else {
        // Fallback: Direct DB decrement
        const prod = productsMap[item.productId];
        const currentStock = typeof prod?.stock_quantity === "number" ? prod.stock_quantity : 0;
        if (currentStock >= qty) {
          const { error: updateErr } = await supabase
            .from("products")
            .update({ stock_quantity: Math.max(0, currentStock - qty) })
            .eq("id", item.productId);
          if (!updateErr) {
            success = true;
          }
        }
      }
    }

    if (!success) {
      // Roll back already decremented items
      for (const dec of decrementedItems) {
        if (dec.variantId) {
          const { data: v } = await supabase
            .from("product_variants")
            .select("stock")
            .eq("id", dec.variantId)
            .single();
          if (v) {
            await supabase
              .from("product_variants")
              .update({ stock: (v.stock || 0) + dec.quantity })
              .eq("id", dec.variantId);
          }
        } else if (dec.productId) {
          const { data: p } = await supabase
            .from("products")
            .select("stock_quantity")
            .eq("id", dec.productId)
            .single();
          if (p) {
            await supabase
              .from("products")
              .update({ stock_quantity: (p.stock_quantity || 0) + dec.quantity })
              .eq("id", dec.productId);
          }
        }
      }

      return {
        error: `${item.name || "Product"} is out of stock`,
      };
    }

    decrementedItems.push(item);
  }

  // ── 4. Insert Order ────────────────────────────────────────────────
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: generateOrderNumber(),
      customer_id: customerId,
      payment_method: "cod",
      order_status: "pending",
      shipping_address: shippingAddress,
      subtotal,
      coupon_code: couponDiscount > 0 ? couponCode : null,
      coupon_discount: couponDiscount,
      quantity_discount: quantityDiscount,
      shipping_fee: shippingFee,
      cod_fee: codFee,
      total_amount: totalAmount,
    })
    .select()
    .single();

  if (orderError) {
    // Roll back stock if order insert fails
    for (const dec of decrementedItems) {
      if (dec.variantId) {
        const { data: v } = await supabase
          .from("product_variants")
          .select("stock")
          .eq("id", dec.variantId)
          .single();
        if (v) {
          await supabase
            .from("product_variants")
            .update({ stock: (v.stock || 0) + dec.quantity })
            .eq("id", dec.variantId);
        }
      } else if (dec.productId) {
        const { data: p } = await supabase
          .from("products")
          .select("stock_quantity")
          .eq("id", dec.productId)
          .single();
        if (p) {
          await supabase
            .from("products")
            .update({ stock_quantity: (p.stock_quantity || 0) + dec.quantity })
            .eq("id", dec.productId);
        }
      }
    }
    return { error: orderError.message };
  }

  // ── 5. Insert Order Items ──────────────────────────────────────────
  const orderItems = verifiedItems.map((i) => ({
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
  if (itemsError) {
    // Clean up order and roll back stock
    await supabase.from("orders").delete().eq("id", order.id);
    for (const dec of decrementedItems) {
      if (dec.variantId) {
        const { data: v } = await supabase
          .from("product_variants")
          .select("stock")
          .eq("id", dec.variantId)
          .single();
        if (v) {
          await supabase
            .from("product_variants")
            .update({ stock: (v.stock || 0) + dec.quantity })
            .eq("id", dec.variantId);
        }
      } else if (dec.productId) {
        const { data: p } = await supabase
          .from("products")
          .select("stock_quantity")
          .eq("id", dec.productId)
          .single();
        if (p) {
          await supabase
            .from("products")
            .update({ stock_quantity: (p.stock_quantity || 0) + dec.quantity })
            .eq("id", dec.productId);
        }
      }
    }
    return { error: itemsError.message };
  }

  redirect(`/account/orders/${order.id}?new=1`);
}
