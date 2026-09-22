"use client";

import { MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORIA_OFERTA_LABEL, UNIDAD_PRECIO_LABEL } from "@/lib/mock-data";
import { formatUsd } from "@/lib/money";
import type { OfertaTuristica } from "@/types/tourist";
import { CategoriaMarkerIcon } from "@/components/tourist/CategoriaMarkerIcon";

interface OfferCardProps {
  oferta: OfertaTuristica;
  inItinerary: boolean;
  onAdd: () => void;
}

export function OfferCard({ oferta, inItinerary, onAdd }: OfferCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-950">
      <div className="relative h-44 w-full overflow-hidden bg-emerald-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={oferta.imagenUrl}
          alt=""
          className="h-full w-full object-cover"
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-emerald-900 backdrop-blur">
          <CategoriaMarkerIcon categoria={oferta.categoria} className="h-3.5 w-3.5" />
          {CATEGORIA_OFERTA_LABEL[oferta.categoria]}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <h3 className="text-base font-semibold tracking-tight">{oferta.titulo}</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{oferta.empresa}</p>
          <p className="inline-flex items-center gap-1 text-xs text-zinc-500">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {oferta.ubicacion}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-sm font-medium">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
            {oferta.puntuacion.toFixed(1)}
            <span className="font-normal text-zinc-500">({oferta.resenas})</span>
          </span>
          <Badge tone="amber">Anticipo {oferta.porcentajeAnticipo}%</Badge>
        </div>
        <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
          {oferta.descripcion}
        </p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-1">
          <p>
            <span className="text-lg font-semibold">{formatUsd(oferta.precioUsd)}</span>
            <span className="text-xs text-zinc-500">
              {" "}
              USDC / {UNIDAD_PRECIO_LABEL[oferta.unidadPrecio]}
            </span>
          </p>
          <Button size="sm" onClick={onAdd} disabled={inItinerary}>
            {inItinerary ? "En itinerario" : "Agregar al itinerario"}
          </Button>
        </div>
      </div>
    </article>
  );
}
