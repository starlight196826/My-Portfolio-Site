import type {
  BlogPost,
  Profile,
  Project,
  Skill,
  Testimonial,
  WorkExperience,
} from '@/data/portfolioData';
import { supabase } from './supabase';
import { fetchPublicProfile } from './supabasePublic';

// ── Experiences ────────────────────────────────────────────────
export async function saveExperiences(experiences: any[]) {
  await supabase.from('work_experience').delete().neq('id', 0);
  if (experiences.length === 0) return;
  const { error } = await supabase.from('work_experience').insert(
    experiences.map((e) => ({
      id: e.id,
      company: e.company,
      role: e.role,
      start_date: e.startDate,
      end_date: e.endDate,
      description: e.description,
      is_current: e.current ?? false,
      technologies: Array.isArray(e.technologies)
        ? e.technologies
        : (e.technologies || '').split(',').map((t: string) => t.trim()),
    }))
  );
  if (error) throw error;
}

// ── Projects ───────────────────────────────────────────────────
export async function saveProjects(projects: any[]) {
  await supabase.from('projects').delete().neq('id', 0);
  if (projects.length === 0) return;
  const { error } = await supabase.from('projects').insert(
    projects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      excerpt: p.excerpt,
      category: p.category,
      live_url: p.liveUrl,
      github_url: p.githubUrl,
      image_url: p.image,
      featured: p.featured ?? false,
      tags: Array.isArray(p.tags)
        ? p.tags
        : (p.tags || '').split(',').map((t: string) => t.trim()),
    }))
  );
  if (error) throw error;
}

// ── Blog Posts ─────────────────────────────────────────────────
export async function saveBlogPosts(posts: any[]) {
  await supabase.from('articles').delete().neq('id', 0);
  if (posts.length === 0) return;
  const { error } = await supabase.from('articles').insert(
    posts.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      content: p.content,
      published_at: p.publishedAt,
      read_time: p.readTime,
      cover_image_url: p.coverImage,
      tags: Array.isArray(p.tags)
        ? p.tags
        : (p.tags || '').split(',').map((t: string) => t.trim()),
    }))
  );
  if (error) throw error;
}

// ── Skills ─────────────────────────────────────────────────────
export async function saveSkills(skills: any[]) {
  await supabase.from('skills').delete().neq('id', 0);
  if (skills.length === 0) return;
  const { error } = await supabase.from('skills').insert(
    skills.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      proficiency: s.proficiency ?? 0,
    }))
  );
  if (error) throw error;
}

// ── Testimonials ───────────────────────────────────────────────
export async function saveTestimonials(rows: any[]) {
  await supabase.from('testimonials').delete().neq('id', 0);
  if (rows.length === 0) return;
  const { error } = await supabase.from('testimonials').insert(
    rows.map((t) => ({
      id: t.id,
      name: t.name,
      role: t.role,
      company: t.company,
      quote: t.quote,
      avatar: t.avatar,
    }))
  );
  if (error) throw error;
}

// ── Profile ────────────────────────────────────────────────────
export async function saveProfile(profile: any) {
  const { error } = await supabase.from('profile').upsert(
    {
      id: 1,
      full_name: profile.name,
      bio: profile.bio,
      email: profile.email,
      location: profile.location,
      years_of_experience: profile.yearsOfExperience,
      projects_completed: profile.projectsCompleted,
      companies_worked: profile.companiesWorked,
      technologies_learned: profile.technologiesLearned,
      title: (profile.heroRoles?.[0] ?? profile.title) ?? null,
      hero_roles: Array.isArray(profile.heroRoles)
        ? profile.heroRoles.filter((r: string) => r && String(r).trim())
        : [],
      profile_image_url: profile.profileImage ?? null,
      resume_url: profile.resumeUrl ?? null,
      social_links: profile.socialLinks ?? null,
    },
    { onConflict: 'id' }
  );
  if (error) throw error;
}

// ── Admin load (Supabase → same shapes as UI) ──────────────────
export async function fetchWorkExperiencesForAdmin(): Promise<WorkExperience[]> {
  const { data, error } = await supabase.from('work_experience').select('*').order('id');
  if (error || !data?.length) return [];
  return data.map((exp: Record<string, unknown>) => ({
    id: String(exp.id ?? ''),
    company: String(exp.company ?? ''),
    role: String(exp.role ?? ''),
    startDate: String(exp.start_date ?? ''),
    endDate: exp.end_date == null ? null : String(exp.end_date),
    description: String(exp.description ?? ''),
    current: Boolean(exp.is_current),
    technologies: Array.isArray(exp.technologies)
      ? (exp.technologies as string[])
      : String(exp.technologies ?? '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
  }));
}

export async function fetchProjectsForAdmin(): Promise<Project[]> {
  const { data, error } = await supabase.from('projects').select('*').order('id');
  if (error || !data?.length) return [];
  return data.map((proj: Record<string, unknown>) => ({
    id: String(proj.id ?? ''),
    title: String(proj.title ?? ''),
    description: String(proj.description ?? ''),
    excerpt: String(proj.excerpt ?? ''),
    category: String(proj.category ?? ''),
    liveUrl: String(proj.live_url ?? ''),
    githubUrl: String(proj.github_url ?? ''),
    image: String(proj.image_url ?? ''),
    featured: Boolean(proj.featured),
    tags: Array.isArray(proj.tags)
      ? (proj.tags as string[])
      : String(proj.tags ?? '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
  }));
}

export async function fetchSkillsForAdmin(): Promise<Skill[]> {
  const { data, error } = await supabase.from('skills').select('*').order('id');
  if (error || !data?.length) return [];
  return data.map((s: Record<string, unknown>) => ({
    id: String(s.id ?? ''),
    name: String(s.name ?? ''),
    category: (String(s.category ?? 'Frontend') || 'Frontend') as Skill['category'],
    proficiency: Number(s.proficiency ?? 0),
  }));
}

export async function fetchBlogPostsForAdmin(): Promise<BlogPost[]> {
  const { data, error } = await supabase.from('articles').select('*').order('id');
  if (error || !data?.length) return [];
  return data.map((post: Record<string, unknown>) => ({
    id: String(post.id ?? ''),
    slug: String(post.slug ?? ''),
    title: String(post.title ?? ''),
    excerpt: String(post.excerpt ?? ''),
    category: String(post.category ?? ''),
    content: String(post.content ?? ''),
    publishedAt: String(post.published_at ?? ''),
    readTime: Number(post.read_time ?? 0),
    coverImage: String(post.cover_image_url ?? ''),
    tags: Array.isArray(post.tags)
      ? (post.tags as string[])
      : String(post.tags ?? '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
  }));
}

export async function fetchTestimonialsForAdmin(): Promise<Testimonial[]> {
  const { data, error } = await supabase.from('testimonials').select('*').order('id');
  if (error || !data?.length) return [];
  return data.map((t: Record<string, unknown>) => ({
    id: String(t.id ?? ''),
    name: String(t.name ?? ''),
    role: String(t.role ?? ''),
    company: String(t.company ?? ''),
    quote: String(t.quote ?? ''),
    avatar: String(t.avatar ?? ''),
  }));
}

export async function fetchProfileForAdmin(): Promise<Partial<Profile> | null> {
  return fetchPublicProfile();
}
