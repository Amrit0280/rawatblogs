import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Calendar, Clock, Facebook, Linkedin, Share2, Twitter } from "lucide-react";
import { CommentForm } from "@/components/comment-form";
import { PostCard } from "@/components/post-card";
import { ReadingProgress } from "@/components/reading-progress";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { getPostBySlug, getRelatedPosts } from "@/lib/data";
import { trackView } from "@/lib/actions";
import { absoluteUrl, initials } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt;
  const url = post.canonicalUrl || absoluteUrl(`/blog/${post.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      images: post.ogImage || post.coverImage ? [{ url: post.ogImage || post.coverImage || "" }] : []
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.ogImage || post.coverImage ? [post.ogImage || post.coverImage || ""] : []
    }
  };
}

function contentBlocks(content: string) {
  return content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
}

function toc(content: string) {
  return contentBlocks(content)
    .filter((block) => block.startsWith("## "))
    .map((block) => {
      const title = block.replace(/^##\s+/, "");
      return { title, id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") };
    });
}

export default async function SinglePostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const headerList = await headers();
  await trackView(
    post.id,
    `/blog/${post.slug}`,
    headerList.get("x-forwarded-for"),
    headerList.get("user-agent")
  ).catch(() => undefined);

  const related = await getRelatedPosts(post.id, post.category?.id);
  const headings = toc(post.content);
  const shareUrl = absoluteUrl(`/blog/${post.slug}`);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt?.toISOString(),
    author: { "@type": "Person", name: post.author.name || "KK Rawat" },
    publisher: { "@type": "Person", name: "KK Rawat" },
    mainEntityOfPage: shareUrl
  };

  return (
    <>
      <ReadingProgress />
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main>
        <article>
          <header className="container-shell grid gap-10 py-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Badge>{post.category?.name || "Essay"}</Badge>
              <h1 className="editorial mt-5 text-5xl leading-tight md:text-7xl">{post.title}</h1>
              <p className="mt-6 text-lg leading-8 text-[var(--muted-foreground)]">{post.excerpt}</p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-[var(--muted-foreground)]">
                <span className="inline-flex items-center gap-2">
                  <Clock size={16} /> {post.readingMinutes} min read
                </span>
                {post.publishedAt ? (
                  <span className="inline-flex items-center gap-2">
                    <Calendar size={16} /> {post.publishedAt.toLocaleDateString("en-IN", { dateStyle: "medium" })}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="relative aspect-[16/11] overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--muted)]">
              {post.coverImage ? (
                <Image src={post.coverImage} alt={post.coverAlt || post.title} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              ) : null}
            </div>
          </header>
          <div className="container-shell grid gap-10 pb-16 lg:grid-cols-[240px_minmax(0,720px)_220px]">
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                  Contents
                </div>
                <div className="mt-4 grid gap-2 text-sm">
                  {headings.length ? (
                    headings.map((item) => (
                      <Link key={item.id} href={`#${item.id}`} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                        {item.title}
                      </Link>
                    ))
                  ) : (
                    <span className="text-[var(--muted-foreground)]">Article overview</span>
                  )}
                </div>
              </div>
            </aside>
            <div className="prose-content">
              {contentBlocks(post.content).map((block) => {
                if (block.startsWith("## ")) {
                  const title = block.replace(/^##\s+/, "");
                  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                  return (
                    <h2 key={block} id={id}>
                      {title}
                    </h2>
                  );
                }
                return <p key={block}>{block}</p>;
              })}
              <section className="mt-12 border-t border-[var(--border)] pt-8">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-[var(--primary)] font-semibold text-[var(--primary-foreground)]">
                    {initials(post.author.name || "KK Rawat")}
                  </div>
                  <div>
                    <h2 className="mt-0 text-2xl">About the author</h2>
                    <p>{post.author.bio || "KK Rawat publishes strategic, authority-building essays for modern professionals."}</p>
                  </div>
                </div>
              </section>
              <section className="mt-10">
                <h2>Comments</h2>
                <div className="mb-6 grid gap-4">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
                      <div className="font-semibold">{comment.name}</div>
                      <p className="mb-0 mt-2 text-base">{comment.body}</p>
                    </div>
                  ))}
                </div>
                <CommentForm postId={post.id} />
              </section>
            </div>
            <aside className="hidden lg:block">
              <div className="sticky top-24 grid gap-2">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                  Share
                </div>
                <Link className="grid h-10 w-10 place-items-center rounded-md border border-[var(--border)]" href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`} aria-label="Share on LinkedIn">
                  <Linkedin size={18} />
                </Link>
                <Link className="grid h-10 w-10 place-items-center rounded-md border border-[var(--border)]" href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(post.title)}`} aria-label="Share on X">
                  <Twitter size={18} />
                </Link>
                <Link className="grid h-10 w-10 place-items-center rounded-md border border-[var(--border)]" href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} aria-label="Share on Facebook">
                  <Facebook size={18} />
                </Link>
                <span className="grid h-10 w-10 place-items-center rounded-md border border-[var(--border)]" aria-hidden>
                  <Share2 size={18} />
                </span>
              </div>
            </aside>
          </div>
        </article>
        {related.length ? (
          <section className="border-t border-[var(--border)] py-14">
            <div className="container-shell">
              <h2 className="editorial text-4xl">Related essays</h2>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {related.map((item) => (
                  <PostCard key={item.id} post={item} />
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
