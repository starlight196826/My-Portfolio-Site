/**
 * Server-side reads for public pages (RSC). Uses anon Supabase client.
 */
import { supabase } from '@/lib/supabase';
import type { BlogPost, Profile } from '@/data/portfolioData';

function mapArticleRow(row: Record<string, unknown>): BlogPost {
  const tagsRaw = row.tags;
  const tags = Array.isArray(tagsRaw)
    ? (tagsRaw as string[])
    : String(tagsRaw ?? '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

  return {
    id: String(row.id ?? ''),
    slug: String(row.slug ?? ''),
    title: String(row.title ?? ''),
    excerpt: String(row.excerpt ?? ''),
    category: String(row.category ?? ''),
    content: String(row.content ?? ''),
    publishedAt: String(row.published_at ?? ''),
    readTime: Number(row.read_time ?? 0),
    coverImage: String(row.cover_image_url ?? ''),
    tags,
  };
}

export async function fetchArticleBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).maybeSingle();
  if (error || !data) return null;
  return mapArticleRow(data as Record<string, unknown>);
}

export async function fetchArticlesByCategory(
  category: string,
  excludeId?: string
): Promise<BlogPost[]> {
  let q = supabase.from('articles').select('*').eq('category', category);
  if (excludeId) q = q.neq('id', excludeId);
  const { data, error } = await q.limit(8);
  if (error || !data?.length) return [];
  return data.map((row) => mapArticleRow(row as Record<string, unknown>));
}

export async function fetchAllArticleSlugs(): Promise<string[]> {
  try {
    const { data, error } = await supabase.from('articles').select('slug');
    if (error || !data?.length) return [];
    return (data as { slug: string }[])
      .map((r) => r.slug)
      .filter((s): s is string => Boolean(s));
  } catch {
    return [];
  }
}

export async function fetchPublicProfile(): Promise<Partial<Profile> | null> {
  const { data, error } = await supabase.from('profile').select('*').limit(1).maybeSingle();
  if (error || !data) return null;
  const p = data as Record<string, unknown>;
  const socialRaw = p.social_links;
  const socialLinks = Array.isArray(socialRaw) ? socialRaw : [];

  const heroFromDb = (p as { hero_roles?: unknown }).hero_roles;
  const heroRoles = Array.isArray(heroFromDb)
    ? (heroFromDb as unknown[]).map((s) => String(s)).filter((s) => s.trim())
    : [];

  return {
    name: String(p.full_name ?? ''),
    title: String(p.title ?? ''),
    heroRoles:
      heroRoles.length > 0
        ? heroRoles
        : String(p.title ?? '').trim()
          ? [String(p.title)]
          : [],
    bio: String(p.bio ?? ''),
    email: String(p.email ?? ''),
    location: String(p.location ?? ''),
    yearsOfExperience: Number(p.years_of_experience ?? 0),
    projectsCompleted: Number(p.projects_completed ?? 0),
    companiesWorked: Number(p.companies_worked ?? 0),
    technologiesLearned: Number(p.technologies_learned ?? 0),
    resumeUrl: String(p.resume_url ?? ''),
    profileImage: String(p.profile_image_url ?? ''),
    socialLinks: socialLinks as Profile['socialLinks'],
  };
}
