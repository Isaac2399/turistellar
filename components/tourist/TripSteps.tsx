"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import { useTourist } from "@/components/tourist/TouristProvider";
import {
  alertasDisponibilidad,
  horariosCompletos,
  puedePagarAnticipo,
} from "@/lib/trip-progress";
import { cn } from "@/lib/utils";

const PASOS = [
  { n: 1, label: "Armar el viaje", href: "/explorar" },
  { n: 2, label: "Fijar horarios", href: "/explorar/agenda" },
  { n: 3, label: "Pagar el anticipo", href: "/checkout" },
  { n: 4, label: "Pasaporte", href: "/tourist/mis-reservas" },
] as const;

function pasoDesdeRuta(pathname: string): 1 | 2 | 3 | 4 {
  if (pathname.startsWith("/explorar/agenda")) return 2;
  if (pathname.startsWith("/checkout")) return 3;
  if (pathname.startsWith("/tourist/mis-reservas")) return 4;
  return 1;
}

export function TripSteps() {
  const pathname = usePathname();
  const { items, reservas, hydrated } = useTourist();
  const actual = pasoDesdeRuta(pathname);
  const horariosListos = horariosCompletos(items);
  const alertas = alertasDisponibilidad(items);
  const puedePagar = puedePagarAnticipo(items);

  const abierto: Record<1 | 2 | 3 | 4, boolean> = {
    1: true,
    2: items.length > 0,
    3: puedePagar,
    4: reservas.length > 0,
  };

  const hecho: Record<1 | 2 | 3 | 4, boolean> = {
    1: items.length > 0,
    2: puedePagar,
    3: false,
    4: false,
  };

  let estado = "";
  if (hydrated && items.length === 0) {
    estado = "El itinerario está vacío. Agrega una experiencia para armar el viaje.";
  } else if (hydrated && !horariosListos) {
    estado = "Falta fijar la fecha y la hora de cada parada.";
  } else if (hydrated && alertas.length > 0) {
    estado = "Hay alertas de disponibilidad. Corrígelas antes de pagar el anticipo.";
  } else if (hydrated && puedePagar && actual < 3) {
    estado = "Los horarios están listos. El siguiente paso es pagar el anticipo.";
  }

  return (
    <nav aria-label="Pasos del viaje" className="mb-8 space-y-3">
      <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {PASOS.map((paso) => {
          const esActual = actual === paso.n;
          const esHecho = hydrated && hecho[paso.n];
          const esAbierto = esActual || (hydrated && abierto[paso.n]);
          const className = cn(
            "flex min-h-12 items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition-all",
            esActual &&
              "bg-emerald-700 text-white shadow-[0_8px_18px_rgba(4,120,87,0.22)]",
            !esActual &&
              esHecho &&
              "border border-emerald-700/40 bg-emerald-50/80 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
            !esActual &&
              !esHecho &&
              esAbierto &&
              "border border-stone-900/10 bg-white/70 text-stone-700 backdrop-blur-sm hover:bg-emerald-50/80 dark:border-white/10 dark:bg-stone-900/50 dark:text-stone-200",
            !esActual &&
              !esAbierto &&
              "border border-stone-900/8 bg-stone-50/60 text-stone-400 dark:border-white/5 dark:bg-stone-900/30",
          );
          const contenido = (
            <>
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  esActual ? "bg-white/20" : "bg-emerald-700/10",
                )}
              >
                {esHecho && !esActual ? <Check className="h-3.5 w-3.5" aria-hidden /> : paso.n}
              </span>
              <span>
                <span className="sr-only">Paso {paso.n}: </span>
                {paso.label}
              </span>
            </>
          );

          return (
            <li key={paso.n}>
              {esAbierto && !esActual ? (
                <Link href={paso.href} className={className}>
                  {contenido}
                </Link>
              ) : (
                <span aria-current={esActual ? "step" : undefined} className={className}>
                  {contenido}
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {estado ? (
        <p
          role="status"
          className="rounded-2xl border border-teal-700/15 bg-teal-50/70 px-3.5 py-2 text-sm text-teal-950 dark:border-teal-400/20 dark:bg-teal-950/30 dark:text-teal-100"
        >
          {estado}
        </p>
      ) : null}
    </nav>
  );
}
