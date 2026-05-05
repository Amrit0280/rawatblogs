# KK Rawat Publishing Platform

Premium personal blogging and CMS platform for KK Rawat, built with Next.js App Router, TypeScript, Prisma, PostgreSQL, NextAuth, Tailwind CSS, and Framer Motion.

## Quick Start

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run dev
```

The admin panel is available at `/admin`.

## Production Notes

- Keep `.env` out of version control.
- Replace `NEXTAUTH_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` before deployment.
- Use `npm run prisma:deploy` on Vercel/Supabase production deployments.
- Configure `NEXT_PUBLIC_SITE_URL` to the live domain before launch.

## Database

The platform uses PostgreSQL through Prisma for users, posts, categories, tags, comments, media metadata, SEO settings, homepage sections, site settings, newsletters, contact inquiries, and analytics views.

If a database password contains reserved URL characters such as `?`, `@`, `%`, or `*`, encode the password segment in `DATABASE_URL`. Prisma receives the same underlying credentials, but the connection string remains parseable.
