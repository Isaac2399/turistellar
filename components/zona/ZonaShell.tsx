import type { ReactNode } from "react";

export function ZonaShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">{children}</div>
  );
}
