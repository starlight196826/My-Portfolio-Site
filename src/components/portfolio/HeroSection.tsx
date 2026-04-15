"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Code2, Share2, ArrowDown, ExternalLink } from "lucide-react";
import { usePortfolioData } from "@/hooks/usePortfolioData";

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const { data, isLoading } = usePortfolioData();
  const { profile } = data;

  const roles = useMemo(() => {
    const fromList = profile.heroRoles?.map((t) => String(t).trim()).filter(Boolean) ?? [];
    if (fromList.length) return fromList;
    if (profile.title?.trim()) return [profile.title.trim()];
    return [] as string[];
  }, [profile.heroRoles, profile.title]);

  const rolesKey = useMemo(() => JSON.stringify(roles), [roles]);
  const [typedRoleText, setTypedRoleText] = useState("");

  useEffect(() => {
    if (roles.length === 0) {
      setTypedRoleText("");
      return;
    }

    if (prefersReducedMotion) {
      setTypedRoleText(roles[0]);
      return;
    }

    let cancelled = false;

    const loop = async () => {
      let i = 0;
      while (!cancelled) {
        const text = roles[i % roles.length];
        for (let c = 0; c <= text.length && !cancelled; c++) {
          setTypedRoleText(text.slice(0, c));
          await sleep(42);
        }
        if (cancelled) break;
        await sleep(2000);
        for (let c = text.length; c >= 0 && !cancelled; c--) {
          setTypedRoleText(text.slice(0, c));
          await sleep(18);
        }
        if (cancelled) break;
        await sleep(380);
        i += 1;
      }
    };

    void loop();
    return () => {
      cancelled = true;
    };
  }, [rolesKey, prefersReducedMotion]);

  const scrollToContact = () => {
    const contact = document.getElementById("contact");
    if (contact) {
      contact.scrollIntoView({ behavior: "smooth" });
    }
  };

  const iconVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.5 + i * 0.1, duration: 0.5 },
    }),
  };

  const statVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: 0.7 + i * 0.1, duration: 0.5 },
    }),
  };

  if (isLoading) {
    return (
      <section
        id="home"
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-sky-50 to-sky-100 pt-16 dark:bg-transparent"
      >
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-navy via-navy-muted to-navy opacity-0 dark:opacity-100" />
        <div className="pointer-events-none absolute inset-0 z-0 opacity-0 bg-grid-dots bg-[length:60px_60px] dark:opacity-[0.05]" />
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-0 dark:opacity-50"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 50% -20%, #1A2942 0%, #0A192F 55%, #0A192F 100%)",
          }}
        />
        <p className="relative z-10 text-gray-500 dark:text-slate-portfolio">Loading…</p>
      </section>
    );
  }

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-50 to-sky-100 pt-16 dark:bg-transparent"
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-navy via-navy-muted to-navy opacity-0 dark:opacity-100" />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-0 dark:opacity-[0.05] bg-grid-dots bg-[length:60px_60px] dark:block" />

      <div className="gradient-orb absolute left-10 top-20 h-72 w-72 bg-teal-200 opacity-20 dark:bg-mint/15" />
      <div className="gradient-orb absolute right-10 bottom-40 h-80 w-80 bg-purple-200 opacity-20 dark:bg-sky-500/10" />

      <div className="section-container relative z-10 flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center gap-12 lg:flex-row lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left"
        >
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 flex items-center justify-center gap-3 font-mono text-lg tracking-wider text-teal-600 lg:justify-start dark:text-mint"
          >
            <span className="inline-block" aria-hidden>
              👋
            </span>
            <span>Hi, I&apos;m</span>
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 font-poppins text-4xl font-bold leading-tight text-gray-900 dark:text-slate-heading sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {profile.name}
          </motion.h1>

          {roles.length > 0 ? (
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="mb-6 min-h-[2.25rem] font-poppins text-xl font-bold leading-relaxed sm:min-h-[2.75rem] sm:text-2xl md:min-h-[3rem] md:text-3xl lg:min-h-[3.25rem] lg:text-4xl"
            >
              <span className="inline-flex items-baseline gap-1">
                <span className="bg-gradient-to-r from-mint via-sky-400 to-pink-300 bg-clip-text text-transparent">
                  {typedRoleText}
                </span>
                {!prefersReducedMotion ? (
                  <span className="animate-pulse font-normal text-mint" aria-hidden>
                    |
                  </span>
                ) : null}
              </span>
            </motion.h2>
          ) : null}

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="mb-8 max-w-2xl text-lg font-light text-gray-600 dark:text-slate-portfolio md:text-xl"
          >
            {profile.bio}
          </motion.p>

          <motion.div className="mb-8 grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-4 lg:max-w-none lg:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Years Exp", value: profile.yearsOfExperience },
              { label: "Projects", value: profile.projectsCompleted },
              { label: "Companies", value: profile.companiesWorked },
              { label: "Technologies", value: profile.technologiesLearned },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                variants={statVariants}
                initial="hidden"
                animate="visible"
                className="rounded-lg border border-sky-100 bg-sky-50/80 px-4 py-3 shadow-md dark:border-navy-border dark:bg-navy-muted"
              >
                <div className="text-2xl font-bold text-teal-600 dark:text-mint">{stat.value}+</div>
                <div className="text-sm text-gray-600 dark:text-slate-portfolio">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mb-8 flex flex-col gap-4 sm:flex-row"
          >
            <a href="#projects" className="btn-primary">
              View My Work
              <ExternalLink size={18} className="ml-2" />
            </a>
            <button type="button" onClick={scrollToContact} className="btn-secondary">
              Contact Me
            </button>
          </motion.div>

          <motion.div className="flex gap-4">
            {(profile.socialLinks ?? []).map((link, i) => (
              <motion.a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                custom={i}
                variants={iconVariants}
                initial="hidden"
                animate="visible"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-gray-700 transition-all hover:bg-mint hover:text-navy dark:bg-navy-muted dark:text-slate-portfolio dark:hover:bg-mint dark:hover:text-navy"
                aria-label={link.label}
              >
                {(link.icon === "Github" || link.icon === "Linkedin") && <Code2 size={24} />}
                {link.icon === "Twitter" && <Share2 size={24} />}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-1 items-center justify-center px-2"
        >
          {/* Reference [my-portfolio-psi-one-97.vercel.app]: square card, overlays, filters — not a circular frame */}
          <motion.div
            initial={
              prefersReducedMotion
                ? { opacity: 1, y: 0, scale: 1, rotate: 0 }
                : { opacity: 0, y: 50, scale: 0.8, rotate: -10 }
            }
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="group relative w-full max-w-md [perspective:1000px]"
          >
            <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-2xl shadow-2xl">
              <div
                className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle at 0% 0%, rgba(100, 255, 218, 0.15) 0%, rgba(100, 255, 218, 0.05) 25%, rgba(10, 25, 47, 0) 50%)",
                }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-br from-mint/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden
              />
              {profile.profileImage?.startsWith("data:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  className="absolute inset-0 h-full w-full rounded-2xl object-cover transition-all duration-700 scale-[1.01] saturate-[0.85] contrast-[1.1] group-hover:scale-110 group-hover:saturate-[1.15] group-hover:contrast-[1.15] group-hover:brightness-110"
                />
              ) : profile.profileImage ? (
                <Image
                  src={profile.profileImage}
                  alt={profile.name || "Profile"}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="rounded-2xl object-cover transition-all duration-700 scale-[1.01] saturate-[0.85] contrast-[1.1] group-hover:scale-110 group-hover:saturate-[1.15] group-hover:contrast-[1.15] group-hover:brightness-110"
                />
              ) : (
                <div
                  className="flex aspect-square w-full items-center justify-center rounded-2xl bg-navy-muted text-sm text-slate-portfolio"
                  aria-hidden
                >
                  Photo
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-mono text-sm text-mint">Scroll Down</span>
        <ArrowDown size={24} className="text-mint" />
      </motion.div>
    </section>
  );
}
