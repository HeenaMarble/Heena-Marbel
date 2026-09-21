"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { createAdminSession, destroyAdminSession } from "@/lib/adminSession";
import { redirect } from "next/navigation";
import crypto from "crypto";

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
  // NOTE: for production, swap this for bcrypt — see note below
}

export async function adminLogin(prevState, formData) {
  const email = (formData.get("email") || "").trim().toLowerCase();
  const password = formData.get("password") || "";

  if (!email || !password) {
    return { error: "Please provide both email and password." };
  }

  const supabase = createAdminClient();
  const { data: admin, error } = await supabase
    .from("admin_users")
    .select("id, email, password_hash")
    .ilike("email", email)
    .single();

  if (error) {
    console.error("[adminLogin] Supabase query error:", error);
  }

  const storedHash = admin?.password_hash ? admin.password_hash.replace(/\s+/g, "") : "";

  if (error || !admin || storedHash !== hashPassword(password)) {
    return { error: "Invalid email or password" };
  }

  await createAdminSession(admin.id);
  redirect("/admin");
}

export async function adminLogout() {
  await destroyAdminSession();
  redirect("/admin/login");
}
