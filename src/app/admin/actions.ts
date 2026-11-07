"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  adminConfigured,
  checkPassword,
  createSessionToken,
  verifySessionToken,
} from "@/lib/auth";
import { getContent, resetContent, saveContent } from "@/lib/content";
import { normalize } from "@/lib/normalize";
import { CONTENT_KEYS, type ContentKey, type ContentMap } from "@/lib/types";

export type ActionResult = { ok: boolean; message: string; data?: ContentMap[ContentKey] };

async function requireAdmin(): Promise<void> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) redirect("/admin/login");
}

export async function login(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  if (!adminConfigured()) {
    return { ok: false, message: "Admin is disabled: set ADMIN_PASSWORD and SESSION_SECRET." };
  }
  if (!(await checkPassword(String(form.get("password") ?? "")))) {
    return { ok: false, message: "Incorrect password." };
  }

  (await cookies()).set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  redirect("/admin");
}

export async function logout(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

function assertKey(key: string): asserts key is ContentKey {
  if (!CONTENT_KEYS.includes(key as ContentKey)) throw new Error(`Unknown content section: ${key}`);
}

/** Runs an admin content change and returns the section's resulting content. */
async function runContentAction(key: string, work: (key: ContentKey) => Promise<void>, success: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    assertKey(key);
    await work(key);
    revalidatePath("/", "layout");
    return { ok: true, message: success, data: await getContent(key) };
  } catch (error) {
    console.error(error);
    return { ok: false, message: error instanceof Error ? error.message : "Something went wrong." };
  }
}

export async function saveSection(key: string, data: unknown): Promise<ActionResult> {
  return runContentAction(key, (k) => saveContent(k, normalize(k, data)), "Saved. The live site is updated.");
}

export async function resetSection(key: string): Promise<ActionResult> {
  return runContentAction(key, resetContent, "Reset. The site now uses the JSON file from the repository.");
}
