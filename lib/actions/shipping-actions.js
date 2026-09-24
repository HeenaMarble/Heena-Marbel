"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function getShippingSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("shipping_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) return { flat_rate: 79, free_shipping_above: 1499, cod_fee: 40 };
  return data;
}

export async function updateShippingSettings(formData) {
  const supabase = createAdminClient(); // service-role, bypasses RLS — admin-only write

  const payload = {
    id: 1,
    flat_rate: Number(formData.get("flat_rate")),
    free_shipping_above: Number(formData.get("free_shipping_above")),
    cod_fee: Number(formData.get("cod_fee")),
  };

  const { error } = await supabase
    .from("shipping_settings")
    .upsert(payload, { onConflict: "id" });

  if (error) return { error: error.message };
  return { success: true };
}
