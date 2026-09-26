'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ========================= PROJECT CATEGORIES =========================

export async function getProjectCategories() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('project_categories')
    .select('*')
    .order('display_order', { ascending: true })
  if (error) throw new Error(error.message)
  return data
}

export async function getProjectCategoriesWithCover() {
  const supabase = createAdminClient()
  const { data: categories, error } = await supabase
    .from('project_categories')
    .select('*')
    .order('display_order', { ascending: true })
  if (error) throw new Error(error.message)

  const { data: projects, error: projError } = await supabase
    .from('projects')
    .select('id, category_id, image_url, display_order')
    .order('display_order', { ascending: true })
  if (projError) throw new Error(projError.message)

  return (categories || []).map((cat) => {
    const firstProject = (projects || []).find((p) => p.category_id === cat.id)
    return {
      ...cat,
      cover_image: firstProject ? firstProject.image_url : null,
    }
  })
}

export async function createProjectCategory(formData) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('project_categories').insert(formData)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/projects')
  revalidatePath('/projects')
}

export async function updateProjectCategory(id, formData) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('project_categories')
    .update(formData)
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/projects')
  revalidatePath('/projects')
}

export async function deleteProjectCategory(id) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('project_categories')
    .delete()
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/projects')
  revalidatePath('/projects')
}

// ========================= PROJECTS (IMAGES) =========================

export async function getProjectsByCategory(categoryId) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('category_id', categoryId)
    .order('display_order', { ascending: true })
  if (error) throw new Error(error.message)
  return data
}

export async function getAllProjects() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*, project_categories(name, slug)')
    .order('display_order', { ascending: true })
  if (error) throw new Error(error.message)
  return data
}

export async function createProject(formData) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('projects').insert(formData)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/projects')
  revalidatePath('/projects')
}

export async function updateProject(id, formData) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('projects')
    .update(formData)
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/projects')
  revalidatePath('/projects')
}

export async function deleteProject(id) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/projects')
  revalidatePath('/projects')
}
