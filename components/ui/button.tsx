import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type ButtonSize = "md" | "sm" | "lg" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-60",
        size === "lg" && "rounded-2xl px-6 py-3 text-sm",
        size === "md" && "rounded-2xl px-4 py-2.5 text-sm",
        size === "sm" && "rounded-xl px-3 py-1.5 text-xs",
        size === "icon" && "h-10 w-10 rounded-2xl p-0",
        variant === "primary" &&
          "bg-emerald-700 text-white shadow-[0_8px_20px_rgba(4,120,87,0.25)] hover:bg-green-800 hover:shadow-[0_10px_24px_rgba(22,101,52,0.28)]",
        variant === "secondary" &&
          "bg-teal-600 text-white shadow-[0_8px_20px_rgba(13,148,136,0.22)] hover:bg-teal-700",
        variant === "outline" &&
          "border border-stone-900/12 bg-white/70 text-stone-900 backdrop-blur-sm hover:border-emerald-700/30 hover:bg-emerald-50/80 dark:border-white/15 dark:bg-white/5 dark:text-stone-100 dark:hover:bg-emerald-950/50",
        variant === "ghost" &&
          "text-stone-700 hover:bg-emerald-50/80 dark:text-stone-200 dark:hover:bg-white/5",
        variant === "destructive" && "bg-rose-600 text-white hover:bg-rose-700",
        className,
      )}
      {...props}
    />
  );
}
