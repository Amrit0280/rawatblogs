import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@kkrawat.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMeBeforeProduction!2026";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, role: "ADMIN", name: "KK Rawat" },
    create: {
      email: adminEmail,
      name: "KK Rawat",
      role: "ADMIN",
      bio: "Authority-driven personal brand publishing insight-rich essays and practical guidance.",
      passwordHash
    }
  });

  const strategy = await prisma.category.upsert({
    where: { slug: "strategy" },
    update: {},
    create: {
      name: "Strategy",
      slug: "strategy",
      description: "Clear thinking for brand, growth, leadership, and execution.",
      color: "#2563eb"
    }
  });

  await prisma.category.upsert({
    where: { slug: "leadership" },
    update: {},
    create: {
      name: "Leadership",
      slug: "leadership",
      description: "Ideas for building trust, clarity, and durable professional influence.",
      color: "#c79a2b"
    }
  });

  const tags = await Promise.all(
    ["Personal Brand", "SEO", "Growth", "Writing"].map((name) =>
      prisma.tag.upsert({
        where: { slug: name.toLowerCase().replace(/\s+/g, "-") },
        update: {},
        create: { name, slug: name.toLowerCase().replace(/\s+/g, "-") }
      })
    )
  );

  const post = await prisma.post.upsert({
    where: { slug: "building-authority-with-clear-digital-thinking" },
    update: {},
    create: {
      title: "Building Authority With Clear Digital Thinking",
      slug: "building-authority-with-clear-digital-thinking",
      excerpt:
        "A practical note on building a personal brand that earns trust through clarity, consistency, and useful ideas.",
      content:
        "Digital authority is not created by noise. It is built when a clear point of view meets useful execution again and again. KK Rawat's platform is designed for that rhythm: publish sharp ideas, organize them well, and make every article easy to discover, read, and share.\n\nThe strongest personal brands do not depend on a rented feed. They own their archive, their search presence, their reader relationship, and their editorial cadence.",
      coverImage:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
      coverAlt: "Premium editorial desk with laptop and notebook",
      status: "PUBLISHED",
      featured: true,
      trending: true,
      publishedAt: new Date(),
      readingMinutes: 3,
      categoryId: strategy.id,
      authorId: admin.id,
      metaTitle: "Building Authority With Clear Digital Thinking | KK Rawat",
      metaDescription:
        "A practical note on building a trusted personal brand through clarity, consistency, and useful publishing."
    }
  });

  await prisma.postTag.createMany({
    data: tags.slice(0, 3).map((tag) => ({ postId: post.id, tagId: tag.id })),
    skipDuplicates: true
  });

  await prisma.homepageSection.upsert({
    where: { key: "hero" },
    update: {},
    create: {
      key: "hero",
      title: "KK Rawat",
      subtitle: "Strategic insight, personal authority, and practical thinking for ambitious professionals.",
      sortOrder: 1,
      content: {
        eyebrow: "Personal publishing platform",
        primaryCta: "Read latest essays",
        secondaryCta: "About KK Rawat"
      }
    }
  });

  await prisma.siteSetting.createMany({
    data: [
      {
        key: "brand",
        label: "Brand",
        group: "branding",
        kind: "JSON",
        value: {
          name: "KK Rawat",
          tagline: "Authority-led ideas for modern growth",
          accent: "#c79a2b"
        }
      },
      {
        key: "contact",
        label: "Contact Details",
        group: "contact",
        kind: "JSON",
        value: {
          email: "hello@kkrawat.com",
          phone: "",
          location: "India",
          linkedin: "https://linkedin.com",
          x: "https://x.com"
        }
      },
      {
        key: "about",
        label: "About Page",
        group: "pages",
        kind: "JSON",
        value: {
          headline: "A clear voice for strategy, growth, and professional credibility.",
          body: "KK Rawat publishes thoughtful, practical writing for readers who value clarity, execution, and long-term brand trust.",
          achievements: ["Independent publishing ownership", "SEO-first digital presence", "Editorial-grade knowledge hub"]
        }
      }
    ],
    skipDuplicates: true
  });

  await prisma.seoSetting.createMany({
    data: [
      {
        route: "/",
        title: "KK Rawat | Strategic Personal Brand Publishing",
        description: "Essays, insight, and authority-led thinking from KK Rawat."
      },
      {
        route: "/about",
        title: "About KK Rawat",
        description: "Learn about KK Rawat's vision, expertise, and professional story."
      }
    ],
    skipDuplicates: true
  });

  console.log(`Seeded admin user: ${adminEmail}`);
  console.log(`Use ADMIN_PASSWORD from .env for the first login, then rotate it.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
