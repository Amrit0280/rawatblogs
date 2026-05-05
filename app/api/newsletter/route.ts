import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, requestIdentity } from "@/lib/security";
import { newsletterSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const identity = requestIdentity(request);
  const limited = rateLimit(`newsletter:${identity}`, 5, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  await prisma.newsletter.upsert({
    where: { email: parsed.data.email.toLowerCase() },
    update: { name: parsed.data.name },
    create: {
      email: parsed.data.email.toLowerCase(),
      name: parsed.data.name,
      source: "website"
    }
  });

  return NextResponse.json({ ok: true });
}
