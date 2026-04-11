import { useState, useEffect } from 'react';
import { emptyPortfolioData } from '@/data/portfolioData';
import { supabase } from '@/lib/supabase';

const isSupabaseConfigured =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_project_url';

export function usePortfolioData() {
  const [data, setData] = useState(emptyPortfolioData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isSupabaseConfigured) {
      loadFromSupabase();
    } else {
      loadFromLocalStorage();
    }
  }, []);

  async function loadFromSupabase() {
    let mergedData = { ...emptyPortfolioData };

    // ── Work Experience ──────────────────────────────────────────
    const { data: experiences, error: expErr } = await supabase
      .from('work_experience')
      .select('*')
      .order('id');
    if (expErr) console.error('[supabase] work_experience:', expErr.message);
    else if (experiences && experiences.length > 0) {
      mergedData.workExperiences = experiences.map((exp: any) => ({
        id: exp.id,
        company: exp.company,
        role: exp.role,
        startDate: exp.start_date,
        endDate: exp.end_date,
        description: exp.description,
        current: exp.is_current,
        technologies: Array.isArray(exp.technologies)
          ? exp.technologies
          : (exp.technologies || '').split(',').map((t: string) => t.trim()),
      }));
    }

    // ── Projects ─────────────────────────────────────────────────
    const { data: projects, error: projErr } = await supabase
      .from('projects')
      .select('*')
      .order('id');
    if (projErr) console.error('[supabase] projects:', projErr.message);
    else if (projects && projects.length > 0) {
      mergedData.projects = projects.map((proj: any) => ({
        id: proj.id,
        title: proj.title,
        description: proj.description,
        excerpt: proj.excerpt,
        category: proj.category,
        liveUrl: proj.live_url,
        githubUrl: proj.github_url,
        image: proj.image_url,
        featured: proj.featured,
        tags: Array.isArray(proj.tags)
          ? proj.tags
          : (proj.tags || '').split(',').map((t: string) => t.trim()),
      }));
    }

    // ── Articles ─────────────────────────────────────────────────
    const { data: blogPosts, error: blogErr } = await supabase
      .from('articles')
      .select('*')
      .order('id');
    if (blogErr) console.error('[supabase] articles:', blogErr.message);
    else if (blogPosts && blogPosts.length > 0) {
      mergedData.blogPosts = blogPosts.map((post: any) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        content: post.content,
        publishedAt: post.published_at,
        readTime: post.read_time,
        coverImage: post.cover_image_url,
        tags: Array.isArray(post.tags)
          ? post.tags
          : (post.tags || '').split(',').map((t: string) => t.trim()),
      }));
    }

    // ── Skills ───────────────────────────────────────────────────
    const { data: skillRows, error: skErr } = await supabase
      .from('skills')
      .select('*')
      .order('id');
    if (skErr) console.error('[supabase] skills:', skErr.message);
    else if (skillRows && skillRows.length > 0) {
      mergedData.skills = skillRows.map((s: any) => ({
        id: s.id,
        name: s.name,
        category: s.category as 'Frontend' | 'Backend' | 'Tools',
        proficiency: s.proficiency ?? 0,
      }));
    }

    // ── Testimonials ────────────────────────────────────────────
    const { data: testimonialRows, error: teErr } = await supabase
      .from('testimonials')
      .select('*')
      .order('id');
    if (teErr) console.error('[supabase] testimonials:', teErr.message);
    else if (testimonialRows && testimonialRows.length > 0) {
      mergedData.testimonials = testimonialRows.map((t: any) => ({
        id: t.id,
        name: t.name,
        role: t.role,
        company: t.company,
        quote: t.quote,
        avatar: t.avatar,
      }));
    }

    // ── Profile ───────────────────────────────────────────────────
    const { data: profiles, error: profErr } = await supabase
      .from('profile')
      .select('*')
      .limit(1);
    if (profErr) console.error('[supabase] profile:', profErr.message);
    else if (profiles && profiles.length > 0) {
      const p = profiles[0];
      let localOverride: Partial<typeof mergedData.profile> = {};
      try {
        const saved = localStorage.getItem('portfolio_profile');
        if (saved) localOverride = JSON.parse(saved);
      } catch {}

      const socialFromDb = p.social_links;
      const socialLinks = Array.isArray(socialFromDb)
        ? socialFromDb
        : mergedData.profile.socialLinks;

      const heroFromDb = (p as { hero_roles?: unknown }).hero_roles;
      const heroRoles = Array.isArray(heroFromDb)
        ? (heroFromDb as string[]).map((s) => String(s)).filter((s) => s.trim())
        : p.title
          ? [String(p.title)]
          : [];

      mergedData.profile = {
        ...emptyPortfolioData.profile,
        name: p.full_name || '',
        bio: p.bio || '',
        email: p.email || '',
        location: p.location || '',
        yearsOfExperience: p.years_of_experience ?? 0,
        projectsCompleted: p.projects_completed ?? 0,
        companiesWorked: p.companies_worked ?? 0,
        technologiesLearned: p.technologies_learned ?? 0,
        heroRoles,
        title: heroRoles[0] ?? String(p.title ?? ''),
        profileImage: p.profile_image_url ?? '',
        resumeUrl: p.resume_url ?? '',
        socialLinks,
        ...localOverride,
      };
      {
        const pr = mergedData.profile;
        let roles = Array.isArray(pr.heroRoles)
          ? pr.heroRoles.map((s) => String(s).trim()).filter(Boolean)
          : [];
        if (!roles.length && pr.title?.trim()) roles = [pr.title.trim()];
        mergedData.profile = { ...pr, heroRoles: roles, title: roles[0] ?? '' };
      }
    }

    setData(mergedData);
    setIsLoading(false);
  }

  function loadFromLocalStorage() {
    try {
      let mergedData = { ...emptyPortfolioData };

      const savedProfile = localStorage.getItem('portfolio_profile');
      if (savedProfile) {
        mergedData.profile = { ...mergedData.profile, ...JSON.parse(savedProfile) };
      }
      {
        const pr = mergedData.profile;
        let roles = Array.isArray(pr.heroRoles)
          ? pr.heroRoles.map((s) => String(s).trim()).filter(Boolean)
          : [];
        if (!roles.length && pr.title?.trim()) roles = [pr.title.trim()];
        mergedData.profile = { ...pr, heroRoles: roles, title: roles[0] ?? pr.title ?? '' };
      }

      const savedExperiences = localStorage.getItem('portfolio_experiences');
      if (savedExperiences) {
        const experiences = JSON.parse(savedExperiences);
        mergedData.workExperiences = experiences.map((exp: any) => ({
          ...exp,
          technologies: Array.isArray(exp.technologies)
            ? exp.technologies
            : (exp.technologies || '').split(',').map((t: string) => t.trim()),
        }));
      }

      const savedProjects = localStorage.getItem('portfolio_projects');
      if (savedProjects) {
        const projects = JSON.parse(savedProjects);
        mergedData.projects = projects.map((proj: any) => ({
          ...proj,
          tags: Array.isArray(proj.tags)
            ? proj.tags
            : (proj.tags || '').split(',').map((t: string) => t.trim()),
        }));
      }

      const savedSkills = localStorage.getItem('portfolio_skills');
      if (savedSkills) mergedData.skills = JSON.parse(savedSkills);

      const savedTestimonials = localStorage.getItem('portfolio_testimonials');
      if (savedTestimonials) mergedData.testimonials = JSON.parse(savedTestimonials);

      const savedArticles = localStorage.getItem('portfolio_articles');
      if (savedArticles) {
        const articles = JSON.parse(savedArticles);
        mergedData.blogPosts = articles.map((post: any) => ({
          ...post,
          tags: Array.isArray(post.tags)
            ? post.tags
            : (post.tags || '').split(',').map((t: string) => t.trim()),
        }));
      }

      setData(mergedData);
    } catch (error) {
      console.error('Error loading portfolio data:', error);
      setData(emptyPortfolioData);
    } finally {
      setIsLoading(false);
    }
  }

  return { data, isLoading };
}
