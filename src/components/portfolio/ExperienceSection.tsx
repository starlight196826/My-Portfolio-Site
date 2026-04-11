"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { usePortfolioData } from "@/hooks/usePortfolioData";

export default function ExperienceSection() {
  const { data, isLoading } = usePortfolioData();
  const { workExperiences } = data;

  if (isLoading) {
    return (
      <section id="experience" className="bg-gray-50 py-16 dark:bg-gray-950">
        <div className="section-container py-12 text-center text-gray-500 dark:text-gray-400">Loading…</div>
      </section>
    );
  }

  return (
    <section id="experience" className="bg-gray-50 py-16 dark:bg-gray-950">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Work Experience
          </h2>
          <div className="mx-auto h-1 w-16 bg-gradient-to-r from-blue-400 to-purple-500"></div>
        </motion.div>

        <div className="space-y-8">
          {workExperiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className={`grid gap-8 lg:grid-cols-2 ${index % 2 === 1 ? "lg:direction-rtl" : ""}`}
            >
              {/* Content */}
              <div className={index % 2 === 1 ? "order-2 lg:order-1" : ""}>
                <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-900">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {experience.role}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400">{experience.company}</p>
                    </div>
                    {experience.current && (
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar size={16} />
                    <span>
                      {experience.startDate} - {experience.endDate || "Present"}
                    </span>
                  </div>

                  <p className="mb-4 text-gray-700 dark:text-gray-300">{experience.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {experience.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Timeline dot */}
              <div className={`flex justify-center ${index % 2 === 1 ? "order-1 lg:order-2" : ""}`}>
                <div className="flex flex-col items-center">
                  <div className="h-4 w-4 rounded-full bg-blue-600"></div>
                  {index < workExperiences.length - 1 && (
                    <div className="h-16 w-1 bg-gradient-to-b from-blue-600 to-transparent"></div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
