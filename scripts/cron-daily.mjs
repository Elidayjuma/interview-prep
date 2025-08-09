#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

function loadEnv() {
  try {
    const scriptDir = dirname(fileURLToPath(import.meta.url));
    const candidates = [
      resolve(process.cwd(), ".env"),
      resolve(scriptDir, "..", ".env"),
      resolve(scriptDir, "..", ".env.local"),
      resolve(scriptDir, "..", "..", ".env"),
      resolve(scriptDir, "..", "..", ".env.local"),
    ];
    for (const p of candidates) {
      if (!existsSync(p)) continue;
      const txt = readFileSync(p, "utf8");
      for (const raw of txt.split(/\r?\n/)) {
        const line = raw.trim();
        if (!line || line.startsWith("#")) continue;
        const eq = line.indexOf("=");
        if (eq <= 0) continue;
        let key = line.slice(0, eq).trim();
        let val = line.slice(eq + 1).trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        if (!(key in process.env)) process.env[key] = val;
      }
      break;
    }
  } catch {}
}

loadEnv();

async function main() {
  const base = process.env.BASE_URL || "http://localhost:3000";
  const secret = process.env.CRON_SECRET;
  if (!secret) throw new Error("CRON_SECRET is not set");

  const boards = (process.env.GREENHOUSE_BOARDS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const includeRemoteOk =
    (process.env.REMOTE_OK ?? "true").toLowerCase() !== "false";

  const ingestRes = await fetch(`${base}/api/jobs/ingest`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-cron-secret": secret },
    body: JSON.stringify({
      greenhouseBoards: boards,
      remoteOk: includeRemoteOk,
    }),
  });
  if (!ingestRes.ok)
    throw new Error(
      `Ingest failed: ${ingestRes.status} ${await ingestRes.text()}`,
    );
  const ingestJson = await ingestRes.json();

  const cleanupRes = await fetch(`${base}/api/jobs/cleanup`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-cron-secret": secret },
    body: JSON.stringify({
      cutoffDays: Number(process.env.JOB_CUTOFF_DAYS) || 60,
    }),
  });
  if (!cleanupRes.ok)
    throw new Error(
      `Cleanup failed: ${cleanupRes.status} ${await cleanupRes.text()}`,
    );
  const cleanupJson = await cleanupRes.json();

  console.log("Daily cron finished:", {
    ingest: ingestJson,
    cleanup: cleanupJson,
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
