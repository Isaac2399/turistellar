export const CANTONES = [
  "Pérez Zeledón",
  "Buenos Aires",
  "Osa",
  "Golfito",
  "Coto Brus",
  "Corredores",
] as const;

export type Canton = (typeof CANTONES)[number];

export const TIPOS_SERVICIO = ["cama", "guia", "comida"] as const;

export type TipoServicio = (typeof TIPOS_SERVICIO)[number];

export const TIPO_LABEL: Record<TipoServicio, string> = {
  cama: "Cama",
  guia: "Guía",
  comida: "Comida",
};

export interface Oferta {
  id: string;
  tipo: TipoServicio;
  titulo: string;
  operador: string;
  lugar: string;
  canton: Canton;
  descripcion: string;
  precio: string;
  imagen: string | null;
}

export interface LineaHistorial {
  id: string;
  ofertaId: string;
  fecha: string;
  queSeOfrecio: string;
  operador: string;
  origen: "ejemplo" | "sesion";
  cuentaOperador: string | null;
  cuentaTurista: string | null;
}

export type EstadoReserva = "reservada" | "prestado" | "confirmada";

export interface Reserva {
  id: string;
  ofertaId: string;
  fecha: string;
  nombreTurista: string;
  estado: EstadoReserva;
  cuentaOperador: string | null;
  cuentaTurista: string | null;
}

export interface NuevaOferta {
  tipo: TipoServicio;
  titulo: string;
  operador: string;
  lugar: string;
  canton: Canton;
  descripcion: string;
  precio: string;
}

export interface NuevaReserva {
  ofertaId: string;
  fecha: string;
  nombreTurista: string;
}
