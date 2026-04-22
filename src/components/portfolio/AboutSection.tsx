"use client";

import { motion } from "framer-motion";
import { MapPin, Mail, Download } from "lucide-react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import SectionLoading from "@/components/portfolio/SectionLoading";

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function AboutSection() {
  const { data, isLoading } = usePortfolioData();
  const { profile } = data;

  if (isLoading) {
    return (
      <section id="about" className="bg-sky-50 py-16 dark:bg-transparent">
        <div className="section-container py-12 text-center">
          <SectionLoading />
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="bg-sky-50 py-16 dark:bg-transparent">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="portfolio-section-title text-center sm:text-left">About Me</h2>
          <div className="mx-auto h-1 w-16 bg-gradient-to-r from-teal-400 to-sky-500 dark:from-mint dark:to-pink-300 sm:mx-0"></div>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Bio Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {profile.bio ? (
              <p className="mb-6 text-lg leading-relaxed text-gray-600 dark:text-slate-portfolio">
                {profile.bio}
              </p>
            ) : null}

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-teal-600 dark:text-mint" />
                <span className="text-gray-700 dark:text-slate-heading">{profile.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-teal-600 dark:text-mint" />
                <a
                  href={profile.email ? `mailto:${profile.email}` : "#about"}
                  className="text-teal-600 hover:underline dark:text-mint"
                >
                  {profile.email || "—"}
                </a>
              </div>
            </div>

            {/* Resume Button */}
            <motion.button
              onClick={() => {
                if (!profile.resumeUrl) return;
                const link = document.createElement("a");
                link.href = profile.resumeUrl;
                link.download = "resume.pdf";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="btn-primary mt-8"
              disabled={!profile.resumeUrl}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download size={18} className="mr-2" />
              Download Resume
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6"
          >
            {[
              { label: "Years of Experience", value: profile.yearsOfExperience },
              { label: "Projects Completed", value: profile.projectsCompleted },
              { label: "Companies Worked", value: profile.companiesWorked },
              { label: "Technologies Learned", value: profile.technologiesLearned },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                variants={statVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="rounded-lg border border-sky-100 bg-gradient-to-br from-sky-50 to-teal-50 p-6 dark:border-navy-border dark:from-navy-muted/80 dark:to-navy-muted/40"
              >
                <div className="mb-2 text-3xl font-bold text-teal-600 dark:text-mint">
                  {stat.value}+
                </div>
                <div className="text-sm text-gray-600 dark:text-slate-portfolio">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
