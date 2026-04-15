import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { markdownToJSX } from "@/utils/markdownParser";
import {
  fetchArticleBySlug,
  fetchArticlesByCategory,
  fetchPublicProfile,
  fetchAllArticleSlugs,
} from "@/lib/supabasePublic";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await fetchAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await fetchArticleBySlug(resolvedParams.slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The blog post you're looking for doesn't exist.",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage
        ? [
            {
              url: post.coverImage,
              width: 800,
              height: 600,
              alt: post.title,
            },
          ]
        : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const post = await fetchArticleBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const [relatedPosts, author] = await Promise.all([
    fetchArticlesByCategory(post.category, post.id).then((rows) => rows.slice(0, 2)),
    fetchPublicProfile(),
  ]);

  const authorName = author?.name?.trim() || "";
  const authorTitle = author?.title?.trim() || "";
  const authorBio = author?.bio?.trim() || "";

  return (
    <main className="min-h-screen bg-sky-50 dark:bg-navy">
      <nav className="border-b border-sky-100 bg-sky-50 dark:border-navy-border dark:bg-navy">
        <div className="section-container py-4">
          <Link
            href="/#blog"
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 dark:text-mint dark:hover:text-mint-dark"
          >
            <ArrowLeft size={18} />
            Back to Blog
          </Link>
        </div>
      </nav>

      <article className="bg-sky-50 py-12 dark:bg-transparent">
        <div className="section-container max-w-3xl">
          {post.coverImage ? (
            <div className="mb-6 overflow-hidden rounded-lg">
              <Image
                src={post.coverImage}
                alt={post.title}
                width={800}
                height={600}
                className="h-96 w-full object-cover"
                priority
              />
            </div>
          ) : null}

          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-slate-heading sm:text-5xl">
            {post.title}
          </h1>

          <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-gray-200 pb-5 dark:border-navy-border">
            <div className="flex items-center gap-2 text-gray-600 dark:text-slate-portfolio">
              <Calendar size={18} />
              <time dateTime={post.publishedAt}>
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : ""}
              </time>
            </div>

            <div className="flex items-center gap-2 text-gray-600 dark:text-slate-portfolio">
              <Clock size={18} />
              <span>{post.readTime} min read</span>
            </div>

            {post.category ? (
              <div className="rounded-full bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-700 dark:bg-mint/10 dark:text-mint">
                {post.category}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700 dark:border-navy-border dark:bg-navy-muted dark:text-slate-portfolio"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="prose prose-sm max-w-none prose-headings:mb-3 prose-p:my-2 prose-li:my-1 prose-ul:my-3 prose-ol:my-3 dark:prose-invert dark:prose-headings:text-slate-heading dark:prose-p:text-white dark:prose-strong:text-white dark:prose-a:text-mint dark:prose-li:text-white sm:prose-base">
            {markdownToJSX(post.content)}
          </div>

          {(authorName || authorBio) && (
            <div className="my-10 border-y border-gray-200 py-6 dark:border-navy-border">
              {authorName ? (
                <p className="mb-3 text-gray-600 dark:text-slate-portfolio">
                  Written by <strong>{authorName}</strong>
                  {authorTitle ? ` — ${authorTitle}` : ""}
                </p>
              ) : null}
              {authorBio ? <p className="text-gray-600 dark:text-slate-portfolio">{authorBio}</p> : null}
            </div>
          )}

          {relatedPosts.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-5 text-2xl font-bold text-gray-900 dark:text-slate-heading">
                Related Articles
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="group rounded-lg border border-sky-200 bg-sky-50 p-5 transition-all hover:border-teal-200 hover:bg-sky-100 dark:border-navy-border dark:bg-navy-muted dark:hover:border-mint/30 dark:hover:bg-navy"
                  >
                    <p className="mb-2 text-sm font-semibold text-teal-600 dark:text-mint">
                      {relatedPost.category}
                    </p>
                    <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-teal-600 dark:text-slate-heading dark:group-hover:text-mint">
                      {relatedPost.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-gray-600 dark:text-slate-portfolio">
                      {relatedPost.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 rounded-lg border border-teal-100 bg-gradient-to-r from-teal-50 to-sky-50 p-7 text-center dark:border-navy-border dark:from-navy-muted dark:to-navy">
            <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-slate-heading">
              Ready to start a project together?
            </h3>
            <p className="mb-5 text-gray-600 dark:text-slate-portfolio">
              Let&apos;s discuss how we can build something amazing.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-6 py-3 font-medium text-white transition-all hover:bg-teal-600 dark:bg-gradient-to-r dark:from-mint dark:to-mint-dark dark:text-navy dark:hover:opacity-90"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
