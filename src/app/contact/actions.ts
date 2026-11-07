"use server";

import { getFirestore } from "@/lib/firestore";
import { mailConfigured, sendContactEmail, type ContactMessage } from "@/lib/mail";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<keyof ContactMessage, string>>;
  values?: ContactMessage;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = { name: 100, email: 200, phone: 30, subject: 150, message: 5000 };

function field(form: FormData, name: string): string {
  return String(form.get(name) ?? "").trim();
}

function validate(msg: ContactMessage): ContactState["errors"] {
  const errors: ContactState["errors"] = {};
  if (!msg.name) errors.name = "Please enter your name.";
  if (!EMAIL_PATTERN.test(msg.email)) errors.email = "Please enter a valid email address.";
  if (!msg.subject) errors.subject = "Please enter a subject.";
  if (msg.message.length < 10) errors.message = "Please write at least 10 characters.";
  for (const [key, max] of Object.entries(LIMITS) as [keyof ContactMessage, number][]) {
    if (msg[key].length > max) errors[key] = `Please keep this under ${max} characters.`;
  }
  return errors;
}

export async function submitContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  // Honeypot: real users never see or fill this field.
  if (field(form, "website")) return { status: "success", message: "Thanks! Your message was sent." };

  const msg: ContactMessage = {
    name: field(form, "name"),
    email: field(form, "email"),
    phone: field(form, "phone"),
    subject: field(form, "subject"),
    message: field(form, "message"),
  };

  const errors = validate(msg);
  if (errors && Object.keys(errors).length > 0) {
    return { status: "error", message: "Please fix the highlighted fields.", errors, values: msg };
  }

  const db = getFirestore();
  const tasks: Promise<unknown>[] = [];
  if (db) tasks.push(db.collection("messages").add({ ...msg, createdAt: new Date() }));
  if (mailConfigured()) tasks.push(sendContactEmail(msg));

  if (tasks.length === 0) {
    console.warn("Contact form: neither Firestore nor SMTP is configured. Message:", msg);
    return { status: "success", message: "Thanks! Your message was received." };
  }

  const results = await Promise.allSettled(tasks);
  results
    .filter((r): r is PromiseRejectedResult => r.status === "rejected")
    .forEach((r) => console.error("Contact form delivery failed:", r.reason));

  return results.some((r) => r.status === "fulfilled")
    ? { status: "success", message: "Thanks! Your message was sent. I'll get back to you soon." }
    : {
        status: "error",
        message: "Sorry, something went wrong. Please try again or email me directly.",
        values: msg,
      };
}
