"use client";

import Link from "next/link";
import { Clock, Route, Trash2 } from "lucide-react";
import { getOfertaById } from "@/lib/mock-data";
import { buildDesglose, etiquetaHorario } from "@/lib/itinerary";
import { formatUsd } from "@/lib/money";
import { useTourist } from "@/components/tourist/TouristProvider";
import { CategoriaMarkerIcon } from "@/components/tourist/CategoriaMarkerIcon";

export function ItineraryPanel() {
  const { items, removeItem, clearItinerary } = useTourist();
  const desglose = buildDesglose(items);

  return (
    <aside className="flex flex-col rounded-2xl border border-emerald-900/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-950">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
          Itinerario ({items.length})
        </h2>
        {items.length > 0 ? (
          <button
            type="button"
            onClick={clearItinerary}
            className="text-xs text-zinc-500 hover:text-rose-600"
          >
            Vaciar
          </button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-zinc-500">
          Agrega un alojamiento, un tour (p. ej. Trapiche) y un producto (p. ej. salsas)
          para trazar la ruta en el mapa.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const oferta = getOfertaById(item.ofertaId);
            if (!oferta) return null;
            return (
              <li
                key={item.id}
                className="flex gap-2 rounded-xl border border-emerald-900/10 p-2 dark:border-white/10"
              >
                <span className="mt-0.5 text-emerald-700">
                  <CategoriaMarkerIcon categoria={oferta.categoria} className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{oferta.titulo}</p>
                  <p className="text-xs text-zinc-500">{etiquetaHorario(item)}</p>
                  <p className="text-xs text-zinc-500">
                    {formatUsd(oferta.precioUsd)} · anticipo {oferta.porcentajeAnticipo}%
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Quitar"
                  onClick={() => removeItem(item.id)}
                  className="text-zinc-400 hover:text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-4 space-y-1 border-t border-emerald-900/10 pt-3 text-sm dark:border-white/10">
        <p className="flex justify-between">
          <span>Total</span>
          <span className="font-semibold">{formatUsd(desglose.total)}</span>
        </p>
        <p className="flex justify-between text-emerald-800 dark:text-emerald-300">
          <span>Anticipo hoy</span>
          <span className="font-semibold">{formatUsd(desglose.anticipo)}</span>
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <Link
          href="/explorar/agenda"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 aria-disabled:pointer-events-none aria-disabled:opacity-50"
          aria-disabled={items.length === 0}
        >
          <Clock className="h-4 w-4" />
          Agendar por horas
        </Link>
        <Link
          href="/explorar/mapa"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-800/20 px-4 py-2 text-sm font-medium hover:bg-emerald-50 dark:hover:bg-emerald-950"
        >
          <Route className="h-4 w-4" />
          Ver ruta en mapa
        </Link>
        <Link
          href="/checkout"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-800/20 px-4 py-2 text-sm font-medium hover:bg-emerald-50 dark:hover:bg-emerald-950"
        >
          Ir al checkout
        </Link>
      </div>
    </aside>
  );
}
