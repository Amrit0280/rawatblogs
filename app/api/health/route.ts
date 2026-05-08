import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      ok: true,
      service: "kk-rawat-publishing-platform",
      database: "reachable"
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        service: "kk-rawat-publishing-platform",
        database: "unreachable"
      },
      { status: 503 }
    );
  }
}
