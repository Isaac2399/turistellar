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
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-8">
        <ExploreFilters
          query={query}
          onQueryChange={setQuery}
          categoria={categoria}
          onCategoriaChange={setCategoria}
        />
        <InteractiveMap
          items={items}
          emphasizedIds={emphasizedIds}
          selectedId={selectedId}
          onSelectOferta={setSelectedId}
        />
        <div className="grid gap-4 sm:grid-cols-2">
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
          <p className="text-sm text-zinc-500">No hay ofertas para esos filtros.</p>
        ) : null}
      </div>
      <ItineraryPanel selectedId={selectedId} onFocus={focusOnMap} />
    </div>
  );
}
