import prisma from "@/lib/db";
import type { Job, JobSourceType, JobStatus } from "@prisma/client";
import DashLayout from "@/components/Layouts/DashLayout";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

function val(sp: SearchParams, key: string) {
    const v = sp?.[key];
    return Array.isArray(v) ? v[0] : v;
}

function num(sp: SearchParams, key: string, fallback: number) {
    const n = parseInt(val(sp, key) || "", 10);
    return Number.isFinite(n) && n > 0 ? n : fallback;
}

export default async function JobsPage({ searchParams }: { searchParams?: Promise<any> }) {
    const sp: SearchParams = (await searchParams) ?? {};
    const q = val(sp, "q")?.trim() || "";
    const location = val(sp, "location")?.trim() || "";
    const company = val(sp, "company")?.trim() || "";
    const source = val(sp, "source") as JobSourceType | undefined;
    const status = (val(sp, "status") as JobStatus | undefined) || "ACTIVE";
    const employmentType = val(sp, "employmentType")?.trim() || "";
    const page = num(sp, "page", 1);
    const pageSize = Math.min(num(sp, "pageSize", 20), 100);

    const where: any = {
        status,
        ...(q
            ? {
                OR: [
                    { title: { contains: q } },
                    { companyName: { contains: q } },
                    { location: { contains: q } },
                ],
            }
            : {}),
        ...(location ? { location: { contains: location } } : {}),
        ...(company ? { companyName: { contains: company } } : {}),
        ...(source ? { source } : {}),
        ...(employmentType ? { employmentType: { contains: employmentType } } : {}),
    };

    const [total, jobs] = await Promise.all([
        prisma.job.count({ where }),
        prisma.job.findMany({
            where,
            orderBy: [{ postedAt: "desc" as const }, { createdAt: "desc" as const }],
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
    ]);

    const pageCount = Math.max(1, Math.ceil(total / pageSize));

    function qs(update: Record<string, string | number | undefined>) {
        const u = new URLSearchParams();
        if (q) u.set("q", q);
        if (location) u.set("location", location);
        if (company) u.set("company", company);
        if (source) u.set("source", source);
        if (status) u.set("status", status);
        if (employmentType) u.set("employmentType", employmentType);
        u.set("pageSize", String(pageSize));
        u.set("page", String(page));
        for (const [k, v] of Object.entries(update)) {
            if (v === undefined || v === "") u.delete(k);
            else u.set(k, String(v));
        }
        return `?${u.toString()}`;
    }

    function timeAgo(d?: Date | null) {
        if (!d) return "";
        const ms = Date.now() - new Date(d).getTime();
        const sec = Math.floor(ms / 1000);
        if (sec < 60) return `${sec}s ago`;
        const min = Math.floor(sec / 60);
        if (min < 60) return `${min}m ago`;
        const hr = Math.floor(min / 60);
        if (hr < 48) return `${hr}h ago`;
        const day = Math.floor(hr / 24);
        if (day < 30) return `${day}d ago`;
        const mo = Math.floor(day / 30);
        if (mo < 12) return `${mo}mo ago`;
        const yr = Math.floor(day / 365);
        return `${yr}y ago`;
    }

    function firstDomain(url?: string | null) {
        try {
            if (!url) return "";
            const u = new URL(url);
            return u.hostname;
        } catch {
            return "";
        }
    }

    function asTags(input: any): string[] {
        if (!input) return [];
        if (Array.isArray(input)) return input.slice(0, 3).map((x) => String(x)).filter(Boolean);
        if (typeof input === "string") return input.split(/[\,\s]+/).slice(0, 3);
        if (typeof input === "object") {
            // try common shapes: {tags:[], keywords:[], skills:[]}
            const arr = (input.tags || input.keywords || input.skills || []) as any[];
            return Array.isArray(arr) ? arr.slice(0, 3).map(String) : [];
        }
        return [];
    }

    function excerptFromHtml(html?: string | null, maxWords = 100) {
        if (!html) return "";
        try {
            const text = String(html)
                .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
                .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
                .replace(/<[^>]+>/g, " ")
                .replace(/&nbsp;/g, " ")
                .replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/\s+/g, " ")
                .trim();
            const parts = text.split(/\s+/);
            return parts.length > maxWords ? parts.slice(0, maxWords).join(" ") + "…" : text;
        } catch {
            return "";
        }
    }

    return (
        <DashLayout>
            <main className="mx-auto max-w-6xl px-4 py-10">
                <h1 className="text-2xl font-semibold mb-6">Jobs</h1>

                <form className="mb-6 grid gap-3 md:grid-cols-6" action="/dashboard/jobs" method="get">
                    <input name="q" defaultValue={q} placeholder="Search title or company" className="md:col-span-2 rounded border px-3 py-2" />
                    <input name="location" defaultValue={location} placeholder="Location" className="rounded border px-3 py-2" />
                    <input name="company" defaultValue={company} placeholder="Company" className="rounded border px-3 py-2" />
                    <select name="source" defaultValue={source || ""} className="rounded border px-3 py-2">
                        <option value="">Any source</option>
                        <option value="GREENHOUSE">Greenhouse</option>
                        <option value="REMOTE_OK">Remote OK</option>
                    </select>
                    <select name="status" defaultValue={status || "ACTIVE"} className="rounded border px-3 py-2">
                        <option value="ACTIVE">Active</option>
                        <option value="EXPIRED">Expired</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                    <input name="employmentType" defaultValue={employmentType} placeholder="Employment Type" className="rounded border px-3 py-2" />
                    <div className="md:col-span-6 flex gap-2">
                        <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white">Filter</button>
                        <a href="/dashboard/jobs" className="rounded border px-4 py-2">Reset</a>
                    </div>
                </form>

                <div className="mb-4 text-sm text-gray-600">{total} result{total === 1 ? "" : "s"}</div>

                {jobs.length === 0 ? (
                    <div className="rounded border p-10 text-center text-gray-600">No jobs found. Try adjusting filters.</div>
                ) : (
                    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {jobs.map((j: Job) => {
                            const tags = asTags(j.tags);
                            const host = firstDomain(j.url);
                            const rel = timeAgo(j.postedAt || j.createdAt);
                            const excerpt = excerptFromHtml(j.description, 100);
                            return (
                                <li key={j.id} className="rounded border p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex items-start gap-3">
                                        <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                                            {host ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img alt="" src={`https://www.google.com/s2/favicons?sz=64&domain_url=${host}`} className="h-6 w-6" />
                                            ) : (
                                                <span className="text-sm text-gray-500">{(j.companyName || j.title)[0]}</span>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <a href={j.url} target="_blank" rel="noreferrer" className="block truncate text-base font-medium text-blue-600 hover:underline">
                                                {j.title}
                                            </a>
                                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                                                {j.companyName && <span className="truncate">{j.companyName}</span>}
                                                {(j.companyName && (j.location || rel)) && <span>•</span>}
                                                {j.location && <span className="truncate">{j.location}</span>}
                                                {rel && <span>• {rel}</span>}
                                            </div>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {j.employmentType && (
                                                    <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-xs">{j.employmentType}</span>
                                                )}
                                                {j.remoteType && (
                                                    <span className="rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 text-xs">{j.remoteType}</span>
                                                )}
                                                <span className="rounded-full bg-gray-50 text-gray-700 border border-gray-200 px-2 py-0.5 text-xs">{j.source}</span>
                                            </div>
                                            {excerpt && (
                                                <p className="mt-3 text-sm text-gray-700 line-clamp-5">{excerpt}</p>
                                            )}
                                            {tags.length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-1.5">
                                                    {tags.map((t, i) => (
                                                        <span key={i} className="rounded bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700">{t}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between">
                                        <a href="/dashboard/resume-builder" className="rounded border px-3 py-1.5 text-xs hover:bg-gray-50">Generate CV/Letter</a>
                                        <a href={j.url} target="_blank" rel="noreferrer" className="rounded bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700">Apply</a>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}

                <div className="mt-8 flex items-center justify-between">
                    <a
                        className={`rounded border px-3 py-2 ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
                        href={qs({ page: Math.max(1, page - 1) })}
                        aria-disabled={page <= 1}
                    >
                        ← Prev
                    </a>
                    <div className="text-sm text-gray-600">Page {page} of {pageCount}</div>
                    <a
                        className={`rounded border px-3 py-2 ${page >= pageCount ? "pointer-events-none opacity-50" : ""}`}
                        href={qs({ page: Math.min(pageCount, page + 1) })}
                        aria-disabled={page >= pageCount}
                    >
                        Next →
                    </a>
                </div>
            </main>
        </DashLayout>
    );
}
