'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { getAdminSession } from '@/lib/adminSession'
import { revalidatePath } from 'next/cache'

// ========================= TESTIMONIALS =========================
// Admin actions use the service-role client + requireAdmin (admin login is a
// custom cookie session, not Supabase auth). The public homepage reads through
// getPublicTestimonials() below, so the table needs no public RLS policy.

async function requireAdmin() {
  if (!(await getAdminSession())) throw new Error('Unauthorized')
}

// Whitelist fields so the client can never write anything unexpected
function cleanTestimonial(input = {}) {
  const out = {}
  if ('name' in input) out.name = String(input.name ?? '').trim()
  if ('location' in input) out.location = String(input.location ?? '').trim()
  if ('rating' in input) out.rating = Math.min(5, Math.max(1, Number(input.rating) || 5))
  if ('message' in input) out.message = String(input.message ?? '').trim()
  if ('display_order' in input) out.display_order = Number(input.display_order) || 0
  if ('is_active' in input) out.is_active = Boolean(input.is_active)
  return out
}

function revalidateTestimonials() {
  revalidatePath('/admin/content/testimonials')
  revalidatePath('/')
}

// Admin list (includes inactive ones)
export async function getTestimonials() {
  await requireAdmin()
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('display_order', { ascending: true })
  if (error) throw new Error(error.message)
  return data
}

// Public homepage list (active only, public fields only)
export async function getPublicTestimonials() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('testimonials')
    .select('id, name, location, rating, message')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
  if (error) {
    console.error('getPublicTestimonials failed:', error.message)
    return []
  }
  return data
}

export async function createTestimonial(formData) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase.from('testimonials').insert(cleanTestimonial(formData))
  if (error) throw new Error(error.message)
  revalidateTestimonials()
}

export async function updateTestimonial(id, formData) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('testimonials')
    .update(cleanTestimonial(formData))
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidateTestimonials()
}

export async function deleteTestimonial(id) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase.from('testimonials').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidateTestimonials()
}

// ========================= SERVICES (fixed 4) =========================

export async function getServices() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('display_order', { ascending: true })
  if (error) throw new Error(error.message)
  return data
}

export async function updateService(id, formData) {
  const supabase = await createClient()
  const { error } = await supabase.from('services').update(formData).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/services')
}

// ========================= STATS (fixed 4) =========================

export async function getStats() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('stats')
    .select('*')
    .order('display_order', { ascending: true })
  if (error) throw new Error(error.message)
  return data
}

export async function updateStat(id, formData) {
  const supabase = await createClient()
  const { error } = await supabase.from('stats').update(formData).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/stats')
}

// ========================= ANNOUNCEMENTS =========================

export async function getAnnouncements() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

export async function createAnnouncement(formData) {
  const supabase = await createClient()
  const { error } = await supabase.from('announcements').insert(formData)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/announcements')
}

export async function updateAnnouncement(id, formData) {
  const supabase = await createClient()
  const { error } = await supabase.from('announcements').update(formData).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/announcements')
}

export async function deleteAnnouncement(id) {
  const supabase = await createClient()
  const { error } = await supabase.from('announcements').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/announcements')
}

// ========================= SITE SETTINGS (single row, id=1) =========================

export async function getSiteSettings() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data
}

export async function updateSiteSettings(formData) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('site_settings')
    .upsert({ id: 1, ...formData })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/settings')
}

// ========================= REELS =========================

export async function getReels() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reels')
    .select('*')
    .order('display_order', { ascending: true })
  if (error) throw new Error(error.message)
  return data
}

export async function createReel(formData) {
  const supabase = await createClient()
  const { error } = await supabase.from('reels').insert(formData)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/reels')
}

export async function updateReel(id, formData) {
  const supabase = await createClient()
  const { error } = await supabase.from('reels').update(formData).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/reels')
}

export async function deleteReel(id) {
  const supabase = await createClient()
  const { error } = await supabase.from('reels').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/reels')
}

// Hero video background (video-only editing — rest of hero stays hardcoded)
export async function getHeroSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hero_settings")
    .select("video_url")
    .eq("id", 1)
    .single();
  if (error) return { video_url: null };
  return data;
}

export async function updateHeroVideo(formData) {
  await requireAdmin();
  const supabase = await createAdminClient();
  const video_url = formData.get("video_url");
  if (!video_url) return { error: "Video URL is required" };
  const { error } = await supabase
    .from("hero_settings")
    .update({ video_url })
    .eq("id", 1);
  if (error) return { error: error.message };
  return { success: true };
}
