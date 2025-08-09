"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { tiers } from "@/data/pricing";

export default function PaystackGateway() {
    const router = useRouter();
    const params = useSearchParams();
    const plan = params.get("plan")?.toLowerCase();

    useEffect(() => {
        if (!plan) return;
        const match = tiers.find(t => t.name.toLowerCase() === plan);
        let link = match?.link;
        if (link) {
            // Pass plan name forward when possible (Paystack Shop may not accept metadata; kept for future custom checkout)
            const url = new URL(link);
            if (!url.searchParams.has("plan")) {
                url.searchParams.set("plan", match!.name);
            }
            link = url.toString();
            // Redirect to external Paystack link
            router.replace(link);
        } else {
            // Fallback to pricing section on homepage
            router.replace("/#pricing");
        }
    }, [plan, router]);

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="text-center">
                <h1 className="text-xl font-semibold mb-2">Redirecting to payment…</h1>
                <p className="text-gray-600">If you are not redirected automatically, please return to pricing and try again.</p>
            </div>
        </div>
    );
}
