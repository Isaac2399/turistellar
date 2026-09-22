import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "emerald" | "amber" | "rose" | "zinc" | "sky";

const TONE: Record<BadgeTone, string> = {
  emerald:
    "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  amber: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  rose: "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200",
  zinc: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
  sky: "bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200",
};

export function Badge({
  className,
  tone = "zinc",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        TONE[tone],
        className,
      )}
      {...props}
    />
  );
}
