/**
 * Domain types for the Rural Tourism & Local Commerce Hub.
 * These models are shared by the App Router UI, API routes, and future Soroban clients.
 */

/** Supported on-chain / off-ramp payment rails for a booking package. */
export type MetodoPago = "xlm" | "usdc" | "fiat_ramp";

/** Roles recognized by dashboard routes. */
export type RolUsuario = "turista" | "comerciante" | "admin";

/**
 * Lifecycle of a tourist booking package.
 * Maps to both off-chain persistence and on-chain escrow status.
 */
export type EstadoReserva =
  | "pendiente"
  | "pagado"
  | "confirmado"
  | "en_curso"
  | "completado"
  | "cancelado"
  | "reembolsado";

/** On-chain settlement status for a Stellar payment or Soroban escrow. */
export type EstadoTransaccion =
  | "creada"
  | "firmada"
  | "enviada"
  | "exitosa"
  | "fallida";

export interface ExperienciaTuristica {
  id: string;
  titulo: string;
  descripcion: string;
  /** Host / operator account (Stellar public key, G...). */
  comercianteId: string;
  ubicacion: string;
  duracionMinutos: number;
  capacidadMaxima: number;
  /** Quoted price in the selected asset (7-decimal Stellar amount as string). */
  precio: string;
  activo: boolean;
  imagenUrl?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductoLocal {
  id: string;
  nombre: string;
  descripcion: string;
  comercianteId: string;
  /** Unit price in the selected asset (string to preserve Stellar precision). */
  precio: string;
  unidad: string;
  stock: number;
  esPreorden: boolean;
  activo: boolean;
  imagenUrl?: string;
  origen?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ItemPaqueteProducto {
  productoId: string;
  cantidad: number;
  precioUnitario: string;
}

export interface PaqueteReserva {
  id: string;
  turistaId: string;
  experienciaId: string;
  fechaExperiencia: string;
  participantes: number;
  productos: ItemPaqueteProducto[];
  /** Total in the selected Stellar asset (string amount). */
  total: string;
  assetCode: "XLM" | "USDC";
  metodoPago: MetodoPago;
  estado: EstadoReserva;
  /** Horizon / RPC transaction hash once submitted. */
  stellarTxHash?: string;
  /** Future Soroban escrow contract id (C...). */
  contratoEscrowId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Usuario {
  id: string;
  rol: RolUsuario;
  nombre: string;
  email?: string;
  /** Stellar account public key when the user connected Freighter. */
  publicKey?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaccion {
  id: string;
  paqueteId: string;
  assetCode: "XLM" | "USDC";
  amount: string;
  fromPublicKey: string;
  toPublicKey: string;
  metodoPago: MetodoPago;
  estado: EstadoTransaccion;
  horizonHash?: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
}

/** Cart line used by `useCart` before a `PaqueteReserva` is created. */
export interface CartItem {
  kind: "experiencia" | "producto";
  itemId: string;
  titulo: string;
  cantidad: number;
  precioUnitario: string;
}

export type {
  ActivoPago,
  AlertaDisponibilidad,
  CanalPagoCheckout,
  CategoriaOferta,
  Coordenada,
  DesgloseFinanciero,
  DesgloseLinea,
  EstadoPasaporte,
  HorarioAtencion,
  ItineraryItem,
  OfertaTuristica,
  PasaporteReserva,
  PorcentajeAnticipoTurista,
  TurnoCatalogo,
  UnidadPrecio,
} from "./tourist";
