import Image from "next/image";
import Link from "next/link";
import { Clock, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";

type PostCardProps = {
  post: {
    title: string;
    slug: string;
    excerpt: string;
    coverImage?: string | null;
    coverAlt?: string | null;
    readingMinutes: number;
    views: number;
    publishedAt?: Date | null;
    category?: { name: string; slug: string; color: string } | null;
  };
  priority?: boolean;
};

export function PostCard({ post, priority }: PostCardProps) {
  return (
    <article className="group grid overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/blog/${post.slug}`} className="relative aspect-[16/10] overflow-hidden bg-[var(--muted)]">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.coverAlt || post.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : null}
      </Link>
      <div className="grid gap-4 p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted-foreground)]">
          {post.category ? <Badge style={{ borderColor: post.category.color }}>{post.category.name}</Badge> : null}
          <span className="inline-flex items-center gap-1">
            <Clock size={14} /> {post.readingMinutes} min
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye size={14} /> {formatNumber(post.views)}
          </span>
        </div>
        <div>
          <Link href={`/blog/${post.slug}`} className="editorial text-2xl leading-tight transition hover:text-[var(--accent)]">
            {post.title}
          </Link>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--muted-foreground)]">
            {post.excerpt}
          </p>
        </div>
      </div>
    </article>
  );
}
