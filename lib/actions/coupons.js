"use server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/adminSession";

export async function getCoupons() {
  await requireAdmin();
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createCoupon(formData) {
  await requireAdmin();
  const supabase = await createAdminClient();

  const code = formData.get("code")?.toString().trim().toUpperCase();
  const type = formData.get("type");
  const value = Number(formData.get("value"));
  const min_purchase = Number(formData.get("min_purchase") || 0);
  const expires_at = formData.get("expires_at") || null;

  if (!code || !type || !value) {
    return { error: "Code, type and value are required" };
  }

  const { error } = await supabase.from("coupons").insert({
    code,
    type,
    value,
    min_purchase,
    expires_at,
  });

  if (error) {
    if (error.code === "23505") return { error: "Coupon code already exists" };
    return { error: error.message };
  }
  return { success: true };
}

export async function toggleCouponActive(id, is_active) {
  await requireAdmin();
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("coupons")
    .update({ is_active })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteCoupon(id) {
  await requireAdmin();
  const supabase = await createAdminClient();
  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) throw error;
}

// Public — called from checkout, no admin check, no public SELECT policy needed
export async function validateCoupon(code, cartTotal) {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.trim().toUpperCase())
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) return { valid: false, error: "Invalid coupon code" };

  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { valid: false, error: "This coupon has expired" };
  }
  if (cartTotal < data.min_purchase) {
    return { valid: false, error: `Minimum purchase of ₹${data.min_purchase} required` };
  }

  const discount =
    data.type === "percent_off"
      ? Math.round((cartTotal * data.value) / 100)
      : data.value;

  return { valid: true, discount, coupon: data };
}
