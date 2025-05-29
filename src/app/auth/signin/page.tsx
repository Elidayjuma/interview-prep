"use client";
import React, { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";

import { login } from "./actions";
import AuthLayout from "@/components/Layouts/AuthLayout";


export default function SignIn() {
  const [state, loginAction] = useActionState(login, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthLayout>
      <span className="mb-1.5 block font-medium">Start for free</span>
      <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
        Sign In To InterviewPrep
      </h2>

      <form action={loginAction}>
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              defaultValue={state?.email || ""}
              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />

            <span className="absolute right-4 top-4">
              <svg
                className="fill-current"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.5">
                  <path
                    d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                    fill=""
                  />
                </g>
              </svg>
            </span>
          </div>
        </div>
        {state?.errors?.email && (
          <p className="text-red-500">{state.errors.email}</p>
        )}


        <div className="mb-6">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="6+ Characters, 1 Capital letter"
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
        </div>
        {state?.errors?.password && (
          <p className="text-red-500">{state.errors.password}</p>
        )}
        <div className="mb-4 flex justify-end">
          <Link href="/auth/reset-password" className="text-sm text-primary hover:underline">
            Forgot Password?
          </Link>
        </div>
        <SubmitButton />

        <div className="mt-6 text-center">
          <p>
            Don&apos;t have any account?{" "}
            <Link href="/auth/signup" className="text-primary">
              Sign Up
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
            Signing In...
          </>
        ) : (
          "Sign In"
        )}
      </button>
    </div>
  );
}



