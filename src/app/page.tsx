import Navbar from "@/components/portfolio/Navbar";
import HeroSection from "@/components/portfolio/HeroSection";
import AboutSection from "@/components/portfolio/AboutSection";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import SkillsSection from "@/components/portfolio/SkillsSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import BlogSection from "@/components/portfolio/BlogSection";
import TestimonialsSection from "@/components/portfolio/TestimonialsSection";
import ContactSection from "@/components/portfolio/ContactSection";
import Footer from "@/components/portfolio/Footer";

export default function Home() {
  return (
    <main className="relative z-0 min-h-screen bg-sky-50 dark:bg-navy">
      {/* Reference-style: deep navy + radial wash + subtle dot grid (dark only) */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 hidden dark:block">
        <div className="absolute inset-0 bg-navy" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,#1A2942,#0A192F)] opacity-50" />
        <div className="absolute inset-0 bg-grid-dots opacity-[0.05]" />
      </div>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <SkillsSection />
      <ProjectsSection />
      <BlogSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
