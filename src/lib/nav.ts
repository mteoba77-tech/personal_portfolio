import { Award, Home, Mail, Wrench, type LucideIcon } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", description: "About me", icon: Home },
  { href: "/showcase", label: "Showcase", description: "Projects and awards I'm proud of", icon: Award },
  { href: "/skills", label: "Skills", description: "Technical skills, tools, and what I'm learning", icon: Wrench },
  { href: "/contact", label: "Contact", description: "Send me a message or a request", icon: Mail },
];
