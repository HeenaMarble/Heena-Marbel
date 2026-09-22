'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ========================= TESTIMONIALS =========================

export async function getTestimonials() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('display_order', { ascending: true })
  if (error) throw new Error(error.message)
  return data
}

export async function createTestimonial(formData) {
  const supabase = await createClient()
  const { error } = await supabase.from('testimonials').insert(formData)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/testimonials')
}

export async function updateTestimonial(id, formData) {
  const supabase = await createClient()
  const { error } = await supabase.from('testimonials').update(formData).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/testimonials')
}

export async function deleteTestimonial(id) {
  const supabase = await createClient()
  const { error } = await supabase.from('testimonials').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/testimonials')
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
