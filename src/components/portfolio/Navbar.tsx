"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Moon, Sun, Download } from "lucide-react";
import { useTheme } from "next-themes";
import { usePortfolioData } from "@/hooks/usePortfolioData";

const navigationLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#blog", label: "Blog" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data } = usePortfolioData();
  const profile = data.profile;
  const brand = profile.name?.trim() || "Portfolio";
  const resumeUrl = profile.resumeUrl?.trim();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = navigationLinks.map((link) => link.href.substring(1));
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.getElementById(href.substring(1));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const linkClass = (id: string) =>
    `relative py-2 text-sm font-medium transition-colors ${
      activeSection === id
        ? "text-teal-600 dark:text-mint"
        : "text-gray-700 hover:text-gray-900 dark:text-slate-portfolio dark:hover:text-mint"
    }`;

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-sky-100 bg-sky-50/85 shadow-sm backdrop-blur-md dark:border-navy-border/50 dark:bg-navy/80"
          : "bg-transparent"
      }`}
    >
      <div className="section-container flex min-h-[2.75rem] items-center justify-between py-2 sm:min-h-[3rem] sm:py-2.5">
        <Link
          href="/"
          className="group relative flex items-center gap-2 font-poppins text-xl font-bold tracking-tight text-gray-900 dark:text-mint"
        >
          <Image
            src="/logo.png"
            alt={`${brand} logo`}
            width={26}
            height={26}
            className="h-6 w-6 sm:h-7 sm:w-7 [filter:hue-rotate(-10deg)_saturate(1.35)_contrast(1.15)_brightness(1.04)] dark:[filter:hue-rotate(18deg)_saturate(1.45)_contrast(1.12)_brightness(1.1)]"
            priority
          />
          <span className="relative z-10">{brand}</span>
          <span className="absolute -bottom-1 left-0 right-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-mint to-slate-heading transition-transform duration-300 group-hover:scale-x-100" />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navigationLinks.map((link) => {
            const id = link.href.substring(1);
            return (
              <div key={link.href} className="relative px-3">
                <a
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`group ${linkClass(id)}`}
                >
                  <span className="relative z-10">{link.label}</span>
                  <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-mint transition-transform duration-300 group-hover:scale-x-100 dark:bg-mint" />
                </a>
              </div>
            );
          })}
          {resumeUrl ? (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-mint to-mint-dark px-5 py-2.5 text-sm font-bold text-navy transition-transform hover:scale-105 hover:shadow-lg hover:shadow-mint/20"
            >
              <Download className="h-4 w-4" />
              Resume
            </a>
          ) : null}
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          {mounted && (
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-md p-1.5 text-gray-700 hover:bg-sky-100 dark:text-slate-portfolio dark:hover:bg-navy-muted"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-md p-1.5 text-gray-700 hover:bg-sky-100 md:hidden dark:text-mint dark:hover:bg-navy-muted"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-sky-100 bg-sky-50 dark:border-navy-border dark:bg-navy md:hidden">
          <div className="space-y-0.5 px-4 py-3">
            {navigationLinks.map((link) => {
              const id = link.href.substring(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`block rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                    activeSection === id
                      ? "bg-teal-50 text-teal-700 dark:bg-navy-muted dark:text-mint"
                      : "text-gray-700 hover:bg-sky-100 dark:text-slate-portfolio dark:hover:bg-navy-muted"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
            {resumeUrl ? (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-mint to-mint-dark px-4 py-3 text-sm font-bold text-navy"
              >
                <Download className="h-4 w-4" />
                Resume
              </a>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
}
