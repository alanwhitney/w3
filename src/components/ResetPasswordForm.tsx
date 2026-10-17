"use client";

import { useActionState, useState } from "react";
import { updatePassword } from "@/app/auth/actions";

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(updatePassword, undefined);
  const [mismatch, setMismatch] = useState(false);

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-center text-2xl font-semibold tracking-tight">
          Set a new password
        </h1>
        <form
          action={formAction}
          onSubmit={(e) => {
            const form = e.currentTarget;
            const password = (form.elements.namedItem("password") as HTMLInputElement).value;
            const confirm = (form.elements.namedItem("confirm") as HTMLInputElement).value;
            if (password !== confirm) {
              e.preventDefault();
              setMismatch(true);
            } else {
              setMismatch(false);
            }
          }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-zinc-600">
              New password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="confirm" className="text-sm font-medium text-zinc-600">
              Confirm password
            </label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              required
              className="rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
            />
          </div>
          {mismatch && <p className="text-sm text-red-600">Passwords don&apos;t match.</p>}
          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-md bg-zinc-900 px-3 py-2 font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-60"
          >
            {pending ? "Please wait…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
