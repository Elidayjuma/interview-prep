"use client";
import React, { useActionState, useEffect, useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { createUser } from "./actions";
import AuthLayout from "@/components/Layouts/AuthLayout";


type FormState = {
    errors?: {
        full_name?: string[];
        email?: string[];
        password?: string[];
        password_confirmation?: string[];
    };
    email?: string;
    password?: string;
    name?: string;
};

export default function SignUp() {
    const [state, signupAction] = useActionState<FormState, FormData>(createUser, {});
    const [showPassword, setShowPassword] = useState(false);


    return (
        <AuthLayout>
            <span className="mb-1.5 block font-medium">Start for free</span>
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign Up To InterviewPrep
            </h2>

            <form action={signupAction}>
                <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Name
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="full_name"
                            placeholder="Enter your full name"
                            defaultValue={state?.name || ""}
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>
                    {state?.errors?.full_name && (
                        <p className="text-red-500 mt-1">{state.errors.full_name}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Email
                    </label>
                    <div className="relative">
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            defaultValue={state?.email || ""}
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>
                    {state?.errors?.email && (
                        <p className="text-red-500 mt-1">{state.errors.email}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter your password"
                            defaultValue={state?.password || ""}
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                // Eye-off icon
                                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeWidth="2" d="M3 3l18 18M1 12s4-7 11-7 11 7 11 7-4 7-11 7c-2.5 0-4.7-.7-6.5-1.9M9.5 9.5a3 3 0 104.2 4.2" />
                                </svg>
                            ) : (
                                // Eye icon
                                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeWidth="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {state?.errors?.password && (
                        <p className="text-red-500 mt-1">{state.errors.password}</p>
                    )}
                    <div className="mt-2 text-sm text-gray-500">
                        <p>Password must contain:</p>
                        <ul className="list-disc list-inside">
                            <li>At least 8 characters</li>
                            <li>One uppercase letter</li>
                            <li>One lowercase letter</li>
                            <li>One number</li>
                            <li>One special character</li>
                        </ul>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Re-type Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password_confirmation"
                            placeholder="Re-enter your password"
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                // Eye-off icon
                                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeWidth="2" d="M3 3l18 18M1 12s4-7 11-7 11 7 11 7-4 7-11 7c-2.5 0-4.7-.7-6.5-1.9M9.5 9.5a3 3 0 104.2 4.2" />
                                </svg>
                            ) : (
                                // Eye icon
                                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeWidth="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {state?.errors?.password_confirmation && (
                        <p className="text-red-500 mt-1">{state.errors.password_confirmation}</p>
                    )}
                </div>

                <SubmitButton />

                <div className="mt-6 text-center">
                    <p>
                        Already have an account?{" "}
                        <Link href="/auth/signin" className="text-primary">
                            Sign in
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <div className="mb-5">
            <button
                disabled={pending}
                type="submit"
                className={`w-full flex items-center justify-center gap-2 rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 disabled:opacity-50`}
            >
                {pending ? (
                    <>
                        <span className="loader border-white border-t-transparent" />
                        Creating account...
                    </>
                ) : (
                    "Sign up"
                )}
            </button>
        </div>
    );
}
