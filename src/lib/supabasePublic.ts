/**
 * Server-side reads for public pages (RSC). Uses anon Supabase client.
 */
import { supabase } from '@/lib/supabase';
import type { BlogPost, Profile } from '@/data/portfolioData';

function safeProfileImageUrl(url: unknown): string {
  const u = String(url ?? '');
  if (!u) return '';
  // Allow moderately sized inline fallbacks when Storage upload is blocked by RLS.
  if (u.startsWith('data:')) return u.length <= 1_200_000 ? u : '';
  if (u.length > 50000) return '';
  return u;
}

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
  const coreColumns =
    'id, full_name, bio, email, location, years_of_experience, projects_completed, companies_worked, technologies_learned, title, hero_roles, resume_url, social_links';

  const byId = await supabase.from('profile').select(coreColumns).eq('id', 1).maybeSingle();
  let p = byId.data as Record<string, unknown> | null;
  let error = byId.error;

  if (!p && !error) {
    const first = await supabase
      .from('profile')
      .select(coreColumns)
      .order('id', { ascending: true })
      .limit(1)
      .maybeSingle();
    p = first.data as Record<string, unknown> | null;
    error = first.error;
  }
  if (error || !p) return null;

  const image = await supabase
    .from('profile')
    .select('profile_image_url')
    .eq('id', p.id)
    .maybeSingle();
  if (!image.error && image.data) {
    p.profile_image_url = image.data.profile_image_url;
  }

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
    profileImage: safeProfileImageUrl(p.profile_image_url),
    socialLinks: socialLinks as Profile['socialLinks'],
  };
}
