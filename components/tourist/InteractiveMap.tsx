"use client";

import { useMemo } from "react";
import { MAP_BOUNDS, OFERTAS_TURISTICAS } from "@/lib/mock-data";
import { puntosConectados } from "@/lib/itinerary";
import { cn } from "@/lib/utils";
import type { Coordenada, ItineraryItem, OfertaTuristica } from "@/types/tourist";
import { MapMarkerBadge } from "@/components/tourist/CategoriaMarkerIcon";

const WIDTH = 920;
const HEIGHT = 560;

function project(coord: Coordenada): { x: number; y: number } {
  const x =
    ((coord.lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) *
    WIDTH;
  const y =
    (1 -
      (coord.lat - MAP_BOUNDS.minLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) *
    HEIGHT;
  return { x, y };
}

function polyline(points: Coordenada[]): string {
  return points
    .map((p) => {
      const { x, y } = project(p);
      return `${x},${y}`;
    })
    .join(" ");
}

interface InteractiveMapProps {
  items: ItineraryItem[];
  highlightedIds?: readonly string[];
  className?: string;
}

function visibleOffers(items: ItineraryItem[]): OfertaTuristica[] {
  const selected = new Set<string>();
  for (const item of items) selected.add(item.ofertaId);
  if (selected.size === 0) {
    return OFERTAS_TURISTICAS.filter((row) => row.categoria !== "paquete");
  }
  const ids = new Set<string>();
  for (const oferta of OFERTAS_TURISTICAS) {
    if (!selected.has(oferta.id)) continue;
    ids.add(oferta.id);
    for (const child of oferta.incluyeIds ?? []) ids.add(child);
  }
  return OFERTAS_TURISTICAS.filter(
    (row) => ids.has(row.id) && row.categoria !== "paquete",
  );
}

export function InteractiveMap({ items, highlightedIds, className }: InteractiveMapProps) {
  const markers = useMemo(() => visibleOffers(items), [items]);
  const route = useMemo(() => puntosConectados(items), [items]);
  const highlight = useMemo(() => new Set(highlightedIds ?? []), [highlightedIds]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-emerald-900/10 bg-emerald-950 shadow-sm dark:border-white/10",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 text-xs text-emerald-50/80">
        <p>Mapa rural · corredor Salento / Cocora / Filandia (mock Mapbox)</p>
        <p>{route.length >= 2 ? "Ruta de puntos conectados" : "Selecciona 2+ puntos"}</p>
      </div>
      <div className="relative aspect-[920/560] w-full">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-full w-full"
          role="img"
          aria-label="Mapa interactivo de puntos de interés"
        >
          <defs>
            <linearGradient id="land" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#14532d" />
              <stop offset="55%" stopColor="#166534" />
              <stop offset="100%" stopColor="#3f6212" />
            </linearGradient>
            <linearGradient id="route" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f8fafc" />
            </linearGradient>
          </defs>
          <rect width={WIDTH} height={HEIGHT} fill="url(#land)" />
          <path
            d="M40 420 C 180 380, 260 500, 420 430 S 640 360, 880 410"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="10"
            opacity="0.35"
          />
          <path
            d="M80 80 C 220 140, 300 60, 480 120 S 720 40, 860 90"
            fill="none"
            stroke="#052e16"
            strokeWidth="18"
            opacity="0.25"
          />
          <text x="70" y="500" fill="#bbf7d0" fontSize="18" opacity="0.7">
            Filandia
          </text>
          <text x="390" y="300" fill="#bbf7d0" fontSize="18" opacity="0.7">
            Salento
          </text>
          <text x="680" y="220" fill="#bbf7d0" fontSize="18" opacity="0.7">
            Valle de Cocora
          </text>

          {route.length >= 2 ? (
            <polyline
              points={polyline(route)}
              fill="none"
              stroke="url(#route)"
              strokeWidth="5"
              strokeDasharray="10 8"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ) : null}
        </svg>

        {markers.map((oferta) => {
          const { x, y } = project(oferta.coordenadas);
          const left = `${(x / WIDTH) * 100}%`;
          const top = `${(y / HEIGHT) * 100}%`;
          const active = highlight.has(oferta.id) || items.some((i) => i.ofertaId === oferta.id);
          return (
            <div
              key={oferta.id}
              className="absolute -translate-x-1/2 -translate-y-full"
              style={{ left, top }}
              title={`${oferta.titulo} · ${oferta.empresa}`}
            >
              <div className="mb-1 max-w-[140px] rounded-md bg-white/95 px-1.5 py-0.5 text-[10px] font-medium text-zinc-800 shadow">
                {oferta.titulo}
              </div>
              <div className={cn("mx-auto w-fit", active && "scale-110")}>
                <MapMarkerBadge categoria={oferta.categoria} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-3 bg-emerald-900/80 px-4 py-2 text-xs text-emerald-50">
        <span className="inline-flex items-center gap-1">
          <MapMarkerBadge categoria="alojamiento" className="h-5 w-5" /> Cabaña / hotel
        </span>
        <span className="inline-flex items-center gap-1">
          <MapMarkerBadge categoria="tour" className="h-5 w-5" /> Tour / senderismo
        </span>
        <span className="inline-flex items-center gap-1">
          <MapMarkerBadge categoria="producto" className="h-5 w-5" /> Producto local
        </span>
      </div>
    </div>
  );
}
