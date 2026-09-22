"use client";

import { BedDouble, Compass, Package, ShoppingBasket } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CategoriaOferta } from "@/types/tourist";
import { CATEGORIA_OFERTA_LABEL } from "@/lib/mock-data";

const FILTERS: { id: CategoriaOferta | "todas"; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "alojamiento", label: CATEGORIA_OFERTA_LABEL.alojamiento },
  { id: "tour", label: CATEGORIA_OFERTA_LABEL.tour },
  { id: "producto", label: CATEGORIA_OFERTA_LABEL.producto },
  { id: "paquete", label: CATEGORIA_OFERTA_LABEL.paquete },
];

const ICONS: Record<CategoriaOferta, typeof BedDouble> = {
  alojamiento: BedDouble,
  tour: Compass,
  producto: ShoppingBasket,
  paquete: Package,
};

interface ExploreFiltersProps {
  query: string;
  onQueryChange: (value: string) => void;
  categoria: CategoriaOferta | "todas";
  onCategoriaChange: (value: CategoriaOferta | "todas") => void;
}

export function ExploreFilters({
  query,
  onQueryChange,
  categoria,
  onCategoriaChange,
}: ExploreFiltersProps) {
  return (
    <div className="space-y-4">
      <label className="block">
        <span className="sr-only">Buscar experiencias</span>
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Buscar cabaña, trapiche, salsas, Cocora…"
          className="h-12 w-full rounded-2xl border border-emerald-900/15 bg-white px-4 text-sm outline-none ring-emerald-700/20 focus:ring-2 dark:border-white/10 dark:bg-zinc-900"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const Icon =
            filter.id === "todas" ? null : ICONS[filter.id as CategoriaOferta];
          const active = categoria === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => onCategoriaChange(filter.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-emerald-700 text-white"
                  : "border border-emerald-800/15 bg-white text-zinc-700 hover:bg-emerald-50 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-emerald-950",
              )}
            >
              {Icon ? <Icon className="h-4 w-4" aria-hidden /> : null}
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
