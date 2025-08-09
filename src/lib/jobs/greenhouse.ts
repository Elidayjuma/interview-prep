export type JobUpsert = {
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
};

export async function fetchGreenhouse(companyBoard: string): Promise<JobUpsert[]> {
  const url = `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(companyBoard)}/jobs?content=true`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  const jobs = (data?.jobs ?? []) as any[];
  return jobs.map((j) => ({
    source: "GREENHOUSE",
    externalId: String(j.id),
    url: j.absolute_url,
    title: j.title,
    companyName: j?.company?.name ?? undefined,
    location: j?.location?.name ?? undefined,
    remoteType: undefined,
    employmentType: undefined,
    salaryMin: undefined,
    salaryMax: undefined,
    currency: undefined,
    postedAt: j.updated_at ? new Date(j.updated_at) : undefined,
    expiresAt: undefined,
    tags: j?.metadata ?? null,
    description: j?.content ?? undefined,
  }));
}
