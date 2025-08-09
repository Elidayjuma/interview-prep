"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyPaystackAndActivate } from "@/actions/payments";

export default function PaystackVerifyPage() {
    const params = useSearchParams();
    const router = useRouter();
    const reference = params.get("reference") || "";
    const plan = params.get("plan") || "";
    const [message, setMessage] = useState("Verifying payment…");

    useEffect(() => {
        const run = async () => {
            if (!reference || !plan) {
                setMessage("Missing payment details.");
                return;
            }
            const res = await verifyPaystackAndActivate(reference, plan);
            if ((res as any).ok) {
                setMessage("Payment verified. Subscription activated.");
                setTimeout(() => router.replace("/dashboard/billing"), 1200);
            } else {
                setMessage(`Verification failed: ${(res as any).error || "Unknown error"}`);
            }
        };
        run();
    }, [reference, plan, router]);

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="text-center">
                <h1 className="text-xl font-semibold mb-2">{message}</h1>
                <p className="text-gray-600">You can close this tab if it doesn’t redirect.</p>
            </div>
        </div>
    );
}
