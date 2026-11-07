import Link from "next/link";
import SocialLinks from "./SocialLinks";
import type { Profile } from "@/lib/types";

export default function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="mt-16 border-t border-cat-line bg-cat-charcoal">
      <div className="container-page flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
        <p className="text-sm text-cat-gray">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <SocialLinks profile={profile} variant="icons" />
        <Link href="/admin" className="text-xs text-neutral-600 hover:text-cat-yellow">
          Admin
        </Link>
      </div>
      <div className="hazard-stripe h-2" aria-hidden />
    </footer>
  );
}
