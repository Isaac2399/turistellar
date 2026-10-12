"use client";

import { useMemo, useState } from "react";
import { ExploreFilters } from "@/components/tourist/ExploreFilters";
import { OfferCard } from "@/components/tourist/OfferCard";
import { InteractiveMap } from "@/components/tourist/InteractiveMap";
import { ItineraryPanel } from "@/components/tourist/ItineraryPanel";
import { useTourist } from "@/components/tourist/TouristProvider";
import { OFERTAS_TURISTICAS } from "@/lib/mock-data";
import type { CategoriaOferta } from "@/types/tourist";

export function ExploreExperience() {
  const { items, addOferta } = useTourist();
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState<CategoriaOferta | "todas">("todas");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return OFERTAS_TURISTICAS.filter((oferta) => {
      if (categoria !== "todas" && oferta.categoria !== categoria) return false;
      if (!q) return true;
      return (
        oferta.titulo.toLowerCase().includes(q) ||
        oferta.empresa.toLowerCase().includes(q) ||
        oferta.ubicacion.toLowerCase().includes(q) ||
        oferta.descripcion.toLowerCase().includes(q)
      );
    });
  }, [categoria, query]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const inItinerary = useMemo(
    () => new Set(items.map((row) => row.ofertaId)),
    [items],
  );
  const emphasizedIds = useMemo(() => {
    const ids = new Set<string>();
    for (const oferta of filtered) {
      ids.add(oferta.id);
      for (const childId of oferta.incluyeIds ?? []) ids.add(childId);
    }
    return [...ids];
  }, [filtered]);

  function focusOnMap(ofertaId: string) {
    setSelectedId(ofertaId);
    document.getElementById("mapa-rural")?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_21rem]">
      <div className="space-y-8">
        <ExploreFilters
          query={query}
          onQueryChange={setQuery}
          categoria={categoria}
          onCategoriaChange={setCategoria}
        />
        <div className="overflow-hidden rounded-3xl border border-stone-900/8 shadow-[var(--shadow-soft)] dark:border-white/10">
          <InteractiveMap
            items={items}
            emphasizedIds={emphasizedIds}
            selectedId={selectedId}
            onSelectOferta={setSelectedId}
          />
        </div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-emerald-800 uppercase dark:text-emerald-300">
              Catálogo vivo
            </p>
            <h2 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-50">
              Experiencias cerca de ti
            </h2>
          </div>
          <p className="text-sm font-medium text-stone-500">{filtered.length} resultados</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {filtered.map((oferta) => (
            <OfferCard
              key={oferta.id}
              oferta={oferta}
              inItinerary={inItinerary.has(oferta.id)}
              onAdd={() => addOferta(oferta.id)}
            />
          ))}
        </div>
        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-stone-900/15 px-4 py-8 text-center text-sm text-stone-500">
            No hay ofertas para esos filtros. Prueba otra categoría o búsqueda.
          </p>
        ) : null}
      </div>
      <ItineraryPanel selectedId={selectedId} onFocus={focusOnMap} />
    </div>
  );
}
