"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import Navbar from "@/components/portfolio/Navbar";
import HeroSection from "@/components/portfolio/HeroSection";
import AboutSection from "@/components/portfolio/AboutSection";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import SkillsSection from "@/components/portfolio/SkillsSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import TestimonialsSection from "@/components/portfolio/TestimonialsSection";
import ContactSection from "@/components/portfolio/ContactSection";
import Footer from "@/components/portfolio/Footer";
import { usePortfolioData } from "@/hooks/usePortfolioData";

type LoaderPhase = "loading" | "outro" | "hidden";

const logoFragments = [
  { id: "top", clipPath: "inset(0 0 50% 0)", initial: { x: 0, y: -240 }, outro: { x: 0, y: -360, rotate: -36 } },
  { id: "right", clipPath: "inset(0 0 0 50%)", initial: { x: 240, y: 0 }, outro: { x: 360, y: 58, rotate: 42 } },
  { id: "bottom", clipPath: "inset(50% 0 0 0)", initial: { x: 0, y: 240 }, outro: { x: 0, y: 360, rotate: 30 } },
  { id: "left", clipPath: "inset(0 50% 0 0)", initial: { x: -240, y: 0 }, outro: { x: -360, y: -60, rotate: -40 } },
] as const;

function HomeIntroLoader({ phase }: { phase: LoaderPhase }) {
  if (phase === "hidden") return null;
  const isOutro = phase === "outro";
  return (
    <motion.div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-sky-50/92 backdrop-blur-[2px] dark:bg-navy/92"
      initial={{ opacity: 1 }}
      animate={{ opacity: isOutro ? [1, 1, 0] : 1, filter: isOutro ? ["brightness(1)", "brightness(1.25)", "brightness(1.12)"] : "brightness(1)" }}
      transition={{ duration: isOutro ? 1.2 : 0.2, ease: "easeOut" }}
    >
      {isOutro ? (
        <motion.div
          className="absolute inset-0 bg-cyan-300/10"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: [0, 0.78, 0.22, 0], scale: [1, 1, 1, 1] }}
          transition={{ duration: 1.0, ease: "easeOut" }}
        />
      ) : null}
      <motion.div
        className="relative h-24 w-24"
        animate={
          isOutro
            ? { rotate: [0, 260], scale: [1, 1.1, 0.85] }
            : { rotate: [0, 360] }
        }
        transition={{
          duration: isOutro ? 0.8 : 2.0,
          repeat: isOutro ? 0 : Infinity,
          ease: "linear",
        }}
      >
        {logoFragments.map((piece) => (
          <motion.div
            key={piece.id}
            className="absolute inset-0"
            style={{ clipPath: piece.clipPath }}
            initial={{ ...piece.initial, opacity: 0.94, scale: 0.95 }}
            animate={
              isOutro
                ? {
                    x: piece.outro.x,
                    y: piece.outro.y,
                    rotate: piece.outro.rotate,
                    opacity: [1, 1, 0],
                    scale: [1, 1.06, 0.92],
                    filter: [
                      "drop-shadow(0 0 0 rgba(255,255,255,0))",
                      "drop-shadow(0 0 8px rgba(255,255,255,0.95)) drop-shadow(0 0 16px rgba(255,255,255,0.8))",
                      "drop-shadow(0 0 4px rgba(255,255,255,0.45))",
                    ],
                    boxShadow: [
                      "0 0 0px rgba(255,255,255,0), 0 0 0px rgba(34,211,238,0)",
                      "0 0 0 3px rgba(255,255,255,0.98), 0 0 50px rgba(255,255,255,0.95), 0 0 34px rgba(34,211,238,0.85)",
                      "0 0 0 1px rgba(255,255,255,0.6), 0 0 14px rgba(255,255,255,0.45), 0 0 10px rgba(34,211,238,0.2)",
                    ],
                  }
                : { x: 0, y: 0, opacity: 1, scale: 1 }
            }
            transition={{ duration: isOutro ? 0.55 : 0.85, ease: isOutro ? "easeOut" : "easeInOut" }}
          >
            <Image
              src="/logo.png"
              alt="Loading logo fragment"
              fill
              sizes="96px"
              loading="eager"
              className="[filter:hue-rotate(-10deg)_saturate(1.25)_contrast(1.1)_brightness(1.03)] dark:[filter:hue-rotate(18deg)_saturate(1.35)_contrast(1.1)_brightness(1.08)]"
              priority
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const { isLoading } = usePortfolioData();
  const [loaderPhase, setLoaderPhase] = useState<LoaderPhase>(isLoading ? "loading" : "hidden");
  const [minIntroElapsed, setMinIntroElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinIntroElapsed(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) {
      if (loaderPhase === "hidden") setLoaderPhase("loading");
      return;
    }
    if (!minIntroElapsed) return;
    if (loaderPhase === "loading") {
      setLoaderPhase("outro");
      const t = setTimeout(() => setLoaderPhase("hidden"), 1750);
      return () => clearTimeout(t);
    }
  }, [isLoading, loaderPhase, minIntroElapsed]);

  useEffect(() => {
    // Fail-safe: never let the intro overlay block navigation indefinitely.
    const timer = setTimeout(() => {
      setLoaderPhase((current) => {
        if (current === "hidden" || current === "outro") return current;
        return "outro";
      });
      setTimeout(() => setLoaderPhase("hidden"), 700);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative z-0 min-h-screen bg-sky-50 dark:bg-navy">
      {/* Reference-style: deep navy + radial wash + subtle dot grid (dark only) */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 hidden dark:block">
        <div className="absolute inset-0 bg-navy" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,#1A2942,#0A192F)] opacity-50" />
        <div className="absolute inset-0 bg-grid-dots opacity-[0.05]" />
      </div>
      <AnimatePresence>
        {loaderPhase !== "hidden" ? <HomeIntroLoader phase={loaderPhase} /> : null}
      </AnimatePresence>
      <Navbar />
      <>
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
        <ProjectsSection />
        <TestimonialsSection />
        <ContactSection />
        <Footer />
      </>
    </main>
  );
}
