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
    { data: lowStock },
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
      .limit(5),
    supabase
      .from("inquiries")
      .select("id, name, message, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("products")
      .select("id, name, stock_quantity")
      .eq("is_active", true)
      .lte("stock_quantity", LOW_STOCK_THRESHOLD)
      .order("stock_quantity", { ascending: true })
      .limit(5),
  ]);

  const revenue = (orders || []).reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const pendingOrders = (orders || []).filter((o) => o.order_status === "pending").length;

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
    lowStock: lowStock || [],
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
