const required = [
  "DATABASE_URL",
  "DIRECT_URL",
  "AUTH_URL",
  "NEXTAUTH_URL",
  "AUTH_SECRET",
  "NEXTAUTH_SECRET",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SITE_NAME"
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

if (process.env.AUTH_SECRET !== process.env.NEXTAUTH_SECRET) {
  console.warn("AUTH_SECRET and NEXTAUTH_SECRET should usually be the same value.");
}

try {
  const url = new URL(process.env.DATABASE_URL);
  if (url.protocol !== "postgresql:" && url.protocol !== "postgres:") {
    throw new Error("DATABASE_URL must use a PostgreSQL protocol.");
  }
} catch {
  console.error("DATABASE_URL is not a valid PostgreSQL connection URL. URL-encode reserved password characters.");
  process.exit(1);
}

console.log("Vercel environment check passed.");
