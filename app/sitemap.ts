import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.post
    .findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true }
    })
    .catch(() => []);

  return [
    { url: absoluteUrl("/"), lastModified: new Date(), priority: 1 },
    { url: absoluteUrl("/about"), lastModified: new Date(), priority: 0.8 },
    { url: absoluteUrl("/blog"), lastModified: new Date(), priority: 0.9 },
    { url: absoluteUrl("/contact"), lastModified: new Date(), priority: 0.7 },
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.updatedAt,
      priority: 0.75
    }))
  ];
}
