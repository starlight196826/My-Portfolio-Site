'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
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

type AdminAlertType = 'success' | 'warning' | 'error';
type AdminAlertDetail = { message: string; type?: AdminAlertType };
const ADMIN_ALERT_EVENT = 'admin-alert';

function showAdminAlert(message: string, type: AdminAlertType = 'warning') {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<AdminAlertDetail>(ADMIN_ALERT_EVENT, { detail: { message, type } }));
}

function AdminLoading() {
  return (
    <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800">
      <p className="text-sm text-gray-500 dark:text-gray-400">Loading from database…</p>
    </div>
  );
}

function AdminAlertModal({
  open,
  type,
  message,
  onClose,
}: {
  open: boolean;
  type: AdminAlertType;
  message: string;
  onClose: () => void;
}) {
  if (!open) return null;
  const palette =
    type === 'success'
      ? 'border-emerald-300 bg-gradient-to-br from-emerald-100 to-lime-100 text-emerald-900 dark:border-emerald-500/50 dark:from-emerald-900/70 dark:to-lime-900/40 dark:text-emerald-100'
      : type === 'error'
        ? 'border-rose-300 bg-gradient-to-br from-rose-100 to-fuchsia-100 text-rose-900 dark:border-rose-500/50 dark:from-rose-900/70 dark:to-fuchsia-900/40 dark:text-rose-100'
        : 'border-amber-300 bg-gradient-to-br from-amber-100 to-orange-100 text-amber-900 dark:border-amber-500/50 dark:from-amber-900/70 dark:to-orange-900/40 dark:text-amber-100';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={`w-full max-w-md rounded-2xl border p-5 shadow-2xl ${palette}`}
      >
        <div className="mb-2 text-xs font-bold uppercase tracking-[0.15em] opacity-80">Notification</div>
        <p className="text-sm font-medium leading-relaxed">{message}</p>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-black/15 px-4 py-2 text-sm font-semibold transition hover:bg-black/25 dark:bg-white/15 dark:hover:bg-white/25"
          >
            OK
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function AdminEditModal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label="Close editor"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </motion.div>
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
  const [modalAlert, setModalAlert] = useState<{
    open: boolean;
    type: AdminAlertType;
    message: string;
  }>({ open: false, type: 'warning', message: '' });

  // Load authentication state from localStorage
  useEffect(() => {
    const isAuth = localStorage.getItem('admin_authenticated') === 'true';
    setAuthenticated(isAuth);
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<AdminAlertDetail>;
      const detail = custom.detail;
      if (!detail?.message) return;
      setModalAlert({ open: true, type: detail.type ?? 'warning', message: detail.message });
    };
    window.addEventListener(ADMIN_ALERT_EVENT, handler as EventListener);
    return () => window.removeEventListener(ADMIN_ALERT_EVENT, handler as EventListener);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - in production, use proper authentication
    if (password === 'admin123') {
      setAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      setPassword('');
    } else {
      showAdminAlert('Invalid password', 'error');
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    setSidebarOpen(false);
  };

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-50 to-teal-50 dark:from-navy dark:to-navy-muted">
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
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
              className="w-full rounded-lg bg-teal-600 px-4 py-2 font-medium text-white transition-all hover:bg-teal-700 active:scale-95"
            >
              Login to Admin Panel
            </button>
          </form>
        </motion.div>
        <AdminAlertModal
          open={modalAlert.open}
          type={modalAlert.type}
          message={modalAlert.message}
          onClose={() => setModalAlert((prev) => ({ ...prev, open: false }))}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-sky-50 dark:bg-navy">
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
                    ? 'bg-teal-100 text-teal-700 dark:bg-mint/20 dark:text-mint'
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
      <AdminAlertModal
        open={modalAlert.open}
        type={modalAlert.type}
        message={modalAlert.message}
        onClose={() => setModalAlert((prev) => ({ ...prev, open: false }))}
      />
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
      showAdminAlert('Please fill in company and role', 'warning');
      return;
    }

    if (editingId) {
      setExperiences(experiences.map((e: { id: string }) => (e.id === editingId ? { ...formData, id: editingId } : e)));
    } else {
      setExperiences([...experiences, { ...formData, id: Date.now().toString() }]);
    }

    showAdminAlert(
      editingId ? 'Experience updated successfully.' : 'Experience saved successfully.',
      'success'
    );
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
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          <Plus size={18} />
          Add experience
        </button>
      </div>

      {formOpen && (
      <AdminEditModal
        open={formOpen}
        onClose={resetForm}
        title={editingId ? 'Edit Experience' : 'New Experience'}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
            <input
              type="text"
              placeholder="Company Name"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Job Role</label>
            <input
              type="text"
              placeholder="Job Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
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
              value={formData.endDate ?? ''}
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
          <div className="col-span-1 md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Role Description
            </label>
            <textarea
              placeholder="Description (use • for bullet points)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              rows={3}
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Technologies Used (comma separated)
            </label>
            <input
              type="text"
              placeholder="Technologies (comma separated)"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-700"
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
      </AdminEditModal>
      )}

      {/* List */}
      <div className="space-y-3">
        {experiences.map((exp: any) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-lg bg-gray-100 p-4 shadow dark:bg-gray-800"
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
                <p className="mt-1 text-xs text-teal-600 dark:text-mint">
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
                  className="rounded-lg bg-teal-100 px-3 py-1 text-sm font-medium text-teal-700 hover:bg-teal-200 dark:bg-mint/20 dark:text-mint"
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
  const [isSaving, setIsSaving] = useState(false);
  const loaded = useRef(false);
  const skipNextPersist = useRef(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    excerpt: '',
    rating: 3.3,
    tags: '',
    category: '',
    liveUrl: '',
    image: '',
    images: [] as string[],
    featured: false,
  });
  const [dragImageIndex, setDragImageIndex] = useState<number | null>(null);
  const [isProjectDropActive, setIsProjectDropActive] = useState(false);
  const projectImagesInputRef = useRef<HTMLInputElement | null>(null);
  const projectSyncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const PROJECT_IMAGE_CACHE_MAX_DATA_URL_CHARS = 1_200_000;

  const projectsForLocalStorage = (rows: any[]) =>
    rows.map((proj) => {
      const images = Array.isArray(proj.images)
        ? proj.images.filter(
            (img: unknown) =>
              typeof img === 'string' &&
              (!img.startsWith('data:') || img.length <= PROJECT_IMAGE_CACHE_MAX_DATA_URL_CHARS)
          )
        : [];
      const primary =
        typeof proj.image === 'string' &&
        (!proj.image.startsWith('data:') || proj.image.length <= PROJECT_IMAGE_CACHE_MAX_DATA_URL_CHARS)
          ? proj.image
          : images[0] ?? '';
      return {
        ...proj,
        image: primary,
        images,
      };
    });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (isSupabaseConfigured) {
          const rows = await fetchProjectsForAdmin();
          if (!cancelled) {
            skipNextPersist.current = true;
            if (rows.length > 0) {
              setProjects(rows);
            } else {
              const saved = localStorage.getItem('portfolio_projects');
              if (saved) {
                try {
                  const parsed = JSON.parse(saved);
                  setProjects(parsed.length > 0 ? parsed : []);
                } catch {
                  setProjects([]);
                }
              } else {
                setProjects([]);
              }
            }
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
    rating: 3.3,
    tags: '',
    category: '',
    liveUrl: '',
    image: '',
    images: [] as string[],
    featured: false,
  });

  const resetForm = () => {
    setFormData(emptyProjectForm());
    setDragImageIndex(null);
    if (projectImagesInputRef.current) projectImagesInputRef.current.value = '';
    setEditingId(null);
    setShowForm(false);
  };

  const importProjectImageFiles = async (files: File[]) => {
    if (!files.length) return;

    const MAX_FILE_BYTES = 8 * 1024 * 1024;
    const oversized = files.find((file) => file.size > MAX_FILE_BYTES);
    if (oversized) {
      const limitMb = (MAX_FILE_BYTES / (1024 * 1024)).toFixed(0);
      const actualMb = (oversized.size / (1024 * 1024)).toFixed(2);
      showAdminAlert(
        `Image "${oversized.name}" is too large (${actualMb}MB). Max allowed is ${limitMb}MB.`,
        'warning'
      );
      return;
    }

    const toDataUrl = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ''));
        reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
        reader.readAsDataURL(file);
      });

    try {
      const imported = (await Promise.all(files.map((file) => toDataUrl(file))))
        .map((img) => img.trim())
        .filter(Boolean);
      if (!imported.length) return;
      setFormData((prev) => {
        const merged = [...prev.images];
        for (const img of imported) {
          if (!merged.includes(img)) merged.push(img);
        }
        return {
          ...prev,
          image: prev.image || merged[0] || '',
          images: merged,
        };
      });
    } catch {
      showAdminAlert('Failed to import one or more images. Please try again.', 'error');
    }
  };

  const handleProjectImageFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget;
    const files = Array.from(inputEl.files ?? []);
    try {
      await importProjectImageFiles(files);
    } finally {
      inputEl.value = '';
    }
  };

  const handleProjectImageDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsProjectDropActive(false);
    const files = Array.from(e.dataTransfer?.files ?? []);
    await importProjectImageFiles(files);
  };

  const removeProjectImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const moveProjectImage = (from: number, to: number) => {
    if (to < 0) return;
    setFormData((prev) => {
      if (to >= prev.images.length) return prev;
      const next = [...prev.images];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return { ...prev, images: next };
    });
  };

  const handleSave = async () => {
    if (isSaving) return;
    if (!formData.title || !formData.description) {
      showAdminAlert('Please fill in title and description', 'warning');
      return;
    }
    const rating = Number.isFinite(Number(formData.rating)) ? Number(formData.rating) : 3.3;
    const normalizedRating = Math.max(0, Math.min(5, Number(rating.toFixed(1))));
    const images = formData.images.map((s) => s.trim()).filter(Boolean);
    const primaryImage = formData.image.trim() || images[0] || '';
    const payload = {
      ...formData,
      image: primaryImage,
      images: images.length > 0 ? images : primaryImage ? [primaryImage] : [],
      rating: normalizedRating,
    };

    const nextProjects = editingId
      ? projects.map((p: { id: string }) => (p.id === editingId ? { ...payload, id: editingId } : p))
      : [...projects, { ...payload, id: Date.now().toString() }];

    setIsSaving(true);
    try {
      if (isSupabaseConfigured) {
        await saveProjects(nextProjects);
      }
      setProjects(nextProjects);
      showAdminAlert(
        editingId ? 'Project updated successfully.' : 'Project saved successfully.',
        'success'
      );
      resetForm();
    } catch (e) {
      warnSupabaseSync('Save project', e);
      showAdminAlert('Project save failed. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!loaded.current) return;
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }
    try {
      localStorage.setItem('portfolio_projects', JSON.stringify(projectsForLocalStorage(projects)));
    } catch (e) {
      const quota =
        e instanceof DOMException &&
        (e.name === 'QuotaExceededError' || (e as DOMException).code === 22);
      if (!quota) throw e;
      try {
        localStorage.setItem(
          'portfolio_projects',
          JSON.stringify(
            projects.map((proj: any) => ({
              ...proj,
              image: typeof proj.image === 'string' && proj.image.startsWith('data:') ? '' : proj.image,
              images: Array.isArray(proj.images)
                ? proj.images.filter(
                    (img: unknown) => typeof img === 'string' && !img.startsWith('data:')
                  )
                : [],
            }))
          )
        );
      } catch {
        console.warn('[admin] localStorage quota exceeded; projects cache reduced');
      }
    }
    if (projectSyncTimerRef.current) {
      clearTimeout(projectSyncTimerRef.current);
      projectSyncTimerRef.current = null;
    }
    if (isSupabaseConfigured) {
      // Debounce and coalesce syncs so older saves cannot race and overwrite newer edits.
      projectSyncTimerRef.current = setTimeout(() => {
        saveProjects(projects).catch((e) => warnSupabaseSync('Sync projects', e));
      }, 450);
    }
    return () => {
      if (projectSyncTimerRef.current) {
        clearTimeout(projectSyncTimerRef.current);
        projectSyncTimerRef.current = null;
      }
    };
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
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          <Plus size={18} />
          Add project
        </button>
      </div>

      {formOpen && (
      <AdminEditModal
        open={formOpen}
        onClose={resetForm}
        title={editingId ? 'Edit Project' : 'New Project'}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="col-span-1 md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Project Title</label>
            <input
              type="text"
              placeholder="Project Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Project Description
            </label>
            <textarea
              placeholder="Project Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              rows={3}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Short Excerpt</label>
            <input
              type="text"
              placeholder="Short Excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Review Score (0.0 - 5.0)
            </label>
            <input
              type="number"
              min={0}
              max={5}
              step={0.1}
              placeholder="Review score (0.0 - 5.0)"
              value={formData.rating}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  rating: Number.isFinite(Number(e.target.value)) ? Number(e.target.value) : 0,
                })
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Live URL</label>
            <input
              type="url"
              placeholder="Live URL"
              value={formData.liveUrl}
              onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Project Images (import files, then drag to reorder)
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
              }}
              onDragEnter={(e) => {
                e.preventDefault();
                setIsProjectDropActive(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                  setIsProjectDropActive(false);
                }
              }}
              onDrop={handleProjectImageDrop}
              className={`mb-3 rounded-lg border-2 border-dashed p-4 transition ${
                isProjectDropActive
                  ? 'border-teal-500 bg-teal-50 dark:border-mint dark:bg-mint/10'
                  : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800/60'
              }`}
            >
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Drag and drop images here
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    JPG, PNG, WebP, GIF up to 8MB each
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => projectImagesInputRef.current?.click()}
                  className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700"
                >
                  Browse files
                </button>
              </div>
              <input
                ref={projectImagesInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleProjectImageFiles}
                className="hidden"
              />
            </div>
            {formData.images.length > 0 ? (
              <div className="space-y-2">
                {formData.images.map((img, idx) => (
                  <div
                    key={`${img}-${idx}`}
                    draggable
                    onDragStart={() => setDragImageIndex(idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (dragImageIndex === null || dragImageIndex === idx) return;
                      moveProjectImage(dragImageIndex, idx);
                      setDragImageIndex(null);
                    }}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                  >
                    <span className="cursor-grab text-xs text-gray-500 dark:text-gray-400">↕</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs text-gray-700 dark:text-gray-200">{img}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => moveProjectImage(idx, idx - 1)}
                      className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 hover:bg-gray-200 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      onClick={() => moveProjectImage(idx, idx + 1)}
                      className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 hover:bg-gray-200 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                    >
                      Down
                    </button>
                    <button
                      type="button"
                      onClick={() => removeProjectImage(idx)}
                      className="rounded bg-red-100 px-2 py-1 text-xs text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400">No additional images yet.</p>
            )}
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
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
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={18} />
            {isSaving ? 'Saving...' : `${editingId ? 'Update' : 'Save'} project`}
          </button>
          <button
            type="button"
            onClick={resetForm}
            disabled={isSaving}
            className="rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-900 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </AdminEditModal>
      )}

      <div className="space-y-3">
        {projects.map((proj: any) => (
          <motion.div
            key={proj.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-lg bg-gray-100 p-4 shadow dark:bg-gray-800"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                  {(proj.image || (Array.isArray(proj.images) ? proj.images[0] : '')) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={proj.image || proj.images?.[0]}
                      alt={`${proj.title} preview`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white">{proj.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{proj.description}</p>
                <p className="mt-1 text-xs font-medium text-amber-500 dark:text-amber-400">
                  Review: {Number(proj.rating ?? 3.3).toFixed(1)} / 5.0
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Images: {Array.isArray(proj.images) && proj.images.length > 0 ? proj.images.length : proj.image ? 1 : 0}
                </p>
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
                      className="rounded-full bg-teal-100 px-2 py-1 text-xs text-teal-700 dark:bg-mint/20 dark:text-mint"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...proj,
                      rating: Number(proj.rating ?? 3.3),
                      tags: Array.isArray(proj.tags) ? proj.tags.join(', ') : proj.tags,
                      image: String(proj.image ?? ''),
                      images: Array.isArray(proj.images)
                        ? proj.images
                        : proj.image
                          ? [String(proj.image)]
                          : [],
                    });
                    setEditingId(proj.id);
                    setShowForm(true);
                  }}
                  className="rounded-lg bg-teal-100 px-3 py-1 text-sm font-medium text-teal-700 hover:bg-teal-200 dark:bg-mint/20 dark:text-mint"
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
  const SKILL_CATEGORY_SUGGESTIONS = [
    'Web Development & No-Code Builders',
    'Mobile Development',
    'UI/UX Design',
    'Backend & Database',
    'AI Development & Automation',
    'Voice AI & Conversational AI',
    'CRM & Marketing Automation',
    'SaaS & Software Development',
    'Integrations & Tools',
    'SEO & Content',
    'Deployment & Infrastructure',
  ];
  const [skills, setSkills] = useState([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const loaded = useRef(false);
  const skipNextPersist = useRef(false);
  const [formData, setFormData] = useState({
    name: '',
    category: SKILL_CATEGORY_SUGGESTIONS[0],
    proficiency: 80,
  });
  const categoryOptions = Array.from(
    new Set(
      [...SKILL_CATEGORY_SUGGESTIONS, ...skills.map((s: any) => String(s.category ?? '').trim())].filter(Boolean)
    )
  );

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
    setFormData({ name: '', category: SKILL_CATEGORY_SUGGESTIONS[0], proficiency: 80 });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = () => {
    if (!formData.name) {
      showAdminAlert('Please enter skill name', 'warning');
      return;
    }

    if (editingId) {
      setSkills(
        skills.map((s: { id: string }) => (s.id === editingId ? { ...formData, id: editingId } : s))
      );
    } else {
      setSkills([...skills, { ...formData, id: Date.now().toString() }]);
    }

    showAdminAlert(
      editingId ? 'Skill updated successfully.' : 'Skill saved successfully.',
      'success'
    );
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
            setFormData({ name: '', category: SKILL_CATEGORY_SUGGESTIONS[0], proficiency: 80 });
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          <Plus size={18} />
          Add skill
        </button>
      </div>

      {formOpen && (
      <AdminEditModal
        open={formOpen}
        onClose={resetForm}
        title={editingId ? 'Edit Skill' : 'New Skill'}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Skill Name</label>
            <input
              type="text"
              placeholder="Skill Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <input
              type="text"
              list="skills-category-options"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Skill category"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <datalist id="skills-category-options">
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Proficiency Percentage: {formData.proficiency}%
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
            className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-700"
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
      </AdminEditModal>
      )}

      {categoryOptions.map((cat) => (
        <div key={cat}>
          <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">{cat}</h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {skills
              .filter((s: any) => s.category === cat)
              .map((skill: any) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-lg bg-gray-100 p-4 shadow dark:bg-gray-800"
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
      showAdminAlert('Please fill in title and content', 'warning');
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

    showAdminAlert(
      editingId ? 'Article updated successfully.' : 'Article saved successfully.',
      'success'
    );
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
      <AdminEditModal
        open={formOpen}
        onClose={resetForm}
        title={editingId ? 'Edit Article' : 'New Article'}
      >
        <div className="grid gap-4">
          {editingId ? (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">URL Slug</label>
              <input
                type="text"
                readOnly
                title="URL slug"
                value={formData.slug}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-400"
              />
            </div>
          ) : null}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Article Title</label>
            <input
              type="text"
              placeholder="Article Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Article Excerpt</label>
            <textarea
              placeholder="Article Excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              rows={2}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Publish Date</label>
              <input
                type="date"
                value={formData.publishedAt}
                onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Read Time (minutes)
              </label>
              <input
                type="number"
                placeholder="Read Time (minutes)"
                value={formData.readTime}
                onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Cover Image URL</label>
              <input
                type="url"
                placeholder="Cover Image URL"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Article Content (Markdown)
            </label>
            <textarea
              placeholder="Article Content (supports markdown)"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              rows={6}
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
      </AdminEditModal>
      )}

      <div className="space-y-3">
        {articles.map((article: any) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-lg bg-gray-100 p-4 shadow dark:bg-gray-800"
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
                  className="rounded-lg bg-teal-100 px-3 py-1 text-sm font-medium text-teal-700 hover:bg-teal-200 dark:bg-mint/20 dark:text-mint"
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
      showAdminAlert('Please fill in name and quote', 'warning');
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

    showAdminAlert(
      editingId ? 'Testimonial updated successfully.' : 'Testimonial saved successfully.',
      'success'
    );
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
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          <Plus size={18} />
          Add testimonial
        </button>
      </div>

      {formOpen && (
      <AdminEditModal
        open={formOpen}
        onClose={resetForm}
        title={editingId ? 'Edit Testimonial' : 'New Testimonial'}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Person Name</label>
            <input
              type="text"
              placeholder="Person Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Job Role</label>
            <input
              type="text"
              placeholder="Job Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
            <input
              type="text"
              placeholder="Company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Avatar Image URL</label>
            <input
              type="url"
              placeholder="Avatar Image URL"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Testimonial Quote</label>
            <textarea
              placeholder="Testimonial Quote"
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              rows={3}
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-700"
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
      </AdminEditModal>
      )}

      <div className="space-y-3">
        {testimonials.map((testimonial: any) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-lg bg-gray-100 p-4 shadow dark:bg-gray-800"
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
                  className="rounded-lg bg-teal-100 px-3 py-1 text-sm font-medium text-teal-700 hover:bg-teal-200 dark:bg-mint/20 dark:text-mint"
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

const PROFILE_IMAGE_UPLOAD_MAX_BYTES = 8 * 1024 * 1024; // Increased limit: 8MB
const PROFILE_IMAGE_CACHE_MAX_DATA_URL_CHARS = 1_200_000; // ~0.9MB binary when base64-encoded

function estimateDataUrlBytes(dataUrl: string): number {
  const comma = dataUrl.indexOf(',');
  if (comma < 0) return 0;
  const base64 = dataUrl.slice(comma + 1);
  return Math.floor((base64.length * 3) / 4);
}

/** Browser localStorage is ~5MB; embedded base64 photos exceed it quickly. */
function profileForLocalStorage<P extends { profileImage?: string }>(payload: P): P {
  const img = payload.profileImage;
  if (img && img.startsWith('data:')) {
    // Keep smaller data URLs so the image still appears even when storage bucket is missing.
    if (img.length <= PROFILE_IMAGE_CACHE_MAX_DATA_URL_CHARS) return payload;
    return { ...payload, profileImage: '' };
  }
  return payload;
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
  const [photoWarning, setPhotoWarning] = useState('');
  const [photoUploadRejected, setPhotoUploadRejected] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [isProfileDropActive, setIsProfileDropActive] = useState(false);

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
    if (photoUploadRejected) {
      showAdminAlert('Can not upload file', 'error');
      return;
    }
    const roles = profile.heroRoles.map((r) => String(r).trim()).filter(Boolean);
    const payload = {
      ...profile,
      heroRoles: roles,
      title: roles[0] ?? '',
    };
    if (payload.profileImage?.startsWith('data:')) {
      const imageBytes = estimateDataUrlBytes(payload.profileImage);
      if (imageBytes > PROFILE_IMAGE_UPLOAD_MAX_BYTES) {
        const limitMb = (PROFILE_IMAGE_UPLOAD_MAX_BYTES / (1024 * 1024)).toFixed(0);
        const actualMb = (imageBytes / (1024 * 1024)).toFixed(2);
        const message = `Image is too large (${actualMb}MB). Max allowed is ${limitMb}MB. Please choose a smaller file.`;
        setPhotoWarning(message);
        setPhotoUploadRejected(true);
        showAdminAlert(message, 'warning');
        return;
      }
    }
    setPhotoWarning('');
    setPhotoUploadRejected(false);
    const stored = profileForLocalStorage(payload);
    try {
      localStorage.setItem('portfolio_profile', JSON.stringify(stored));
    } catch (e) {
      const quota =
        e instanceof DOMException &&
        (e.name === 'QuotaExceededError' || (e as DOMException).code === 22);
      if (quota) {
        try {
          localStorage.setItem(
            'portfolio_profile',
            JSON.stringify({ ...stored, profileImage: '' })
          );
        } catch {
          console.error('localStorage quota exceeded; profile not cached locally');
        }
      } else {
        throw e;
      }
    }
    if (isSupabaseConfigured) {
      try {
        await saveProfile(payload);
      } catch (e) {
        warnSupabaseSync('Profile save', e);
      }
    }
    setProfile(payload);
    const skippedDataUrl =
      payload.profileImage?.startsWith('data:') && !isSupabaseConfigured;
    showAdminAlert(
      skippedDataUrl
        ? 'Profile saved. Uploaded photos cannot be stored in browser cache at this size. Configure Supabase Storage and save again to persist your photo, or use an image URL.'
        : 'Profile updated successfully!',
      skippedDataUrl ? 'warning' : 'success'
    );
    setShowProfileEditor(false);
  };

  const importProfilePhoto = (file: File | undefined) => {
    if (!file) return;
    if (file.size > PROFILE_IMAGE_UPLOAD_MAX_BYTES) {
      const limitMb = (PROFILE_IMAGE_UPLOAD_MAX_BYTES / (1024 * 1024)).toFixed(0);
      const actualMb = (file.size / (1024 * 1024)).toFixed(2);
      const message = `Image is too large (${actualMb}MB). Max allowed is ${limitMb}MB. Please choose a smaller file.`;
      setPhotoWarning(message);
      setPhotoUploadRejected(true);
      // Immediate rejection: clear selected file and preview.
      setProfile(prev => ({ ...prev, profileImage: '' }));
      showAdminAlert(message, 'warning');
      return;
    }
    setPhotoWarning('');
    setPhotoUploadRejected(false);
    const reader = new FileReader();
    reader.onload = () => setProfile(prev => ({ ...prev, profileImage: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget;
    const file = inputEl.files?.[0];
    importProfilePhoto(file);
    inputEl.value = '';
  };

  const handleProfilePhotoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsProfileDropActive(false);
    const file = e.dataTransfer?.files?.[0];
    importProfilePhoto(file);
  };

  const currentPhoto = profile.profileImage || '';

  if (isLoading) return <AdminLoading />;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl rounded-lg bg-gray-100 p-6 shadow dark:bg-gray-800"
      >
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h2>
        <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          {isSupabaseConfigured
            ? 'Loaded from Supabase. Save writes to your database and this browser.'
            : 'Configure Supabase URL in .env to load profile from the database.'}
        </p>
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900/40">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              {currentPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={currentPhoto} alt="Profile preview" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{profile.name || 'Unnamed profile'}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{profile.email || 'No email set'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowProfileEditor(true)}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            Edit Profile
          </button>
        </div>
      </motion.div>

      <AdminEditModal
        open={showProfileEditor}
        onClose={() => setShowProfileEditor(false)}
        title="Edit Profile"
      >
      <div className="space-y-4">
        {/* Photo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Profile Photo
          </label>
          <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-gray-300 p-6 dark:border-gray-600 sm:flex-row sm:items-start">
            {/* Preview */}
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 ring-2 ring-gray-300 dark:bg-gray-600 dark:ring-gray-500">
              {currentPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={currentPhoto} alt="Profile preview" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs text-gray-500">No photo</span>
              )}
            </div>
            {/* Controls */}
            <div className="flex-1 space-y-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Max upload size: {(PROFILE_IMAGE_UPLOAD_MAX_BYTES / (1024 * 1024)).toFixed(0)}MB
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPhotoMode('upload')}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${photoMode === 'upload' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'}`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoMode('url')}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${photoMode === 'url' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'}`}
                >
                  Use URL
                </button>
              </div>
              {photoMode === 'upload' ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'copy';
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setIsProfileDropActive(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                      setIsProfileDropActive(false);
                    }
                  }}
                  onDrop={handleProfilePhotoDrop}
                  className={`rounded-lg border-2 border-dashed p-3 transition ${
                    isProfileDropActive
                      ? 'border-teal-500 bg-teal-50 dark:border-mint dark:bg-mint/10'
                      : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800/60'
                  }`}
                >
                  <label className="flex cursor-pointer items-center justify-between gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span>Drag and drop a photo here, or browse</span>
                    <span className="rounded-md bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700">
                      Browse
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={profile.profileImage?.startsWith('data:') ? '' : (profile.profileImage ?? '')}
                  onChange={(e) => setProfile(prev => ({ ...prev, profileImage: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              )}
              {photoWarning ? (
                <p className="text-xs text-amber-600 dark:text-amber-400">{photoWarning}</p>
              ) : null}
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
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
          <input
            type="text"
            placeholder="Full Name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
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
              className="mt-1 inline-flex items-center gap-1 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-sm text-teal-600 hover:bg-gray-50 dark:border-gray-600 dark:text-mint dark:hover:bg-gray-700/50"
            >
              <Plus size={16} />
              Add role
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            The hero cycles through each line: types in, pauses, deletes, then shows the next.
          </p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
          <input
            type="email"
            placeholder="Email Address"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
          <input
            type="text"
            placeholder="Location"
            value={profile.location}
            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
          <textarea
            placeholder="Bio"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            rows={4}
          />
        </div>

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
          className="w-full rounded-lg bg-teal-600 px-4 py-2 font-medium text-white transition-all hover:bg-teal-700 active:scale-95 flex items-center justify-center gap-2"
        >
          <Save size={18} />
          Save Profile Changes
        </button>
      </div>
      </AdminEditModal>
    </>
  );
}
