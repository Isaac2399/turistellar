"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { TouristProvider } from "@/components/tourist/TouristProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <TouristProvider>{children}</TouristProvider>
    </AuthProvider>
  );
}
