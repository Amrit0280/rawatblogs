"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hashValue } from "@/lib/security";
import { uniquePostSlug, uniqueTaxonomySlug } from "@/lib/slug";
import {
  categorySchema,
  homepageSectionSchema,
  mediaSchema,
  postSchema,
  siteSettingSchema,
  tagSchema
} from "@/lib/validation";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  return session;
}

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function checkbox(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function readJson(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export async function loginAction(_: unknown, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formValue(formData, "email"),
      password: formValue(formData, "password"),
      redirectTo: "/admin"
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) throw error;
    return { error: "Invalid email or password." };
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

export async function savePostAction(formData: FormData) {
  const session = await requireAdmin();
  const parsed = postSchema.parse({
    id: formValue(formData, "id") || undefined,
    title: formValue(formData, "title"),
    excerpt: formValue(formData, "excerpt"),
    content: formValue(formData, "content"),
    coverImage: formValue(formData, "coverImage"),
    coverAlt: formValue(formData, "coverAlt"),
    status: formValue(formData, "status"),
    featured: checkbox(formData, "featured"),
    trending: checkbox(formData, "trending"),
    categoryId: formValue(formData, "categoryId"),
    tagIds: formData.getAll("tagIds").map(String),
    scheduledAt: formValue(formData, "scheduledAt"),
    metaTitle: formValue(formData, "metaTitle"),
    metaDescription: formValue(formData, "metaDescription"),
    canonicalUrl: formValue(formData, "canonicalUrl"),
    ogImage: formValue(formData, "ogImage")
  });

  const slug = await uniquePostSlug(parsed.title, parsed.id);
  const wordCount = parsed.content.trim().split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 220));
  const publishedAt =
    parsed.status === "PUBLISHED"
      ? new Date()
      : parsed.status === "SCHEDULED" && parsed.scheduledAt
        ? new Date(parsed.scheduledAt)
        : null;

  const post = await prisma.post.upsert({
    where: { id: parsed.id || "__new__" },
    update: {
      title: parsed.title,
      slug,
      excerpt: parsed.excerpt,
      content: parsed.content,
      coverImage: parsed.coverImage || null,
      coverAlt: parsed.coverAlt || null,
      status: parsed.status,
      featured: parsed.featured,
      trending: parsed.trending,
      readingMinutes,
      scheduledAt: parsed.scheduledAt ? new Date(parsed.scheduledAt) : null,
      publishedAt,
      categoryId: parsed.categoryId || null,
      metaTitle: parsed.metaTitle || null,
      metaDescription: parsed.metaDescription || null,
      canonicalUrl: parsed.canonicalUrl || null,
      ogImage: parsed.ogImage || null,
      tags: {
        deleteMany: {},
        create: parsed.tagIds.map((tagId) => ({ tagId }))
      }
    },
    create: {
      title: parsed.title,
      slug,
      excerpt: parsed.excerpt,
      content: parsed.content,
      coverImage: parsed.coverImage || null,
      coverAlt: parsed.coverAlt || null,
      status: parsed.status,
      featured: parsed.featured,
      trending: parsed.trending,
      readingMinutes,
      scheduledAt: parsed.scheduledAt ? new Date(parsed.scheduledAt) : null,
      publishedAt,
      categoryId: parsed.categoryId || null,
      metaTitle: parsed.metaTitle || null,
      metaDescription: parsed.metaDescription || null,
      canonicalUrl: parsed.canonicalUrl || null,
      ogImage: parsed.ogImage || null,
      authorId: session.user.id,
      tags: {
        create: parsed.tagIds.map((tagId) => ({ tagId }))
      }
    }
  });

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function deletePostAction(formData: FormData) {
  await requireAdmin();
  const id = formValue(formData, "id");
  await prisma.post.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/posts");
}

export async function saveCategoryAction(formData: FormData) {
  await requireAdmin();
  const parsed = categorySchema.parse({
    id: formValue(formData, "id") || undefined,
    name: formValue(formData, "name"),
    description: formValue(formData, "description"),
    color: formValue(formData, "color") || "#2563eb"
  });
  const slug = await uniqueTaxonomySlug("category", parsed.name, parsed.id);
  await prisma.category.upsert({
    where: { id: parsed.id || "__new__" },
    update: { name: parsed.name, slug, description: parsed.description, color: parsed.color },
    create: { name: parsed.name, slug, description: parsed.description, color: parsed.color }
  });
  revalidatePath("/blog");
  revalidatePath("/admin/taxonomy");
}

export async function saveTagAction(formData: FormData) {
  await requireAdmin();
  const parsed = tagSchema.parse({
    id: formValue(formData, "id") || undefined,
    name: formValue(formData, "name")
  });
  const slug = await uniqueTaxonomySlug("tag", parsed.name, parsed.id);
  await prisma.tag.upsert({
    where: { id: parsed.id || "__new__" },
    update: { name: parsed.name, slug },
    create: { name: parsed.name, slug }
  });
  revalidatePath("/blog");
  revalidatePath("/admin/taxonomy");
}

export async function moderateCommentAction(formData: FormData) {
  await requireAdmin();
  const id = formValue(formData, "id");
  const status = formValue(formData, "status") as "APPROVED" | "SPAM" | "DELETED" | "PENDING";
  await prisma.comment.update({ where: { id }, data: { status } });
  revalidatePath("/admin/comments");
}

export async function saveMediaAction(formData: FormData) {
  await requireAdmin();
  const parsed = mediaSchema.parse({
    url: formValue(formData, "url"),
    alt: formValue(formData, "alt"),
    title: formValue(formData, "title"),
    mimeType: formValue(formData, "mimeType") || "image/jpeg",
    folder: formValue(formData, "folder") || "general",
    size: formValue(formData, "size") || undefined,
    width: formValue(formData, "width") || undefined,
    height: formValue(formData, "height") || undefined
  });
  await prisma.media.create({ data: parsed });
  revalidatePath("/admin/media");
}

export async function saveSiteSettingAction(formData: FormData) {
  await requireAdmin();
  const parsed = siteSettingSchema.parse({
    key: formValue(formData, "key"),
    label: formValue(formData, "label"),
    group: formValue(formData, "group"),
    kind: formValue(formData, "kind"),
    value: formValue(formData, "value")
  });
  await prisma.siteSetting.upsert({
    where: { key: parsed.key },
    update: {
      label: parsed.label,
      group: parsed.group,
      kind: parsed.kind,
      value: readJson(parsed.value)
    },
    create: {
      key: parsed.key,
      label: parsed.label,
      group: parsed.group,
      kind: parsed.kind,
      value: readJson(parsed.value)
    }
  });
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/admin/settings");
}

export async function saveHomepageSectionAction(formData: FormData) {
  await requireAdmin();
  const parsed = homepageSectionSchema.parse({
    key: formValue(formData, "key"),
    title: formValue(formData, "title"),
    subtitle: formValue(formData, "subtitle"),
    enabled: checkbox(formData, "enabled"),
    sortOrder: formValue(formData, "sortOrder") || 0,
    content: formValue(formData, "content")
  });
  await prisma.homepageSection.upsert({
    where: { key: parsed.key },
    update: {
      title: parsed.title,
      subtitle: parsed.subtitle,
      enabled: parsed.enabled,
      sortOrder: parsed.sortOrder,
      content: readJson(parsed.content)
    },
    create: {
      key: parsed.key,
      title: parsed.title,
      subtitle: parsed.subtitle,
      enabled: parsed.enabled,
      sortOrder: parsed.sortOrder,
      content: readJson(parsed.content)
    }
  });
  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function trackView(postId: string, path: string, ip?: string | null, userAgent?: string | null) {
  const ipHash = hashValue(ip);
  await prisma.$transaction([
    prisma.post.update({ where: { id: postId }, data: { views: { increment: 1 } } }),
    prisma.postView.create({ data: { postId, path, ipHash, userAgent } })
  ]);
}
