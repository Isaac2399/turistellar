"use client";

import Link from "next/link";
import { Clock, Trash2 } from "lucide-react";
import { getOfertaById } from "@/lib/mock-data";
import { buildDesglose, etiquetaHorario } from "@/lib/itinerary";
import { formatUsd } from "@/lib/money";
import { cn } from "@/lib/utils";
import { useTourist } from "@/components/tourist/TouristProvider";
import { CategoriaMarkerIcon } from "@/components/tourist/CategoriaMarkerIcon";

interface ItineraryPanelProps {
  selectedId?: string | null;
  onFocus?: (ofertaId: string) => void;
}

export function ItineraryPanel({ selectedId, onFocus }: ItineraryPanelProps) {
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
            const selected = selectedId === oferta.id;
            return (
              <li
                key={item.id}
                className={cn(
                  "flex gap-2 rounded-xl border border-emerald-900/10 p-2 dark:border-white/10",
                  selected && "ring-2 ring-amber-400",
                )}
              >
                <span className="mt-0.5 text-emerald-700">
                  <CategoriaMarkerIcon categoria={oferta.categoria} className="h-4 w-4" />
                </span>
                <button
                  type="button"
                  onClick={() => onFocus?.(oferta.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="truncate text-sm font-medium">{oferta.titulo}</p>
                  <p className="text-xs text-zinc-500">{etiquetaHorario(item)}</p>
                  <p className="text-xs text-zinc-500">
                    {formatUsd(oferta.precioUsd)} · anticipo {oferta.porcentajeAnticipo}%
                  </p>
                </button>
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

      <div className="mt-4">
        {items.length > 0 ? (
          <Link
            href="/explorar/agenda"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
          >
            <Clock className="h-4 w-4" />
            Fijar horarios
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            <Clock className="h-4 w-4" />
            Fijar horarios
          </button>
        )}
      </div>
    </aside>
  );
}
