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
  const email = formData.get("email");
  const password = formData.get("password");

  const supabase = createAdminClient();
  const { data: admin, error } = await supabase
    .from("admin_users")
    .select("id, password_hash")
    .eq("email", email)
    .single();

  if (error || !admin || admin.password_hash !== hashPassword(password)) {
    return { error: "Invalid email or password" };
  }

  await createAdminSession(admin.id);
  redirect("/admin");
}

export async function adminLogout() {
  await destroyAdminSession();
  redirect("/admin/login");
}
