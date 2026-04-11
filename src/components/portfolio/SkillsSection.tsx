"use client";

import { motion } from "framer-motion";
import { usePortfolioData } from "@/hooks/usePortfolioData";

const categories = ["Frontend", "Backend", "Tools"] as const;

export default function SkillsSection() {
  const { data, isLoading } = usePortfolioData();
  const { skills } = data;

  if (isLoading) {
    return (
      <section id="skills" className="bg-white py-16 dark:bg-gray-900">
        <div className="section-container py-12 text-center text-gray-500 dark:text-gray-400">Loading…</div>
      </section>
    );
  }

  return (
    <section id="skills" className="bg-white py-16 dark:bg-gray-900">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Skills & Expertise
          </h2>
          <div className="mx-auto h-1 w-16 bg-gradient-to-r from-blue-400 to-purple-500"></div>
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
                className="rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 p-8 dark:from-blue-900/20 dark:to-purple-900/20"
              >
                <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                  {category}
                </h3>

                <div className="space-y-6">
                  {categorySkills.map((skill) => (
                    <div key={skill.id}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {skill.name}
                        </span>
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {skill.proficiency}%
                        </span>
                      </div>
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        viewport={{ once: true }}
                        style={{ originX: 0 }}
                        className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
                      >
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
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
