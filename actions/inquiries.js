"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ---------- Admin side (already existed) ----------

export async function getInquiries() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function toggleInquiryResolved(id, resolved) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("inquiries")
    .update({ is_resolved: resolved })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
}

export async function deleteInquiry(id) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("inquiries").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
}

// ---------- Public side (NEW): Contact form submit ----------
// Used with useActionState, so signature is (prevState, formData) => newState

export async function submitInquiry(prevState, formData) {
  // Honeypot: real users never see this field, bots fill it
  if (formData.get("website")) return { success: true };

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !message) {
    return { error: "Please fill in your name, email and message." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (phone && !/^[0-9]{7,15}$/.test(phone)) {
    return { error: "Please enter a valid phone number (digits only)." };
  }
  if (name.length > 100 || email.length > 150 || phone.length > 20 || message.length > 3000) {
    return { error: "One of the fields is too long. Please shorten it and try again." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("inquiries").insert({
    name,
    email,
    phone: phone || null,
    message,
  });

  if (error) {
    console.error("submitInquiry failed:", error.message);
    return { error: "Could not send your message. Please try again in a moment." };
  }

  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
  return { success: true };
}
