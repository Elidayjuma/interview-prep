#!/usr/bin/env ts-node
import 'dotenv/config';

async function main() {
  const base = process.env.BASE_URL || 'http://localhost:3000';
  const secret = process.env.CRON_SECRET;
  if (!secret) throw new Error('CRON_SECRET is not set');

  const body = {
    greenhouseBoards: (process.env.GREENHOUSE_BOARDS || '').split(',').map(s => s.trim()).filter(Boolean),
    remoteOk: (process.env.REMOTE_OK ?? 'true') !== 'false'
  };

  const res = await fetch(`${base}/api/jobs/ingest`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-cron-secret': secret,
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed: ${res.status} ${text}`);
  }
  const json = await res.json();
  console.log('Ingest result:', json);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
