import type { Metadata } from "next";
import Link from "next/link";
import { Inbox, LogOut, Pencil, TriangleAlert } from "lucide-react";
import { firestoreEnabled } from "@/lib/firestore";
import { logout } from "../actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-page py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-cat-line pb-4">
        <h1 className="text-3xl">Admin</h1>
        <nav className="flex flex-wrap gap-2" aria-label="Admin">
          <Link href="/admin" className="btn-ghost">
            <Pencil className="h-4 w-4" /> Edit content
          </Link>
          <Link href="/admin/messages" className="btn-ghost">
            <Inbox className="h-4 w-4" /> Messages
          </Link>
          <form action={logout}>
            <button type="submit" className="btn-outline">
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </form>
        </nav>
      </div>

      {!firestoreEnabled() && (
        <p className="mb-6 flex items-start gap-2 rounded-lg border border-cat-yellow/50 bg-cat-yellow/10 p-4 text-sm">
          <TriangleAlert className="h-5 w-5 shrink-0 text-cat-yellow" aria-hidden />
          Firestore is off (USE_FIRESTORE is not &quot;true&quot;), so saving here is disabled. Edit the files in
          the content/ folder instead, or enable Firestore.
        </p>
      )}

      {children}
    </div>
  );
}
