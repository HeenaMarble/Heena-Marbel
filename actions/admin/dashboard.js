"use server";

import { createAdminClient } from "@/lib/supabase/server";

const LOW_STOCK_THRESHOLD = 5;

export async function getDashboardStats() {
  const supabase = createAdminClient();

  const [
    { data: orders },
    { count: productCount },
    { count: inquiryCount },
    { count: pendingReviewCount },
    { count: unresolvedInquiryCount },
    { data: recentOrders },
    { data: recentInquiries },
    { data: activeProducts },
  ] = await Promise.all([
    supabase.from("orders").select("total_amount, order_status"),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("inquiries").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }).eq("is_approved", false),
    supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("is_resolved", false),
    supabase
      .from("orders")
      .select("id, order_number, total_amount, order_status, created_at")
      .order("created_at", { ascending: false })
      .limit(12),
    supabase
      .from("inquiries")
      .select("id, name, message, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("products")
      .select("id, name, stock_quantity, has_variants")
      .eq("is_active", true),
  ]);

  const revenue = (orders || []).reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const pendingOrders = (orders || []).filter((o) => o.order_status === "pending").length;

  const variantProductIds = (activeProducts || [])
    .filter((p) => p.has_variants)
    .map((p) => p.id);

  let stockByProduct = {};
  if (variantProductIds.length > 0) {
    const { data: variantRows } = await supabase
      .from("product_variants")
      .select("product_id, stock")
      .in("product_id", variantProductIds);

    for (const v of variantRows || []) {
      stockByProduct[v.product_id] = (stockByProduct[v.product_id] || 0) + (v.stock || 0);
    }
  }

  const withEffectiveStock = (activeProducts || []).map((p) => ({
    id: p.id,
    name: p.name,
    stock_quantity: p.has_variants ? (stockByProduct[p.id] || 0) : p.stock_quantity,
  }));

  const lowStock = withEffectiveStock
    .filter((p) => p.stock_quantity <= LOW_STOCK_THRESHOLD)
    .sort((a, b) => a.stock_quantity - b.stock_quantity)
    .slice(0, 5);

  return {
    revenue,
    orderCount: orders?.length || 0,
    pendingOrders,
    productCount: productCount || 0,
    inquiryCount: inquiryCount || 0,
    pendingReviewCount: pendingReviewCount || 0,
    unresolvedInquiryCount: unresolvedInquiryCount || 0,
    recentOrders: recentOrders || [],
    recentInquiries: recentInquiries || [],
    lowStock,
  };
}

export async function getSidebarBadgeCounts() {
  const supabase = createAdminClient();
  const [{ count: pendingReviewCount }, { count: unresolvedInquiryCount }] = await Promise.all([
    supabase.from("reviews").select("*", { count: "exact", head: true }).eq("is_approved", false),
    supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("is_resolved", false),
  ]);
  return {
    pendingReviewCount: pendingReviewCount || 0,
    unresolvedInquiryCount: unresolvedInquiryCount || 0,
  };
}
