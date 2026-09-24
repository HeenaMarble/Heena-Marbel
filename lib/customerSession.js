import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "hm_customer_session";

function getSecret() {
  const secret = process.env.CUSTOMER_SESSION_SECRET;
  if (!secret) throw new Error("CUSTOMER_SESSION_SECRET is not set");
  return secret;
}

function hmacOf(value) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

function sign(value) {
  return `${value}.${hmacOf(value)}`;
}

function verify(signed) {
  if (!signed) return null;
  const idx = signed.lastIndexOf(".");
  if (idx <= 0) return null;
  const value = signed.slice(0, idx);
  const given = Buffer.from(signed.slice(idx + 1));
  const expected = Buffer.from(hmacOf(value));
  if (given.length !== expected.length) return null;
  return crypto.timingSafeEqual(given, expected) ? value : null;
}

export async function createCustomerSession(customerId) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, sign(String(customerId)), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function getCustomerSession() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  return verify(raw); // returns customerId or null
}

export async function destroyCustomerSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}