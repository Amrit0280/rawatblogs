import slugify from "slugify";
import { prisma } from "@/lib/prisma";

export function toSlug(value: string) {
  return slugify(value, { lower: true, strict: true, trim: true });
}

export async function uniquePostSlug(title: string, currentId?: string) {
  const base = toSlug(title);
  let slug = base;
  let counter = 2;

  while (
    await prisma.post.findFirst({
      where: { slug, id: currentId ? { not: currentId } : undefined },
      select: { id: true }
    })
  ) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
}

export async function uniqueTaxonomySlug(
  model: "category" | "tag",
  name: string,
  currentId?: string
) {
  const base = toSlug(name);
  let slug = base;
  let counter = 2;

  if (model === "category") {
    while (
      await prisma.category.findFirst({
        where: { slug, id: currentId ? { not: currentId } : undefined },
        select: { id: true }
      })
    ) {
      slug = `${base}-${counter}`;
      counter += 1;
    }
  } else {
    while (
      await prisma.tag.findFirst({
        where: { slug, id: currentId ? { not: currentId } : undefined },
        select: { id: true }
      })
    ) {
      slug = `${base}-${counter}`;
      counter += 1;
    }
  }

  return slug;
}
