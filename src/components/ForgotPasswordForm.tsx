"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/app/auth/actions";

export function ForgotPasswordForm({ initialError }: { initialError?: string }) {
  const [state, formAction, pending] = useActionState(requestPasswordReset, undefined);

  const error = state?.error ?? (!state ? initialError : undefined);
  const success = state?.success;

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-2xl font-semibold tracking-tight">
          Reset your password
        </h1>
        <p className="mb-6 text-center text-sm text-zinc-600">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-zinc-600">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-emerald-600">{success}</p>}
          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-md bg-zinc-900 px-3 py-2 font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-60"
          >
            {pending ? "Please wait…" : "Send reset link"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-600">
          <Link href="/login" className="font-medium text-zinc-900 underline">
            Back to log in
          </Link>
        </p>
      </div>
    </div>
  );
}
