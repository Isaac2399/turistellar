"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

type DialogProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
};

export function Dialog({
  open,
  title,
  description,
  onClose,
  children,
  className,
}: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 bg-zinc-950/50"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className={cn(
          "relative z-10 w-full max-w-xl rounded-2xl border border-emerald-900/10 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-zinc-950",
          className,
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id="dialog-title" className="text-lg font-semibold">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
            ) : null}
          </div>
          <Button variant="ghost" className="h-8 w-8 rounded-full p-0" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
