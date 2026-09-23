/**
 * Mock catalog for the merchant (empresa) dashboard.
 * Keep amounts as strings to stay compatible with Stellar 7-decimal precision.
 */

import type { EstadoReserva } from "@/types/estado-reserva";

export type CategoriaEmpresa = "eco-turismo" | "gastronomia" | "finca";

export type PorcentajeAnticipo = 30 | 50 | 100;

export type EstadoTurno =
  | "disponible"
  | "reservado_parcial"
  | "lleno"
  | "bloqueado";

export type TipoNotificacion = "tour_proximo" | "saldo_pendiente" | "stock_bajo";

export type TipoAlojamiento =
  | "habitacion_privada"
  | "cabana_completa"
  | "casa_de_campo"
  | "glamping";

export type TipoCama = "matrimonial" | "individual" | "nido_litera";

export type TipoBano = "privado" | "compartido";

export type AmenidadAlojamiento =
  | "wifi"
  | "desayuno"
  | "parqueo"
  | "cocina"
  | "mascotas"
  | "agua_caliente";

export type EstadoNocheAlojamiento = "disponible" | "reservada_anticipo" | "bloqueada";

export type CanalPagoAnticipo = "stellar" | "fiat";

export interface PerfilEmpresa {
  nombreComercial: string;
  descripcion: string;
  categorias: CategoriaEmpresa[];
  logoUrl: string;
  ubicacion: string;
  whatsapp: string;
  stellarWallet: string;
}

export interface TourComerciante {
  id: string;
  titulo: string;
  descripcion: string;
  duracionMinutos: number;
  precioPorPersona: string;
  cupoMaximo: number;
  porcentajeAnticipo: PorcentajeAnticipo;
  activo: boolean;
}

export interface ProductoArtesanal {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string;
  stock: number;
  imagenUrl: string;
  diasPreorden: number;
  activo: boolean;
}

export interface TurnoCalendario {
  id: string;
  fecha: string;
  hora: string;
  tourId: string;
  estado: EstadoTurno;
  cuposOcupados: number;
}

export interface ItemReservaProducto {
  productoId: string;
  cantidad: number;
}

export interface ReservaComerciante {
  id: string;
  turistaNombre: string;
  fechaHora: string;
  tourId: string;
  productos: ItemReservaProducto[];
  montoTotal: string;
  anticipoPagado: string;
  pendienteCobrar: string;
  assetCode: "USDC" | "XLM";
  estadoPago: EstadoReserva;
  escrowContractId: string;
}

export interface NotificacionComerciante {
  id: string;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  leida: boolean;
  createdAt: string;
}

export interface DistribucionCamas {
  tipo: TipoCama;
  cantidad: number;
}

export interface AlojamientoUnidad {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: TipoAlojamiento;
  capacidadHuespedes: number;
  camas: DistribucionCamas[];
  numeroBanos: number;
  tipoBano: TipoBano;
  amenidades: AmenidadAlojamiento[];
  galeriaUrls: string[];
  precioPorNoche: string;
  porcentajeAnticipo: PorcentajeAnticipo;
  depositoGarantia: string;
  escrowGarantiaActivo: boolean;
  activo: boolean;
}

export interface NocheOcupacion {
  id: string;
  fecha: string;
  unidadId: string;
  estado: EstadoNocheAlojamiento;
}

export interface ReservaAlojamiento {
  id: string;
  huespedNombre: string;
  unidadId: string;
  checkIn: string;
  checkOut: string;
  noches: number;
  personas: number;
  anticipoPagado: string;
  saldoPendiente: string;
  assetCode: "USDC" | "XLM" | "USD";
  canalPagoAnticipo: CanalPagoAnticipo;
  estadoPago: EstadoReserva;
  escrowContractId: string;
}

export type CatalogoEmpresa = "estadia-tours" | "productos";

export interface MerchantSnapshot {
  catalogo: CatalogoEmpresa;
  perfil: PerfilEmpresa;
  tours: TourComerciante[];
  productos: ProductoArtesanal[];
  turnos: TurnoCalendario[];
  reservas: ReservaComerciante[];
  notificaciones: NotificacionComerciante[];
  alojamientos: AlojamientoUnidad[];
  nochesAlojamiento: NocheOcupacion[];
  reservasAlojamiento: ReservaAlojamiento[];
}

export const CATEGORIA_LABEL: Record<CategoriaEmpresa, string> = {
  "eco-turismo": "Eco-turismo",
  gastronomia: "Gastronomía",
  finca: "Finca",
};

export const ESTADO_TURNO_LABEL: Record<EstadoTurno, string> = {
  disponible: "Disponible",
  reservado_parcial: "Reservado parcial",
  lleno: "Lleno",
  bloqueado: "Bloqueado / Cerrado",
};

export const TIPO_NOTIFICACION_LABEL: Record<TipoNotificacion, string> = {
  tour_proximo: "Tour próximo",
  saldo_pendiente: "Saldo pendiente",
  stock_bajo: "Stock bajo",
};

export const TIPO_ALOJAMIENTO_LABEL: Record<TipoAlojamiento, string> = {
  habitacion_privada: "Habitación privada",
  cabana_completa: "Cabaña completa",
  casa_de_campo: "Casa de campo",
  glamping: "Glamping",
};

export const TIPO_CAMA_LABEL: Record<TipoCama, string> = {
  matrimonial: "Matrimonial",
  individual: "Individual",
  nido_litera: "Camas nido / litera",
};

export const TIPO_BANO_LABEL: Record<TipoBano, string> = {
  privado: "Privado",
  compartido: "Compartido",
};

export const AMENIDAD_ALOJAMIENTO_LABEL: Record<AmenidadAlojamiento, string> = {
  wifi: "WiFi",
  desayuno: "Desayuno incluido",
  parqueo: "Parqueo",
  cocina: "Cocina",
  mascotas: "Acepta mascotas",
  agua_caliente: "Agua caliente",
};

export const AMENIDADES_ALOJAMIENTO: readonly AmenidadAlojamiento[] = [
  "wifi",
  "desayuno",
  "parqueo",
  "cocina",
  "mascotas",
  "agua_caliente",
] as const;

export const ESTADO_NOCHE_LABEL: Record<EstadoNocheAlojamiento, string> = {
  disponible: "Disponible",
  reservada_anticipo: "Reservada / Anticipo pagado",
  bloqueada: "Bloqueada / Uso propio",
};

export const CANAL_PAGO_LABEL: Record<CanalPagoAnticipo, string> = {
  stellar: "Stellar (USDC)",
  fiat: "Fiat",
};

export const CICLO_ESTADO_TURNO: readonly EstadoTurno[] = [
  "disponible",
  "reservado_parcial",
  "lleno",
  "bloqueado",
] as const;

export function nextEstadoTurno(current: EstadoTurno): EstadoTurno {
  const index = CICLO_ESTADO_TURNO.indexOf(current);
  return CICLO_ESTADO_TURNO[(index + 1) % CICLO_ESTADO_TURNO.length];
}

export const CICLO_ESTADO_NOCHE: readonly EstadoNocheAlojamiento[] = [
  "disponible",
  "reservada_anticipo",
  "bloqueada",
] as const;

export function nextEstadoNoche(current: EstadoNocheAlojamiento): EstadoNocheAlojamiento {
  const index = CICLO_ESTADO_NOCHE.indexOf(current);
  return CICLO_ESTADO_NOCHE[(index + 1) % CICLO_ESTADO_NOCHE.length];
}

const PERFIL_ROBLE: PerfilEmpresa = {
  nombreComercial: "Finca El Roble",
  descripcion:
    "Estadía y tours en el Eje Cafetero. Cabañas, sendero del cafetal y caminata al Valle de Cocora. Esta cuenta no vende productos.",
  categorias: ["eco-turismo", "finca"],
  logoUrl: "",
  ubicacion: "Vereda La Esperanza, Salento, Quindío",
  whatsapp: "573001234567",
  stellarWallet: "GDRXE2BQUC3AZB4BXQYDMEGQSZA3QC4GZBXNLMRSKXGBJQ5J2V2XAAAA",
};

const PERFIL_VALLE: PerfilEmpresa = {
  nombreComercial: "Artesanías Valle Verde",
  descripcion:
    "Productos de finca para recoger en el viaje: salsas, café y canasta campesina. Esta cuenta no ofrece estadía ni tours.",
  categorias: ["gastronomia"],
  logoUrl: "",
  ubicacion: "Salento centro, Quindío",
  whatsapp: "573009876543",
  stellarWallet: "GARTESANIAVALLEVERDESTELLARWALLETXXXXXXXXXXXXXXXXXXXX",
};

const TOURS_ROBLE: TourComerciante[] = [
  {
    id: "tour-trapiche",
    titulo: "Tour del Trapiche de Caña",
    descripcion: "Molienda en vivo, jugo de caña y panela. Recorrido de 2.5 h con guía de la finca.",
    duracionMinutos: 150,
    precioPorPersona: "38.00",
    cupoMaximo: 8,
    porcentajeAnticipo: 30,
    activo: true,
  },
  {
    id: "tour-cafetal",
    titulo: "Sendero del cafetal y cata de altura",
    descripcion:
      "Cultivo, beneficio húmedo y cata de tres tuestes. Incluye merienda campesina.",
    duracionMinutos: 180,
    precioPorPersona: "45.00",
    cupoMaximo: 8,
    porcentajeAnticipo: 50,
    activo: true,
  },
  {
    id: "tour-cocora",
    titulo: "Caminata palmas de cera · Valle de Cocora",
    descripcion: "Senderismo guiado entre palmas de cera, mirador y almuerzo campesino en finca.",
    duracionMinutos: 300,
    precioPorPersona: "52.00",
    cupoMaximo: 12,
    porcentajeAnticipo: 50,
    activo: true,
  },
];

const PRODUCTOS_VALLE: ProductoArtesanal[] = [
  {
    id: "prod-salsas",
    nombre: "Lote de salsas de la casa",
    descripcion: "Tres frascos: ají dulce fermentado, hogao de finca y salsa de uchuva.",
    precio: "22.00",
    stock: 12,
    imagenUrl: "",
    diasPreorden: 0,
    activo: true,
  },
  {
    id: "prod-cafe",
    nombre: "Café de altura 250 g · lote norte",
    descripcion: "Tostión media, empaque con válvula.",
    precio: "12.00",
    stock: 9,
    imagenUrl: "",
    diasPreorden: 3,
    activo: true,
  },
  {
    id: "prod-canasta",
    nombre: "Canasta campesina de temporada",
    descripcion: "Uchuva, plátano, panela en bloque y queso de finca.",
    precio: "18.50",
    stock: 3,
    imagenUrl: "",
    diasPreorden: 1,
    activo: true,
  },
];

const TURNOS_ROBLE: TurnoCalendario[] = [
  {
    id: "turno-0924-trapiche",
    fecha: "2026-09-24",
    hora: "14:00",
    tourId: "tour-trapiche",
    estado: "reservado_parcial",
    cuposOcupados: 2,
  },
  {
    id: "turno-0924-cafetal",
    fecha: "2026-09-24",
    hora: "08:00",
    tourId: "tour-cafetal",
    estado: "reservado_parcial",
    cuposOcupados: 1,
  },
  {
    id: "turno-0925-cocora",
    fecha: "2026-09-25",
    hora: "06:30",
    tourId: "tour-cocora",
    estado: "disponible",
    cuposOcupados: 0,
  },
];

const RESERVAS_ROBLE: ReservaComerciante[] = [
  {
    id: "res-trapiche",
    turistaNombre: "Mateo Ríos",
    fechaHora: "2026-09-24T14:00:00-05:00",
    tourId: "tour-trapiche",
    productos: [],
    montoTotal: "76.00",
    anticipoPagado: "22.80",
    pendienteCobrar: "53.20",
    assetCode: "USDC",
    estadoPago: "servicio_confirmado",
    escrowContractId: "CDMATEORIOSESCROWTRAPICHE24XXXXXXXXXXXXXXXXXXXX",
  },
  {
    id: "res-cafetal",
    turistaNombre: "Ana Sofía Vargas",
    fechaHora: "2026-09-24T08:00:00-05:00",
    tourId: "tour-cafetal",
    productos: [],
    montoTotal: "45.00",
    anticipoPagado: "22.50",
    pendienteCobrar: "22.50",
    assetCode: "USDC",
    estadoPago: "anticipo_retenido",
    escrowContractId: "CDANASOFIAESCROWCAFETAL24XXXXXXXXXXXXXXXXXXXXXX",
  },
];

const RESERVAS_VALLE: ReservaComerciante[] = [
  {
    id: "res-salsas",
    turistaNombre: "Lucía Herrera",
    fechaHora: "2026-09-24T11:00:00-05:00",
    tourId: "",
    productos: [{ productoId: "prod-salsas", cantidad: 1 }],
    montoTotal: "22.00",
    anticipoPagado: "6.60",
    pendienteCobrar: "15.40",
    assetCode: "USDC",
    estadoPago: "anticipo_retenido",
    escrowContractId: "CDLUCIAHERESCROWSALSAS24XXXXXXXXXXXXXXXXXXXXXXX",
  },
  {
    id: "res-cafe",
    turistaNombre: "Diego Peña",
    fechaHora: "2026-09-24T09:00:00-05:00",
    tourId: "",
    productos: [{ productoId: "prod-cafe", cantidad: 2 }],
    montoTotal: "24.00",
    anticipoPagado: "12.00",
    pendienteCobrar: "12.00",
    assetCode: "USDC",
    estadoPago: "servicio_confirmado",
    escrowContractId: "CDDIEGOPENAESCROWCAFE24XXXXXXXXXXXXXXXXXXXXXXX",
  },
  {
    id: "res-canasta",
    turistaNombre: "Camila Restrepo",
    fechaHora: "2026-09-26T10:00:00-05:00",
    tourId: "",
    productos: [{ productoId: "prod-canasta", cantidad: 2 }],
    montoTotal: "37.00",
    anticipoPagado: "11.10",
    pendienteCobrar: "25.90",
    assetCode: "USDC",
    estadoPago: "anticipo_retenido",
    escrowContractId: "CDCAMILARESTESCROWCANASTA26XXXXXXXXXXXXXXXXXXX",
  },
];

const MOCK_ALOJAMIENTOS: AlojamientoUnidad[] = [
  {
    id: "alo-trapiche",
    nombre: "Cabaña del Trapiche",
    descripcion:
      "Cabaña de guadua junto al trapiche de caña. Terraza con hamacas, cocina campesina y fogón de leña para noches frías.",
    tipo: "cabana_completa",
    capacidadHuespedes: 4,
    camas: [
      { tipo: "matrimonial", cantidad: 1 },
      { tipo: "individual", cantidad: 2 },
    ],
    numeroBanos: 1,
    tipoBano: "privado",
    amenidades: ["wifi", "parqueo", "cocina", "agua_caliente"],
    galeriaUrls: [
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
    ],
    precioPorNoche: "85.00",
    porcentajeAnticipo: 50,
    depositoGarantia: "100.00",
    escrowGarantiaActivo: true,
    activo: true,
  },
  {
    id: "alo-montana",
    nombre: "Habitación Vista a la Montaña",
    descripcion:
      "Habitación privada en la casa principal. Balcón al bosque de niebla, desayuno campesino y baño en suite.",
    tipo: "habitacion_privada",
    capacidadHuespedes: 2,
    camas: [{ tipo: "matrimonial", cantidad: 1 }],
    numeroBanos: 1,
    tipoBano: "privado",
    amenidades: ["wifi", "desayuno", "parqueo", "agua_caliente"],
    galeriaUrls: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80",
    ],
    precioPorNoche: "55.00",
    porcentajeAnticipo: 30,
    depositoGarantia: "0.00",
    escrowGarantiaActivo: false,
    activo: true,
  },
  {
    id: "alo-glamping",
    nombre: "Nido de Niebla",
    descripcion:
      "Domo geodésico con cama king, manta térmica y ducha compartida en el jardín de heliconias. Acepta mascotas pequeñas.",
    tipo: "glamping",
    capacidadHuespedes: 2,
    camas: [{ tipo: "matrimonial", cantidad: 1 }],
    numeroBanos: 1,
    tipoBano: "compartido",
    amenidades: ["wifi", "desayuno", "mascotas", "agua_caliente"],
    galeriaUrls: [
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1200&q=80",
    ],
    precioPorNoche: "72.00",
    porcentajeAnticipo: 50,
    depositoGarantia: "50.00",
    escrowGarantiaActivo: true,
    activo: true,
  },
];

function noche(
  unidadId: string,
  fecha: string,
  estado: EstadoNocheAlojamiento,
): NocheOcupacion {
  return {
    id: `noche-${unidadId}-${fecha}`,
    unidadId,
    fecha,
    estado,
  };
}

const NOCHES_ROBLE: NocheOcupacion[] = [
  noche("alo-montana", "2026-09-25", "bloqueada"),
  noche("alo-trapiche", "2026-09-22", "reservada_anticipo"),
  noche("alo-trapiche", "2026-09-23", "reservada_anticipo"),
  noche("alo-trapiche", "2026-09-24", "reservada_anticipo"),
  noche("alo-glamping", "2026-09-26", "reservada_anticipo"),
  noche("alo-glamping", "2026-09-27", "reservada_anticipo"),
  noche("alo-glamping", "2026-09-28", "reservada_anticipo"),
];

const RESERVAS_ALOJAMIENTO_ROBLE: ReservaAlojamiento[] = [
  {
    id: "stay-trapiche",
    huespedNombre: "Camila Restrepo",
    unidadId: "alo-trapiche",
    checkIn: "2026-09-22",
    checkOut: "2026-09-25",
    noches: 3,
    personas: 3,
    anticipoPagado: "127.50",
    saldoPendiente: "127.50",
    assetCode: "USDC",
    canalPagoAnticipo: "stellar",
    estadoPago: "anticipo_retenido",
    escrowContractId: "CDCAMILARESTESCOWTRAPICHE22XXXXXXXXXXXXXXXXXXXX",
  },
  {
    id: "stay-glamping",
    huespedNombre: "Valentina Ruiz",
    unidadId: "alo-glamping",
    checkIn: "2026-09-26",
    checkOut: "2026-09-29",
    noches: 3,
    personas: 2,
    anticipoPagado: "108.00",
    saldoPendiente: "108.00",
    assetCode: "USDC",
    canalPagoAnticipo: "stellar",
    estadoPago: "servicio_confirmado",
    escrowContractId: "CDVALENTINARUIZESCROWGLAMP26XXXXXXXXXXXXXXXXXXX",
  },
];

const NOTIFICACIONES_ROBLE: NotificacionComerciante[] = [
  {
    id: "ntf-roble-tour",
    tipo: "tour_proximo",
    titulo: "Trapiche el 24 sep, 2 personas",
    mensaje:
      "Mateo Ríos pagó anticipo USDC 22.80 (30% de USDC 76.00). Al llegar cobra USDC 53.20.",
    leida: false,
    createdAt: "2026-09-22T08:00:00-05:00",
  },
  {
    id: "ntf-roble-stay",
    tipo: "saldo_pendiente",
    titulo: "Saldo de la Cabaña del Trapiche",
    mensaje:
      "Camila Restrepo: 3 noches × USDC 85.00 = USDC 255.00. Anticipo 50% USDC 127.50. Saldo USDC 127.50.",
    leida: false,
    createdAt: "2026-09-22T07:30:00-05:00",
  },
];

const NOTIFICACIONES_VALLE: NotificacionComerciante[] = [
  {
    id: "ntf-valle-cafe",
    tipo: "saldo_pendiente",
    titulo: "Café listo para liberar",
    mensaje:
      "Diego Peña: 2 × USDC 12.00 = USDC 24.00. Anticipo 50% USDC 12.00. Saldo USDC 12.00. El servicio ya está confirmado.",
    leida: false,
    createdAt: "2026-09-22T09:10:00-05:00",
  },
  {
    id: "ntf-valle-stock",
    tipo: "stock_bajo",
    titulo: "Stock bajo: canasta campesina",
    mensaje: "Quedan 3 canastas. Camila Restrepo apartó 2 con anticipo USDC 11.10.",
    leida: false,
    createdAt: "2026-09-22T09:20:00-05:00",
  },
];

const SNAPSHOT_ROBLE: MerchantSnapshot = {
  catalogo: "estadia-tours",
  perfil: PERFIL_ROBLE,
  tours: TOURS_ROBLE,
  productos: [],
  turnos: TURNOS_ROBLE,
  reservas: RESERVAS_ROBLE,
  notificaciones: NOTIFICACIONES_ROBLE,
  alojamientos: MOCK_ALOJAMIENTOS,
  nochesAlojamiento: NOCHES_ROBLE,
  reservasAlojamiento: RESERVAS_ALOJAMIENTO_ROBLE,
};

const SNAPSHOT_VALLE: MerchantSnapshot = {
  catalogo: "productos",
  perfil: PERFIL_VALLE,
  tours: [],
  productos: PRODUCTOS_VALLE,
  turnos: [],
  reservas: RESERVAS_VALLE,
  notificaciones: NOTIFICACIONES_VALLE,
  alojamientos: [],
  nochesAlojamiento: [],
  reservasAlojamiento: [],
};

const SNAPSHOTS: Record<string, MerchantSnapshot> = {
  usr_comercio_roble: SNAPSHOT_ROBLE,
  usr_comercio_valle: SNAPSHOT_VALLE,
};

const SNAPSHOT_VACIO: MerchantSnapshot = {
  catalogo: "estadia-tours",
  perfil: {
    nombreComercial: "Empresa",
    descripcion: "",
    categorias: ["finca"],
    logoUrl: "",
    ubicacion: "",
    whatsapp: "",
    stellarWallet: "",
  },
  tours: [],
  productos: [],
  turnos: [],
  reservas: [],
  notificaciones: [],
  alojamientos: [],
  nochesAlojamiento: [],
  reservasAlojamiento: [],
};

export function cloneMerchantSnapshot(merchantId = "usr_comercio_roble"): MerchantSnapshot {
  return structuredClone(SNAPSHOTS[merchantId] ?? SNAPSHOT_VACIO);
}

export function addMoney(a: string, b: string): string {
  return (Number(a) + Number(b)).toFixed(2);
}

export function formatMoney(amount: string, asset: "USDC" | "XLM" | "USD" = "USDC"): string {
  const value = Number(amount);
  const formatted = new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
  return `${asset} ${formatted}`;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  if (rest === 0) return `${hours} h`;
  return `${hours} h ${rest} min`;
}

export function newEntityId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

const BOGOTA_TZ = "America/Bogota";

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: BOGOTA_TZ,
  }).format(new Date(iso));
}

export function formatMonthYear(year: number, monthIndex: number): string {
  return new Intl.DateTimeFormat("es-CO", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(Date.UTC(year, monthIndex, 1));
}

export function formatIsoDate(isoDate: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const start = Date.parse(`${checkIn}T00:00:00Z`);
  const end = Date.parse(`${checkOut}T00:00:00Z`);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 0;
  return Math.max(0, Math.round((end - start) / 86_400_000));
}

export function summarizeCamas(camas: DistribucionCamas[]): string {
  return camas
    .filter((item) => item.cantidad > 0)
    .map((item) => `${item.cantidad} ${TIPO_CAMA_LABEL[item.tipo].toLowerCase()}`)
    .join(" · ");
}
