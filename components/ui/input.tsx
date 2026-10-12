import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, type = "text", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        "h-11 w-full rounded-2xl border border-stone-900/10 bg-white/80 px-3.5 text-sm text-stone-900 outline-none transition-all",
        "placeholder:text-stone-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20",
        "disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-stone-900/70 dark:text-stone-100",
        className,
      )}
      {...props}
    />
  );
}
