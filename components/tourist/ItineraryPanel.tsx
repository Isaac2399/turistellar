"use client";

import Link from "next/link";
import { Clock, Map, Trash2 } from "lucide-react";
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
    <aside className="glass-panel sticky top-24 flex flex-col rounded-3xl p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-emerald-800 uppercase dark:text-emerald-300">
            Tu ruta
          </p>
          <h2 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-50">
            Itinerario ({items.length})
          </h2>
        </div>
        {items.length > 0 ? (
          <button
            type="button"
            onClick={clearItinerary}
            className="text-xs font-semibold text-stone-500 hover:text-rose-600"
          >
            Vaciar
          </button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-emerald-800/20 bg-emerald-50/50 p-4 dark:bg-emerald-950/20">
          <Map className="mb-2 h-5 w-5 text-emerald-700" aria-hidden />
          <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">
            Agrega alojamiento, un tour y un producto local para trazar tu ruta
            en el mapa.
          </p>
        </div>
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
                  "flex gap-2 rounded-2xl border border-stone-900/8 bg-white/70 p-2.5 dark:border-white/10 dark:bg-stone-950/40",
                  selected && "ring-2 ring-teal-500/70",
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
                  <p className="truncate text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {oferta.titulo}
                  </p>
                  <p className="text-xs text-stone-500">{etiquetaHorario(item)}</p>
                  <p className="text-xs text-stone-500">
                    {formatUsd(oferta.precioUsd)} · anticipo {oferta.porcentajeAnticipo}%
                  </p>
                </button>
                <button
                  type="button"
                  aria-label="Quitar"
                  onClick={() => removeItem(item.id)}
                  className="text-stone-400 hover:text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-4 space-y-1.5 border-t border-stone-900/8 pt-4 text-sm dark:border-white/10">
        <p className="flex justify-between text-stone-700 dark:text-stone-300">
          <span>Total del viaje</span>
          <span className="font-semibold">{formatUsd(desglose.total)}</span>
        </p>
        <p className="flex justify-between text-emerald-800 dark:text-emerald-300">
          <span>Anticipo protegido</span>
          <span className="font-semibold">{formatUsd(desglose.anticipo)}</span>
        </p>
      </div>

      <div className="mt-4">
        {items.length > 0 ? (
          <Link
            href="/explorar/agenda"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(4,120,87,0.22)] hover:bg-green-800"
          >
            <Clock className="h-4 w-4" />
            Fijar horarios
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            <Clock className="h-4 w-4" />
            Fijar horarios
          </button>
        )}
      </div>
    </aside>
  );
}
