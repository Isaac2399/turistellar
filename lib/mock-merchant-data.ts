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

export interface MerchantSnapshot {
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

const MOCK_PERFIL: PerfilEmpresa = {
  nombreComercial: "Finca El Cafetal Ancestral",
  descripcion:
    "Finca familiar en el Eje Cafetero. Caminatas por el bosque de niebla, degustación de café de altura y preórdenes de salsas, panela y café tostado en lote pequeño.",
  categorias: ["eco-turismo", "finca", "gastronomia"],
  logoUrl: "",
  ubicacion: "Vereda La Esperanza, Salento, Quindío",
  whatsapp: "573001234567",
  stellarWallet: "GDRXE2BQUC3AZB4BXQYDMEGQSZA3QC4GZBXNLMRSKXGBJQ5J2V2XAAAA",
};

const MOCK_TOURS: TourComerciante[] = [
  {
    id: "tour-cafetal",
    titulo: "Sendero del cafetal y cata de altura",
    descripcion:
      "Recorrido guiado por el cultivo, proceso húmedo y cata de tres perfiles de tueste. Incluye merienda campesina.",
    duracionMinutos: 180,
    precioPorPersona: "45.00",
    cupoMaximo: 8,
    porcentajeAnticipo: 50,
    activo: true,
  },
  {
    id: "tour-gastronomia",
    titulo: "Fogón de caña y salsas de la casa",
    descripcion:
      "Taller de salsas, arepas de chócolo y dulce de caña con la familia anfitriona. Cupo reducido.",
    duracionMinutos: 150,
    precioPorPersona: "38.00",
    cupoMaximo: 6,
    porcentajeAnticipo: 30,
    activo: true,
  },
  {
    id: "tour-amanecer",
    titulo: "Amanecer en el bosque de niebla",
    descripcion:
      "Salida a las 5:30 a.m. para avistamiento de aves y desayuno en el mirador. Anticipo completo por logística.",
    duracionMinutos: 240,
    precioPorPersona: "62.00",
    cupoMaximo: 5,
    porcentajeAnticipo: 100,
    activo: true,
  },
];

const MOCK_PRODUCTOS: ProductoArtesanal[] = [
  {
    id: "prod-salsa",
    nombre: "Salsa de ají de la casa",
    descripcion: "Ají dulce fermentado con panela. Frasco de 250 ml.",
    precio: "8.50",
    stock: 18,
    imagenUrl: "",
    diasPreorden: 0,
    activo: true,
  },
  {
    id: "prod-dulce",
    nombre: "Dulce de caña en bloque",
    descripcion: "Panela artesanal de caña criolla. Bloque de 500 g.",
    precio: "6.00",
    stock: 4,
    imagenUrl: "",
    diasPreorden: 2,
    activo: true,
  },
  {
    id: "prod-cafe",
    nombre: "Café de altura 250 g",
    descripcion: "Tostión media, lote de la ladera norte. Empaque con válvula.",
    precio: "12.00",
    stock: 9,
    imagenUrl: "",
    diasPreorden: 3,
    activo: true,
  },
];

const MOCK_TURNOS: TurnoCalendario[] = [
  {
    id: "turno-0922-am",
    fecha: "2026-09-22",
    hora: "08:00",
    tourId: "tour-cafetal",
    estado: "reservado_parcial",
    cuposOcupados: 5,
  },
  {
    id: "turno-0922-pm",
    fecha: "2026-09-22",
    hora: "14:00",
    tourId: "tour-gastronomia",
    estado: "disponible",
    cuposOcupados: 0,
  },
  {
    id: "turno-0923-am",
    fecha: "2026-09-23",
    hora: "05:30",
    tourId: "tour-amanecer",
    estado: "lleno",
    cuposOcupados: 5,
  },
  {
    id: "turno-0924-am",
    fecha: "2026-09-24",
    hora: "08:00",
    tourId: "tour-cafetal",
    estado: "disponible",
    cuposOcupados: 0,
  },
  {
    id: "turno-0925-pm",
    fecha: "2026-09-25",
    hora: "14:00",
    tourId: "tour-gastronomia",
    estado: "bloqueado",
    cuposOcupados: 0,
  },
  {
    id: "turno-0926-am",
    fecha: "2026-09-26",
    hora: "08:00",
    tourId: "tour-cafetal",
    estado: "reservado_parcial",
    cuposOcupados: 3,
  },
  {
    id: "turno-0927-am",
    fecha: "2026-09-27",
    hora: "05:30",
    tourId: "tour-amanecer",
    estado: "disponible",
    cuposOcupados: 0,
  },
];

const MOCK_RESERVAS: ReservaComerciante[] = [
  {
    id: "res-1001",
    turistaNombre: "Lucía Herrera",
    fechaHora: "2026-09-22T08:00:00-05:00",
    tourId: "tour-cafetal",
    productos: [
      { productoId: "prod-cafe", cantidad: 2 },
      { productoId: "prod-salsa", cantidad: 1 },
    ],
    montoTotal: "257.50",
    anticipoPagado: "128.75",
    pendienteCobrar: "128.75",
    assetCode: "USDC",
    estadoPago: "anticipo_retenido",
    escrowContractId: "CDLUCIAHERESCROWCAFETAL22XXXXXXXXXXXXXXXXXXXXXXX",
  },
  {
    id: "res-1002",
    turistaNombre: "Mateo Ríos",
    fechaHora: "2026-09-23T05:30:00-05:00",
    tourId: "tour-amanecer",
    productos: [{ productoId: "prod-dulce", cantidad: 3 }],
    montoTotal: "328.00",
    anticipoPagado: "328.00",
    pendienteCobrar: "0.00",
    assetCode: "USDC",
    estadoPago: "servicio_confirmado",
    escrowContractId: "CDMATEORIOSESCROWAMANECER23XXXXXXXXXXXXXXXXXXXX",
  },
  {
    id: "res-1003",
    turistaNombre: "Ana Sofía Vargas",
    fechaHora: "2026-09-26T08:00:00-05:00",
    tourId: "tour-cafetal",
    productos: [],
    montoTotal: "135.00",
    anticipoPagado: "67.50",
    pendienteCobrar: "67.50",
    assetCode: "USDC",
    estadoPago: "anticipo_retenido",
    escrowContractId: "CDANASOFIAESCROWCAFETAL26XXXXXXXXXXXXXXXXXXXXXX",
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
  {
    id: "alo-casa",
    nombre: "Casa de Campo La Esperanza",
    descripcion:
      "Residencia completa de dos plantas para familias. Sala con chimenea, cocina equipada, huerta y corredor de geranios.",
    tipo: "casa_de_campo",
    capacidadHuespedes: 8,
    camas: [
      { tipo: "matrimonial", cantidad: 2 },
      { tipo: "nido_litera", cantidad: 2 },
    ],
    numeroBanos: 2,
    tipoBano: "privado",
    amenidades: ["wifi", "desayuno", "parqueo", "cocina", "mascotas", "agua_caliente"],
    galeriaUrls: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    ],
    precioPorNoche: "180.00",
    porcentajeAnticipo: 50,
    depositoGarantia: "200.00",
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

const MOCK_NOCHES_ALOJAMIENTO: NocheOcupacion[] = [
  noche("alo-montana", "2026-09-20", "reservada_anticipo"),
  noche("alo-montana", "2026-09-21", "reservada_anticipo"),
  noche("alo-montana", "2026-09-25", "bloqueada"),
  noche("alo-trapiche", "2026-09-22", "reservada_anticipo"),
  noche("alo-trapiche", "2026-09-23", "reservada_anticipo"),
  noche("alo-trapiche", "2026-09-24", "reservada_anticipo"),
  noche("alo-trapiche", "2026-09-27", "bloqueada"),
  noche("alo-casa", "2026-09-24", "reservada_anticipo"),
  noche("alo-casa", "2026-09-25", "reservada_anticipo"),
  noche("alo-casa", "2026-09-26", "reservada_anticipo"),
  noche("alo-casa", "2026-09-27", "reservada_anticipo"),
  noche("alo-glamping", "2026-09-26", "reservada_anticipo"),
  noche("alo-glamping", "2026-09-27", "reservada_anticipo"),
  noche("alo-glamping", "2026-09-28", "reservada_anticipo"),
];

const MOCK_RESERVAS_ALOJAMIENTO: ReservaAlojamiento[] = [
  {
    id: "stay-2001",
    huespedNombre: "Diego Peña",
    unidadId: "alo-montana",
    checkIn: "2026-09-20",
    checkOut: "2026-09-22",
    noches: 2,
    personas: 2,
    anticipoPagado: "33.00",
    saldoPendiente: "77.00",
    assetCode: "USDC",
    canalPagoAnticipo: "fiat",
    estadoPago: "anticipo_retenido",
    escrowContractId: "CDDIEGOPENAESCROWMONTANA20XXXXXXXXXXXXXXXXXXXXX",
  },
  {
    id: "stay-2002",
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
    id: "stay-2003",
    huespedNombre: "Hiroshi Sato",
    unidadId: "alo-casa",
    checkIn: "2026-09-24",
    checkOut: "2026-09-28",
    noches: 4,
    personas: 6,
    anticipoPagado: "360.00",
    saldoPendiente: "360.00",
    assetCode: "USDC",
    canalPagoAnticipo: "stellar",
    estadoPago: "anticipo_retenido",
    escrowContractId: "CDHIROSHISATOESCROWCASA24XXXXXXXXXXXXXXXXXXXXXX",
  },
  {
    id: "stay-2004",
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

const MOCK_NOTIFICACIONES: NotificacionComerciante[] = [
  {
    id: "ntf-01",
    tipo: "tour_proximo",
    titulo: "Mañana tienes un tour con 5 personas",
    mensaje:
      "Sendero del cafetal (22 sep, 08:00). Prepara insumos de cata, merienda y 2 paquetes de café preordenados.",
    leida: false,
    createdAt: "2026-09-21T09:15:00-05:00",
  },
  {
    id: "ntf-02",
    tipo: "saldo_pendiente",
    titulo: "Saldo por cobrar al llegar",
    mensaje:
      "Lucía Herrera deja USDC 128.75 pendientes al finalizar el sendero. Ana Sofía Vargas deja USDC 67.50.",
    leida: false,
    createdAt: "2026-09-21T08:40:00-05:00",
  },
  {
    id: "ntf-03",
    tipo: "stock_bajo",
    titulo: "Stock bajo: dulce de caña",
    mensaje:
      "Quedan 4 bloques de dulce de caña. Hay una preorden de 3 unidades para el 23 sep.",
    leida: false,
    createdAt: "2026-09-20T16:05:00-05:00",
  },
  {
    id: "ntf-04",
    tipo: "tour_proximo",
    titulo: "Tour de amanecer el 23 sep",
    mensaje:
      "Grupo lleno (5/5). Anticipo al 100%. Recuerda escanear el QR de liberación al cierre.",
    leida: true,
    createdAt: "2026-09-20T11:00:00-05:00",
  },
];

export const MOCK_MERCHANT: MerchantSnapshot = {
  perfil: MOCK_PERFIL,
  tours: MOCK_TOURS,
  productos: MOCK_PRODUCTOS,
  turnos: MOCK_TURNOS,
  reservas: MOCK_RESERVAS,
  notificaciones: MOCK_NOTIFICACIONES,
  alojamientos: MOCK_ALOJAMIENTOS,
  nochesAlojamiento: MOCK_NOCHES_ALOJAMIENTO,
  reservasAlojamiento: MOCK_RESERVAS_ALOJAMIENTO,
};

export function cloneMerchantSnapshot(): MerchantSnapshot {
  return structuredClone(MOCK_MERCHANT);
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
