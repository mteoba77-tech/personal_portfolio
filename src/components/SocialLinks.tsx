import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import type { Profile } from "@/lib/types";

type Props = {
  profile: Pick<Profile, "email" | "linkedin" | "github">;
  variant?: "buttons" | "icons";
};

export default function SocialLinks({ profile, variant = "buttons" }: Props) {
  const links = [
    { href: `mailto:${profile.email}`, label: "Email me", icon: Mail, external: false },
    { href: profile.linkedin, label: "LinkedIn", icon: LinkedinIcon, external: true },
    { href: profile.github, label: "GitHub", icon: GithubIcon, external: true },
  ].filter((link) => link.href && link.href !== "mailto:");

  return (
    <div className="flex flex-wrap gap-3">
      {links.map(({ href, label, icon: Icon, external }, i) => (
        <a
          key={label}
          href={href}
          {...(external && { target: "_blank", rel: "noopener noreferrer" })}
          aria-label={label}
          className={
            variant === "icons"
              ? "rounded-full border border-cat-line p-2 text-cat-gray transition-colors hover:border-cat-yellow hover:text-cat-yellow"
              : i === 0
                ? "btn-primary"
                : "btn-outline"
          }
        >
          <Icon className="h-5 w-5" aria-hidden />
          {variant === "buttons" && label}
        </a>
      ))}
    </div>
  );
}
