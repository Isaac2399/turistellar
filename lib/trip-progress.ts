import { verificarDisponibilidad } from "@/lib/availability";
import { getOfertaById } from "@/lib/mock-data";
import type { EstadoReserva } from "@/types/estado-reserva";
import type { AlertaDisponibilidad, ItineraryItem, OfertaTuristica } from "@/types/tourist";

export function alertasDisponibilidad(
  items: readonly ItineraryItem[],
): AlertaDisponibilidad[] {
  const alertas: AlertaDisponibilidad[] = [];
  for (const item of items) {
    const alerta = verificarDisponibilidad(item);
    if (alerta) alertas.push(alerta);
  }
  return alertas;
}

export function ofertaExigeHora(oferta: Pick<OfertaTuristica, "turnos"> | undefined): boolean {
  return (oferta?.turnos.length ?? 0) > 0;
}

export function itemConHorario(item: ItineraryItem): boolean {
  if (!item.fecha) return false;
  const oferta = getOfertaById(item.ofertaId);
  if (!oferta || ofertaExigeHora(oferta)) return Boolean(item.hora);
  return true;
}

export function horariosCompletos(items: readonly ItineraryItem[]): boolean {
  return items.length > 0 && items.every(itemConHorario);
}

export function estadoItinerario(
  items: readonly ItineraryItem[],
): Extract<EstadoReserva, "borrador" | "horarios_fijados"> {
  return horariosCompletos(items) ? "horarios_fijados" : "borrador";
}

export function puedePagarAnticipo(items: readonly ItineraryItem[]): boolean {
  return horariosCompletos(items) && alertasDisponibilidad(items).length === 0;
}
