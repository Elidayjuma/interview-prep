"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { verifyResetToken, resetPasswordWithToken } from "../../actions";
import Loader from "@/components/common/Loader";
import AuthLayout from "@/components/Layouts/AuthLayout";

export default function ResetPasswordTokenPage() {
    const params = useParams();
    const token = params.token as string;
    const router = useRouter();
    const [status, setStatus] = useState<"checking" | "invalid" | "valid" | "success" | "error">("checking");
    const [error, setError] = useState<string | null>(null);
    const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
    const [confirmErrors, setConfirmErrors] = useState<string[]>([]);

    useEffect(() => {
        const checkToken = async () => {
            const valid = await verifyResetToken(token);
            setStatus(valid ? "valid" : "invalid");
        };
        checkToken();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("checking");
        setError(null);
        const form = e.currentTarget;
        const password = form.password.value;
        const confirm = form.confirm.value;
        if (password !== confirm) {
            setError("Passwords do not match.");
            setStatus("valid");
            return;
        }
        const result = await resetPasswordWithToken(token, password, confirm);
        console.log(result);
        if (result.success) {
            setStatus("success");
            setTimeout(() => router.push("/auth/signin"), 2000);
        } else {
            setPasswordErrors(result.errors?.password || []);
            setConfirmErrors(result.errors?.confirm || []);
            setStatus("valid");
        }
    };

    if (status === "checking") return <Loader />;
    if (status === "invalid")
        return (
            <AuthLayout>
                <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow text-center">
                    <h2 className="text-xl font-bold mb-2">Invalid or Expired Link</h2>
                    <p className="mb-4">Your password reset link is invalid or has expired.</p>
                    <a href="/auth/reset-password" className="text-primary underline">Request a new reset link</a>
                </div>
            </AuthLayout>
        );
    if (status === "success")
        return (
            <AuthLayout>
                <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow text-center">
                    <h2 className="text-xl font-bold mb-2">Password Reset Successful</h2>
                    <p>You will be redirected to sign in...</p>
                </div>
            </AuthLayout>
        );

    // status === "valid"
    return (
        <AuthLayout>
            <span className="mb-1.5 block font-medium">Reset Password</span>
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Create New Password
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">New Password</label>
                    <input
                        type="password"
                        name="password"
                        minLength={8}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                    {passwordErrors.length > 0 && (
                        <ul className="text-red-500 mb-2">
                            {passwordErrors.map((err, idx) => (
                                <li key={idx}>{err}</li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Confirm Password</label>
                    <input
                        type="password"
                        name="confirm"
                        minLength={8}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                    {confirmErrors.length > 0 && (
                        <ul className="text-red-500 mb-2">
                            {confirmErrors.map((err, idx) => (
                                <li key={idx}>{err}</li>
                            ))}
                        </ul>
                    )}
                </div>
                {error && <div className="text-red-500 mb-2">{error}</div>}
                <button
                    type="submit"
                    className="w-full bg-primary text-white py-2 rounded font-semibold"
                >
                    Reset Password
                </button>

            </form>

        </AuthLayout>
    );
}