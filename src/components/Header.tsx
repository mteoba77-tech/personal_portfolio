"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HardHat, Menu, X } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function Header({ name }: { name: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu after navigating.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-cat-line bg-cat-black/90 backdrop-blur">
      <div className="hazard-stripe h-1.5" aria-hidden />
      <nav className="container-page flex h-16 items-center justify-between" aria-label="Main">
        <Link href="/" className="flex items-center gap-2 font-display text-lg uppercase tracking-wider">
          <HardHat className="h-6 w-6 text-cat-yellow" aria-hidden />
          <span>{name}</span>
        </Link>

        <ul className="hidden gap-1 md:flex">
          {NAV_ITEMS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive(pathname, href) ? "page" : undefined}
                className={`rounded-md px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors ${
                  isActive(pathname, href)
                    ? "bg-cat-yellow text-cat-black"
                    : "text-neutral-300 hover:text-cat-yellow"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="rounded-md p-2 text-cat-yellow md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-cat-line bg-cat-charcoal md:hidden"
          >
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 px-6 py-4 font-semibold uppercase tracking-wide ${
                    isActive(pathname, href) ? "text-cat-yellow" : "text-neutral-200"
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                  {label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
