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
  const [displayedText, setDisplayedText] = useState("");
  const prefersReducedMotion = useReducedMotion();
  const { data, isLoading } = usePortfolioData();
  const { profile } = data;

  const roles = useMemo(() => {
    const fromList = profile.heroRoles?.map((t) => String(t).trim()).filter(Boolean) ?? [];
    if (fromList.length) return fromList;
    if (profile.title?.trim()) return [profile.title.trim()];
    return [];
  }, [profile.heroRoles, profile.title]);

  const rolesKey = useMemo(() => JSON.stringify(roles), [roles]);

  useEffect(() => {
    if (roles.length === 0) {
      setDisplayedText("");
      return;
    }

    let cancelled = false;

    const loop = async () => {
      let i = 0;
      while (!cancelled) {
        const text = roles[i % roles.length];
        for (let c = 0; c <= text.length && !cancelled; c++) {
          setDisplayedText(text.slice(0, c));
          await sleep(45);
        }
        if (cancelled) break;
        await sleep(2200);
        for (let c = text.length; c >= 0 && !cancelled; c--) {
          setDisplayedText(text.slice(0, c));
          await sleep(22);
        }
        if (cancelled) break;
        await sleep(450);
        i += 1;
      }
    };

    loop();
    return () => {
      cancelled = true;
    };
  }, [rolesKey, roles.length]);

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
        className="relative flex min-h-[70vh] items-center justify-center bg-gradient-to-b from-gray-50 to-white pt-16 dark:from-gray-950 dark:to-gray-900"
      >
        <p className="text-gray-500 dark:text-gray-400">Loading…</p>
      </section>
    );
  }

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-white pt-16 dark:from-gray-950 dark:to-gray-900"
    >
      <div className="gradient-orb absolute left-10 top-20 h-72 w-72 bg-blue-200 opacity-20 dark:bg-blue-900/20" />
      <div className="gradient-orb absolute right-10 bottom-40 h-80 w-80 bg-purple-200 opacity-20 dark:bg-purple-900/20" />

      <div className="section-container relative z-10 flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center gap-12 lg:flex-row lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl lg:text-6xl"
          >
            {profile.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6 min-h-[3.5rem] sm:min-h-[4rem]"
          >
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 sm:text-2xl">
              {displayedText}
              {roles.length > 0 ? <span className="animate-pulse">_</span> : null}
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-8 max-w-xl text-lg text-gray-600 dark:text-gray-400"
          >
            {profile.bio}
          </motion.p>

          <motion.div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
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
                className="rounded-lg bg-white px-4 py-3 shadow-md dark:bg-gray-800"
              >
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stat.value}+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mb-8 flex flex-col gap-4 sm:flex-row"
          >
            <a href="#projects" className="btn-primary">
              View My Work
              <ExternalLink size={18} className="ml-2" />
            </a>
            <button type="button" onClick={scrollToContact} className="btn-secondary">
              Get In Touch
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
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-all hover:bg-blue-600 hover:text-white dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-blue-600"
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
          className="flex flex-1 items-center justify-center"
        >
          <motion.div
            className="relative [contain:layout]"
            animate={prefersReducedMotion ? { y: 0 } : { y: [0, -10, 0] }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    duration: 6,
                    repeat: Infinity,
                    ease: [0.45, 0.05, 0.55, 0.95],
                  }
            }
          >
            {/* Opacity-only pulse — scaling this blur read as the whole portrait "growing" */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 blur-2xl"
              animate={
                prefersReducedMotion
                  ? { opacity: 0.22 }
                  : { opacity: [0.16, 0.28, 0.16] }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 7.5, repeat: Infinity, ease: "easeInOut" }
              }
            />
            <div className="relative rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-1.5 shadow-[0_25px_50px_-12px_rgba(59,130,246,0.35)] ring-1 ring-white/20 transition-[filter] duration-300 hover:brightness-105 dark:shadow-[0_25px_50px_-12px_rgba(99,102,241,0.25)] dark:ring-white/10 dark:hover:brightness-110">
              <div className="overflow-hidden rounded-full">
                {profile.profileImage?.startsWith("data:") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.profileImage}
                    alt={profile.name}
                    width={380}
                    height={380}
                    className="h-[380px] w-[380px] max-w-[min(380px,100vw-2rem)] rounded-full object-cover"
                  />
                ) : profile.profileImage ? (
                  <Image
                    src={profile.profileImage}
                    alt={profile.name || "Profile"}
                    width={380}
                    height={380}
                    className="h-[380px] w-[380px] max-w-[min(380px,100vw-2rem)] rounded-full object-cover"
                    priority
                  />
                ) : (
                  <div
                    className="flex h-[380px] w-[380px] max-w-[min(380px,100vw-2rem)] items-center justify-center rounded-full bg-gray-200 text-sm text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                    aria-hidden
                  >
                    Photo
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ArrowDown size={24} className="text-gray-600 dark:text-gray-400" />
      </motion.div>
    </section>
  );
}
