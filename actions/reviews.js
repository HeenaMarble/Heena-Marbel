"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getReviews() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*, products(name), customers(name)")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function approveReview(id) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("reviews").update({ is_approved: true }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/reviews");
}

export async function deleteReview(id) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/reviews");
}
