import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, requestIdentity } from "@/lib/security";
import { contactSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const identity = requestIdentity(request);
  const limited = rateLimit(`contact:${identity}`, 4, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many messages. Please try again soon." }, { status: 429 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete all fields correctly." }, { status: 400 });
  }

  await prisma.contactInquiry.create({ data: parsed.data });
  return NextResponse.json({ ok: true });
}
