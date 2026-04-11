'use client';

import { useState, useEffect, useRef } from 'react';
import { Menu, X, LogOut, Save, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { emptyPortfolioData } from '@/data/portfolioData';
import {
  saveExperiences,
  saveProjects,
  saveBlogPosts,
  saveProfile,
  saveSkills,
  saveTestimonials,
  fetchWorkExperiencesForAdmin,
  fetchProjectsForAdmin,
  fetchSkillsForAdmin,
  fetchBlogPostsForAdmin,
  fetchTestimonialsForAdmin,
  fetchProfileForAdmin,
} from '@/lib/portfolioService';

const isSupabaseConfigured =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_project_url';

/** Supabase errors are plain objects; bare `console.error(err)` triggers Next devtools overlay as `{}`. */
function warnSupabaseSync(context: string, err: unknown) {
  const msg =
    err !== null && typeof err === 'object' && 'message' in err
      ? String((err as { message: unknown }).message)
      : String(err);
  console.warn(`[admin] ${context}:`, msg);
}

function AdminLoading() {
  return (
    <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800">
      <p className="text-sm text-gray-500 dark:text-gray-400">Loading from database…</p>
    </div>
  );
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  /** Start closed on mobile so the dimmed overlay does not cover the whole page on first load. */
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('experience');
  const [showPassword, setShowPassword] = useState(false);

  // Load authentication state from localStorage
  useEffect(() => {
    const isAuth = localStorage.getItem('admin_authenticated') === 'true';
    setAuthenticated(isAuth);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - in production, use proper authentication
    if (password === 'admin123') {
      setAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      setPassword('');
    } else {
      alert('Invalid password');
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    setSidebarOpen(false);
  };

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-950 dark:to-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800"
        >
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          <p className="mb-6 text-gray-600 dark:text-gray-400">Manage your portfolio content</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-600 dark:text-gray-400"
                >
                  {showPassword ? '👁️' : '🔒'}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Demo: admin123</p>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-all hover:bg-blue-700 active:scale-95"
            >
              Login to Admin Panel
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar Overlay - Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`fixed left-0 top-0 z-40 h-full w-64 transform bg-white shadow-lg transition-all duration-300 dark:bg-gray-800 lg:relative lg:z-0 lg:translate-x-0 ${
          !sidebarOpen ? '-translate-x-full lg:translate-x-0' : ''
        }`}
      >
        <div className="overflow-y-auto p-6 h-full">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h2>

          <nav className="space-y-2">
            {[
              { id: 'experience', label: '💼 Work Experience' },
              { id: 'projects', label: '🚀 Featured Projects' },
              { id: 'skills', label: '⚡ Skills & Expertise' },
              { id: 'articles', label: '📝 Latest Articles' },
              { id: 'testimonials', label: '💬 Testimonials' },
              { id: 'profile', label: '👤 Profile Settings' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full rounded-lg px-4 py-2 text-left text-sm font-medium transition-all ${
                  activeSection === item.id
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-8 w-full rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-all hover:bg-red-700 active:scale-95 flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="sticky top-0 z-20 bg-white shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 lg:hidden"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {activeSection === 'experience' && '💼 Manage Work Experience'}
              {activeSection === 'projects' && '🚀 Manage Featured Projects'}
              {activeSection === 'skills' && '⚡ Manage Skills & Expertise'}
              {activeSection === 'articles' && '📝 Manage Latest Articles'}
              {activeSection === 'testimonials' && '💬 Manage Testimonials'}
              {activeSection === 'profile' && '👤 Profile Settings'}
            </h1>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeSection === 'experience' && <ExperienceManager />}
          {activeSection === 'projects' && <ProjectsManager />}
          {activeSection === 'skills' && <SkillsManager />}
          {activeSection === 'articles' && <ArticlesManager />}
          {activeSection === 'testimonials' && <TestimonialsManager />}
          {activeSection === 'profile' && <ProfileManager />}
        </div>
      </div>
    </div>
  );
}

// Work Experience Manager Component
function ExperienceManager() {
  const [experiences, setExperiences] = useState([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const loaded = useRef(false);
  const skipNextPersist = useRef(false);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    description: '',
    technologies: '',
    current: false,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (isSupabaseConfigured) {
          const rows = await fetchWorkExperiencesForAdmin();
          if (!cancelled) {
            skipNextPersist.current = true;
            setExperiences(rows);
          }
        } else {
          const saved = localStorage.getItem('portfolio_experiences');
          if (saved) {
            const parsed = JSON.parse(saved);
            setExperiences(parsed.length > 0 ? parsed : []);
          } else {
            setExperiences(emptyPortfolioData.workExperiences);
          }
        }
      } finally {
        if (!cancelled) {
          loaded.current = true;
          setIsLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const resetForm = () => {
    setFormData({
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      description: '',
      technologies: '',
      current: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = () => {
    if (!formData.company || !formData.role) {
      alert('Please fill in company and role');
      return;
    }

    if (editingId) {
      setExperiences(experiences.map((e: { id: string }) => (e.id === editingId ? { ...formData, id: editingId } : e)));
    } else {
      setExperiences([...experiences, { ...formData, id: Date.now().toString() }]);
    }

    resetForm();
  };

  useEffect(() => {
    if (!loaded.current) return;
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }
    localStorage.setItem('portfolio_experiences', JSON.stringify(experiences));
    if (isSupabaseConfigured)
      saveExperiences(experiences).catch((e) => warnSupabaseSync('Sync work experience', e));
  }, [experiences]);

  const formOpen = showForm || editingId !== null;

  if (isLoading) return <AdminLoading />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {experiences.length} experience{experiences.length !== 1 ? 's' : ''}
        </p>
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setFormData({
              company: '',
              role: '',
              startDate: '',
              endDate: '',
              description: '',
              technologies: '',
              current: false,
            });
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add experience
        </button>
      </div>

      {formOpen && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg bg-white p-6 shadow dark:bg-gray-800"
      >
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {editingId ? 'Edit Experience' : 'New experience'}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Company Name"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Job Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
            <input
              type="month"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date {formData.current && <span className="text-gray-500">(Disabled - Current Role)</span>}
            </label>
            <input
              type="month"
              placeholder="End Date (or leave blank if current)"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              disabled={formData.current}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <label className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 md:col-span-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
            <input
              type="checkbox"
              checked={formData.current}
              onChange={(e) => {
                setFormData({ 
                  ...formData, 
                  current: e.target.checked,
                  endDate: e.target.checked ? '' : formData.endDate
                });
              }}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium dark:text-white">Current Date</span>
          </label>
          <textarea
            placeholder="Description (use • for bullet points)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="col-span-1 md:col-span-2 rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            rows={3}
          />
          <input
            type="text"
            placeholder="Technologies (comma separated)"
            value={formData.technologies}
            onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
            className="col-span-1 md:col-span-2 rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            <Save size={18} />
            {editingId ? 'Update' : 'Save'} experience
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </motion.div>
      )}

      {/* List */}
      <div className="space-y-3">
        {experiences.map((exp: any) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-lg bg-white p-4 shadow dark:bg-gray-800"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white">
                  {exp.role} at {exp.company}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {exp.startDate} - {exp.endDate || 'Present'}
                </p>
                <p className="mt-2 text-gray-700 dark:text-gray-300">{exp.description}</p>
                <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                  {Array.isArray(exp.technologies) ? exp.technologies.join(', ') : exp.technologies}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...exp,
                      technologies: Array.isArray(exp.technologies) ? exp.technologies.join(', ') : exp.technologies,
                    });
                    setEditingId(exp.id);
                    setShowForm(true);
                  }}
                  className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setExperiences(experiences.filter((e: { id: string }) => e.id !== exp.id))}
                  className="rounded-lg bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Projects Manager Component
function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const loaded = useRef(false);
  const skipNextPersist = useRef(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    excerpt: '',
    tags: '',
    category: '',
    liveUrl: '',
    githubUrl: '',
    image: '',
    featured: false,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (isSupabaseConfigured) {
          const rows = await fetchProjectsForAdmin();
          if (!cancelled) {
            skipNextPersist.current = true;
            setProjects(rows);
          }
        } else {
          const saved = localStorage.getItem('portfolio_projects');
          if (saved) {
            const parsed = JSON.parse(saved);
            setProjects(parsed.length > 0 ? parsed : []);
          } else {
            setProjects(emptyPortfolioData.projects);
          }
        }
      } finally {
        if (!cancelled) {
          loaded.current = true;
          setIsLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const emptyProjectForm = () => ({
    title: '',
    description: '',
    excerpt: '',
    tags: '',
    category: '',
    liveUrl: '',
    githubUrl: '',
    image: '',
    featured: false,
  });

  const resetForm = () => {
    setFormData(emptyProjectForm());
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = () => {
    if (!formData.title || !formData.description) {
      alert('Please fill in title and description');
      return;
    }

    if (editingId) {
      setProjects(
        projects.map((p: { id: string }) => (p.id === editingId ? { ...formData, id: editingId } : p))
      );
    } else {
      setProjects([...projects, { ...formData, id: Date.now().toString() }]);
    }

    resetForm();
  };

  useEffect(() => {
    if (!loaded.current) return;
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));
    if (isSupabaseConfigured)
      saveProjects(projects).catch((e) => warnSupabaseSync('Sync projects', e));
  }, [projects]);

  const formOpen = showForm || editingId !== null;

  if (isLoading) return <AdminLoading />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {projects.length} project{projects.length !== 1 ? 's' : ''}
        </p>
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setFormData(emptyProjectForm());
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add project
        </button>
      </div>

      {formOpen && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg bg-white p-6 shadow dark:bg-gray-800"
      >
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {editingId ? 'Edit project' : 'New project'}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Project Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="col-span-1 md:col-span-2 rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <textarea
            placeholder="Project Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="col-span-1 md:col-span-2 rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            rows={3}
          />
          <input
            type="text"
            placeholder="Short Excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <input
            type="url"
            placeholder="Live URL"
            value={formData.liveUrl}
            onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <input
            type="url"
            placeholder="GitHub URL"
            value={formData.githubUrl}
            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <input
            type="url"
            placeholder="Image URL"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="col-span-1 md:col-span-2 rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="col-span-1 md:col-span-2 rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <label className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            />
            <span className="text-sm dark:text-white">Featured Project</span>
          </label>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            <Save size={18} />
            {editingId ? 'Update' : 'Save'} project
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </motion.div>
      )}

      <div className="space-y-3">
        {projects.map((proj: any) => (
          <motion.div
            key={proj.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-lg bg-white p-4 shadow dark:bg-gray-800"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white">{proj.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{proj.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {(Array.isArray(proj.tags)
                    ? proj.tags
                    : String(proj.tags ?? '')
                        .split(',')
                        .map((t: string) => t.trim())
                        .filter(Boolean)
                  ).map((tag: string, i: number) => (
                    <span
                      key={`${proj.id}-tag-${i}-${tag}`}
                      className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...proj,
                      tags: Array.isArray(proj.tags) ? proj.tags.join(', ') : proj.tags,
                    });
                    setEditingId(proj.id);
                    setShowForm(true);
                  }}
                  className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setProjects(projects.filter((p: { id: string }) => p.id !== proj.id))}
                  className="rounded-lg bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Skills Manager Component
function SkillsManager() {
  const [skills, setSkills] = useState([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const loaded = useRef(false);
  const skipNextPersist = useRef(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    proficiency: 80,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (isSupabaseConfigured) {
          const rows = await fetchSkillsForAdmin();
          if (!cancelled) {
            skipNextPersist.current = true;
            setSkills(rows);
          }
        } else {
          const saved = localStorage.getItem('portfolio_skills');
          if (saved) {
            const parsed = JSON.parse(saved);
            setSkills(parsed.length > 0 ? parsed : []);
          } else {
            setSkills(emptyPortfolioData.skills);
          }
        }
      } finally {
        if (!cancelled) {
          loaded.current = true;
          setIsLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const resetForm = () => {
    setFormData({ name: '', category: 'Frontend', proficiency: 80 });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = () => {
    if (!formData.name) {
      alert('Please enter skill name');
      return;
    }

    if (editingId) {
      setSkills(
        skills.map((s: { id: string }) => (s.id === editingId ? { ...formData, id: editingId } : s))
      );
    } else {
      setSkills([...skills, { ...formData, id: Date.now().toString() }]);
    }

    resetForm();
  };

  useEffect(() => {
    if (!loaded.current) return;
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }
    localStorage.setItem('portfolio_skills', JSON.stringify(skills));
    if (isSupabaseConfigured)
      saveSkills(skills).catch((e) => warnSupabaseSync('Sync skills', e));
  }, [skills]);

  const formOpen = showForm || editingId !== null;

  if (isLoading) return <AdminLoading />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {skills.length} skill{skills.length !== 1 ? 's' : ''}
        </p>
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setFormData({ name: '', category: 'Frontend', proficiency: 80 });
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add skill
        </button>
      </div>

      {formOpen && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg bg-white p-6 shadow dark:bg-gray-800"
      >
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {editingId ? 'Edit skill' : 'New skill'}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Skill Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option>Frontend</option>
            <option>Backend</option>
            <option>Tools</option>
          </select>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Proficiency: {formData.proficiency}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.proficiency}
              onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            <Save size={18} />
            {editingId ? 'Update' : 'Save'} skill
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </motion.div>
      )}

      {['Frontend', 'Backend', 'Tools'].map((cat) => (
        <div key={cat}>
          <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">{cat} Skills</h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {skills
              .filter((s: any) => s.category === cat)
              .map((skill: any) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-lg bg-white p-4 shadow dark:bg-gray-800"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 dark:text-white">{skill.name}</h4>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                          style={{ width: `${skill.proficiency}%` }}
                        ></div>
                      </div>
                      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                        {skill.proficiency}% proficiency
                      </p>
                    </div>
                    <div className="flex gap-2 ml-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(skill);
                          setEditingId(skill.id);
                          setShowForm(true);
                        }}
                        className="rounded-lg bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSkills(skills.filter((s: { id: string }) => s.id !== skill.id))
                        }
                        className="rounded-lg bg-red-100 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Articles Manager Component
function ArticlesManager() {
  const [articles, setArticles] = useState([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const loaded = useRef(false);
  const skipNextPersist = useRef(false);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    excerpt: '',
    category: '',
    tags: '',
    publishedAt: new Date().toISOString().split('T')[0],
    readTime: 5,
    coverImage: '',
    content: '',
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (isSupabaseConfigured) {
          const rows = await fetchBlogPostsForAdmin();
          if (!cancelled) {
            skipNextPersist.current = true;
            setArticles(rows);
          }
        } else {
          const saved = localStorage.getItem('portfolio_articles');
          if (saved) {
            const parsed = JSON.parse(saved);
            setArticles(parsed.length > 0 ? parsed : []);
          } else {
            setArticles(emptyPortfolioData.blogPosts);
          }
        }
      } finally {
        if (!cancelled) {
          loaded.current = true;
          setIsLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const emptyArticleForm = () => ({
    slug: '',
    title: '',
    excerpt: '',
    category: '',
    tags: '',
    publishedAt: new Date().toISOString().split('T')[0],
    readTime: 5,
    coverImage: '',
    content: '',
  });

  const resetForm = () => {
    setFormData(emptyArticleForm());
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = () => {
    if (!formData.title || !formData.content) {
      alert('Please fill in title and content');
      return;
    }

    if (editingId) {
      setArticles(
        articles.map((a: { id: string; slug?: string }) => {
          if (a.id !== editingId) return a;
          const slug =
            formData.slug?.trim() ||
            a.slug ||
            formData.title
              .toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^a-z0-9-]/g, '');
          return { ...formData, id: editingId, slug };
        })
      );
    } else {
      const slug =
        formData.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '') || `post-${Date.now()}`;
      setArticles([...articles, { ...formData, id: Date.now().toString(), slug }]);
    }

    resetForm();
  };

  useEffect(() => {
    if (!loaded.current) return;
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }
    localStorage.setItem('portfolio_articles', JSON.stringify(articles));
    if (isSupabaseConfigured)
      saveBlogPosts(articles).catch((e) => warnSupabaseSync('Sync articles', e));
  }, [articles]);

  const formOpen = showForm || editingId !== null;

  if (isLoading) return <AdminLoading />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {articles.length} article{articles.length !== 1 ? 's' : ''}
        </p>
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setFormData(emptyArticleForm());
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add article
        </button>
      </div>

      {formOpen && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg bg-white p-6 shadow dark:bg-gray-800"
      >
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {editingId ? 'Edit article' : 'New article'}
        </h2>

        <div className="grid gap-4">
          {editingId ? (
            <input
              type="text"
              readOnly
              title="URL slug"
              value={formData.slug}
              className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-400"
            />
          ) : null}
          <input
            type="text"
            placeholder="Article Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <textarea
            placeholder="Article Excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            rows={2}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="date"
              value={formData.publishedAt}
              onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
              className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="number"
              placeholder="Read Time (minutes)"
              value={formData.readTime}
              onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) })}
              className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="url"
              placeholder="Cover Image URL"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <textarea
            placeholder="Article Content (supports markdown)"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            rows={6}
          />
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            <Save size={18} />
            {editingId ? 'Update' : 'Save'} article
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </motion.div>
      )}

      <div className="space-y-3">
        {articles.map((article: any) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-lg bg-white p-4 shadow dark:bg-gray-800"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white">{article.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{article.excerpt}</p>
                <div className="mt-2 flex gap-2">
                  <span className="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                    {article.category}
                  </span>
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    {article.readTime} min read
                  </span>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      slug: article.slug ?? '',
                      title: article.title,
                      excerpt: article.excerpt,
                      category: article.category,
                      tags: Array.isArray(article.tags) ? article.tags.join(', ') : article.tags,
                      publishedAt: article.publishedAt || new Date().toISOString().split('T')[0],
                      readTime: article.readTime,
                      coverImage: article.coverImage,
                      content: article.content,
                    });
                    setEditingId(article.id);
                    setShowForm(true);
                  }}
                  className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setArticles(articles.filter((a: { id: string }) => a.id !== article.id))}
                  className="rounded-lg bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Testimonials Manager Component
function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const loaded = useRef(false);
  const skipNextPersist = useRef(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    quote: '',
    avatar: '',
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (isSupabaseConfigured) {
          const rows = await fetchTestimonialsForAdmin();
          if (!cancelled) {
            skipNextPersist.current = true;
            setTestimonials(rows);
          }
        } else {
          const saved = localStorage.getItem('portfolio_testimonials');
          setTestimonials(saved ? JSON.parse(saved) : []);
        }
      } finally {
        if (!cancelled) {
          loaded.current = true;
          setIsLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const resetForm = () => {
    setFormData({ name: '', role: '', company: '', quote: '', avatar: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = () => {
    if (!formData.name || !formData.quote) {
      alert('Please fill in name and quote');
      return;
    }

    if (editingId) {
      setTestimonials(
        testimonials.map((t: { id: string }) =>
          t.id === editingId ? { ...formData, id: editingId } : t
        )
      );
    } else {
      setTestimonials([...testimonials, { ...formData, id: Date.now().toString() }]);
    }

    resetForm();
  };

  useEffect(() => {
    if (!loaded.current) return;
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }
    localStorage.setItem('portfolio_testimonials', JSON.stringify(testimonials));
    if (isSupabaseConfigured)
      saveTestimonials(testimonials).catch((e) => warnSupabaseSync('Sync testimonials', e));
  }, [testimonials]);

  const formOpen = showForm || editingId !== null;

  if (isLoading) return <AdminLoading />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {testimonials.length} testimonial{testimonials.length !== 1 ? 's' : ''}
        </p>
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setFormData({ name: '', role: '', company: '', quote: '', avatar: '' });
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add testimonial
        </button>
      </div>

      {formOpen && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg bg-white p-6 shadow dark:bg-gray-800"
      >
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {editingId ? 'Edit testimonial' : 'New testimonial'}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Person Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Job Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <input
            type="url"
            placeholder="Avatar Image URL"
            value={formData.avatar}
            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <textarea
            placeholder="Testimonial Quote"
            value={formData.quote}
            onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
            className="col-span-1 md:col-span-2 rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            rows={3}
          />
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            <Save size={18} />
            {editingId ? 'Update' : 'Save'} testimonial
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </motion.div>
      )}

      <div className="space-y-3">
        {testimonials.map((testimonial: any) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-lg bg-white p-4 shadow dark:bg-gray-800"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <blockquote className="italic text-gray-700 dark:text-gray-300">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="mt-3">
                  <p className="font-bold text-gray-900 dark:text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  type="button"
                  onClick={() => {
                    setFormData(testimonial);
                    setEditingId(testimonial.id);
                    setShowForm(true);
                  }}
                  className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setTestimonials(
                      testimonials.filter((t: { id: string }) => t.id !== testimonial.id)
                    )
                  }
                  className="rounded-lg bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Profile Manager Component
function ProfileManager() {
  const p = emptyPortfolioData.profile;
  const [profile, setProfile] = useState({
    name: p.name,
    title: p.title,
    heroRoles: p.heroRoles?.length ? p.heroRoles : p.title ? [p.title] : [''],
    email: p.email,
    location: p.location,
    bio: p.bio,
    profileImage: p.profileImage,
    resumeUrl: p.resumeUrl,
    socialLinks: p.socialLinks,
    yearsOfExperience: p.yearsOfExperience,
    projectsCompleted: p.projectsCompleted,
    companiesWorked: p.companiesWorked,
    technologiesLearned: p.technologiesLearned,
  });
  const [photoMode, setPhotoMode] = useState<'upload' | 'url'>('upload');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (isSupabaseConfigured) {
          const row = await fetchProfileForAdmin();
          if (cancelled || !row) return;
          let roles = row.heroRoles?.length
            ? row.heroRoles.map((s) => String(s).trim()).filter(Boolean)
            : row.title?.trim()
              ? [row.title.trim()]
              : [];
          if (!roles.length) roles = [''];
          setProfile({
            name: row.name ?? '',
            title: roles[0] ?? '',
            heroRoles: roles,
            email: row.email ?? '',
            location: row.location ?? '',
            bio: row.bio ?? '',
            profileImage: row.profileImage ?? '',
            resumeUrl: row.resumeUrl ?? '',
            socialLinks:
              Array.isArray(row.socialLinks) && row.socialLinks.length > 0
                ? row.socialLinks
                : p.socialLinks,
            yearsOfExperience: row.yearsOfExperience ?? 0,
            projectsCompleted: row.projectsCompleted ?? 0,
            companiesWorked: row.companiesWorked ?? 0,
            technologiesLearned: row.technologiesLearned ?? 0,
          });
        } else {
          const saved = localStorage.getItem('portfolio_profile');
          if (!saved) return;
          try {
            const parsed = JSON.parse(saved) as Record<string, unknown>;
            setProfile((prev) => {
              const next = { ...prev, ...parsed } as typeof prev;
              let roles = Array.isArray(parsed.heroRoles)
                ? (parsed.heroRoles as string[]).map((s) => String(s))
                : [];
              if (!roles.length && typeof parsed.title === 'string' && parsed.title.trim()) {
                roles = [parsed.title.trim()];
              }
              if (!roles.length) roles = [''];
              const trimmed = roles.map((r) => r.trim()).filter(Boolean);
              next.heroRoles = trimmed.length ? trimmed : [''];
              next.title = next.heroRoles[0] ?? '';
              return next;
            });
          } catch {
            console.error('Invalid portfolio_profile in localStorage');
          }
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async () => {
    const roles = profile.heroRoles.map((r) => String(r).trim()).filter(Boolean);
    const payload = {
      ...profile,
      heroRoles: roles,
      title: roles[0] ?? '',
    };
    localStorage.setItem('portfolio_profile', JSON.stringify(payload));
    if (isSupabaseConfigured) {
      try {
        await saveProfile(payload);
      } catch (e) {
        warnSupabaseSync('Profile save', e);
      }
    }
    setProfile(payload);
    alert('Profile updated successfully!');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfile(prev => ({ ...prev, profileImage: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const currentPhoto = profile.profileImage || '';

  if (isLoading) return <AdminLoading />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl rounded-lg bg-white p-6 shadow dark:bg-gray-800"
    >
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h2>
      <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        {isSupabaseConfigured
          ? 'Loaded from Supabase. Save writes to your database and this browser.'
          : 'Configure Supabase URL in .env to load profile from the database.'}
      </p>

      <div className="space-y-4">
        {/* Photo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Profile Photo
          </label>
          <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-gray-300 p-6 dark:border-gray-600 sm:flex-row sm:items-start">
            {/* Preview */}
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 ring-2 ring-blue-500 dark:bg-gray-600">
              {currentPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={currentPhoto} alt="Profile preview" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs text-gray-500">No photo</span>
              )}
            </div>
            {/* Controls */}
            <div className="flex-1 space-y-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPhotoMode('upload')}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${photoMode === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'}`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoMode('url')}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${photoMode === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'}`}
                >
                  Use URL
                </button>
              </div>
              {photoMode === 'upload' ? (
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                  <span>Choose photo…</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={profile.profileImage?.startsWith('data:') ? '' : profile.profileImage}
                  onChange={(e) => setProfile(prev => ({ ...prev, profileImage: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              )}
              {profile.profileImage && (
                <button
                  type="button"
                  onClick={() => setProfile(prev => ({ ...prev, profileImage: '' }))}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove photo (use default)
                </button>
              )}
            </div>
          </div>
        </div>
        <input
          type="text"
          placeholder="Full Name"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Hero roles (shown one at a time, in order, then repeat)
          </label>
          <div className="space-y-2">
            {(profile.heroRoles ?? ['']).map((role, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="flex w-7 shrink-0 items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                  {idx + 1}.
                </span>
                <input
                  type="text"
                  placeholder="e.g. Full Stack Developer"
                  value={role}
                  onChange={(e) => {
                    const next = [...(profile.heroRoles ?? [])];
                    next[idx] = e.target.value;
                    const cleaned = next.length ? next : [''];
                    setProfile({
                      ...profile,
                      heroRoles: cleaned,
                      title: cleaned.map((r) => r.trim()).filter(Boolean)[0] ?? '',
                    });
                  }}
                  className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <div className="flex shrink-0 flex-col gap-0.5">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => {
                      const next = [...(profile.heroRoles ?? [])];
                      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                      const first = next.map((r) => r.trim()).filter(Boolean)[0] ?? '';
                      setProfile({ ...profile, heroRoles: next, title: first });
                    }}
                    className="rounded border border-gray-300 p-1 text-gray-600 hover:bg-gray-100 disabled:opacity-30 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                    title="Move up"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    type="button"
                    disabled={idx >= (profile.heroRoles?.length ?? 1) - 1}
                    onClick={() => {
                      const next = [...(profile.heroRoles ?? [])];
                      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                      const first = next.map((r) => r.trim()).filter(Boolean)[0] ?? '';
                      setProfile({ ...profile, heroRoles: next, title: first });
                    }}
                    className="rounded border border-gray-300 p-1 text-gray-600 hover:bg-gray-100 disabled:opacity-30 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                    title="Move down"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = (profile.heroRoles ?? []).filter((_, i) => i !== idx);
                    const list = next.length ? next : [''];
                    const first = list.map((r) => r.trim()).filter(Boolean)[0] ?? '';
                    setProfile({ ...profile, heroRoles: list, title: first });
                  }}
                  className="shrink-0 rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20"
                  title="Remove role"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setProfile({
                  ...profile,
                  heroRoles: [...(profile.heroRoles ?? []), ''],
                  title: profile.title,
                })
              }
              className="mt-1 inline-flex items-center gap-1 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-sm text-blue-600 hover:bg-gray-50 dark:border-gray-600 dark:text-blue-400 dark:hover:bg-gray-700/50"
            >
              <Plus size={16} />
              Add role
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            The hero cycles through each line: types in, pauses, deletes, then shows the next.
          </p>
        </div>
        <input
          type="email"
          placeholder="Email Address"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <input
          type="text"
          placeholder="Location"
          value={profile.location}
          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <textarea
          placeholder="Bio"
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          rows={4}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Years of Experience
            </label>
            <input
              type="number"
              value={profile.yearsOfExperience}
              onChange={(e) => setProfile({ ...profile, yearsOfExperience: parseInt(e.target.value) })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Projects Completed
            </label>
            <input
              type="number"
              value={profile.projectsCompleted}
              onChange={(e) => setProfile({ ...profile, projectsCompleted: parseInt(e.target.value) })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Companies Worked
            </label>
            <input
              type="number"
              value={profile.companiesWorked}
              onChange={(e) => setProfile({ ...profile, companiesWorked: parseInt(e.target.value) })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Technologies Learned
            </label>
            <input
              type="number"
              value={profile.technologiesLearned}
              onChange={(e) => setProfile({ ...profile, technologiesLearned: parseInt(e.target.value) })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-all hover:bg-blue-700 active:scale-95 flex items-center justify-center gap-2"
        >
          <Save size={18} />
          Save Profile Changes
        </button>
      </div>
    </motion.div>
  );
}
