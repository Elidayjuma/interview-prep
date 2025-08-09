import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  const secretHeader = req.headers.get("x-cron-secret");
  const secret = process.env.CRON_SECRET;
  if (!secret || secretHeader !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let cutoffDays = 60;
  try {
    const body: any = await req.json();
    if (body && Number.isFinite(body.cutoffDays)) cutoffDays = Math.max(1, Math.floor(body.cutoffDays));
  } catch {}

  const cutoffDate = new Date(Date.now() - cutoffDays * 24 * 60 * 60 * 1000);

  const result = await prisma.job.deleteMany({
    where: {
      OR: [
        { postedAt: { lt: cutoffDate } },
        { AND: [{ postedAt: null }, { createdAt: { lt: cutoffDate } }] },
      ],
    },
  });

  return NextResponse.json({ ok: true, cutoffDays, cutoffDate, deletedCount: result.count });
}
