"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, CheckCircle, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { usePortfolioData } from "@/hooks/usePortfolioData";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactSection() {
  const { data, isLoading } = usePortfolioData();
  const { profile } = data;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setShowSuccess(true);
        reset();
        setTimeout(() => setShowSuccess(false), 5000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <section id="contact" className="bg-sky-50 py-16 dark:bg-transparent">
        <div className="section-container py-12 text-center text-gray-500 dark:text-slate-portfolio">
          Loading…
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="bg-sky-50 py-16 dark:bg-transparent">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="portfolio-section-title">Get In Touch</h2>
          <div className="mx-auto h-1 w-16 bg-gradient-to-r from-teal-400 to-sky-500 dark:from-mint dark:to-pink-300"></div>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="mb-8 text-lg text-gray-600 dark:text-slate-portfolio">
              Have a question or want to work together? I'd love to hear from you. Feel free to reach out!
            </p>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 dark:bg-mint/10">
                  <Mail size={24} className="text-teal-600 dark:text-mint" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-slate-heading">Email</h3>
                  <a
                    href={profile.email ? `mailto:${profile.email}` : "#contact"}
                    className="text-teal-600 hover:underline dark:text-mint"
                  >
                    {profile.email || "—"}
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 dark:bg-mint/10">
                  <MapPin size={24} className="text-teal-600 dark:text-mint" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-slate-heading">Location</h3>
                  <p className="text-gray-600 dark:text-slate-portfolio">{profile.location}</p>
                </div>
              </div>

              {/* Availability */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 dark:bg-mint/10">
                  <Phone size={24} className="text-teal-600 dark:text-mint" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-slate-heading">Availability</h3>
                  <p className="text-gray-600 dark:text-slate-portfolio">Open to opportunities</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 flex items-center gap-3 rounded-lg bg-green-100 p-4 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              >
                <CheckCircle size={20} />
                <span>Thank you! I'll get back to you soon.</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-slate-heading">
                  Name
                </label>
                <input
                  {...register("name", { required: "Name is required" })}
                  type="text"
                  placeholder="Your name"
                  className="w-full rounded-lg border border-sky-200 bg-sky-50 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-teal-500 focus:outline-none dark:border-navy-border dark:bg-navy-muted dark:text-slate-heading dark:placeholder-slate-portfolio"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-slate-heading">
                  Email
                </label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-sky-200 bg-sky-50 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-teal-500 focus:outline-none dark:border-navy-border dark:bg-navy-muted dark:text-slate-heading dark:placeholder-slate-portfolio"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-slate-heading">
                  Subject
                </label>
                <input
                  {...register("subject", { required: "Subject is required" })}
                  type="text"
                  placeholder="Project inquiry"
                  className="w-full rounded-lg border border-sky-200 bg-sky-50 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-teal-500 focus:outline-none dark:border-navy-border dark:bg-navy-muted dark:text-slate-heading dark:placeholder-slate-portfolio"
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject.message}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-slate-heading">
                  Message
                </label>
                <textarea
                  {...register("message", { required: "Message is required" })}
                  placeholder="Your message here..."
                  rows={4}
                  className="w-full rounded-lg border border-sky-200 bg-sky-50 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-teal-500 focus:outline-none dark:border-navy-border dark:bg-navy-muted dark:text-slate-heading dark:placeholder-slate-portfolio"
                ></textarea>
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Send size={18} className="mr-2" />
                {isSubmitting ? "Sending..." : "Send Message"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
