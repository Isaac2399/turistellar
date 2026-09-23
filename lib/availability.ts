import { getOfertaById } from "@/lib/mock-data";
import type {
  AlertaDisponibilidad,
  ItineraryItem,
  OfertaTuristica,
  TurnoCatalogo,
} from "@/types/tourist";

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function turnoLibre(turno: TurnoCatalogo, cantidad: number): boolean {
  return turno.cuposOcupados + cantidad <= turno.cuposTotales;
}

export function nochesDelStay(checkIn: string, noches: number): string[] {
  return Array.from({ length: noches }, (_, i) => addDays(checkIn, i));
}

function alojamientoDisponible(
  oferta: OfertaTuristica,
  checkIn: string,
  noches: number,
): boolean {
  const ocupadas = new Set(oferta.nochesOcupadas ?? []);
  return nochesDelStay(checkIn, noches).every((fecha) => !ocupadas.has(fecha));
}

function siguienteNocheLibre(oferta: OfertaTuristica, from: string, noches: number): string | undefined {
  for (let i = 0; i < 21; i += 1) {
    const candidate = addDays(from, i);
    if (alojamientoDisponible(oferta, candidate, noches)) return candidate;
  }
  return undefined;
}

function siguienteTurno(
  oferta: OfertaTuristica,
  fromDate: string,
  fromTime: string,
  cantidad: number,
): TurnoCatalogo | undefined {
  const start = `${fromDate}T${fromTime}`;
  return [...oferta.turnos]
    .filter((turno) => turnoLibre(turno, cantidad))
    .sort((a, b) => `${a.fecha}T${a.hora}`.localeCompare(`${b.fecha}T${b.hora}`))
    .find((turno) => `${turno.fecha}T${turno.hora}` >= start);
}

export function dentroDeHorario(oferta: OfertaTuristica, fecha: string, hora: string): boolean {
  const day = new Date(`${fecha}T12:00:00`).getDay();
  const minutes = toMinutes(hora);
  return oferta.horarios.some(
    (h) =>
      h.dias.includes(day) &&
      minutes >= toMinutes(h.abre) &&
      minutes <= toMinutes(h.cierra),
  );
}

export function verificarDisponibilidad(
  item: Pick<ItineraryItem, "ofertaId" | "cantidad" | "noches" | "fecha" | "hora">,
): AlertaDisponibilidad | null {
  const oferta = getOfertaById(item.ofertaId);
  if (!oferta || !item.fecha || !item.hora) return null;

  if (oferta.categoria === "alojamiento") {
    if (!alojamientoDisponible(oferta, item.fecha, item.noches)) {
      const next = siguienteNocheLibre(oferta, item.fecha, item.noches);
      return {
        ofertaId: oferta.id,
        titulo: oferta.titulo,
        mensaje: `${oferta.titulo} no tiene cupo esas noches.`,
        sugerenciaFecha: next,
        sugerenciaHora: item.hora,
      };
    }
    if (!dentroDeHorario(oferta, item.fecha, item.hora)) {
      return {
        ofertaId: oferta.id,
        titulo: oferta.titulo,
        mensaje: `El check-in de ${oferta.titulo} está fuera del horario de llegada.`,
        sugerenciaFecha: item.fecha,
        sugerenciaHora: oferta.horarios[0]?.abre,
      };
    }
    return null;
  }

  const exacto = oferta.turnos.find(
    (turno) => turno.fecha === item.fecha && turno.hora === item.hora,
  );

  if (exacto && !turnoLibre(exacto, item.cantidad)) {
    const next = siguienteTurno(oferta, item.fecha, item.hora, item.cantidad);
    return {
      ofertaId: oferta.id,
      titulo: oferta.titulo,
      mensaje: `${oferta.titulo} no tiene cupo en esa hora.`,
      sugerenciaFecha: next?.fecha,
      sugerenciaHora: next?.hora,
    };
  }

  if (exacto || dentroDeHorario(oferta, item.fecha, item.hora)) return null;

  const next = siguienteTurno(oferta, item.fecha, item.hora, item.cantidad);
  return {
    ofertaId: oferta.id,
    titulo: oferta.titulo,
    mensaje: `${oferta.titulo} está fuera de su horario de atención.`,
    sugerenciaFecha: next?.fecha,
    sugerenciaHora: next?.hora,
  };
}
