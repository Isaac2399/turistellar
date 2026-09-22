import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Turista · Hub Rural",
  description: "Pasaporte digital, reservas y tiquete QR de experiencias rurales.",
};

export default function TouristLayout({ children }: { children: ReactNode }) {
  return children;
}
