"use client";

import { useActionState } from "react";
import { CircleAlert, CircleCheck, LoaderCircle, Send } from "lucide-react";
import { submitContact, type ContactState } from "@/app/contact/actions";

const FIELDS = [
  { name: "name", label: "Full name", type: "text", autoComplete: "name", required: true },
  { name: "email", label: "Email", type: "email", autoComplete: "email", required: true },
  { name: "phone", label: "Phone (optional)", type: "tel", autoComplete: "tel", required: false },
  { name: "subject", label: "Subject", type: "text", autoComplete: "off", required: true },
] as const;

export default function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, { status: "idle" });

  if (state.status === "success") {
    return (
      <div className="card flex flex-col items-center p-10 text-center" role="status">
        <CircleCheck className="h-14 w-14 text-cat-yellow" aria-hidden />
        <p className="mt-4 text-xl font-semibold">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="card space-y-5 p-6 sm:p-8" noValidate>
      {state.status === "error" && (
        <p className="flex items-center gap-2 rounded-lg bg-red-950/60 p-3 text-red-200" role="alert">
          <CircleAlert className="h-5 w-5 shrink-0" aria-hidden /> {state.message}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        {FIELDS.map(({ name, label, type, autoComplete, required }) => (
          <div key={name}>
            <label htmlFor={name} className="label">
              {label}
            </label>
            <input
              id={name}
              name={name}
              type={type}
              autoComplete={autoComplete}
              required={required}
              defaultValue={state.values?.[name]}
              className="input"
              aria-invalid={Boolean(state.errors?.[name])}
              aria-describedby={state.errors?.[name] ? `${name}-error` : undefined}
            />
            {state.errors?.[name] && (
              <p id={`${name}-error`} className="mt-1 text-sm text-red-300">
                {state.errors[name]}
              </p>
            )}
          </div>
        ))}
      </div>

      <div>
        <label htmlFor="message" className="label">
          Your request
        </label>
        <textarea
          id="message"
          name="message"
          rows={7}
          required
          defaultValue={state.values?.message}
          className="input resize-y"
          placeholder="Tell me about your project, question, or opportunity..."
          aria-invalid={Boolean(state.errors?.message)}
          aria-describedby={state.errors?.message ? "message-error" : undefined}
        />
        {state.errors?.message && (
          <p id="message-error" className="mt-1 text-sm text-red-300">
            {state.errors.message}
          </p>
        )}
      </div>

      {/* Honeypot field for bots, hidden from people and screen readers */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={pending}>
        {pending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        {pending ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
