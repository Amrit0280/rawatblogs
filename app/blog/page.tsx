import Link from "next/link";
import type { Metadata } from "next";
import { Search } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getArchive } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Browse KK Rawat's latest essays by category, tag, and search."
};

export default async function BlogPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; category?: string; tag?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page || 1);
  const archive = await getArchive({
    query: params.q,
    category: params.category,
    tag: params.tag,
    page: Number.isFinite(page) ? page : 1
  });

  return (
    <>
      <SiteHeader />
      <main className="container-shell py-14">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <Badge>Archive</Badge>
            <h1 className="editorial mt-4 text-5xl leading-tight md:text-7xl">All essays</h1>
            <p className="mt-5 max-w-lg text-[var(--muted-foreground)]">
              Search the full owned archive of articles, categories, and tagged ideas.
            </p>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5">
            <form className="flex gap-2">
              <Input name="q" defaultValue={params.q} placeholder="Search articles" aria-label="Search articles" />
              <Button type="submit">
                <Search size={16} /> Search
              </Button>
            </form>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild variant={!params.category && !params.tag ? "default" : "secondary"} size="sm">
                <Link href="/blog">All</Link>
              </Button>
              {archive.categories.map((category) => (
                <Button key={category.id} asChild variant={params.category === category.slug ? "default" : "secondary"} size="sm">
                  <Link href={`/blog?category=${category.slug}`}>{category.name}</Link>
                </Button>
              ))}
              {archive.tags.map((tag) => (
                <Button key={tag.id} asChild variant={params.tag === tag.slug ? "gold" : "secondary"} size="sm">
                  <Link href={`/blog?tag=${tag.slug}`}>#{tag.name}</Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {archive.posts.map((post, index) => (
            <PostCard key={post.id} post={post} priority={index < 3} />
          ))}
        </div>
        <div className="mt-10 flex items-center justify-between border-t border-[var(--border)] pt-6">
          <span className="text-sm text-[var(--muted-foreground)]">
            Page {archive.page} of {archive.pages}
          </span>
          <div className="flex gap-2">
            {archive.page > 1 ? (
              <Button asChild variant="secondary">
                <Link href={`/blog?page=${archive.page - 1}`}>Previous</Link>
              </Button>
            ) : null}
            {archive.page < archive.pages ? (
              <Button asChild variant="secondary">
                <Link href={`/blog?page=${archive.page + 1}`}>Next</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
