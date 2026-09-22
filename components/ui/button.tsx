import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "outline" | "ghost" | "destructive";
type ButtonSize = "md" | "sm" | "icon";

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
        "inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-60",
        size === "md" && "rounded-full px-4 py-2 text-sm",
        size === "sm" && "rounded-full px-3 py-1.5 text-xs",
        size === "icon" && "h-9 w-9 rounded-full p-0",
        variant === "primary" && "bg-emerald-700 text-white hover:bg-emerald-800",
        variant === "outline" &&
          "border border-emerald-800/20 hover:bg-emerald-50 dark:hover:bg-emerald-950",
        variant === "ghost" && "hover:bg-zinc-100 dark:hover:bg-zinc-900",
        variant === "destructive" && "bg-rose-600 text-white hover:bg-rose-700",
        className,
      )}
      {...props}
    />
  );
}
