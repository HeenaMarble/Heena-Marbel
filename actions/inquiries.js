"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getInquiries() {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function toggleInquiryResolved(id, resolved) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("inquiries").update({ is_resolved: resolved }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/inquiries");
}

export async function deleteInquiry(id) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("inquiries").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/inquiries");
}
