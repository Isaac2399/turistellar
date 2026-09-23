import { ExploreExperience } from "@/components/tourist/ExploreExperience";

export default function ExplorarPage() {
  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">Armar el viaje</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Elige alojamiento, tours y productos locales. El mapa y el itinerario están
          en esta pantalla.
        </p>
      </div>
      <ExploreExperience />
    </div>
  );
}
