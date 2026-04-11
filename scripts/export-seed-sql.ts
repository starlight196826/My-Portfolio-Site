/**
 * Generates supabase/seed_sample_data.sql from seed-defaults.ts
 * Output is structured like manual SQL entry: sections + one commented INSERT per row.
 * Run: npx tsx scripts/export-seed-sql.ts
 */
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { seedPortfolioData } from './seed-defaults';

function dollarQuote(s: string, tag = 's'): string {
  let t = tag;
  while (s.includes(`$${t}$`)) t += 'x';
  return `$${t}$${s}$${t}$`;
}

function sqlStr(s: string): string {
  return dollarQuote(s, 'v');
}

function sqlTextArray(arr: string[]): string {
  if (!arr.length) return 'ARRAY[]::text[]';
  return `ARRAY[${arr.map((x) => sqlStr(x)).join(', ')}]`;
}

function banner(title: string, lines: string[]) {
  lines.push('');
  lines.push(`-- -----------------------------------------------------------------------------`);
  lines.push(`-- ${title}`);
  lines.push(`-- (same values as if entered one-by-one in the SQL Editor / Admin)`);
  lines.push(`-- -----------------------------------------------------------------------------`);
}

function main() {
  const { profile, workExperiences, skills, projects, testimonials, blogPosts } =
    seedPortfolioData;

  const lines: string[] = [];
  lines.push(`-- =============================================================================`);
  lines.push(`-- Portfolio sample data — structured like manual registration`);
  lines.push(`-- Source: scripts/seed-defaults.ts  |  Regenerate: npm run db:export-sql`);
  lines.push(`--`);
  lines.push(`-- BEFORE this file: run ALL migrations in supabase/migrations/ in order,`);
  lines.push(`-- especially 20250411130000_portfolio_anon_access.sql (anon can read/write).`);
  lines.push(`-- Without it, the app sees 0 rows even after a successful insert.`);
  lines.push(`-- =============================================================================`);
  lines.push(``);
  lines.push(`-- Optional: ensure hero_roles exists on profile`);
  lines.push(
    `alter table public.profile add column if not exists hero_roles jsonb default '[]'::jsonb;`
  );
  lines.push(``);
  lines.push(`-- Reset existing rows so this script can be re-run cleanly`);
  lines.push(`-- (remove these deletes if you only want to append new rows)`);
  lines.push(`delete from public.testimonials;`);
  lines.push(`delete from public.skills;`);
  lines.push(`delete from public.articles;`);
  lines.push(`delete from public.projects;`);
  lines.push(`delete from public.work_experience;`);
  lines.push(`delete from public.profile where id = 1;`);
  lines.push(``);

  const socialJson = JSON.stringify(profile.socialLinks);
  const heroJson = JSON.stringify(
    profile.heroRoles?.length ? profile.heroRoles : [profile.title].filter(Boolean)
  );

  banner('PROFILE — site owner (id = 1, as in Admin → Profile)', lines);
  lines.push(`insert into public.profile (`);
  lines.push(
    `  id, full_name, bio, email, location, years_of_experience, projects_completed, companies_worked, technologies_learned,`
  );
  lines.push(`  title, hero_roles, profile_image_url, resume_url, social_links`);
  lines.push(`) values (`);
  lines.push(`  1,`);
  lines.push(`  ${sqlStr(profile.name)},`);
  lines.push(`  ${sqlStr(profile.bio)},`);
  lines.push(`  ${sqlStr(profile.email)},`);
  lines.push(`  ${sqlStr(profile.location)},`);
  lines.push(`  ${profile.yearsOfExperience},`);
  lines.push(`  ${profile.projectsCompleted},`);
  lines.push(`  ${profile.companiesWorked},`);
  lines.push(`  ${profile.technologiesLearned},`);
  lines.push(`  ${sqlStr(profile.title)},`);
  lines.push(`  ${sqlStr(heroJson)}::jsonb,`);
  lines.push(`  ${sqlStr(profile.profileImage)},`);
  lines.push(`  ${sqlStr(profile.resumeUrl)},`);
  lines.push(`  ${sqlStr(socialJson)}::jsonb`);
  lines.push(`);`);

  banner('WORK EXPERIENCE — one row per job (as if added in Admin)', lines);
  for (const e of workExperiences) {
    const label = `${e.company} — ${e.role}`.replace(/\s+/g, ' ').trim();
    lines.push('');
    lines.push(`-- Job id ${e.id}: ${label}`);
    lines.push(`insert into public.work_experience (`);
    lines.push(
      `  id, company, role, start_date, end_date, description, is_current, technologies`
    );
    lines.push(`) values (`);
    lines.push(`  ${sqlStr(e.id)},`);
    lines.push(`  ${sqlStr(e.company)},`);
    lines.push(`  ${sqlStr(e.role)},`);
    lines.push(`  ${sqlStr(e.startDate)},`);
    lines.push(`  ${e.endDate === null ? 'null' : sqlStr(e.endDate)},`);
    lines.push(`  ${sqlStr(e.description)},`);
    lines.push(`  ${e.current ?? false},`);
    lines.push(`  ${sqlTextArray(e.technologies)}`);
    lines.push(`);`);
  }

  banner('PROJECTS — one row per project', lines);
  for (const p of projects) {
    lines.push('');
    lines.push(`-- Project id ${p.id}: ${p.title}`);
    lines.push(`insert into public.projects (`);
    lines.push(
      `  id, title, description, excerpt, category, live_url, github_url, image_url, featured, tags`
    );
    lines.push(`) values (`);
    lines.push(`  ${sqlStr(p.id)},`);
    lines.push(`  ${sqlStr(p.title)},`);
    lines.push(`  ${sqlStr(p.description)},`);
    lines.push(`  ${sqlStr(p.excerpt)},`);
    lines.push(`  ${sqlStr(p.category)},`);
    lines.push(`  ${sqlStr(p.liveUrl)},`);
    lines.push(`  ${sqlStr(p.githubUrl)},`);
    lines.push(`  ${sqlStr(p.image)},`);
    lines.push(`  ${p.featured ?? false},`);
    lines.push(`  ${sqlTextArray(p.tags)}`);
    lines.push(`);`);
  }

  banner('SKILLS — one row per skill', lines);
  for (const s of skills) {
    lines.push('');
    lines.push(`-- Skill: ${s.name} (${s.category})`);
    lines.push(`insert into public.skills (id, name, category, proficiency) values (`);
    lines.push(
      `  ${sqlStr(s.id)}, ${sqlStr(s.name)}, ${sqlStr(s.category)}, ${s.proficiency}`
    );
    lines.push(`);`);
  }

  banner('TESTIMONIALS — one row per quote', lines);
  for (const t of testimonials) {
    lines.push('');
    lines.push(`-- Testimonial from ${t.name} (${t.company})`);
    lines.push(`insert into public.testimonials (`);
    lines.push(`  id, name, role, company, quote, avatar`);
    lines.push(`) values (`);
    lines.push(`  ${sqlStr(t.id)},`);
    lines.push(`  ${sqlStr(t.name)},`);
    lines.push(`  ${sqlStr(t.role)},`);
    lines.push(`  ${sqlStr(t.company)},`);
    lines.push(`  ${sqlStr(t.quote)},`);
    lines.push(`  ${sqlStr(t.avatar)}`);
    lines.push(`);`);
  }

  banner('ARTICLES / BLOG — one row per post (content in dollar-quotes)', lines);
  for (const post of blogPosts) {
    lines.push('');
    lines.push(`-- Article: “${post.title.replace(/"/g, "'")}”  slug: ${post.slug}`);
    lines.push(`insert into public.articles (`);
    lines.push(
      `  id, slug, title, excerpt, category, content, published_at, read_time, cover_image_url, tags`
    );
    lines.push(`) values (`);
    lines.push(`  ${sqlStr(post.id)},`);
    lines.push(`  ${sqlStr(post.slug)},`);
    lines.push(`  ${sqlStr(post.title)},`);
    lines.push(`  ${sqlStr(post.excerpt)},`);
    lines.push(`  ${sqlStr(post.category)},`);
    lines.push(`  ${dollarQuote(post.content, 'c')},`);
    lines.push(`  ${sqlStr(post.publishedAt)},`);
    lines.push(`  ${post.readTime},`);
    lines.push(`  ${sqlStr(post.coverImage)},`);
    lines.push(`  ${sqlTextArray(post.tags)}`);
    lines.push(`);`);
  }

  lines.push('');
  lines.push(`-- =============================================================================`);
  lines.push(`-- End of sample data`);
  lines.push(`-- =============================================================================`);

  const out = resolve(process.cwd(), 'supabase/seed_sample_data.sql');
  writeFileSync(out, lines.join('\n') + '\n', 'utf8');
  console.log(`Wrote ${out}`);
}

main();
