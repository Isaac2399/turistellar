"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { LocateFixed } from "lucide-react";
import { paradasConectadas } from "@/lib/itinerary";
import { cn } from "@/lib/utils";
import type { ItineraryItem } from "@/types/tourist";
import { MapMarkerBadge } from "@/components/tourist/CategoriaMarkerIcon";

export type BasemapId = "calles" | "satelite" | "relieve";

const BASEMAPS: { id: BasemapId; label: string }[] = [
  { id: "calles", label: "Calles" },
  { id: "satelite", label: "Satélite" },
  { id: "relieve", label: "Relieve" },
];

const RuralLeafletMap = dynamic(
  () => import("./RuralLeafletMap").then((mod) => mod.RuralLeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-emerald-950 text-sm text-emerald-50">
        Cargando mapa del corredor…
      </div>
    ),
  },
);

interface InteractiveMapProps {
  items: ItineraryItem[];
  highlightedIds?: readonly string[];
  emphasizedIds?: readonly string[];
  selectedId?: string | null;
  onSelectOferta?: (ofertaId: string | null) => void;
  scrollWheelZoom?: boolean;
  className?: string;
  mapClassName?: string;
}

export function InteractiveMap({
  items,
  emphasizedIds,
  selectedId,
  onSelectOferta,
  scrollWheelZoom = false,
  className,
  mapClassName,
}: InteractiveMapProps) {
  const [basemap, setBasemap] = useState<BasemapId>("satelite");
  const [recenterToken, setRecenterToken] = useState(0);
  const stops = useMemo(() => paradasConectadas(items), [items]);

  return (
    <div
      id="mapa-rural"
      className={cn(
        "overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-950",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-900/10 px-4 py-3 dark:border-white/10">
        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Corredor Salento · Cocora · Filandia
          </p>
          <p className="text-xs text-zinc-500">
            {stops.length >= 2
              ? `Ruta de ${stops.length} paradas en orden de hora`
              : stops.length === 1
                ? "1 parada lista. Agrega otra para trazar la ruta"
                : "Acerca, arrastra y toca un punto para armar la ruta"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-full border border-emerald-900/10 p-0.5 text-xs dark:border-white/10">
            {BASEMAPS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setBasemap(option.id)}
                className={cn(
                  "rounded-full px-2.5 py-1 font-medium",
                  basemap === option.id
                    ? "bg-emerald-700 text-white"
                    : "text-zinc-600 hover:bg-emerald-50 dark:text-zinc-300 dark:hover:bg-emerald-950",
                )}
                aria-pressed={basemap === option.id}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setRecenterToken((value) => value + 1)}
            className="inline-flex items-center gap-1 rounded-full border border-emerald-900/10 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-emerald-50 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-emerald-950"
          >
            <LocateFixed className="h-3.5 w-3.5" aria-hidden />
            Centrar
          </button>
        </div>
      </div>

      <div className={cn("relative z-0 h-80 w-full", mapClassName)}>
        <RuralLeafletMap
          basemap={basemap}
          emphasizedIds={emphasizedIds}
          selectedId={selectedId}
          onSelectOferta={(id) => onSelectOferta?.(id)}
          scrollWheelZoom={scrollWheelZoom}
          recenterToken={recenterToken}
        />
      </div>

      <div className="flex flex-wrap gap-3 border-t border-emerald-900/10 px-4 py-2 text-xs text-zinc-600 dark:border-white/10 dark:text-zinc-300">
        <span className="inline-flex items-center gap-1">
          <MapMarkerBadge categoria="alojamiento" className="h-5 w-5" /> Alojamiento
        </span>
        <span className="inline-flex items-center gap-1">
          <MapMarkerBadge categoria="tour" className="h-5 w-5" /> Tour
        </span>
        <span className="inline-flex items-center gap-1">
          <MapMarkerBadge categoria="producto" className="h-5 w-5" /> Producto local
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-0.5 w-6 border-t-2 border-dashed border-amber-500" />
          Ruta del itinerario
        </span>
      </div>
    </div>
  );
}
