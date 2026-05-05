import { Prisma, PostStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const publicPostSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  coverImage: true,
  coverAlt: true,
  featured: true,
  trending: true,
  readingMinutes: true,
  views: true,
  publishedAt: true,
  metaTitle: true,
  metaDescription: true,
  canonicalUrl: true,
  ogImage: true,
  category: true,
  author: { select: { name: true, image: true, bio: true } },
  tags: { include: { tag: true } },
  comments: {
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, body: true, createdAt: true }
  }
} satisfies Prisma.PostSelect;

export async function getSiteSetting<T>(key: string, fallback: T): Promise<T> {
  const setting = await prisma.siteSetting.findUnique({ where: { key } });
  return (setting?.value as T) ?? fallback;
}

export async function getHomepage() {
  const [hero, featuredPosts, latestPosts, categories, trendingPosts, brand] =
    await Promise.all([
      prisma.homepageSection.findUnique({ where: { key: "hero" } }),
      prisma.post.findMany({
        where: { status: PostStatus.PUBLISHED, featured: true },
        orderBy: [{ publishedAt: "desc" }],
        take: 3,
        select: publicPostSelect
      }),
      prisma.post.findMany({
        where: { status: PostStatus.PUBLISHED },
        orderBy: [{ publishedAt: "desc" }],
        take: 6,
        select: publicPostSelect
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { posts: true } } }
      }),
      prisma.post.findMany({
        where: { status: PostStatus.PUBLISHED, trending: true },
        orderBy: [{ views: "desc" }, { publishedAt: "desc" }],
        take: 4,
        select: publicPostSelect
      }),
      getSiteSetting("brand", {
        name: "KK Rawat",
        tagline: "Authority-led ideas for modern growth",
        accent: "#c79a2b"
      })
    ]);

  return { hero, featuredPosts, latestPosts, categories, trendingPosts, brand };
}

export async function getArchive({
  query,
  category,
  tag,
  page = 1
}: {
  query?: string;
  category?: string;
  tag?: string;
  page?: number;
}) {
  const take = 9;
  const skip = (page - 1) * take;
  const where: Prisma.PostWhereInput = {
    status: PostStatus.PUBLISHED,
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { excerpt: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } }
          ]
        }
      : {}),
    ...(category ? { category: { slug: category } } : {}),
    ...(tag ? { tags: { some: { tag: { slug: tag } } } } : {})
  };

  const [posts, total, categories, tags] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take,
      skip,
      select: publicPostSelect
    }),
    prisma.post.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } })
  ]);

  return {
    posts,
    categories,
    tags,
    total,
    page,
    pages: Math.max(1, Math.ceil(total / take))
  };
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findFirst({
    where: { slug, status: PostStatus.PUBLISHED },
    select: publicPostSelect
  });
}

export async function getRelatedPosts(postId: string, categoryId?: string | null) {
  return prisma.post.findMany({
    where: {
      id: { not: postId },
      status: PostStatus.PUBLISHED,
      ...(categoryId ? { categoryId } : {})
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: publicPostSelect
  });
}

export async function getDashboardStats() {
  const [posts, published, drafts, scheduled, comments, pendingComments, subscribers, views] =
    await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: "PUBLISHED" } }),
      prisma.post.count({ where: { status: "DRAFT" } }),
      prisma.post.count({ where: { status: "SCHEDULED" } }),
      prisma.comment.count(),
      prisma.comment.count({ where: { status: "PENDING" } }),
      prisma.newsletter.count(),
      prisma.post.aggregate({ _sum: { views: true } })
    ]);

  const recentPosts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    take: 5,
    include: { category: true }
  });

  const recentInquiries = await prisma.contactInquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 5
  });

  return {
    posts,
    published,
    drafts,
    scheduled,
    comments,
    pendingComments,
    subscribers,
    views: views._sum.views || 0,
    recentPosts,
    recentInquiries
  };
}

export async function getAdminContent() {
  const [posts, categories, tags] = await Promise.all([
    prisma.post.findMany({
      orderBy: { updatedAt: "desc" },
      include: { category: true, tags: { include: { tag: true } } }
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } })
  ]);
  return { posts, categories, tags };
}
