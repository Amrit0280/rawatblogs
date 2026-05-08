# Vercel Deployment

This project is ready for Vercel as a Next.js application with Prisma and Supabase PostgreSQL.

## Vercel Settings

- Framework preset: `Next.js`
- Install command: `npm install`
- Build command: `npm run vercel:build`
- Output directory: `.next`
- Node runtime: Vercel default Node.js runtime
- Region: `bom1` in `vercel.json`

## Environment Variables

Add these in Vercel Project Settings > Environment Variables for Production, Preview, and Development as needed:

```bash
DATABASE_URL="postgresql://postgres:URL_ENCODED_PASSWORD@HOST:5432/postgres"
AUTH_URL="https://your-domain.com"
NEXTAUTH_URL="https://your-domain.com"
AUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_SECRET="same-value-as-AUTH_SECRET"
ADMIN_EMAIL="admin@kkrawat.com"
ADMIN_PASSWORD="set-a-strong-initial-password"
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
NEXT_PUBLIC_SITE_NAME="KK Rawat"
```

Use the URL-encoded database password. Reserved characters such as `?`, `@`, `%`, and `*` must be encoded inside the password segment.

## Database Deployment

The Supabase database already has the initial migration and seed data applied. For future schema changes, run:

```bash
npm run prisma:deploy
```

Then redeploy on Vercel.

## Preflight

```bash
npm run vercel:env
npm run lint
npx tsc --noEmit
npm run build
```

After deploy, check:

- `/`
- `/blog`
- `/admin/login`
- `/api/health`
- `/sitemap.xml`
