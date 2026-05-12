import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { NewsletterForm } from "@/components/newsletter-form";
import { PostCard } from "@/components/post-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { FadeIn } from "@/components/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getHomepage } from "@/lib/data";
import { GoogleAd } from "@/components/google-ad";


export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { hero, featuredPosts, latestPosts, categories, trendingPosts, brand } = await getHomepage();
  const heroContent = hero?.content as { eyebrow?: string; primaryCta?: string; secondaryCta?: string } | null;

  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-[var(--border)]">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,color-mix(in_srgb,var(--primary)_14%,transparent),transparent_42%),radial-gradient(circle_at_85%_20%,color-mix(in_srgb,var(--sky)_18%,transparent),transparent_34%)]" />
          <div className="container-shell relative grid min-h-[calc(100svh-64px)] items-center gap-10 py-14 md:grid-cols-[1.05fr_0.95fr]">
            <FadeIn>
              <Badge className="mb-6 border-[var(--accent)] bg-[var(--accent-soft)]">
                <Sparkles size={14} /> {heroContent?.eyebrow || "Personal publishing platform"}
              </Badge>
              <h1 className="editorial max-w-3xl text-6xl leading-[0.95] tracking-normal md:text-8xl">
                {hero?.title || brand.name}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted-foreground)]">
                {hero?.subtitle || brand.tagline}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" variant="gold">
                  <Link href="/blog">
                    {heroContent?.primaryCta || "Read latest essays"} <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/about">{heroContent?.secondaryCta || "About KK Rawat"}</Link>
                </Button>
              </div>
            </FadeIn>
            <FadeIn delay={0.1} className="grid gap-4">
              <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl">
                <div className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                  Editorial focus
                </div>
                <div className="mt-6 grid gap-4">
                  {["Strategic clarity", "Professional authority", "Search-led publishing"].map((item) => (
                    <div key={item} className="flex items-center justify-between border-b border-[var(--border)] pb-4 last:border-0 last:pb-0">
                      <span className="editorial text-2xl">{item}</span>
                      <ArrowRight className="text-[var(--accent)]" size={20} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  ["SEO", "first"],
                  ["CMS", "owned"],
                  ["Brand", "ready"]
                ].map(([top, bottom]) => (
                  <div key={top} className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 text-center">
                    <div className="editorial text-2xl">{top}</div>
                    <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                      {bottom}
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="container-shell py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <Badge>Featured</Badge>
              <h2 className="editorial mt-3 text-4xl md:text-5xl">Essential essays</h2>
            </div>
            <Button asChild variant="secondary">
              <Link href="/blog">View archive</Link>
            </Button>
          </div>
          <FadeIn className="grid gap-6 md:grid-cols-3">
            {featuredPosts.map((post, index) => (
              <PostCard key={post.id} post={post} priority={index === 0} />
            ))}
          </FadeIn>

          {/* Google Ad - Featured Posts Bottom */}
          <GoogleAd slot="1234567890" className="mt-12" />
        </section>

        <section className="border-y border-[var(--border)] bg-[var(--card)] py-16">
          <div className="container-shell grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <Badge>Discovery</Badge>
              <h2 className="editorial mt-3 text-4xl md:text-5xl">Browse by thinking lane</h2>
              <p className="mt-4 text-[var(--muted-foreground)]">
                Categories are designed for fast reader orientation and durable search structure.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/blog?category=${category.slug}`}
                  className="rounded-lg border border-[var(--border)] p-5 transition hover:-translate-y-1 hover:bg-[var(--muted)]"
                >
                  <span className="block h-1.5 w-12 rounded-full" style={{ background: category.color }} />
                  <span className="editorial mt-4 block text-2xl">{category.name}</span>
                  <span className="mt-2 block text-sm text-[var(--muted-foreground)]">
                    {category._count.posts} articles
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="container-shell grid gap-10 py-16 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="editorial text-4xl">Latest articles</h2>
              <Button asChild variant="ghost">
                <Link href="/blog">
                  All posts <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
            <div className="grid gap-5">
              {latestPosts.slice(0, 4).map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="grid gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] p-5 transition hover:bg-[var(--muted)]"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                    {post.category?.name || "Article"} · {post.readingMinutes} min read
                  </span>
                  <span className="editorial text-2xl">{post.title}</span>
                  <span className="text-sm leading-6 text-[var(--muted-foreground)]">{post.excerpt}</span>
                </Link>
              ))}
            </div>
          </div>
          <aside className="rounded-lg border border-[var(--border)] bg-[var(--primary)] p-6 text-[var(--primary-foreground)]">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] opacity-75">
              <TrendingUp size={16} /> Trending
            </div>
            <div className="mt-6 grid gap-5">
              {trendingPosts.map((post, index) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="grid gap-2 border-b border-white/10 pb-5 last:border-0">
                  <span className="text-sm opacity-60">0{index + 1}</span>
                  <span className="editorial text-2xl">{post.title}</span>
                </Link>
              ))}
            </div>
          </aside>
        </section>

        <section className="border-t border-[var(--border)] bg-[var(--card)] py-16">
          <div className="container-shell">
            <div className="max-w-2xl">
              <Badge>Newsletter</Badge>
              <h2 className="editorial mt-3 text-4xl">Receive the best essays directly.</h2>
              <p className="mt-3 text-[var(--muted-foreground)]">
                A quiet, high-signal channel for new writing, launch updates, and curated insight.
              </p>
            </div>
            <div className="mt-8">
              <NewsletterForm />
            </div>
          </div>

          {/* Google Ad - Homepage Bottom */}
          <GoogleAd slot="0987654321" className="mt-12" />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
