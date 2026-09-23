/**
 * Tourist planner models: catalog offers, itinerary lines, and digital passports.
 * Amounts stay as strings to match Stellar 7-decimal precision used elsewhere.
 */

import type { EstadoReserva } from "./estado-reserva";

export type CategoriaOferta =
  | "alojamiento"
  | "tour"
  | "producto"
  | "paquete";

export type UnidadPrecio = "noche" | "persona" | "unidad" | "paquete";

export type PorcentajeAnticipoTurista = 30 | 50;

export type CanalPagoCheckout = "fiat" | "stellar";

export type ActivoPago = "USDC" | "XLM" | "USD";

export interface Coordenada {
  lat: number;
  lng: number;
}

export interface HorarioAtencion {
  /** 0 = domingo … 6 = sábado */
  dias: readonly number[];
  abre: string;
  cierra: string;
}

export interface TurnoCatalogo {
  fecha: string;
  hora: string;
  cuposTotales: number;
  cuposOcupados: number;
}

export interface OfertaTuristica {
  id: string;
  categoria: CategoriaOferta;
  titulo: string;
  descripcion: string;
  empresa: string;
  ubicacion: string;
  puntuacion: number;
  resenas: number;
  precioUsd: string;
  unidadPrecio: UnidadPrecio;
  porcentajeAnticipo: PorcentajeAnticipoTurista;
  imagenUrl: string;
  coordenadas: Coordenada;
  horarios: readonly HorarioAtencion[];
  duracionMinutos?: number;
  capacidad?: number;
  turnos: readonly TurnoCatalogo[];
  /** Fechas YYYY-MM-DD ya ocupadas (alojamiento). */
  nochesOcupadas?: readonly string[];
  /** Ofertas hijas que un paquete conecta en el mapa. */
  incluyeIds?: readonly string[];
}

export interface ItineraryItem {
  id: string;
  ofertaId: string;
  cantidad: number;
  noches: number;
  fecha: string | null;
  hora: string | null;
  addedAt: string;
}

export interface DesgloseLinea {
  itemId: string;
  ofertaId: string;
  titulo: string;
  categoria: CategoriaOferta;
  cantidad: number;
  noches: number;
  subtotal: string;
  anticipo: string;
  saldo: string;
  porcentajeAnticipo: PorcentajeAnticipoTurista;
}

export interface DesgloseFinanciero {
  lineas: DesgloseLinea[];
  total: string;
  anticipo: string;
  saldo: string;
}

export interface PasaporteReserva {
  id: string;
  codigoQr: string;
  createdAt: string;
  canalPago: CanalPagoCheckout;
  assetCode: ActivoPago;
  estado: EstadoReserva;
  desglose: DesgloseFinanciero;
  items: ItineraryItem[];
  stellarPublicKey?: string;
  stellarTxHash?: string;
  escrowContractId: string;
}

export interface AlertaDisponibilidad {
  ofertaId: string;
  titulo: string;
  mensaje: string;
  sugerenciaFecha?: string;
  sugerenciaHora?: string;
}
