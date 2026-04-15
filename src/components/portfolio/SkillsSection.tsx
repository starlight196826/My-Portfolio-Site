"use client";

import { motion } from "framer-motion";
import { usePortfolioData } from "@/hooks/usePortfolioData";

const categories = ["Frontend", "Backend", "Tools"] as const;

export default function SkillsSection() {
  const { data, isLoading } = usePortfolioData();
  const { skills } = data;

  if (isLoading) {
    return (
      <section id="skills" className="bg-sky-50 py-16 dark:bg-transparent">
        <div className="section-container py-12 text-center text-gray-500 dark:text-slate-portfolio">Loading…</div>
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

        <div className="grid gap-8 lg:grid-cols-3">
          {categories.map((category) => {
            const categorySkills = skills.filter((s) => s.category === category);

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="rounded-lg border border-sky-100 bg-gradient-to-br from-sky-50 to-teal-50 p-8 dark:border-navy-border dark:from-navy-muted/80 dark:to-navy-muted/40"
              >
                <h3 className="mb-6 font-poppins text-2xl font-bold text-gray-900 dark:text-slate-heading">
                  {category}
                </h3>

                <div className="space-y-6">
                  {categorySkills.map((skill) => (
                    <div key={skill.id}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-slate-heading">
                          {skill.name}
                        </span>
                        <span className="text-sm font-semibold text-teal-600 dark:text-mint">
                          {skill.proficiency}%
                        </span>
                      </div>
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        viewport={{ once: true }}
                        style={{ originX: 0 }}
                        className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-navy-border"
                      >
                        <div
                          className="h-full bg-gradient-to-r from-teal-500 to-sky-500 dark:from-mint dark:to-mint-dark"
                          style={{ width: `${skill.proficiency}%` }}
                        ></div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
