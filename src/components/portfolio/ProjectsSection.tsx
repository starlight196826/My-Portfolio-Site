"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ExternalLink, X, Star } from "lucide-react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import SectionLoading from "@/components/portfolio/SectionLoading";

export default function ProjectsSection() {
  const { data, isLoading } = usePortfolioData();
  const { projects } = data;
  const featuredProjects = projects.filter((p) => p.featured);
  const categories = Array.from(new Set(projects.map((p) => p.category))).sort();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const filteredProjects =
    selectedCategory === "All"
      ? featuredProjects
      : projects.filter((p) => p.category === selectedCategory);
  const selectedProject = projects.find((p) => p.id === selectedProjectId) ?? null;
  const getProjectImages = (project: { image?: string; images?: string[] }) => {
    const fromArray = Array.isArray(project.images)
      ? project.images.map((url) => String(url).trim()).filter(Boolean)
      : [];
    const primary = String(project.image ?? '').trim();
    if (fromArray.length > 0) return fromArray;
    return primary ? [primary] : [];
  };

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [selectedProjectId]);

  if (isLoading) {
    return (
      <section id="projects" className="bg-sky-50 py-16 dark:bg-transparent">
        <div className="section-container py-12 text-center">
          <SectionLoading />
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="bg-sky-50 py-16 dark:bg-transparent">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="portfolio-section-title">Featured Projects</h2>
          <div className="mx-auto h-1 w-16 bg-gradient-to-r from-teal-400 to-sky-500 dark:from-mint dark:to-pink-300"></div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-wrap justify-center gap-3"
        >
          {["All", ...categories].map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-6 py-2 font-medium transition-all ${
                selectedCategory === category
                  ? "bg-teal-500 text-white dark:bg-gradient-to-r dark:from-mint dark:to-mint-dark dark:text-navy"
                  : "border border-sky-100 bg-sky-50 text-gray-700 hover:bg-sky-100 dark:border dark:border-navy-border dark:bg-navy-muted dark:text-slate-portfolio dark:hover:border-mint/50"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border border-sky-100 bg-sky-50/80 shadow-md transition-shadow hover:shadow-xl dark:border-navy-border dark:bg-navy-muted"
                onClick={() => setSelectedProjectId(project.id)}
              >
                {(() => {
                  const projectImages = getProjectImages(project);
                  const coverImage = projectImages[0] ?? "";
                  return (
                <>
                {/* Image Container */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-200 dark:bg-navy">
                  {coverImage ? (
                    <Image
                      src={coverImage}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : null}
                  {project.featured && (
                    <div className="absolute right-3 top-3 rounded-full bg-teal-500 px-3 py-1 text-xs font-semibold text-white dark:bg-mint dark:text-navy">
                      Featured
                    </div>
                  )}
                  {projectImages.length > 1 ? (
                    <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2 py-1 text-xs font-semibold text-white">
                      {projectImages.length} images
                    </div>
                  ) : null}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="mb-2 line-clamp-2 min-h-[3.5rem] text-lg font-bold text-gray-900 dark:text-slate-heading">
                    {project.title}
                  </h3>
                  <button
                    type="button"
                    className="mb-3 inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-gray-700 shadow-sm backdrop-blur-sm dark:bg-navy/60 dark:text-slate-portfolio"
                    aria-label="Project review score"
                  >
                    <Star size={15} className="fill-yellow-400 text-yellow-400" />
                    <span>{Number(project.rating ?? 3.3).toFixed(1)} / 5.0</span>
                  </button>
                  <p className="mb-4 text-sm text-gray-600 dark:text-slate-portfolio">{project.excerpt}</p>

                  {/* Tags */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-teal-100 px-2 py-1 text-xs font-medium text-teal-700 dark:bg-mint/10 dark:text-mint"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="mt-auto flex gap-3">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-600 dark:bg-gradient-to-r dark:from-mint dark:to-mint-dark dark:text-navy dark:hover:opacity-90"
                    >
                      <ExternalLink size={16} />
                      Live Demo
                    </a>
                  </div>
                </div>
                </>
                  );
                })()}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {selectedProject ? (
            (() => {
              const projectImages = getProjectImages(selectedProject);
              const coverImage = projectImages[selectedImageIndex] ?? projectImages[0] ?? "";
              return (
            <motion.div
              className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProjectId(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 10 }}
                transition={{ duration: 0.2 }}
                className="relative max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-sky-100 bg-sky-50 shadow-2xl dark:border-navy-border dark:bg-navy-muted"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setSelectedProjectId(null)}
                  className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white transition hover:bg-black/75"
                  aria-label="Close project details"
                >
                  <X size={18} />
                </button>

                <div className="relative h-[40vh] min-h-[320px] w-full bg-gray-100 dark:bg-navy sm:h-[48vh] sm:min-h-[380px]">
                  <AnimatePresence mode="wait" initial={false}>
                    {coverImage ? (
                      <motion.div
                        key={`${selectedProject.id}-${selectedImageIndex}-${coverImage}`}
                        initial={{ opacity: 0, x: 24, scale: 1.02 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -24, scale: 0.99 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={coverImage}
                          alt={selectedProject.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 1024px"
                          className="object-cover"
                        />
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                  {projectImages.length > 1 ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedImageIndex((prev) =>
                            prev >= projectImages.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-2 text-sm font-bold text-white hover:bg-black/75"
                        aria-label="Next image"
                      >
                        ›
                      </button>
                    </>
                  ) : null}
                </div>

                <div className="max-h-[calc(92vh-24rem)] overflow-y-auto p-6 sm:max-h-[calc(92vh-28rem)]">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-mint/10 dark:text-mint">
                      {selectedProject.category}
                    </span>
                    {selectedProject.featured ? (
                      <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                        Featured
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-slate-heading">
                    {selectedProject.title}
                  </h3>
                  <button
                    type="button"
                    className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-gray-700 shadow-sm backdrop-blur-sm dark:bg-navy/60 dark:text-slate-portfolio"
                    aria-label="Project review score"
                  >
                    <Star size={15} className="fill-yellow-400 text-yellow-400" />
                    <span>{Number(selectedProject.rating ?? 3.3).toFixed(1)} / 5.0</span>
                  </button>
                  <p className="mb-5 text-gray-700 dark:text-slate-portfolio">{selectedProject.description}</p>

                  <div className="mb-6 flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-navy dark:text-slate-portfolio"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-600 dark:bg-gradient-to-r dark:from-mint dark:to-mint-dark dark:text-navy"
                    >
                      <ExternalLink size={16} />
                      Live Preview
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
              );
            })()
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
