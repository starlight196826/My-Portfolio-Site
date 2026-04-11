/**
 * Seeds Supabase with the same default data as src/data/portfolioData.ts
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   (Dashboard → Settings → API → service_role — never expose in client code)
 *
 * Run from project root: npm run db:seed
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';
import { seedPortfolioData } from './seed-defaults';

config({ path: resolve(process.cwd(), '.env.local') });

async function deleteAllByIds(supabase: SupabaseClient, table: string) {
  const { data, error } = await supabase.from(table).select('id');
  if (error) throw error;
  if (!data?.length) return;
  const ids = data.map((row: { id: string }) => row.id);
  const { error: delErr } = await supabase.from(table).delete().in('id', ids);
  if (delErr) throw delErr;
}

async function seed() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || url === 'your_supabase_project_url') {
    console.error('Set NEXT_PUBLIC_SUPABASE_URL in .env.local');
    process.exit(1);
  }
  if (!serviceKey) {
    console.error(
      'Set SUPABASE_SERVICE_ROLE_KEY in .env.local (Supabase → Project Settings → API → service_role secret)'
    );
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { profile, workExperiences, projects, blogPosts, skills, testimonials } = seedPortfolioData;

  console.log('Clearing existing rows…');
  await deleteAllByIds(supabase, 'work_experience');
  await deleteAllByIds(supabase, 'projects');
  await deleteAllByIds(supabase, 'articles');
  await deleteAllByIds(supabase, 'skills');
  await deleteAllByIds(supabase, 'testimonials');

  console.log('Inserting work_experience…');
  const { error: expErr } = await supabase.from('work_experience').insert(
    workExperiences.map((e) => ({
      id: e.id,
      company: e.company,
      role: e.role,
      start_date: e.startDate,
      end_date: e.endDate,
      description: e.description,
      is_current: e.current ?? false,
      technologies: e.technologies,
    }))
  );
  if (expErr) throw expErr;

  console.log('Inserting projects…');
  const { error: projErr } = await supabase.from('projects').insert(
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
      tags: p.tags,
    }))
  );
  if (projErr) throw projErr;

  console.log('Inserting articles…');
  const { error: artErr } = await supabase.from('articles').insert(
    blogPosts.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      content: p.content,
      published_at: p.publishedAt,
      read_time: p.readTime,
      cover_image_url: p.coverImage,
      tags: p.tags,
    }))
  );
  if (artErr) throw artErr;

  console.log('Inserting skills…');
  const { error: skErr } = await supabase.from('skills').insert(
    skills.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      proficiency: s.proficiency,
    }))
  );
  if (skErr) throw skErr;

  console.log('Inserting testimonials…');
  const { error: teErr } = await supabase.from('testimonials').insert(
    testimonials.map((t) => ({
      id: t.id,
      name: t.name,
      role: t.role,
      company: t.company,
      quote: t.quote,
      avatar: t.avatar,
    }))
  );
  if (teErr) throw teErr;

  console.log('Upserting profile…');
  const { error: profErr } = await supabase.from('profile').upsert(
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
      title: profile.title,
      hero_roles: profile.heroRoles?.length
        ? profile.heroRoles
        : profile.title
          ? [profile.title]
          : [],
      profile_image_url: profile.profileImage,
      resume_url: profile.resumeUrl,
      social_links: profile.socialLinks,
    },
    { onConflict: 'id' }
  );
  if (profErr) throw profErr;

  console.log(
    'Done. Seeded profile, work_experience, projects, articles, skills, testimonials.'
  );
}

seed().catch((err) => {
  console.error(err?.message ?? err);
  process.exit(1);
});
