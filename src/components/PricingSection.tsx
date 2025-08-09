'use client';
import { tiers } from "@/data/pricing";
import { createPaystackCheckout } from "@/actions/payments";
import { FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";

const PricingSection = () => {
    const router = useRouter();

    const handleClick = async (tier: any) => {
        if (tier.price === 0) {
            router.push(tier.link);
            return;
        }
        const res = await createPaystackCheckout(tier.name);
        if ((res as any).ok && (res as any).authorization_url) {
            router.push((res as any).authorization_url);
        } else {
            // fallback to gateway redirect if init fails
            router.push(`/gateway/paystack?plan=${encodeURIComponent(tier.name)}`);
        }
    };

    return (
        <section className="py-16 bg-gray-50" id="pricing">
            <div className="max-w-5xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-4">Pricing</h2>
                <p className="text-center text-gray-600 mb-10">
                    Choose the plan that fits your job search needs.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {tiers.map((tier: any) => (
                        <div
                            key={tier.name}
                            className="bg-white rounded-lg shadow p-6 flex flex-col items-center"
                        >
                            <h3 className="text-xl font-semibold mb-2">
                                {tier.name}
                                {tier.name === "Pro" && (
                                    <span className="ml-2 text-sm bg-black text-primary"> </span>
                                )}
                            </h3>
                            <div className="text-3xl font-bold mb-4">
                                {tier.price === 0 ? "Free" : `$${tier.price}`}
                                {tier.name === "Pro" ? (
                                    <span className="text-base font-normal">/year <sub className="text-primary bg-black text-sm">Best value</sub></span>
                                ) : tier.name === "Starter" ? (
                                    <span className="text-base font-normal">/month</span>
                                ) : null}
                            </div>
                            <ul className="mb-6 space-y-2 w-full">
                                {tier.features.map((feature: any) => (
                                    <li key={feature} className="flex items-center gap-2 text-gray-700">
                                        <FaCheckCircle className="text-green-500" /> {feature}
                                    </li>
                                ))}
                            </ul>
                            <div className="w-full mt-auto">
                                <button
                                    onClick={() => handleClick(tier)}
                                    className={`w-full py-2 rounded font-semibold ${tier.name === "Pro"
                                        ? "bg-primary text-white"
                                        : "bg-primary text-white"
                                        }`}
                                >
                                    Choose Plan
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;