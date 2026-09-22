"use client";

import { InteractiveMap } from "@/components/tourist/InteractiveMap";
import { ItineraryPanel } from "@/components/tourist/ItineraryPanel";
import { useTourist } from "@/components/tourist/TouristProvider";

export default function ExplorarMapaPage() {
  const { items } = useTourist();

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Puntos conectados</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Marcadores: cabaña (alojamiento), brújula (tour) y cesta (producto). La línea
          punteada recorre el itinerario en orden de hora.
        </p>
        <InteractiveMap items={items} />
      </div>
      <ItineraryPanel />
    </div>
  );
}
