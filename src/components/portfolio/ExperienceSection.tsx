"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import SectionLoading from "@/components/portfolio/SectionLoading";

export default function ExperienceSection() {
  const { data, isLoading } = usePortfolioData();
  const { workExperiences } = data;

  if (isLoading) {
    return (
      <section id="experience" className="bg-sky-50 py-16 dark:bg-transparent">
        <div className="section-container py-12 text-center">
          <SectionLoading />
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="bg-sky-50 py-16 dark:bg-transparent">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="portfolio-section-title">Work Experience</h2>
          <div className="mx-auto h-1 w-16 bg-gradient-to-r from-teal-400 to-sky-500 dark:from-mint dark:to-pink-300"></div>
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
                <div className="rounded-lg border border-sky-100 bg-sky-50/80 p-6 shadow-md dark:border-navy-border dark:bg-navy-muted">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-slate-heading">
                        {experience.role}
                      </h3>
                      <p className="text-teal-600 dark:text-mint">{experience.company}</p>
                    </div>
                    {experience.current && (
                      <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-mint/15 dark:text-mint">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-slate-portfolio">
                    <Calendar size={16} />
                    <span>
                      {experience.startDate} - {experience.endDate || "Present"}
                    </span>
                  </div>

                  <p className="mb-4 text-gray-700 dark:text-slate-portfolio">{experience.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {experience.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-700 dark:bg-mint/10 dark:text-mint"
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
                  <div className="h-4 w-4 rounded-full bg-teal-600 dark:bg-mint"></div>
                  {index < workExperiences.length - 1 && (
                    <div className="h-16 w-1 bg-gradient-to-b from-teal-600 to-transparent dark:from-mint"></div>
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
