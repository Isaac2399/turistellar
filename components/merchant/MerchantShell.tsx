"use client";

import type { ReactNode } from "react";
import { MerchantProvider } from "./MerchantProvider";
import { MerchantSidebar } from "./MerchantSidebar";

export function MerchantShell({ children }: { children: ReactNode }) {
  return (
    <MerchantProvider>
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 lg:flex-row">
        <MerchantSidebar />
        <section className="min-w-0 flex-1">{children}</section>
      </div>
    </MerchantProvider>
  );
}
