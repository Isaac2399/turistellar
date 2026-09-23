import { getOfertaById, OFERTAS_TURISTICAS } from "@/lib/mock-data";
import { formatAmount, parseAmount, percentOf } from "@/lib/money";
import type {
  Coordenada,
  DesgloseFinanciero,
  DesgloseLinea,
  ItineraryItem,
  OfertaTuristica,
} from "@/types/tourist";

export function createItineraryItem(
  ofertaId: string,
  extras?: Partial<Pick<ItineraryItem, "cantidad" | "noches" | "fecha" | "hora">>,
): ItineraryItem {
  const oferta = getOfertaById(ofertaId);
  const noches = extras?.noches ?? (oferta?.categoria === "alojamiento" ? 2 : 1);
  return {
    id: `it-${ofertaId}-${crypto.randomUUID()}`,
    ofertaId,
    cantidad: extras?.cantidad ?? 1,
    noches,
    fecha: extras?.fecha ?? null,
    hora: extras?.hora ?? null,
    addedAt: new Date().toISOString(),
  };
}

export function multiplicadorLinea(item: ItineraryItem, oferta: OfertaTuristica): number {
  if (oferta.unidadPrecio === "noche") return item.noches * item.cantidad;
  return item.cantidad;
}

export function buildDesglose(items: readonly ItineraryItem[]): DesgloseFinanciero {
  const lineas: DesgloseLinea[] = [];

  for (const item of items) {
    const oferta = getOfertaById(item.ofertaId);
    if (!oferta) continue;
    const qty = multiplicadorLinea(item, oferta);
    const subtotal = formatAmount(parseAmount(oferta.precioUsd) * qty);
    const anticipo = percentOf(subtotal, oferta.porcentajeAnticipo);
    const saldo = formatAmount(parseAmount(subtotal) - parseAmount(anticipo));
    lineas.push({
      itemId: item.id,
      ofertaId: oferta.id,
      titulo: oferta.titulo,
      categoria: oferta.categoria,
      cantidad: item.cantidad,
      noches: item.noches,
      subtotal,
      anticipo,
      saldo,
      porcentajeAnticipo: oferta.porcentajeAnticipo,
    });
  }

  const total = formatAmount(lineas.reduce((s, l) => s + parseAmount(l.subtotal), 0));
  const anticipo = formatAmount(lineas.reduce((s, l) => s + parseAmount(l.anticipo), 0));
  const saldo = formatAmount(lineas.reduce((s, l) => s + parseAmount(l.saldo), 0));

  return { lineas, total, anticipo, saldo };
}

export function paradasConectadas(items: readonly ItineraryItem[]): OfertaTuristica[] {
  const seen = new Set<string>();
  const stops: OfertaTuristica[] = [];

  const ordered = [...items].sort((a, b) => {
    const aKey = `${a.fecha ?? "9999"}T${a.hora ?? "99:99"}`;
    const bKey = `${b.fecha ?? "9999"}T${b.hora ?? "99:99"}`;
    return aKey.localeCompare(bKey);
  });

  for (const item of ordered) {
    const oferta = getOfertaById(item.ofertaId);
    if (!oferta) continue;
    const ids = oferta.incluyeIds?.length ? oferta.incluyeIds : [oferta.id];
    for (const id of ids) {
      const child = getOfertaById(id) ?? (id === oferta.id ? oferta : undefined);
      if (!child || child.categoria === "paquete" || seen.has(child.id)) continue;
      seen.add(child.id);
      stops.push(child);
    }
  }

  return stops;
}

export function puntosConectados(items: readonly ItineraryItem[]): Coordenada[] {
  return paradasConectadas(items).map((stop) => stop.coordenadas);
}

export function ofertasEnItinerario(items: readonly ItineraryItem[]): OfertaTuristica[] {
  const ids = new Set<string>();
  for (const item of items) {
    const oferta = getOfertaById(item.ofertaId);
    if (!oferta) continue;
    ids.add(oferta.id);
    for (const childId of oferta.incluyeIds ?? []) ids.add(childId);
  }
  return OFERTAS_TURISTICAS.filter((row) => ids.has(row.id));
}

export function etiquetaHorario(item: ItineraryItem): string {
  if (item.fecha && item.hora) return `${item.fecha} · ${item.hora}`;
  return "Sin hora asignada";
}
