"use client";

import { BedDouble, Compass, Package, Search, ShoppingBasket } from "lucide-react";
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
      <label className="relative block">
        <span className="sr-only">Buscar experiencias</span>
        <Search
          className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-stone-400"
          aria-hidden
        />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Buscar cabaña, trapiche, salsas, Cocora…"
          className="h-12 w-full rounded-2xl border border-stone-900/10 bg-white/80 pr-4 pl-11 text-sm text-stone-900 outline-none ring-emerald-700/20 backdrop-blur-sm transition focus:ring-2 dark:border-white/10 dark:bg-stone-900/70 dark:text-stone-100"
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
                "inline-flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-sm font-semibold transition-all",
                active
                  ? "bg-emerald-700 text-white shadow-[0_8px_18px_rgba(4,120,87,0.22)]"
                  : "border border-stone-900/10 bg-white/70 text-stone-700 backdrop-blur-sm hover:border-emerald-700/25 hover:bg-emerald-50/80 dark:border-white/10 dark:bg-stone-900/60 dark:text-stone-200 dark:hover:bg-emerald-950/40",
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
