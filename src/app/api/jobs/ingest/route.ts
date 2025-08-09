import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { fetchGreenhouse } from "@/lib/jobs/greenhouse";
import { fetchRemoteOk } from "@/lib/jobs/remoteok";

// Minimal type to match our adapters
interface JobUpsert {
  source: "GREENHOUSE" | "REMOTE_OK";
  externalId?: string | null;
  url: string;
  title: string;
  companyName?: string | null;
  location?: string | null;
  remoteType?: string | null;
  employmentType?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  currency?: string | null;
  postedAt?: Date | null;
  expiresAt?: Date | null;
  tags?: any;
  description?: string | null;
}

async function upsertJobs(items: JobUpsert[]) {
  const db = prisma as any;
  let created = 0, updated = 0;
  for (const j of items) {
    const where = j.externalId ? { source_externalId: { source: j.source, externalId: j.externalId } } : undefined as any;
    if (where) {
      const res = await db.job.upsert({
        where,
        create: j,
        update: {
          url: j.url,
          title: j.title,
          companyName: j.companyName,
          location: j.location,
          remoteType: j.remoteType,
          employmentType: j.employmentType,
          salaryMin: j.salaryMin,
          salaryMax: j.salaryMax,
          currency: j.currency,
          postedAt: j.postedAt,
          expiresAt: j.expiresAt,
          tags: j.tags,
          description: j.description,
          status: "ACTIVE",
        },
      });
      if (res.createdAt.getTime() === res.updatedAt.getTime()) created++; else updated++;
    } else {
      const res = await db.job.create({ data: j });
      if (res) created++;
    }
  }
  return { created, updated };
}

export async function POST(req: NextRequest) {
  const secretHeader = req.headers.get("x-cron-secret");
  const secret = process.env.CRON_SECRET;
  if (!secret || secretHeader !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

  let body: any = {};
  try {
    body = await req.json();
  } catch {}

  const greenhouseBoards: string[] = body.greenhouseBoards || [];
  const includeRemoteOk: boolean = body.remoteOk ?? true;

  const batches: JobUpsert[] = [];
  for (const board of greenhouseBoards) {
    try {
      const items = await fetchGreenhouse(board);
      batches.push(...items);
    } catch (e) {
      console.error("greenhouse adapter failed", board, e);
    }
  }

  if (includeRemoteOk) {
    try {
      const items = await fetchRemoteOk();
      batches.push(...items);
    } catch (e) {
      console.error("remoteok adapter failed", e);
    }
  }

  const result = await upsertJobs(batches);
  return NextResponse.json({ ok: true, ...result, count: batches.length });
}
