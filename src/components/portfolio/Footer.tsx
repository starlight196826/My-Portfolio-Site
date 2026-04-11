"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { usePortfolioData } from "@/hooks/usePortfolioData";

export default function Footer() {
  const { data, isLoading } = usePortfolioData();
  const { profile } = data;
  const currentYear = new Date().getFullYear();
  const brand = profile.name?.trim() || "Portfolio";
  const title =
    (profile.heroRoles?.map((t) => String(t).trim()).filter(Boolean)[0] ??
      profile.title?.trim()) ||
    "";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
  ];

  const resourceLinks = [
    { label: "Blog", href: "#blog" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
  ];

  if (isLoading) {
    return (
      <footer className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950">
        <div className="section-container py-12 text-center text-sm text-gray-500 dark:text-gray-400">
          Loading…
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950">
      <div className="section-container">
        {/* Main Footer Content */}
        <div className="grid gap-8 py-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link href="/" className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              {profile.name ? profile.name.split(" ")[0] : brand}
            </Link>
            {title ? <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p> : null}
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Resources</h3>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Connect</h3>
            <div className="flex gap-3">
              {(profile.socialLinks ?? []).map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-blue-600 hover:text-white dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-blue-600"
                  aria-label={link.label}
                >
                  {link.icon === "Github" && "GH"}
                  {link.icon === "Linkedin" && "Li"}
                  {link.icon === "Twitter" && "Tw"}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-between border-t border-gray-200 py-8 dark:border-gray-700 sm:flex-row"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} {profile.name || brand}. All rights reserved.
          </p>

          <motion.button
            onClick={scrollToTop}
            className="mt-4 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:mt-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Back to top"
          >
            Back to top
            <ArrowUp size={16} />
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
}
