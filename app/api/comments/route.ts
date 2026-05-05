import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashValue, rateLimit, requestIdentity } from "@/lib/security";
import { commentSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const identity = requestIdentity(request);
  const limited = rateLimit(`comment:${identity}`, 5, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many comments. Please slow down." }, { status: 429 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = commentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete the comment form correctly." }, { status: 400 });
  }

  const post = await prisma.post.findUnique({ where: { id: parsed.data.postId }, select: { id: true } });
  if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });

  await prisma.comment.create({
    data: {
      ...parsed.data,
      website: parsed.data.website || null,
      email: parsed.data.email.toLowerCase(),
      ipHash: hashValue(identity),
      userAgent: request.headers.get("user-agent")
    }
  });

  return NextResponse.json({ ok: true });
}
