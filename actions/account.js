"use server";

import { createAdminClient } from "@/lib/supabase/server";

export async function getCustomers() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("customers")
    .select("id, name, email, phone, created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}
