import { createHash } from "crypto";
import { NextRequest } from "next/server";

const memoryBuckets = new Map<string, { count: number; expiresAt: number }>();

export function hashValue(value?: string | null) {
  if (!value) return null;
  return createHash("sha256").update(value).digest("hex");
}

export function requestIdentity(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous"
  );
}

export function rateLimit(key: string, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const bucket = memoryBuckets.get(key);

  if (!bucket || bucket.expiresAt < now) {
    memoryBuckets.set(key, { count: 1, expiresAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return { ok: false, remaining: 0 };
  }

  bucket.count += 1;
  return { ok: true, remaining: limit - bucket.count };
}
