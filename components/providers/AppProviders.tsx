"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { TouristProvider } from "@/components/tourist/TouristProvider";
import { ZonaProvider } from "@/components/zona/ZonaProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <TouristProvider>
        <ZonaProvider>{children}</ZonaProvider>
      </TouristProvider>
    </AuthProvider>
  );
}
