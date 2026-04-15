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
      <footer className="border-t border-sky-100 bg-sky-50 dark:border-navy-border dark:bg-navy">
        <div className="section-container py-12 text-center text-sm text-gray-500 dark:text-slate-portfolio">
          Loading…
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-sky-100 bg-sky-50 dark:border-navy-border dark:bg-navy">
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
            <Link href="/" className="mb-4 font-poppins text-xl font-bold text-gray-900 dark:text-mint">
              {profile.name ? profile.name.split(" ")[0] : brand}
            </Link>
            {title ? <p className="text-sm text-gray-600 dark:text-slate-portfolio">{title}</p> : null}
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-slate-heading">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 dark:text-slate-portfolio dark:hover:text-mint"
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
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-slate-heading">Resources</h3>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 dark:text-slate-portfolio dark:hover:text-mint"
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
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-slate-heading">Connect</h3>
            <div className="flex gap-3">
              {(profile.socialLinks ?? []).map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-gray-700 transition-colors hover:bg-teal-500 hover:text-white dark:bg-navy-muted dark:text-slate-portfolio dark:hover:bg-mint dark:hover:text-navy"
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
          className="flex flex-col items-center justify-between border-t border-sky-100 py-8 dark:border-navy-border sm:flex-row"
        >
          <p className="text-sm text-gray-600 dark:text-slate-portfolio">
            © {currentYear} {profile.name || brand}. All rights reserved.
          </p>

          <motion.button
            onClick={scrollToTop}
            className="mt-4 flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-600 sm:mt-0 dark:bg-gradient-to-r dark:from-mint dark:to-mint-dark dark:text-navy dark:hover:opacity-90"
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
