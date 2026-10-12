"use client";

import { Leaf, MapPin, ShieldCheck, Star } from "lucide-react";
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
    <article className="lift-hover group flex flex-col overflow-hidden rounded-3xl border border-stone-900/8 bg-[color-mix(in_oklab,var(--sand)_92%,white)] shadow-[var(--shadow-soft)] dark:border-white/10 dark:bg-stone-900/50">
      <div className="relative h-52 w-full overflow-hidden bg-emerald-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={oferta.imagenUrl}
          alt=""
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-stone-950/45 via-transparent to-transparent"
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/85 px-2.5 py-1 text-xs font-semibold text-emerald-900 backdrop-blur-md">
          <CategoriaMarkerIcon categoria={oferta.categoria} className="h-3.5 w-3.5" />
          {CATEGORIA_OFERTA_LABEL[oferta.categoria]}
        </span>
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-teal-600/95 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
          Recibo verificable
        </span>
        <p className="absolute bottom-3 left-3 inline-flex items-center gap-1 text-xs font-medium text-white/95">
          <MapPin className="h-3.5 w-3.5" aria-hidden />
          {oferta.ubicacion}
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <h3 className="font-display text-lg font-semibold tracking-tight text-stone-900 dark:text-stone-50">
            {oferta.titulo}
          </h3>
          <p className="inline-flex items-center gap-1.5 text-sm text-stone-600 dark:text-stone-400">
            <Leaf className="h-3.5 w-3.5 text-emerald-700" aria-hidden />
            {oferta.empresa}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-stone-800 dark:text-stone-200">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
            {oferta.puntuacion.toFixed(1)}
            <span className="font-medium text-stone-500">({oferta.resenas})</span>
          </span>
          <Badge tone="amber">Anticipo {oferta.porcentajeAnticipo}%</Badge>
          <Badge tone="teal">Experiencia local</Badge>
        </div>
        <p className="line-clamp-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
          {oferta.descripcion}
        </p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-1">
          <p>
            <span className="font-display text-xl font-semibold text-stone-900 dark:text-stone-50">
              {formatUsd(oferta.precioUsd)}
            </span>
            <span className="text-xs font-medium text-stone-500">
              {" "}
              / {UNIDAD_PRECIO_LABEL[oferta.unidadPrecio]}
            </span>
          </p>
          <Button size="sm" onClick={onAdd} disabled={inItinerary}>
            {inItinerary ? "En el viaje" : "Agregar al viaje"}
          </Button>
        </div>
      </div>
    </article>
  );
}
