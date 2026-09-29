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
// Same pattern as Hero Video / Testimonials: admin reads+writes go through
// requireAdmin() + the service-role client. Public homepage reads through
// getPublicServices() below (also service-role, read-only fields), so the
// table needs no public RLS policy.

function cleanService(input = {}) {
  const out = {}
  if ('title' in input) out.title = String(input.title ?? '').trim()
  if ('description' in input) out.description = String(input.description ?? '').trim()
  if ('image_url' in input) out.image_url = String(input.image_url ?? '').trim()
  return out
}

// Admin list (all fields)
export async function getServices() {
  await requireAdmin()
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('display_order', { ascending: true })
  if (error) throw new Error(error.message)
  return data
}

// Public homepage list
export async function getPublicServices() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('services')
    .select('id, title, description, image_url')
    .order('display_order', { ascending: true })
  if (error) {
    console.error('getPublicServices failed:', error.message)
    return []
  }
  return data
}

export async function updateService(id, formData) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase.from('services').update(cleanService(formData)).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/services')
  revalidatePath('/')
  revalidatePath('/services')
}

// ========================= STATS (fixed 4) =========================

function cleanStat(input = {}) {
  const out = {}
  if ('icon_key' in input) out.icon_key = String(input.icon_key ?? '').trim()
  if ('number' in input) out.number = String(input.number ?? '').trim()
  if ('label' in input) out.label = String(input.label ?? '').trim()
  return out
}

// Admin list (all fields)
export async function getStats() {
  await requireAdmin()
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('stats')
    .select('*')
    .order('display_order', { ascending: true })
  if (error) throw new Error(error.message)
  return data
}

// Public homepage list
export async function getPublicStats() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('stats')
    .select('id, icon_key, number, label')
    .order('display_order', { ascending: true })
  if (error) {
    console.error('getPublicStats failed:', error.message)
    return []
  }
  return data
}

export async function updateStat(id, formData) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase.from('stats').update(cleanStat(formData)).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/stats')
  revalidatePath('/')
}

// ========================= ANNOUNCEMENTS =========================
// Same pattern as Hero Video / Testimonials / Services / Stats: admin
// reads+writes go through requireAdmin() + the service-role client. Public
// storefront banner reads through getActiveAnnouncement() below (also
// service-role, read-only fields), so the table needs no public RLS policy.

function cleanAnnouncement(input = {}) {
  const out = {}
  if ('message' in input) out.message = String(input.message ?? '').trim()
  if ('link_url' in input) out.link_url = input.link_url ? String(input.link_url).trim() : null
  if (out.link_url && !(/^\//.test(out.link_url) || /^https?:\/\/[^\s]+\.[^\s]+/.test(out.link_url))) {
    throw new Error('Please provide a valid URL (starting with http:// or https://) or an internal path (starting with /).')
  }
  if ('is_active' in input) out.is_active = Boolean(input.is_active)
  return out
}

// Admin list (all rows, active + inactive)
export async function getAnnouncements() {
  await requireAdmin()
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

// Public: the single banner shown at the top of the storefront (most
// recently created active row, in case more than one is left active).
export async function getActiveAnnouncement() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('announcements')
    .select('id, message, link_url')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) {
    console.error('getActiveAnnouncement failed:', error.message)
    return null
  }
  return data
}

export async function createAnnouncement(formData) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase.from('announcements').insert(cleanAnnouncement(formData))
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/announcements')
  revalidatePath('/')
}

export async function updateAnnouncement(id, formData) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('announcements')
    .update(cleanAnnouncement(formData))
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/announcements')
  revalidatePath('/')
}

export async function deleteAnnouncement(id) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase.from('announcements').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/announcements')
  revalidatePath('/')
}

export async function getSiteSettings() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data
}

export async function updateSiteSettings(formData) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('site_settings')
    .upsert({ id: 1, ...formData }, { onConflict: 'id' })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/settings')
  revalidatePath('/')
  revalidatePath('/contact')
}

// ========================= REELS =========================
// Same pattern as other Content sections: admin reads+writes go through
// requireAdmin() + the service-role client. Public /reels page reads
// through getPublicReels() below, so the table needs no public RLS policy.

function isInstagramOrVideoUrl(url) {
  try {
    const u = new URL(url)
    return /(^|\.)instagram\.com$/.test(u.hostname) || /\.(mp4|webm|mov)(\?.*)?$/i.test(url) || u.protocol.startsWith('http')
  } catch {
    return false
  }
}

function cleanReel(input = {}) {
  const out = {}
  if ('url' in input) out.url = String(input.url ?? '').trim()
  if ('label' in input) out.label = String(input.label ?? '').trim()
  if ('display_order' in input) out.display_order = Number(input.display_order) || 0
  if ('is_active' in input) out.is_active = Boolean(input.is_active)
  if ('is_featured' in input) {
    // If is_featured is provided, store as 'featured' in title column to maintain compatibility
    out.title = input.is_featured ? 'featured' : ''
  }
  return out
}

function mapReelData(row) {
  if (!row) return row
  return {
    ...row,
    is_featured: row.is_featured ?? (row.title === 'featured' || row.title === 'true'),
  }
}

// Admin list
export async function getReels() {
  await requireAdmin()
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('reels')
    .select('*')
    .order('display_order', { ascending: true })
  if (error) throw new Error(error.message)
  return (data || []).map(mapReelData)
}

// Public /reels page list
export async function getPublicReels() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('reels')
    .select('id, url, label, title, display_order, is_active')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
  if (error) {
    console.error('getPublicReels failed:', error.message)
    return []
  }
  return (data || []).map(mapReelData)
}

// Public homepage featured reels
export async function getFeaturedReels() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('reels')
    .select('id, url, label, title, display_order, is_active')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
  if (error) {
    console.error('getFeaturedReels failed:', error.message)
    return []
  }
  const mapped = (data || []).map(mapReelData)
  const featured = mapped.filter((r) => r.is_featured)
  // If user marked specific reels as featured, return those. Otherwise fallback to first 4 active reels.
  return featured.length > 0 ? featured : mapped.slice(0, 4)
}

export async function createReel(formData) {
  await requireAdmin()
  const clean = cleanReel(formData)
  if (!clean.url) throw new Error('A reel link is required')
  if (!isInstagramOrVideoUrl(clean.url)) throw new Error('Please paste a valid video or instagram.com link')

  const supabase = createAdminClient()

  // Auto-append to the end of the list or use provided display_order
  let nextOrder = clean.display_order
  if (!nextOrder) {
    const { data: last, error: lastError } = await supabase
      .from('reels')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1)
    if (lastError) throw new Error(lastError.message)
    nextOrder = (last?.[0]?.display_order ?? 0) + 1
  }

  const { error } = await supabase.from('reels').insert({
    url: clean.url,
    label: clean.label || `Reel ${nextOrder}`,
    display_order: nextOrder,
    title: clean.title ?? 'featured',
    is_active: clean.is_active !== undefined ? clean.is_active : true,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/reels')
  revalidatePath('/reels')
  revalidatePath('/')
}

export async function updateReel(id, formData) {
  await requireAdmin()
  const supabase = createAdminClient()
  const clean = cleanReel(formData)
  if (clean.url && !isInstagramOrVideoUrl(clean.url)) {
    throw new Error('Please paste a valid video or instagram.com link')
  }

  const { error } = await supabase.from('reels').update(clean).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/reels')
  revalidatePath('/reels')
  revalidatePath('/')
}

export async function toggleFeaturedReel(id, isFeatured) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('reels')
    .update({ title: isFeatured ? 'featured' : '' })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/reels')
  revalidatePath('/reels')
  revalidatePath('/')
}

export async function moveReelOrder(id, direction) {
  await requireAdmin()
  const supabase = createAdminClient()

  const { data: reels, error: fetchErr } = await supabase
    .from('reels')
    .select('id, display_order')
    .order('display_order', { ascending: true })

  if (fetchErr) throw new Error(fetchErr.message)
  if (!reels || reels.length < 2) return

  const idx = reels.findIndex((r) => r.id === id)
  if (idx === -1) return

  const targetIdx = direction === 'up' ? idx - 1 : idx + 1
  if (targetIdx < 0 || targetIdx >= reels.length) return

  const currentReel = reels[idx]
  const adjacentReel = reels[targetIdx]

  // Swap display_orders
  const tempOrder = currentReel.display_order
  let newCurrentOrder = adjacentReel.display_order
  let newAdjacentOrder = tempOrder

  // If both had the exact same order value, normalize
  if (newCurrentOrder === newAdjacentOrder) {
    newCurrentOrder = targetIdx + 1
    newAdjacentOrder = idx + 1
  }

  const [res1, res2] = await Promise.all([
    supabase.from('reels').update({ display_order: newCurrentOrder }).eq('id', currentReel.id),
    supabase.from('reels').update({ display_order: newAdjacentOrder }).eq('id', adjacentReel.id),
  ])

  if (res1.error) throw new Error(res1.error.message)
  if (res2.error) throw new Error(res2.error.message)

  revalidatePath('/admin/content/reels')
  revalidatePath('/reels')
  revalidatePath('/')
}

export async function deleteReel(id) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase.from('reels').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/reels')
  revalidatePath('/reels')
  revalidatePath('/')
}

// Applications (homepage "Our Applications" cards — title + image, admin-managed)
function cleanApplication(input = {}) {
  const out = {}
  if ('title' in input) out.title = String(input.title ?? '').trim()
  if ('image_url' in input) out.image_url = String(input.image_url ?? '').trim()
  return out
}

// Admin list
export async function getApplications() {
  await requireAdmin()
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('display_order', { ascending: true })
  if (error) throw new Error(error.message)
  return data
}

// Public homepage list
export async function getPublicApplications() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('applications')
    .select('id, title, image_url')
    .order('display_order', { ascending: true })
  if (error) {
    console.error('getPublicApplications failed:', error.message)
    return []
  }
  return data
}

export async function createApplication(formData) {
  await requireAdmin()
  const clean = cleanApplication(formData)
  if (!clean.title) throw new Error('A title is required')
  if (!clean.image_url) throw new Error('An image is required')

  const supabase = createAdminClient()

  const { data: last, error: lastError } = await supabase
    .from('applications')
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1)
  if (lastError) throw new Error(lastError.message)
  const nextOrder = (last?.[0]?.display_order ?? 0) + 1

  const { error } = await supabase.from('applications').insert({
    title: clean.title,
    image_url: clean.image_url,
    display_order: nextOrder,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/applications')
  revalidatePath('/')
}

export async function updateApplication(id, formData) {
  await requireAdmin()
  const clean = cleanApplication(formData)
  if ('title' in clean && !clean.title) throw new Error('A title is required')
  if ('image_url' in clean && !clean.image_url) throw new Error('An image is required')
  const supabase = createAdminClient()
  const { error } = await supabase.from('applications').update(clean).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/applications')
  revalidatePath('/')
}

export async function deleteApplication(id) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase.from('applications').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/applications')
  revalidatePath('/')
}

// Applications section tagline (single row, id = 1)
export async function getApplicationsTagline() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('applications_section')
    .select('tagline')
    .eq('id', 1)
    .single()
  if (error) {
    console.error('getApplicationsTagline failed:', error.message)
    return 'for every sacred and special space'
  }
  return data?.tagline ?? 'for every sacred and special space'
}

export async function updateApplicationsTagline(tagline) {
  await requireAdmin()
  const clean = String(tagline ?? '').trim()
  if (!clean) throw new Error('Tagline is required')
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('applications_section')
    .update({ tagline: clean })
    .eq('id', 1)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/content/applications')
  revalidatePath('/')
}

// Hero settings (video background, title, description)
export async function getHeroSettings() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("hero_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) {
    console.error("getHeroSettings error:", error);
    return { video_url: null, title: null, description: null };
  }
  return data || { video_url: null, title: null, description: null };
}

export async function updateHeroSettings(payload = {}) {
  await requireAdmin();
  const supabase = createAdminClient();

  let video_url, title, description;
  if (payload instanceof FormData) {
    video_url = payload.get("video_url");
    title = payload.get("title");
    description = payload.get("description");
  } else if (payload && typeof payload === "object") {
    video_url = payload.video_url;
    title = payload.title;
    description = payload.description;
  }

  const updateData = {};
  if (video_url !== undefined) {
    updateData.video_url = video_url ? String(video_url).trim() : null;
  }
  if (title !== undefined) {
    updateData.title = title ? String(title).trim() : null;
  }
  if (description !== undefined) {
    updateData.description = description ? String(description).trim() : null;
  }

  const { error } = await supabase
    .from("hero_settings")
    .upsert({ id: 1, ...updateData }, { onConflict: "id" });

  if (error) {
    console.error("updateHeroSettings error:", error);
    return { error: "Failed to update hero content." };
  }

  revalidatePath("/admin/content/hero-video");
  revalidatePath("/");
  return { success: true };
}

export async function updateHeroVideo(payload) {
  return updateHeroSettings(payload);
}
