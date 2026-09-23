"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BedDouble,
  Bell,
  CalendarDays,
  LayoutDashboard,
  MapPinned,
  Menu,
  Receipt,
  Store,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useMerchant } from "./MerchantProvider";

const NAV_ITEMS = [
  { href: "/dashboard/merchant", label: "Dashboard general", icon: LayoutDashboard },
  { href: "/dashboard/merchant/perfil", label: "Perfil", icon: Store },
  { href: "/dashboard/merchant/tours", label: "Tours", icon: MapPinned },
  { href: "/dashboard/merchant/alojamiento", label: "Alojamiento / Hospedaje", icon: BedDouble },
  { href: "/dashboard/merchant/productos", label: "Productos", icon: UtensilsCrossed },
  { href: "/dashboard/merchant/calendario", label: "Calendario", icon: CalendarDays },
  { href: "/dashboard/merchant/reservas", label: "Reservas / Anticipos", icon: Receipt },
  { href: "/dashboard/merchant/notificaciones", label: "Notificaciones", icon: Bell },
] as const;

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/dashboard/merchant") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MerchantSidebar() {
  const pathname = usePathname();
  const { alertasPendientes, perfil, catalogo } = useMerchant();
  const [open, setOpen] = useState(false);
  const items = NAV_ITEMS.filter((item) => {
    if (catalogo === "productos") {
      return (
        item.href !== "/dashboard/merchant/tours" &&
        item.href !== "/dashboard/merchant/alojamiento" &&
        item.href !== "/dashboard/merchant/calendario"
      );
    }
    return item.href !== "/dashboard/merchant/productos";
  });

  return (
    <>
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <p className="text-sm font-medium">{perfil.nombreComercial}</p>
        <button
          type="button"
          className="inline-flex rounded-md p-2"
          aria-label={open ? "Cerrar menú del comerciante" : "Abrir menú del comerciante"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <aside
        className={cn(
          "w-full shrink-0 rounded-2xl border border-emerald-900/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-950 lg:w-64",
          open ? "block" : "hidden lg:block",
        )}
      >
        <p className="mb-1 hidden text-xs font-medium uppercase tracking-wide text-emerald-800 lg:block">
          Panel empresa
        </p>
        <h2 className="mb-4 hidden text-sm font-semibold leading-snug lg:block">
          {perfil.nombreComercial}
        </h2>
        <nav className="flex flex-col gap-1">
          {items.map((item) => {
            const active = isActivePath(pathname, item.href);
            const Icon = item.icon;
            const showBadge = item.href.endsWith("/notificaciones") && alertasPendientes > 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-emerald-700 text-white"
                    : "text-zinc-700 hover:bg-emerald-50 dark:text-zinc-200 dark:hover:bg-emerald-950",
                )}
              >
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4" aria-hidden />
                  {item.label}
                </span>
                {showBadge ? (
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[11px] font-semibold",
                      active ? "bg-white/20" : "bg-rose-600 text-white",
                    )}
                  >
                    {alertasPendientes}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
