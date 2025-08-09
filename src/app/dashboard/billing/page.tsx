"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashLayout from "@/components/Layouts/DashLayout";
import { listSubscriptionPlans, getActiveUserSubscription, startOrUpgradeSubscription, getPromptUsage } from "@/actions/actions";
import { createPaystackCheckout } from "@/actions/payments";
import { returnLogedIUser } from "@/actions/actions";

type Plan = {
    id: number;
    name: string;
    priceCents: number;
    currency: string;
    interval: "MONTHLY" | "YEARLY";
    promptLimitMonthly: number | null;
    description?: string | null;
};

export default function BillingPage() {
    const router = useRouter();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [active, setActive] = useState<any>(null);
    const [usage, setUsage] = useState<{ promptsUsed: number; promptLimitMonthly: number | typeof Infinity; remaining: number | typeof Infinity } | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const user = await returnLogedIUser();
            if (user?.id) setUserId(user.id);
            const [p, a] = await Promise.all([
                listSubscriptionPlans(),
                user?.id ? getActiveUserSubscription(user.id) : Promise.resolve(null),
            ]);
            setPlans(p as any);
            setActive(a as any);
            if (user?.id) {
                const u = await getPromptUsage(user.id);
                setUsage(u as any);
            }
            setLoading(false);
        };
        init();
    }, []);

    const handleCheckout = async (planName: string) => {
        console.log("Initiating checkout for plan:", planName);
        const res = await createPaystackCheckout(planName);
        console.log("Checkout response:", res);
        if ((res as any).ok && (res as any).authorization_url) {
            router.push((res as any).authorization_url);
        } else {
            return;
            // router.push(`/gateway/paystack?plan=${encodeURIComponent(planName)}`);
        }
    };

    return (
        <DashLayout>
            <div className="max-w-4xl mx-auto py-8 px-2 sm:px-4">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6">Billing</h1>

                {usage && (
                    <div className="mb-6 p-4 rounded border bg-gray-50">
                        <h2 className="font-semibold mb-2">Prompt Usage</h2>
                        <p>
                            Used: <b>{usage.promptsUsed}</b>
                            {Number.isFinite(usage.promptLimitMonthly as number) ? (
                                <> / <b>{usage.promptLimitMonthly as number}</b> (Remaining: <b>{Number.isFinite(usage.remaining as number) ? (usage.remaining as number) : "∞"}</b>)</>
                            ) : (
                                <> / <b>Unlimited</b></>
                            )}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map((plan) => {
                        const isActive = active?.planId === plan.id && active?.status === "ACTIVE";
                        const price = (plan.priceCents / 100).toFixed(2);
                        return (
                            <div key={plan.id} className={`rounded border p-4 ${isActive ? "border-primary shadow" : "border-gray-200"}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                                    {isActive && <span className="text-xs px-2 py-1 bg-primary text-white rounded">Current</span>}
                                </div>
                                <div className="text-2xl font-bold mb-2">
                                    {plan.currency} {price} <span className="text-sm font-normal">/{plan.interval === 'MONTHLY' ? 'month' : 'year'}</span>
                                </div>
                                {plan.promptLimitMonthly === null ? (
                                    <p className="text-gray-700 mb-4">Unlimited prompts</p>
                                ) : (
                                    <p className="text-gray-700 mb-4">Up to {plan.promptLimitMonthly} prompts / month</p>
                                )}
                                {plan.description && <p className="text-sm text-gray-600 mb-4">{plan.description}</p>}
                                <button
                                    className={`w-full py-2 rounded font-semibold ${isActive ? 'bg-gray-200 text-gray-700 cursor-default' : 'bg-primary text-white'}`}
                                    disabled={isActive || loading}
                                    onClick={() => handleCheckout(plan.name)}
                                >
                                    {isActive ? 'Current Plan' : 'Choose Plan'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </DashLayout>
    );
}
