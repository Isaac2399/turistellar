"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/explorar", label: "Explorar" },
  { href: "/explorar/mapa", label: "Mapa y ruta" },
  { href: "/explorar/agenda", label: "Agenda" },
  { href: "/checkout", label: "Checkout" },
  { href: "/tourist/mis-reservas", label: "Pasaporte QR" },
] as const;

export function TouristSubnav() {
  const pathname = usePathname();
  return (
    <nav className="mb-8 flex flex-wrap gap-2">
      {LINKS.map((link) => {
        const active =
          link.href === "/explorar"
            ? pathname === "/explorar"
            : pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium",
              active
                ? "bg-emerald-700 text-white"
                : "border border-emerald-800/15 text-zinc-600 hover:bg-emerald-50 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-emerald-950",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
