"use server";
import { session_data } from "../middleware";
import prisma from "@/lib/db";
import { startOrUpgradeSubscription } from "@/actions/actions";

export async function getPlanByName(name: string) {
  const db = prisma as any;
  return db.subscriptionPlan.findUnique({ where: { name } });
}

export async function verifyPaystackAndActivate(reference: string, planName: string) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return { ok: false, error: "Missing PAYSTACK_SECRET_KEY" };

  try {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}` , {
      headers: { Authorization: `Bearer ${secret}` },
      cache: "no-store",
    });
    if (!res.ok) return { ok: false, error: `Verify failed (${res.status})` };
    const body = await res.json();

    const status = body?.data?.status;
    if (status !== "success") return { ok: false, error: "Payment not successful" };

    const plan = await getPlanByName(planName);
    if (!plan) return { ok: false, error: "Plan not found" };

    const session = await session_data();
    const userId = session?.userId ? parseInt(session.userId as string, 10) : undefined;
    if (!userId) return { ok: false, error: "Not authenticated" };

    await startOrUpgradeSubscription({
      userId,
      planId: plan.id,
      externalProvider: "paystack",
      externalReference: reference,
    });

    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Unexpected error" };
  }
}

export async function createPaystackCheckout(planName: string) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const baseUrl = process.env.BASE_URL; // e.g., https://<your-tunnel> or prod domain
  if (!secret || !baseUrl) return { ok: false, error: "Missing PAYSTACK_SECRET_KEY or BASE_URL" };

  const plan = await getPlanByName(planName);
  if (!plan) return { ok: false, error: "Plan not found" };

  const session = await session_data();
  const email = (session?.email as string) || "";
  if (!email) return { ok: false, error: "Missing user email" };

  const currency = process.env.PAYSTACK_CURRENCY || plan.currency || "NGN";
  const payload = {
    email,
    amount: plan.priceCents, // price in smallest unit
    currency,
    callback_url: `${baseUrl}/gateway/paystack/verify?plan=${encodeURIComponent(plan.name)}`,
    metadata: {
      plan: plan.name,
    },
  } as any;

  try {
    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (!res.ok) return { ok: false, error: `Init failed (${res.status})` };
    const body = await res.json();
    const authUrl = body?.data?.authorization_url;
    const reference = body?.data?.reference;
    if (!authUrl) return { ok: false, error: "Missing authorization_url" };
    return { ok: true, authorization_url: authUrl, reference };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Unexpected error" };
  }
}
