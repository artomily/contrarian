import Link from "next/link";
import { BrandMark } from "./brand-mark";

const FOOTER_LINKS = [
  { href: "/dashboard", label: "Launch App" },
  { href: "/docs", label: "Docs" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#lenses", label: "The four lenses" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xs space-y-3">
          <BrandMark />
          <p className="text-sm leading-relaxed text-muted-foreground">
            The AI agent that challenges every onchain decision before it
            becomes a transaction.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-1">
          {FOOTER_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex h-10 items-center rounded-lg text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:px-2"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-6 py-5">
          <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
            Demo build — analysis is mocked locally and execution is simulated.
            Nothing here is financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
