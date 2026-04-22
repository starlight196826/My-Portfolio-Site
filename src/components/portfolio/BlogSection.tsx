"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import SectionLoading from "@/components/portfolio/SectionLoading";

export default function BlogSection() {
  const { data, isLoading } = usePortfolioData();
  const blogPosts = data.blogPosts;
  const categories = Array.from(new Set(blogPosts.map((p) => p.category))).sort();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = useMemo(() => {
    let results = blogPosts;

    // Filter by search query
    if (searchQuery) {
      results = results.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== "All") {
      results = results.filter((post) => post.category === selectedCategory);
    }

    return results;
  }, [searchQuery, selectedCategory, blogPosts]);

  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  if (isLoading) {
    return (
      <section id="blog" className="bg-sky-50 py-16 dark:bg-transparent">
        <div className="section-container py-12 text-center">
          <SectionLoading />
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="bg-sky-50 py-16 dark:bg-transparent">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="portfolio-section-title">Latest Articles</h2>
          <div className="mx-auto h-1 w-16 bg-gradient-to-r from-teal-400 to-sky-500 dark:from-mint dark:to-pink-300"></div>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-sky-200 bg-sky-50 py-2 pl-10 pr-10 text-gray-900 placeholder-gray-500 focus:border-teal-500 focus:outline-none dark:border-navy-border dark:bg-navy-muted dark:text-slate-heading"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8 flex flex-wrap gap-2"
        >
          {["All", ...categories].map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-teal-500 text-white dark:bg-gradient-to-r dark:from-mint dark:to-mint-dark dark:text-navy"
                  : "border border-sky-100 bg-sky-50 text-gray-700 hover:bg-sky-100 dark:border dark:border-navy-border dark:bg-navy-muted dark:text-slate-portfolio dark:hover:border-mint/40"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Results count */}
        <p className="mb-8 text-sm text-gray-600 dark:text-slate-portfolio">
          {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""} found
        </p>

        {/* Featured Post */}
        {featuredPost && (
          <AnimatePresence mode="wait">
            <motion.div
              key="featured"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="mb-10"
            >
              <Link href={`/blog/${featuredPost.slug}`}>
                <div className="group cursor-pointer overflow-hidden rounded-lg border border-sky-100 bg-gradient-to-br from-teal-50 to-sky-50 dark:border-navy-border dark:from-navy-muted/80 dark:to-navy-muted/40">
                  <div className="grid gap-5 md:grid-cols-2">
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden bg-gray-200 dark:bg-navy md:h-auto">
                      {featuredPost.coverImage ? (
                        <Image
                          src={featuredPost.coverImage}
                          alt={featuredPost.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : null}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-center p-6">
                      <div className="mb-3 inline-flex w-fit rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-mint/15 dark:text-mint">
                        {featuredPost.category}
                      </div>
                      <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-slate-heading">
                        {featuredPost.title}
                      </h3>
                      <p className="mb-3 text-gray-600 dark:text-slate-portfolio">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-slate-portfolio">
                        <span>{new Date(featuredPost.publishedAt).toLocaleDateString()}</span>
                        <span>{featuredPost.readTime} min read</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Remaining Posts Grid */}
        {remainingPosts.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {remainingPosts.map((post, index) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="group h-full overflow-hidden rounded-lg border border-sky-100 bg-sky-50/80 shadow-md transition-shadow hover:shadow-xl dark:border-navy-border dark:bg-navy-muted dark:hover:border-mint/30"
                  >
                    {/* Image */}
                    <div className="relative h-48 w-full overflow-hidden bg-gray-200 dark:bg-navy">
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : null}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="mb-2 inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-mint/10 dark:text-mint">
                        {post.category}
                      </div>
                      <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-slate-heading">
                        {post.title}
                      </h3>
                      <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-slate-portfolio">
                        {post.excerpt}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                        <span>{post.readTime} min</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg border border-sky-100 bg-sky-50 p-12 text-center dark:border-navy-border dark:bg-navy-muted"
          >
            <p className="mb-4 text-gray-600 dark:text-slate-portfolio">No articles found</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="btn-secondary"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
