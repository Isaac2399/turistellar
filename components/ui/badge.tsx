import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "emerald" | "amber" | "rose" | "zinc" | "sky" | "teal";

const TONE: Record<BadgeTone, string> = {
  emerald:
    "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  amber: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  rose: "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200",
  zinc: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-200",
  sky: "bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200",
  teal: "bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-200",
};

export function Badge({
  className,
  tone = "zinc",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide",
        TONE[tone],
        className,
      )}
      {...props}
    />
  );
}
