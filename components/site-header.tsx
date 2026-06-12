"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { BrandMark } from "./brand-mark";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#lenses", label: "Lenses" },
  { href: "/docs", label: "Docs" },
];

/**
 * Marketing-site navigation for the landing and docs pages. The dashboard has
 * its own header (it carries the wallet button instead).
 */
export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          aria-label="Contrarian home"
          className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <BrandMark />
        </Link>

        <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = href === "/docs" && pathname === "/docs";
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "hidden h-10 items-center rounded-lg px-3 text-sm transition-colors duration-150 sm:inline-flex",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                  // Docs stays reachable on mobile; the anchor links are desktop-only.
                  href === "/docs" && "inline-flex",
                )}
              >
                {label}
              </Link>
            );
          })}

          <Link
            href="/dashboard"
            className="ml-1 inline-flex h-10 items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-br from-rose-500 to-rose-600 px-3.5 text-sm font-medium text-white shadow-[0_4px_16px_-4px_rgba(244,63,94,0.6)] transition-colors duration-150 hover:from-rose-400 hover:to-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px sm:px-5"
          >
            Launch App
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
