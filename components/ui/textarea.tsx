import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-xl border border-emerald-900/15 bg-white px-3 py-2 text-sm outline-none transition-colors",
        "placeholder:text-zinc-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20",
        "disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-zinc-900",
        className,
      )}
      {...props}
    />
  );
}
