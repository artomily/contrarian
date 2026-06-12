import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The Contrarian logo lockup. Rendered with spans so it can live inside a
 * link (site header, dashboard header) without invalid nesting.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 ring-1 ring-rose-500/20">
        <ShieldAlert className="h-4 w-4 text-rose-400" aria-hidden="true" />
      </span>
      <span className="leading-tight">
        <span className="block font-mono text-sm font-bold tracking-tight text-foreground">
          Contrarian
        </span>
        <span className="block whitespace-nowrap font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
          Decision Firewall
        </span>
      </span>
    </span>
  );
}
