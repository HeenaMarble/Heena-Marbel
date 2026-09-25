"use server";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/adminSession";

export async function getQuantityDiscountAdmin() {
  await requireAdmin();
  const supabase = await createAdminClient();
  const [{ data: settings }, { data: tiers }] = await Promise.all([
    supabase.from("quantity_discount_settings").select("*").eq("id", 1).single(),
    supabase.from("quantity_discount_tiers").select("*").order("min_items", { ascending: true }),
  ]);
  return { settings, tiers: tiers || [] };
}

export async function saveQuantityDiscountRules(formData) {
  await requireAdmin();
  const supabase = await createAdminClient();

  const is_enabled = formData.get("is_enabled") === "true";
  const tiersJson = JSON.parse(formData.get("tiers_json") || "[]");

  const { error: settingsErr } = await supabase
    .from("quantity_discount_settings")
    .update({ is_enabled })
    .eq("id", 1);
  if (settingsErr) return { error: settingsErr.message };

  await supabase.from("quantity_discount_tiers").delete().not("id", "is", null);

  if (tiersJson.length) {
    const rows = tiersJson.map((t, i) => ({
      min_items: Number(t.min_items),
      discount_amount: Number(t.discount_amount),
      display_order: i,
    }));
    const { error: insertErr } = await supabase.from("quantity_discount_tiers").insert(rows);
    if (insertErr) return { error: insertErr.message };
  }

  return { success: true };
}

// Public — checkout reads this via anon client, RLS SELECT policy allows it
export async function getActiveQuantityDiscount() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("quantity_discount_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (!settings?.is_enabled) return { enabled: false, tiers: [] };

  const { data: tiers } = await supabase
    .from("quantity_discount_tiers")
    .select("*")
    .order("min_items", { ascending: false });

  return { enabled: true, tiers: tiers || [] };
}

export async function computeQuantityDiscount(totalItems, tiers) {
  const match = tiers.find((t) => totalItems >= t.min_items);
  return match ? match.discount_amount : 0;
}
