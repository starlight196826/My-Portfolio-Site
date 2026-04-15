import { useState, useEffect } from 'react';
import { emptyPortfolioData } from '@/data/portfolioData';
import { supabase } from '@/lib/supabase';

const isSupabaseConfigured =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_project_url';

function isStatementTimeout(error: { message?: string } | null | undefined): boolean {
  return Boolean(error?.message?.toLowerCase().includes('statement timeout'));
}

function logSupabaseError(scope: string, error: { message?: string } | null | undefined) {
  if (!error) return;
  if (isStatementTimeout(error)) {
    console.warn(`[supabase] ${scope}: statement timeout (falling back to defaults for this section)`);
    return;
  }
  console.error(`[supabase] ${scope}:`, error.message);
}

function isMissingReviewRatingColumn(error: { message?: string } | null | undefined): boolean {
  const message = error?.message?.toLowerCase() ?? '';
  return (
    message.includes('review_rating') &&
    (message.includes('does not exist') ||
      message.includes('could not find') ||
      message.includes('schema cache'))
  );
}

function isMissingImageUrlsColumn(error: { message?: string } | null | undefined): boolean {
  const message = error?.message?.toLowerCase() ?? '';
  return (
    message.includes('image_urls') &&
    (message.includes('does not exist') ||
      message.includes('could not find') ||
      message.includes('schema cache'))
  );
}

const PROFILE_IMAGE_CACHE_MAX_DATA_URL_CHARS = 1_200_000; // keep moderate data URLs for local fallback

function sanitizeProfileImage(url: unknown): string {
  const value = String(url ?? '');
  // DB values should be URLs; local fallback can be a bounded data URL.
  if (!value) return '';
  if (value.startsWith('data:')) return value.length <= PROFILE_IMAGE_CACHE_MAX_DATA_URL_CHARS ? value : '';
  if (value.length > 50000) return '';
  return value;
}

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

  async function fetchProfileRowSafe() {
    const coreColumns =
      'id, full_name, bio, email, location, years_of_experience, projects_completed, companies_worked, technologies_learned, title, hero_roles, resume_url, social_links';

    const byId = await supabase.from('profile').select(coreColumns).eq('id', 1).maybeSingle();
    let row = byId.data as Record<string, unknown> | null;
    let error = byId.error;

    // Some datasets don't use id=1. Fall back to first row.
    if (!row && !error) {
      const first = await supabase
        .from('profile')
        .select(coreColumns)
        .order('id', { ascending: true })
        .limit(1)
        .maybeSingle();
      row = first.data as Record<string, unknown> | null;
      error = first.error;
    }

    if (!row || error) return { row: null as Record<string, unknown> | null, error };

    // Fetch image separately so large profile_image_url can't block all profile data.
    const image = await supabase
      .from('profile')
      .select('profile_image_url')
      .eq('id', row.id)
      .maybeSingle();
    if (image.error) {
      logSupabaseError('profile image', image.error);
    } else if (image.data) {
      row.profile_image_url = image.data.profile_image_url;
    }

    return { row, error: null as null };
  }

  async function loadFromSupabase() {
    let mergedData = { ...emptyPortfolioData };

    try {
      const fetchProjectsSafe = async () => {
        const withRating = await supabase
          .from('projects')
          .select(
            'id, title, description, excerpt, category, live_url, github_url, image_url, image_urls, featured, tags, review_rating'
          )
          .order('id');
        if (!isMissingReviewRatingColumn(withRating.error) && !isMissingImageUrlsColumn(withRating.error))
          return withRating;

        const missingRating = isMissingReviewRatingColumn(withRating.error);
        const missingImageUrls = isMissingImageUrlsColumn(withRating.error);
        const fallbackColumns = [
          'id',
          'title',
          'description',
          'excerpt',
          'category',
          'live_url',
          'github_url',
          'image_url',
          missingImageUrls ? null : 'image_urls',
          'featured',
          'tags',
          missingRating ? null : 'review_rating',
        ]
          .filter(Boolean)
          .join(', ');
        const fallback = await supabase.from('projects').select(fallbackColumns).order('id');
        if (fallback.error) return fallback;
        return {
          ...fallback,
          data: (fallback.data ?? []).map((proj: any) => ({ ...proj, review_rating: 3.3 })),
          error: null,
        };
      };

      const [
        { data: experiences, error: expErr },
        { data: projects, error: projErr },
        { data: blogPosts, error: blogErr },
        { data: skillRows, error: skErr },
        { data: testimonialRows, error: teErr },
        { row: profileRow, error: profErr },
      ] = await Promise.all([
        supabase
          .from('work_experience')
          .select('id, company, role, start_date, end_date, description, is_current, technologies')
          .order('id'),
        fetchProjectsSafe(),
        // NOTE: Intentionally excludes articles.content to keep initial payload small and prevent timeouts.
        supabase
          .from('articles')
          .select('id, slug, title, excerpt, category, published_at, read_time, cover_image_url, tags')
          .order('id'),
        supabase.from('skills').select('id, name, category, proficiency').order('id'),
        supabase.from('testimonials').select('id, name, role, company, quote, avatar').order('id'),
        fetchProfileRowSafe(),
      ]);

    if (expErr) logSupabaseError('work_experience', expErr);
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

    if (projErr) logSupabaseError('projects', projErr);
    else if (projects && projects.length > 0) {
      mergedData.projects = projects.map((proj: any) => {
        const rawImages = Array.isArray(proj.image_urls)
          ? proj.image_urls.map((v: unknown) => String(v).trim()).filter(Boolean)
          : [];
        const legacyImage = String(proj.image_url ?? '').trim();
        const images = rawImages.length ? rawImages : legacyImage ? [legacyImage] : [];
        return {
          id: proj.id,
          title: proj.title,
          description: proj.description,
          excerpt: proj.excerpt,
          category: proj.category,
          liveUrl: proj.live_url,
          githubUrl: proj.github_url,
          image: images[0] ?? '',
          images,
          featured: proj.featured,
          rating: Number(proj.review_rating ?? 3.3),
          tags: Array.isArray(proj.tags)
            ? proj.tags
            : (proj.tags || '').split(',').map((t: string) => t.trim()),
        };
      });
    }
    // If Supabase projects are empty (or temporarily unavailable), fallback to locally cached projects.
    if (mergedData.projects.length === 0) {
      try {
        const savedProjects = localStorage.getItem('portfolio_projects');
        if (savedProjects) {
          const localProjects = JSON.parse(savedProjects);
          if (Array.isArray(localProjects) && localProjects.length > 0) {
            mergedData.projects = localProjects.map((proj: any) => {
              const localImages = Array.isArray(proj.images)
                ? proj.images.map((v: unknown) => String(v).trim()).filter(Boolean)
                : String(proj.image ?? '').trim()
                  ? [String(proj.image).trim()]
                  : [];
              return {
                ...proj,
                image: String(proj.image ?? '').trim() || localImages[0] || '',
                images: localImages,
                tags: Array.isArray(proj.tags)
                  ? proj.tags
                  : String(proj.tags ?? '')
                      .split(',')
                      .map((t: string) => t.trim())
                      .filter(Boolean),
              };
            });
          }
        }
      } catch (error) {
        console.warn('[supabase] projects fallback from localStorage failed', error);
      }
    }

    if (blogErr) logSupabaseError('articles', blogErr);
    else if (blogPosts && blogPosts.length > 0) {
      mergedData.blogPosts = blogPosts.map((post: any) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        content: '',
        publishedAt: post.published_at,
        readTime: post.read_time,
        coverImage: post.cover_image_url,
        tags: Array.isArray(post.tags)
          ? post.tags
          : (post.tags || '').split(',').map((t: string) => t.trim()),
      }));
    }

    if (skErr) logSupabaseError('skills', skErr);
    else if (skillRows && skillRows.length > 0) {
      mergedData.skills = skillRows.map((s: any) => ({
        id: s.id,
        name: s.name,
        category: s.category as 'Frontend' | 'Backend' | 'Tools',
        proficiency: s.proficiency ?? 0,
      }));
    }

    if (teErr) logSupabaseError('testimonials', teErr);
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

    let localOverride: Partial<typeof mergedData.profile> = {};
    try {
      const saved = localStorage.getItem('portfolio_profile');
      if (saved) localOverride = JSON.parse(saved);
    } catch {}
    localOverride.profileImage = sanitizeProfileImage(localOverride.profileImage);
    // Do not let an empty cached image erase a valid DB image.
    if (!localOverride.profileImage) {
      delete localOverride.profileImage;
    }

    if (profErr) logSupabaseError('profile', profErr);
    else if (profileRow) {
      const p = profileRow;

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
        name: String(p.full_name ?? ''),
        bio: String(p.bio ?? ''),
        email: String(p.email ?? ''),
        location: String(p.location ?? ''),
        yearsOfExperience: Number(p.years_of_experience ?? 0),
        projectsCompleted: Number(p.projects_completed ?? 0),
        companiesWorked: Number(p.companies_worked ?? 0),
        technologiesLearned: Number(p.technologies_learned ?? 0),
        heroRoles,
        title: heroRoles[0] ?? String(p.title ?? ''),
        profileImage: sanitizeProfileImage(p.profile_image_url),
        resumeUrl: String(p.resume_url ?? ''),
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
    } else if (Object.keys(localOverride).length > 0) {
      mergedData.profile = { ...mergedData.profile, ...localOverride };
      const pr = mergedData.profile;
      let roles = Array.isArray(pr.heroRoles)
        ? pr.heroRoles.map((s) => String(s).trim()).filter(Boolean)
        : [];
      if (!roles.length && pr.title?.trim()) roles = [pr.title.trim()];
      mergedData.profile = { ...pr, heroRoles: roles, title: roles[0] ?? '' };
    }

      setData(mergedData);
      setIsLoading(false);
    } catch (e) {
      console.error('[supabase] loadFromSupabase failed:', e);
      loadFromLocalStorage();
    }
  }

  function loadFromLocalStorage() {
    try {
      let mergedData = { ...emptyPortfolioData };

      const savedProfile = localStorage.getItem('portfolio_profile');
      if (savedProfile) {
        mergedData.profile = { ...mergedData.profile, ...JSON.parse(savedProfile) };
      }
      mergedData.profile.profileImage = sanitizeProfileImage(mergedData.profile.profileImage);
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
          images: Array.isArray(proj.images)
            ? proj.images.map((v: unknown) => String(v).trim()).filter(Boolean)
            : String(proj.image ?? '').trim()
              ? [String(proj.image).trim()]
              : [],
          image:
            String(proj.image ?? '').trim() ||
            (Array.isArray(proj.images)
              ? proj.images.map((v: unknown) => String(v).trim()).find(Boolean)
              : '') ||
            '',
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
