import { ItineraryTimeline } from "@/components/tourist/ItineraryTimeline";

export default function ExplorarAgendaPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Agenda por horas exactas</h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Ejemplo de día: 08:00 check-in → 10:30 tour del trapiche → 13:00 recoger lote de
        salsas. Si no hay cupo, verás el siguiente turno libre.
      </p>
      <ItineraryTimeline />
    </div>
  );
}
