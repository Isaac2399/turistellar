import { ExploreExperience } from "@/components/tourist/ExploreExperience";

export default function ExplorarPage() {
  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold tracking-[0.16em] text-emerald-800 uppercase dark:text-emerald-300">
          Paso 1
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-50">
          Armar el viaje
        </h1>
        <p className="mt-3 text-base leading-relaxed text-stone-600 dark:text-stone-400">
          Elige alojamiento, tours y productos locales. El mapa y tu itinerario
          conviven en una sola pantalla, al estilo de una reserva de experiencias.
        </p>
      </div>
      <ExploreExperience />
    </div>
  );
}
