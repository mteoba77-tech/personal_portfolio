"use client";

import { useActionState } from "react";
import { CircleAlert, Lock } from "lucide-react";
import { login } from "../actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null);

  return (
    <section className="container-page flex justify-center py-20">
      <form action={action} className="card w-full max-w-sm space-y-5 p-8">
        <div className="text-center">
          <Lock className="mx-auto h-10 w-10 text-cat-yellow" aria-hidden />
          <h1 className="mt-3 text-3xl">Admin Login</h1>
        </div>

        {state && !state.ok && (
          <p className="flex items-center gap-2 rounded-lg bg-red-950/60 p-3 text-sm text-red-200" role="alert">
            <CircleAlert className="h-4 w-4 shrink-0" aria-hidden /> {state.message}
          </p>
        )}

        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <input id="password" name="password" type="password" autoComplete="current-password" required className="input" />
        </div>

        <button type="submit" className="btn-primary w-full" disabled={pending}>
          {pending ? "Checking..." : "Log in"}
        </button>
      </form>
    </section>
  );
}
