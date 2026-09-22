/**
 * Tourist-facing catalog for the rural eco-tourism corridor
 * (Salento / Valle de Cocora / Filandia, Quindío).
 */

import type {
  CategoriaOferta,
  OfertaTuristica,
  TurnoCatalogo,
} from "@/types/tourist";

const DIAS_SEMANA = [0, 1, 2, 3, 4, 5, 6] as const;
const DIAS_OPERACION = [1, 2, 3, 4, 5, 6] as const;

function turnos(
  rows: readonly [fecha: string, hora: string, tot: number, ocup: number][],
): TurnoCatalogo[] {
  return rows.map(([fecha, hora, cuposTotales, cuposOcupados]) => ({
    fecha,
    hora,
    cuposTotales,
    cuposOcupados,
  }));
}

export const CATEGORIA_OFERTA_LABEL: Record<CategoriaOferta, string> = {
  alojamiento: "Alojamiento",
  tour: "Tours / Experiencias",
  producto: "Productos locales",
  paquete: "Paquetes completos",
};

export const UNIDAD_PRECIO_LABEL: Record<OfertaTuristica["unidadPrecio"], string> = {
  noche: "noche",
  persona: "persona",
  unidad: "unidad",
  paquete: "paquete",
};

export const OFERTAS_TURISTICAS: readonly OfertaTuristica[] = [
  {
    id: "alo-trapiche",
    categoria: "alojamiento",
    titulo: "Cabaña del Trapiche",
    descripcion:
      "Cabaña de guadua junto al trapiche de caña. Terraza con hamacas, cocina campesina y fogón de leña.",
    empresa: "Finca El Cafetal Ancestral",
    ubicacion: "Vereda La Esperanza, Salento",
    puntuacion: 4.8,
    resenas: 42,
    precioUsd: "85.00",
    unidadPrecio: "noche",
    porcentajeAnticipo: 50,
    imagenUrl:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
    coordenadas: { lat: 4.6214, lng: -75.5518 },
    horarios: [{ dias: DIAS_SEMANA, abre: "15:00", cierra: "20:00" }],
    capacidad: 4,
    turnos: [],
    nochesOcupadas: ["2026-09-22", "2026-09-23", "2026-09-24", "2026-09-27"],
  },
  {
    id: "alo-montana",
    categoria: "alojamiento",
    titulo: "Habitación Vista a la Montaña",
    descripcion:
      "Habitación privada en la casa principal. Balcón al bosque de niebla y desayuno campesino.",
    empresa: "Finca El Cafetal Ancestral",
    ubicacion: "Vereda La Esperanza, Salento",
    puntuacion: 4.6,
    resenas: 28,
    precioUsd: "55.00",
    unidadPrecio: "noche",
    porcentajeAnticipo: 30,
    imagenUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    coordenadas: { lat: 4.6368, lng: -75.5701 },
    horarios: [{ dias: DIAS_SEMANA, abre: "14:00", cierra: "21:00" }],
    capacidad: 2,
    turnos: [],
    nochesOcupadas: ["2026-09-20", "2026-09-21", "2026-09-25"],
  },
  {
    id: "alo-glamping",
    categoria: "alojamiento",
    titulo: "Nido de Niebla",
    descripcion:
      "Domo geodésico con cama king y jardín de heliconias. Acepta mascotas pequeñas.",
    empresa: "Reserva Bosque de Niebla",
    ubicacion: "Alto de la Palma, Salento",
    puntuacion: 4.9,
    resenas: 61,
    precioUsd: "72.00",
    unidadPrecio: "noche",
    porcentajeAnticipo: 50,
    imagenUrl:
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80",
    coordenadas: { lat: 4.6482, lng: -75.4924 },
    horarios: [{ dias: DIAS_SEMANA, abre: "15:00", cierra: "19:00" }],
    capacidad: 2,
    turnos: [],
    nochesOcupadas: ["2026-09-26", "2026-09-27", "2026-09-28"],
  },
  {
    id: "tour-trapiche",
    categoria: "tour",
    titulo: "Tour del Trapiche de Caña",
    descripcion:
      "Molienda en vivo, jugo de caña y panela. Recorrido de 2.5 h con guía de la finca.",
    empresa: "Finca El Cafetal Ancestral",
    ubicacion: "Trapiche La Esperanza",
    puntuacion: 4.9,
    resenas: 87,
    precioUsd: "38.00",
    unidadPrecio: "persona",
    porcentajeAnticipo: 30,
    imagenUrl:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80",
    coordenadas: { lat: 4.6198, lng: -75.5492 },
    horarios: [{ dias: DIAS_OPERACION, abre: "08:00", cierra: "16:00" }],
    duracionMinutos: 150,
    capacidad: 8,
    turnos: turnos([
      ["2026-09-22", "08:00", 8, 8],
      ["2026-09-22", "10:30", 8, 8],
      ["2026-09-22", "14:00", 8, 3],
      ["2026-09-23", "08:00", 8, 5],
      ["2026-09-23", "10:30", 8, 0],
      ["2026-09-24", "08:00", 8, 0],
      ["2026-09-24", "10:30", 8, 2],
      ["2026-09-24", "14:00", 8, 0],
      ["2026-09-25", "08:00", 8, 0],
      ["2026-09-25", "10:30", 8, 0],
      ["2026-09-26", "08:00", 8, 6],
      ["2026-09-26", "10:30", 8, 0],
    ]),
  },
  {
    id: "tour-cafetal",
    categoria: "tour",
    titulo: "Sendero del cafetal y cata de altura",
    descripcion:
      "Cultivo, beneficio húmedo y cata de tres tuestes. Incluye merienda campesina.",
    empresa: "Finca El Cafetal Ancestral",
    ubicacion: "Ladera norte, Salento",
    puntuacion: 4.7,
    resenas: 54,
    precioUsd: "45.00",
    unidadPrecio: "persona",
    porcentajeAnticipo: 50,
    imagenUrl:
      "https://images.unsplash.com/photo-1447933601403-0c6688b58a91?auto=format&fit=crop&w=1200&q=80",
    coordenadas: { lat: 4.6321, lng: -75.5634 },
    horarios: [{ dias: DIAS_OPERACION, abre: "07:30", cierra: "15:00" }],
    duracionMinutos: 180,
    capacidad: 8,
    turnos: turnos([
      ["2026-09-22", "08:00", 8, 5],
      ["2026-09-23", "08:00", 8, 8],
      ["2026-09-24", "08:00", 8, 0],
      ["2026-09-24", "13:00", 8, 1],
      ["2026-09-25", "08:00", 8, 0],
      ["2026-09-26", "08:00", 8, 3],
    ]),
  },
  {
    id: "tour-cocora",
    categoria: "tour",
    titulo: "Caminata palmas de cera · Valle de Cocora",
    descripcion:
      "Senderismo guiado entre palmas de cera, mirador y almuerzo campesino en finca.",
    empresa: "Guías Cocora Rural",
    ubicacion: "Valle de Cocora",
    puntuacion: 4.8,
    resenas: 119,
    precioUsd: "52.00",
    unidadPrecio: "persona",
    porcentajeAnticipo: 50,
    imagenUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
    coordenadas: { lat: 4.6389, lng: -75.4872 },
    horarios: [{ dias: DIAS_SEMANA, abre: "06:30", cierra: "14:00" }],
    duracionMinutos: 300,
    capacidad: 12,
    turnos: turnos([
      ["2026-09-23", "06:30", 12, 12],
      ["2026-09-24", "06:30", 12, 4],
      ["2026-09-25", "06:30", 12, 0],
      ["2026-09-26", "06:30", 12, 9],
      ["2026-09-27", "06:30", 12, 0],
    ]),
  },
  {
    id: "prod-salsas",
    categoria: "producto",
    titulo: "Lote de salsas de la casa",
    descripcion:
      "Tres frascos: ají dulce fermentado, hogao de finca y salsa de uchuva. Recogida en tienda.",
    empresa: "Fogón de Caña",
    ubicacion: "Salento centro",
    puntuacion: 4.7,
    resenas: 33,
    precioUsd: "22.00",
    unidadPrecio: "unidad",
    porcentajeAnticipo: 30,
    imagenUrl:
      "https://images.unsplash.com/photo-1472476443507-c7a9ba75bb67?auto=format&fit=crop&w=1200&q=80",
    coordenadas: { lat: 4.6375, lng: -75.5698 },
    horarios: [{ dias: DIAS_OPERACION, abre: "09:00", cierra: "17:00" }],
    capacidad: 20,
    turnos: turnos([
      ["2026-09-22", "13:00", 6, 6],
      ["2026-09-23", "11:00", 8, 2],
      ["2026-09-23", "13:00", 8, 0],
      ["2026-09-24", "11:00", 8, 0],
      ["2026-09-24", "13:00", 8, 1],
      ["2026-09-25", "13:00", 8, 0],
      ["2026-09-26", "13:00", 8, 0],
    ]),
  },
  {
    id: "prod-cafe",
    categoria: "producto",
    titulo: "Café de altura 250 g · lote norte",
    descripcion: "Tostión media, empaque con válvula. Preorden de 3 días si el stock llega a 0.",
    empresa: "Finca El Cafetal Ancestral",
    ubicacion: "Beneficiadero de la finca",
    puntuacion: 4.9,
    resenas: 76,
    precioUsd: "12.00",
    unidadPrecio: "unidad",
    porcentajeAnticipo: 50,
    imagenUrl:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=1200&q=80",
    coordenadas: { lat: 4.6338, lng: -75.5611 },
    horarios: [{ dias: DIAS_OPERACION, abre: "08:00", cierra: "16:00" }],
    capacidad: 30,
    turnos: turnos([
      ["2026-09-24", "09:00", 10, 0],
      ["2026-09-24", "15:00", 10, 3],
      ["2026-09-25", "09:00", 10, 0],
      ["2026-09-26", "09:00", 10, 0],
    ]),
  },
  {
    id: "prod-canasta",
    categoria: "producto",
    titulo: "Canasta campesina de temporada",
    descripcion:
      "Uchuva, plátano, panela en bloque y queso de finca. Recogida o entrega en el alojamiento.",
    empresa: "Mercado Vereda La Esperanza",
    ubicacion: "Plaza campesina, Filandia",
    puntuacion: 4.5,
    resenas: 21,
    precioUsd: "18.50",
    unidadPrecio: "unidad",
    porcentajeAnticipo: 30,
    imagenUrl:
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80",
    coordenadas: { lat: 4.6748, lng: -75.6062 },
    horarios: [{ dias: [2, 4, 6], abre: "07:00", cierra: "13:00" }],
    capacidad: 15,
    turnos: turnos([
      ["2026-09-24", "10:00", 15, 4],
      ["2026-09-26", "10:00", 15, 0],
    ]),
  },
  {
    id: "pkg-cafetal",
    categoria: "paquete",
    titulo: "Fin de semana Cafetal + Trapiche",
    descripcion:
      "2 noches en cabaña, tour del trapiche (10:30) y lote de salsas. Ruta conectada en el mapa.",
    empresa: "Finca El Cafetal Ancestral",
    ubicacion: "Corredor Salento rural",
    puntuacion: 4.8,
    resenas: 18,
    precioUsd: "248.00",
    unidadPrecio: "paquete",
    porcentajeAnticipo: 50,
    imagenUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    coordenadas: { lat: 4.6285, lng: -75.5602 },
    horarios: [{ dias: DIAS_OPERACION, abre: "08:00", cierra: "18:00" }],
    duracionMinutos: 2880,
    capacidad: 4,
    turnos: turnos([
      ["2026-09-24", "15:00", 2, 0],
      ["2026-09-25", "15:00", 2, 1],
    ]),
    incluyeIds: ["alo-trapiche", "tour-trapiche", "prod-salsas"],
  },
  {
    id: "pkg-cocora",
    categoria: "paquete",
    titulo: "Niebla, palmas y canasta",
    descripcion:
      "Noche en el Nido de Niebla, caminata Cocora al amanecer y canasta campesina en Filandia.",
    empresa: "Guías Cocora Rural",
    ubicacion: "Cocora · Filandia",
    puntuacion: 4.9,
    resenas: 12,
    precioUsd: "196.00",
    unidadPrecio: "paquete",
    porcentajeAnticipo: 50,
    imagenUrl:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
    coordenadas: { lat: 4.655, lng: -75.54 },
    horarios: [{ dias: DIAS_SEMANA, abre: "06:00", cierra: "18:00" }],
    duracionMinutos: 1440,
    capacidad: 2,
    turnos: turnos([
      ["2026-09-25", "15:00", 2, 0],
      ["2026-09-27", "15:00", 2, 0],
    ]),
    incluyeIds: ["alo-glamping", "tour-cocora", "prod-canasta"],
  },
];

export function getOfertaById(id: string): OfertaTuristica | undefined {
  return OFERTAS_TURISTICAS.find((row) => row.id === id);
}

export function listOfertas(categoria?: CategoriaOferta | "todas"): OfertaTuristica[] {
  if (!categoria || categoria === "todas") return [...OFERTAS_TURISTICAS];
  return OFERTAS_TURISTICAS.filter((row) => row.categoria === categoria);
}

export const MAP_BOUNDS = {
  minLat: 4.58,
  maxLat: 4.72,
  minLng: -75.65,
  maxLng: -75.45,
} as const;
