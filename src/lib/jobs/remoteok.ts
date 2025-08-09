import type { JobUpsert } from "./greenhouse";

export async function fetchRemoteOk(): Promise<JobUpsert[]> {
  const res = await fetch("https://remoteok.com/api", { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  const items = Array.isArray(data) ? data : [];
  // first element is metadata; skip if it has no id
  return items
    .filter((it: any) => it && it.id && it.url)
    .map((it: any) => ({
      source: "REMOTE_OK" as const,
      externalId: String(it.id),
      url: it.url,
      title: it.position || it.title || "",
      companyName: it.company || undefined,
      location: (it.location || it.country || "").toString() || undefined,
      remoteType: it.remote ? "remote" : undefined,
      employmentType: it.employment_type || undefined,
      salaryMin: undefined,
      salaryMax: undefined,
      currency: undefined,
      postedAt: it.date ? new Date(it.date) : undefined,
      expiresAt: undefined,
      tags: it.tags || it.keywords || null,
      description: it.description || undefined,
    }));
}
