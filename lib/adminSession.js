import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "hm_admin_session";
const SECRET = process.env.ADMIN_SESSION_SECRET;

function sign(value) {
  const hmac = crypto.createHmac("sha256", SECRET).update(value).digest("hex");
  return `${value}.${hmac}`;
}

function verify(signed) {
  if (!signed) return null;
  const [value, hmac] = signed.split(".");
  if (!value || !hmac) return null;
  const expected = crypto.createHmac("sha256", SECRET).update(value).digest("hex");
  return hmac === expected ? value : null;
}

export async function createAdminSession(adminId) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, sign(adminId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  return verify(raw); // returns adminId or null
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
