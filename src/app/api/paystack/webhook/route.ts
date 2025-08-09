import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/db";
import { startOrUpgradeSubscription } from "@/actions/actions";

export async function POST(req: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return NextResponse.json({ error: "Missing secret" }, { status: 500 });

  const raw = await req.text();
  const signature = req.headers.get("x-paystack-signature") || "";
  const hash = crypto.createHmac("sha512", secret).update(raw).digest("hex");
  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(raw);
  const type = event?.event;
  const data = event?.data;

  if (type === "charge.success") {
    try {
      // Try to get plan name from metadata
      const planName: string | undefined = data?.metadata?.plan || data?.plan || undefined;
      const email: string | undefined = data?.customer?.email;
      if (!planName || !email) return NextResponse.json({ ok: true });

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return NextResponse.json({ ok: true });

      const plan = await (prisma as any).subscriptionPlan.findUnique({ where: { name: planName } });
      if (!plan) return NextResponse.json({ ok: true });

      await startOrUpgradeSubscription({
        userId: user.id,
        planId: plan.id,
        externalProvider: "paystack",
        externalReference: data?.reference,
      });
    } catch (e) {
      // swallow errors to avoid retry storms
    }
  }

  return NextResponse.json({ ok: true });
}
