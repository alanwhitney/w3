"use client";

import { useActionState } from "react";
import Link from "next/link";

type AuthAction = (
  prevState: unknown,
  formData: FormData,
) => Promise<{ error?: string } | undefined>;

export function AuthForm({
  action,
  heading,
  submitLabel,
  altHref,
  altLabel,
  showForgotPassword,
}: {
  action: AuthAction;
  heading: string;
  submitLabel: string;
  altHref: string;
  altLabel: string;
  showForgotPassword?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-center text-2xl font-semibold tracking-tight">
          {heading}
        </h1>
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
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between">
              <label htmlFor="password" className="text-sm font-medium text-zinc-600">
                Password
              </label>
              {showForgotPassword && (
                <Link href="/forgot-password" className="text-sm text-zinc-500 underline hover:text-zinc-900">
                  Forgot password?
                </Link>
              )}
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
            />
          </div>
          {state?.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-md bg-zinc-900 px-3 py-2 font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-60"
          >
            {pending ? "Please wait…" : submitLabel}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-600">
          <Link href={altHref} className="font-medium text-zinc-900 underline">
            {altLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}
