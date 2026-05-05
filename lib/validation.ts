import { z } from "zod";

export const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3),
  excerpt: z.string().min(20).max(320),
  content: z.string().min(50),
  coverImage: z.string().url().optional().or(z.literal("")),
  coverAlt: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"]),
  featured: z.coerce.boolean().default(false),
  trending: z.coerce.boolean().default(false),
  categoryId: z.string().optional().or(z.literal("")),
  tagIds: z.array(z.string()).default([]),
  scheduledAt: z.string().optional().or(z.literal("")),
  metaTitle: z.string().max(70).optional().or(z.literal("")),
  metaDescription: z.string().max(170).optional().or(z.literal("")),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
  ogImage: z.string().url().optional().or(z.literal(""))
});

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#2563eb")
});

export const tagSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2)
});

export const commentSchema = z.object({
  postId: z.string(),
  name: z.string().min(2).max(80),
  email: z.string().email(),
  website: z.string().url().optional().or(z.literal("")),
  body: z.string().min(5).max(1200)
});

export const newsletterSchema = z.object({
  email: z.string().email(),
  name: z.string().max(80).optional()
});

export const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  subject: z.string().min(3).max(140),
  message: z.string().min(10).max(2000)
});

export const siteSettingSchema = z.object({
  key: z.string().min(2),
  label: z.string().min(2),
  group: z.string().min(2),
  kind: z.enum(["TEXT", "JSON", "IMAGE", "BOOLEAN"]),
  value: z.string().min(1)
});

export const mediaSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
  title: z.string().optional(),
  mimeType: z.string().min(3),
  folder: z.string().min(2).default("general"),
  size: z.coerce.number().optional(),
  width: z.coerce.number().optional(),
  height: z.coerce.number().optional()
});

export const homepageSectionSchema = z.object({
  key: z.string().min(2),
  title: z.string().min(2),
  subtitle: z.string().optional(),
  enabled: z.coerce.boolean().default(false),
  sortOrder: z.coerce.number().default(0),
  content: z.string().min(2)
});
