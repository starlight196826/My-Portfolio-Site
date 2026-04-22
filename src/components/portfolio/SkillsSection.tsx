"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import SectionLoading from "@/components/portfolio/SectionLoading";

export default function SkillsSection() {
  const { data, isLoading } = usePortfolioData();
  const { skills } = data;
  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          skills
            .map((s) => String(s.category ?? "").trim())
            .filter(Boolean)
        )
      ),
    [skills]
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);
  const scatterPositions = useMemo(() => {
    // Pre-defined irregular slots to keep a "random" look while preventing overlap.
    const slotPool = [
      { top: 12, left: 8, rotate: -8, scale: 0.95 },
      { top: 10, left: 24, rotate: 7, scale: 0.94 },
      { top: 12, left: 42, rotate: -6, scale: 0.96 },
      { top: 11, left: 60, rotate: 8, scale: 0.93 },
      { top: 12, left: 78, rotate: -7, scale: 0.94 },
      { top: 36, left: 12, rotate: 6, scale: 0.94 },
      { top: 38, left: 30, rotate: -7, scale: 0.95 },
      { top: 36, left: 48, rotate: 7, scale: 0.94 },
      { top: 38, left: 66, rotate: -8, scale: 0.95 },
      { top: 62, left: 8, rotate: -9, scale: 0.95 },
      { top: 64, left: 24, rotate: 8, scale: 0.93 },
      { top: 62, left: 42, rotate: -6, scale: 0.95 },
      { top: 64, left: 60, rotate: 7, scale: 0.94 },
      { top: 62, left: 78, rotate: -7, scale: 0.95 },
    ];
    const hash = (value: string) =>
      value.split("").reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 100000, 7);
    const ordered = categories
      .map((category) => ({ category, rank: hash(category) }))
      .sort((a, b) => a.rank - b.rank);
    const placement = new Map<string, { top: number; left: number; rotate: number; scale: number }>();
    for (let i = 0; i < ordered.length; i += 1) {
      placement.set(ordered[i].category, slotPool[i % slotPool.length]);
    }
    return categories.map((category, index) => {
      const slot = category === "Web Development & No-Code Builders"
        ? { top: 50, left: 50, rotate: -4, scale: 0.95 }
        : (placement.get(category) ?? slotPool[index % slotPool.length]);
      const h = hash(`${category}-${index}`);
      const delay = (h % 10) * 0.05;
      // Keep roaming motion but stay inside bounds.
      const x1 = 10 + (h % 14);
      const x2 = -12 - (Math.floor(h / 11) % 14);
      const x3 = 8 + (Math.floor(h / 19) % 12);
      const x4 = -8 - (Math.floor(h / 29) % 12);
      const y1 = -10 - (Math.floor(h / 7) % 12);
      const y2 = 10 + (Math.floor(h / 13) % 12);
      const y3 = -8 - (Math.floor(h / 23) % 10);
      const y4 = 8 + (Math.floor(h / 31) % 10);
      const xDuration = 11.5 + (h % 30) / 10;
      const yDuration = 10.8 + (Math.floor(h / 17) % 34) / 10;
      const rotateDuration = 3.8 + (Math.floor(h / 23) % 20) / 10;
      return {
        category,
        top: slot.top,
        left: slot.left,
        rotate: slot.rotate,
        scale: slot.scale,
        delay,
        x1,
        x2,
        x3,
        x4,
        y1,
        y2,
        y3,
        y4,
        xDuration,
        yDuration,
        rotateDuration,
      };
    });
  }, [categories]);

  useEffect(() => {
    if (!categories.length) {
      setSelectedCategory("");
      return;
    }
    if (!selectedCategory || !categories.includes(selectedCategory)) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  const selectedSkills = skills.filter((s) => s.category === selectedCategory);

  if (isLoading) {
    return (
      <section id="skills" className="bg-sky-50 py-16 dark:bg-transparent">
        <div className="section-container py-12 text-center">
          <SectionLoading label="Loading skills..." />
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="bg-sky-50 py-16 dark:bg-transparent">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="portfolio-section-title">Skills &amp; Expertise</h2>
          <div className="mx-auto h-1 w-16 bg-gradient-to-r from-teal-400 to-sky-500 dark:from-mint dark:to-pink-300"></div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.div
              key="skills-overview"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="overflow-hidden rounded-lg border border-sky-100 bg-gradient-to-br from-sky-50 to-teal-50 p-8 dark:border-navy-border dark:from-navy-muted/80 dark:to-navy-muted/40"
            >
              <p className="mb-8 text-center text-sm font-medium text-gray-600 dark:text-slate-portfolio">
                Choose a field to explore detailed skills
              </p>
              <div className="relative hidden min-h-[560px] overflow-hidden sm:block">
                {scatterPositions.map(({ category, top, left, rotate, scale, delay, x1, x2, x3, x4, y1, y2, y3, y4, xDuration, yDuration, rotateDuration }) => (
                  <motion.button
                    key={category}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsExpanded(true);
                    }}
                    initial={{ opacity: 0, scale: 0.82 }}
                    animate={{
                      opacity: 1,
                      scale,
                      x: [0, x1, x2, x3, x4, 0],
                      y: [0, y1, y2, y3, y4, 0],
                      rotate,
                    }}
                    transition={{
                      opacity: { duration: 0.25, delay },
                      scale: { duration: 0.25, delay },
                      x: {
                        duration: xDuration,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                        delay,
                      },
                      y: {
                        duration: yDuration,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                        delay: delay + 0.2,
                      },
                      rotate: {
                        duration: rotateDuration,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                        delay,
                      },
                    }}
                    style={{ top: `${top}%`, left: `${left}%` }}
                    className="group absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-teal-300/70 bg-white/95 p-4 text-center shadow-sm transition hover:-translate-y-[54%] hover:border-teal-400 hover:shadow-md dark:border-mint/40 dark:bg-navy"
                  >
                    <span className="inline-flex h-36 w-36 items-center justify-center rounded-full border border-dashed border-teal-200 px-4 text-center text-base font-semibold leading-tight text-gray-900 whitespace-normal break-words dark:border-mint/30 dark:text-slate-heading">
                      {category}
                    </span>
                  </motion.button>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 sm:hidden">
                {categories.map((category, index) => (
                    <motion.button
                      key={category}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsExpanded(true);
                      }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1, y: [0, -4, 0] }}
                      transition={{
                        opacity: { duration: 0.25, delay: index * 0.03 },
                        scale: { duration: 0.25, delay: index * 0.03 },
                        y: {
                          duration: 2.8,
                          repeat: Infinity,
                          repeatType: "loop",
                          ease: "easeInOut",
                          delay: index * 0.08,
                        },
                      }}
                      className="group relative flex h-40 w-40 items-center justify-center rounded-full border border-teal-300/70 bg-white/95 p-4 text-center shadow-sm transition hover:-translate-y-1 hover:border-teal-400 hover:shadow-md dark:border-mint/40 dark:bg-navy"
                    >
                      <span className="text-center text-base font-semibold leading-tight text-gray-900 whitespace-normal break-words dark:text-slate-heading">
                        {category}
                      </span>
                    </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="skills-details"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="rounded-lg border border-sky-100 bg-gradient-to-br from-sky-50 to-teal-50 p-8 dark:border-navy-border dark:from-navy-muted/80 dark:to-navy-muted/40"
            >
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-poppins text-2xl font-bold text-gray-900 dark:text-slate-heading">
                  {selectedCategory || "Skills"}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-sky-100 dark:border-navy-border dark:bg-navy dark:text-slate-portfolio dark:hover:border-mint/50 dark:hover:bg-navy-muted"
                >
                  Back to fields
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {selectedSkills.map((skill) => (
                  <motion.button
                    key={skill.id}
                    type="button"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-full border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-400 hover:bg-teal-50 hover:shadow dark:border-mint/30 dark:bg-navy dark:text-slate-heading dark:hover:border-mint dark:hover:bg-navy-muted"
                    aria-label={`${skill.name} proficiency ${skill.proficiency}%`}
                  >
                    {skill.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
