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
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <nav className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950">
        <div className="section-container py-4">
          <Link
            href="/#blog"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft size={18} />
            Back to Blog
          </Link>
        </div>
      </nav>

      <article className="bg-white py-16 dark:bg-gray-900">
        <div className="section-container max-w-3xl">
          {post.coverImage ? (
            <div className="mb-8 overflow-hidden rounded-lg">
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

          <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            {post.title}
          </h1>

          <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-gray-200 pb-8 dark:border-gray-700">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
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

            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Clock size={18} />
              <span>{post.readTime} min read</span>
            </div>

            {post.category ? (
              <div className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {post.category}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="prose prose-sm max-w-none dark:prose-invert sm:prose-base">
            {markdownToJSX(post.content)}
          </div>

          {(authorName || authorBio) && (
            <div className="my-16 border-y border-gray-200 py-8 dark:border-gray-700">
              {authorName ? (
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  Written by <strong>{authorName}</strong>
                  {authorTitle ? ` — ${authorTitle}` : ""}
                </p>
              ) : null}
              {authorBio ? <p className="text-gray-600 dark:text-gray-400">{authorBio}</p> : null}
            </div>
          )}

          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
                Related Articles
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="group rounded-lg bg-gray-50 p-6 transition-all hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <p className="mb-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {relatedPost.category}
                    </p>
                    <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {relatedPost.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                      {relatedPost.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-16 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-8 text-center dark:from-blue-900/20 dark:to-purple-900/20">
            <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Ready to start a project together?
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Let&apos;s discuss how we can build something amazing.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-all hover:bg-blue-700"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
