/**
 * Type definitions and empty defaults only. All portfolio content is loaded at runtime
 * from Supabase (see usePortfolioData) or admin localStorage. Seed data lives in scripts/seed-defaults.ts.
 */

export interface SocialLink {
  label: string;
  url: string;
  icon: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  description: string;
  technologies: string[];
  current?: boolean;
}

export interface Skill {
  id: string;
  name: string;
  proficiency: number;
  category: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  excerpt: string;
  rating?: number;
  tags: string[];
  category: string;
  liveUrl: string;
  githubUrl?: string;
  image: string;
  images?: string[];
  featured?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  coverImage: string;
  content: string;
}

export interface Profile {
  name: string;
  /** First hero role; mirrors `heroRoles[0]` for footer and legacy data */
  title: string;
  /** Hero typewriter lines, shown one at a time in order (then repeat) */
  heroRoles: string[];
  bio: string;
  location: string;
  email: string;
  yearsOfExperience: number;
  projectsCompleted: number;
  companiesWorked: number;
  technologiesLearned: number;
  resumeUrl: string;
  socialLinks: SocialLink[];
  profileImage: string;
}

export interface PortfolioBundle {
  profile: Profile;
  workExperiences: WorkExperience[];
  skills: Skill[];
  projects: Project[];
  testimonials: Testimonial[];
  blogPosts: BlogPost[];
}

const emptyProfile: Profile = {
  name: '',
  title: '',
  heroRoles: [],
  bio: '',
  location: '',
  email: '',
  yearsOfExperience: 0,
  projectsCompleted: 0,
  companiesWorked: 0,
  technologiesLearned: 0,
  resumeUrl: '',
  socialLinks: [],
  profileImage: '',
};

/** Initial / fallback state: no bundled marketing copy — fill from Supabase. */
export const emptyPortfolioData: PortfolioBundle = {
  profile: emptyProfile,
  workExperiences: [],
  skills: [],
  projects: [],
  testimonials: [],
  blogPosts: [],
};

export function getProjectsByCategory(projects: Project[], category: string): Project[] {
  if (category === 'All') return projects;
  return projects.filter((p) => p.category === category);
}

export function getUniqueCategoriesFromProjects(projects: Project[]): string[] {
  const categories = new Set(projects.map((p) => p.category));
  return Array.from(categories).sort();
}

export function getBlogPostBySlug(posts: BlogPost[], slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}

export function searchBlogPosts(posts: BlogPost[], query: string): BlogPost[] {
  const q = query.toLowerCase();
  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q) ||
      post.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}

export function getBlogPostsByCategory(posts: BlogPost[], category: string): BlogPost[] {
  if (category === 'All') return posts;
  return posts.filter((p) => p.category === category);
}

export function getUniqueBlogCategories(posts: BlogPost[]): string[] {
  const categories = new Set(posts.map((p) => p.category));
  return Array.from(categories).sort();
}
