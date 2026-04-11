"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { usePortfolioData } from "@/hooks/usePortfolioData";

export default function TestimonialsSection() {
  const { data, isLoading } = usePortfolioData();
  const { testimonials } = data;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay || !testimonials || testimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlay, testimonials]);

  if (isLoading) {
    return (
      <section id="testimonials" className="bg-gray-50 py-16 dark:bg-gray-950">
        <div className="section-container py-12 text-center text-gray-500 dark:text-gray-400">Loading…</div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlay(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlay(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
  };

  return (
    <section id="testimonials" className="bg-gray-50 py-16 dark:bg-gray-950">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            What People Say
          </h2>
          <div className="mx-auto h-1 w-16 bg-gradient-to-r from-blue-400 to-purple-500"></div>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
          className="relative mx-auto max-w-2xl"
        >
          {/* Testimonial Card */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-900"
          >
            {/* Quote icon */}
            <Quote className="mb-4 text-blue-600 dark:text-blue-400" size={32} />

            {/* Quote */}
            <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">
              "{testimonials[currentIndex]?.quote || ''}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-full">
                <Image
                  src={testimonials[currentIndex]?.avatar || ''}
                  alt={testimonials[currentIndex]?.name || ''}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {testimonials[currentIndex]?.name || ''}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {testimonials[currentIndex]?.role || ''} at {testimonials[currentIndex]?.company || ''}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-x-12 -translate-y-1/2 rounded-lg bg-blue-600 p-2 text-white transition-all hover:bg-blue-700 active:scale-95"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 rounded-lg bg-blue-600 p-2 text-white transition-all hover:bg-blue-700 active:scale-95"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dot Navigation */}
          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-blue-600"
                    : "w-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
