/**
 * Single booking lifecycle shared by the tourist passport and the merchant panel.
 * `borrador` and `horarios_fijados` are unpaid itineraries, not reservations yet.
 */

export type EstadoReserva =
  | "borrador"
  | "horarios_fijados"
  | "anticipo_retenido"
  | "servicio_confirmado"
  | "fondos_liberados"
  | "reembolsado";

export const ESTADO_RESERVA_LABEL: Record<EstadoReserva, string> = {
  borrador: "Borrador",
  horarios_fijados: "Horarios fijados",
  anticipo_retenido: "Anticipo retenido",
  servicio_confirmado: "Servicio confirmado",
  fondos_liberados: "Fondos liberados",
  reembolsado: "Reembolsado",
};

export const ESTADO_RESERVA_TONE: Record<
  EstadoReserva,
  "zinc" | "sky" | "amber" | "emerald" | "rose"
> = {
  borrador: "zinc",
  horarios_fijados: "sky",
  anticipo_retenido: "amber",
  servicio_confirmado: "sky",
  fondos_liberados: "emerald",
  reembolsado: "rose",
};

export type AccionReserva = "confirmar_servicio" | "liberar_fondos" | "reembolsar";

const TRANSICIONES: Record<AccionReserva, { desde: EstadoReserva; hacia: EstadoReserva }> = {
  confirmar_servicio: { desde: "anticipo_retenido", hacia: "servicio_confirmado" },
  liberar_fondos: { desde: "servicio_confirmado", hacia: "fondos_liberados" },
  reembolsar: { desde: "anticipo_retenido", hacia: "reembolsado" },
};

const ESTADOS = new Set<string>(Object.keys(ESTADO_RESERVA_LABEL));

const LEGACY_ESTADO: Record<string, EstadoReserva> = {
  anticipo_pagado: "anticipo_retenido",
  anticipo_recibido: "anticipo_retenido",
  escaneado_destino: "servicio_confirmado",
  pendiente_liberacion: "servicio_confirmado",
  pagado_completo: "fondos_liberados",
  cancelado: "reembolsado",
  pendiente: "borrador",
  pagado: "anticipo_retenido",
  confirmado: "servicio_confirmado",
  en_curso: "servicio_confirmado",
  completado: "fondos_liberados",
};

export function esEstadoReserva(value: string): value is EstadoReserva {
  return ESTADOS.has(value);
}

export function normalizarEstadoReserva(value: unknown): EstadoReserva {
  if (typeof value === "string" && esEstadoReserva(value)) return value;
  if (typeof value === "string" && value in LEGACY_ESTADO) return LEGACY_ESTADO[value];
  return "anticipo_retenido";
}

/** Returns the next state, or null when the action is not allowed from `estado`. */
export function aplicarAccionReserva(
  estado: EstadoReserva,
  accion: AccionReserva,
): EstadoReserva | null {
  const regla = TRANSICIONES[accion];
  return estado === regla.desde ? regla.hacia : null;
}
