"use server";
import { createAdminClient } from "@/lib/supabase/server";
import { getCustomerSession } from "@/lib/customerSession";
import { getAdminSession } from "@/lib/adminSession";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  if (!(await getAdminSession())) throw new Error("Unauthorized");
}

// Admin: saare reviews (pending + approved)
export async function getReviews() {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*, products(name), customers(name)")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

// Product page: top N approved reviews for a product
export async function getApprovedReviews(productId, limit = 4) {
  const supabase = createAdminClient();
  let query = supabase
    .from("reviews")
    .select("id, rating, comment, created_at, customers(name)")
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

// All-reviews page: saare approved reviews (no limit)
export async function getAllApprovedReviews(productId) {
  return getApprovedReviews(productId, null);
}

// Customer submits a review (login required)
export async function submitReview(productId, rating, comment) {
  const customerId = await getCustomerSession();
  if (!customerId) throw new Error("You must be logged in to submit a review.");
  const supabase = createAdminClient();
  const { error } = await supabase.from("reviews").insert({
    product_id: productId,
    customer_id: customerId,
    rating,
    comment,
    is_approved: false,
  });
  if (error) throw new Error(error.message);
}

// Admin: approve review + revalidate shop pages
export async function approveReview(id) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("reviews")
    .update({ is_approved: true })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/reviews");
  revalidatePath("/shop", "layout");
}

// Admin: delete review + revalidate shop pages
export async function deleteReview(id) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/reviews");
  revalidatePath("/shop", "layout");
}
