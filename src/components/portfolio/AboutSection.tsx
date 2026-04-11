"use client";

import { motion } from "framer-motion";
import { MapPin, Mail, Download } from "lucide-react";
import { usePortfolioData } from "@/hooks/usePortfolioData";

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
      <section id="about" className="bg-white py-16 dark:bg-gray-900">
        <div className="section-container py-12 text-center text-gray-500 dark:text-gray-400">Loading…</div>
      </section>
    );
  }

  return (
    <section id="about" className="bg-white py-16 dark:bg-gray-900">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            About Me
          </h2>
          <div className="mx-auto h-1 w-16 bg-gradient-to-r from-blue-400 to-purple-500"></div>
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
              <p className="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                {profile.bio}
              </p>
            ) : null}

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-blue-600 dark:text-blue-400" />
                <span className="text-gray-700 dark:text-gray-300">{profile.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-blue-600 dark:text-blue-400" />
                <a
                  href={profile.email ? `mailto:${profile.email}` : "#about"}
                  className="text-blue-600 hover:underline dark:text-blue-400"
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
                className="rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 p-6 dark:from-blue-900/20 dark:to-purple-900/20"
              >
                <div className="mb-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {stat.value}+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
