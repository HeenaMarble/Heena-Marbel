"use server";

import imagekit from "@/lib/imagekit";

export async function getImageKitAuthParams() {
  return imagekit.getAuthenticationParameters();
}
