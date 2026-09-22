import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost";
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60",
        variant === "primary" && "bg-emerald-700 text-white hover:bg-emerald-800",
        variant === "outline" &&
          "border border-emerald-800/20 hover:bg-emerald-50 dark:hover:bg-emerald-950",
        variant === "ghost" && "hover:bg-zinc-100 dark:hover:bg-zinc-900",
        className,
      )}
      {...props}
    />
  );
}
