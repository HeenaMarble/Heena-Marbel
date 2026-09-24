"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import {
  createCustomerSession,
  getCustomerSession,
  destroyCustomerSession,
} from "@/lib/customerSession";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// login timing same rakhne ke liye (email exist kare ya na kare)
const DUMMY_HASH = bcrypt.hashSync("dummy-password", 10);

export async function registerCustomer(prevState, formData) {
  const name = (formData.get("name") || "").trim();
  const email = (formData.get("email") || "").trim().toLowerCase();
  const password = formData.get("password") || "";
  const phone = (formData.get("phone") || "").trim() || null;
  // error pe form reset ho jata hai, isliye values wapas bhejte hain
  const values = { name, email };

  if (!name || !email || !password) {
    return { error: "Please fill in all required fields.", values };
  }
  if (!EMAIL_RE.test(email)) {
    return { error: "Please enter a valid email address.", values };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters.", values };
  }

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("customers")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (existing) {
    return { error: "An account with this email already exists.", values };
  }

  const password_hash = await bcrypt.hash(password, 10);
  const { data: customer, error } = await supabase
    .from("customers")
    .insert({ name, email, phone, password_hash })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { error: "An account with this email already exists.", values };
    }
    console.error("[registerCustomer] Supabase error:", error);
    return { error: "Something went wrong. Please try again.", values };
  }

  await createCustomerSession(customer.id);
  const redirectTo = (formData.get("redirect") || "").trim();
  const safeRedirect = redirectTo.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : "/";
  redirect(safeRedirect);
}

export async function loginCustomer(prevState, formData) {
  const email = (formData.get("email") || "").trim().toLowerCase();
  const password = formData.get("password") || "";
  const values = { email };

  if (!email || !password) {
    return { error: "Please provide both email and password.", values };
  }

  const supabase = createAdminClient();
  const { data: customer, error } = await supabase
    .from("customers")
    .select("id, password_hash")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    console.error("[loginCustomer] Supabase error:", error);
  }

  const ok = await bcrypt.compare(password, customer?.password_hash || DUMMY_HASH);
  // password_hash null ho (manually bani row) toh login kabhi allow nahi hoga
  if (error || !customer || !customer.password_hash || !ok) {
    return { error: "Invalid email or password", values };
  }

  await createCustomerSession(customer.id);
  const redirectTo = (formData.get("redirect") || "").trim();
  const safeRedirect = redirectTo.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : "/";
  redirect(safeRedirect);
}

export async function logoutCustomer() {
  await destroyCustomerSession();
  redirect("/");
}

export async function getCurrentCustomer() {
  const id = await getCustomerSession();
  if (!id) return null;

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("customers")
    .select("id, name, email, phone")
    .eq("id", id)
    .maybeSingle();

  return data || null;
}
