import type { Metadata } from "next";
import { ItineraryTimeline } from "@/components/tourist/ItineraryTimeline";

export const metadata: Metadata = {
  title: "Fijar horarios · Hub Rural",
  description: "Asigna la fecha y la hora de cada parada del viaje.",
};

export default function ExplorarAgendaPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight">Fijar horarios</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Asigna la fecha y la hora de cada parada. Si no hay cupo, verás el siguiente
        turno libre.
      </p>
      <ItineraryTimeline />
    </div>
  );
}
