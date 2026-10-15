"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { LINEAS_SEMILLA, OFERTAS_SEMILLA } from "@/lib/zona/catalogo";
import type {
  LineaHistorial,
  NuevaOferta,
  NuevaReserva,
  Oferta,
  Reserva,
} from "@/lib/zona/tipos";

const STORAGE_KEY = "turistellar-zona-v1";

interface Extra {
  ofertas: Oferta[];
  lineas: LineaHistorial[];
  reservas: Reserva[];
}

const VACIO: Extra = { ofertas: [], lineas: [], reservas: [] };

interface ZonaContextValue {
  listo: boolean;
  ofertas: Oferta[];
  reservas: Reserva[];
  lineasDe: (ofertaId: string) => LineaHistorial[];
  ofertaPorId: (id: string) => Oferta | undefined;
  publicar: (input: NuevaOferta) => Oferta;
  reservar: (input: NuevaReserva) => Reserva | null;
  marcarPrestado: (reservaId: string, cuenta: string | null) => void;
  confirmarServicio: (reservaId: string, cuenta: string | null) => boolean;
}

const ZonaContext = createContext<ZonaContextValue | null>(null);

function esExtra(value: unknown): value is Extra {
  if (!value || typeof value !== "object") return false;
  const record = value as Extra;
  return (
    Array.isArray(record.ofertas) &&
    Array.isArray(record.lineas) &&
    Array.isArray(record.reservas)
  );
}

export function ZonaProvider({ children }: { children: ReactNode }) {
  const [extra, setExtra] = useState<Extra>(VACIO);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (esExtra(parsed)) setExtra(parsed);
      }
    } catch {
      // Si el navegador tiene datos dañados, se sigue con el catálogo de ejemplo.
    }
    setListo(true);
  }, []);

  useEffect(() => {
    if (!listo) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(extra));
  }, [extra, listo]);

  const ofertas = useMemo(
    () => [...OFERTAS_SEMILLA, ...extra.ofertas],
    [extra.ofertas],
  );

  const ofertaPorId = useCallback(
    (id: string) => ofertas.find((oferta) => oferta.id === id),
    [ofertas],
  );

  const lineasDe = useCallback(
    (ofertaId: string) =>
      [...LINEAS_SEMILLA, ...extra.lineas]
        .filter((linea) => linea.ofertaId === ofertaId)
        .sort((a, b) => b.fecha.localeCompare(a.fecha)),
    [extra.lineas],
  );

  const publicar = useCallback((input: NuevaOferta) => {
    const oferta: Oferta = {
      ...input,
      id: `oferta-${crypto.randomUUID()}`,
      imagen: null,
      titulo: input.titulo.trim(),
      operador: input.operador.trim(),
      lugar: input.lugar.trim(),
      descripcion: input.descripcion.trim(),
      precio: input.precio.trim(),
    };
    setExtra((actual) => ({ ...actual, ofertas: [...actual.ofertas, oferta] }));
    return oferta;
  }, []);

  const reservar = useCallback(
    (input: NuevaReserva) => {
      if (!ofertas.some((oferta) => oferta.id === input.ofertaId)) return null;
      const reserva: Reserva = {
        id: `reserva-${crypto.randomUUID()}`,
        ofertaId: input.ofertaId,
        fecha: input.fecha,
        nombreTurista: input.nombreTurista.trim(),
        estado: "reservada",
        cuentaOperador: null,
        cuentaTurista: null,
      };
      setExtra((actual) => ({
        ...actual,
        reservas: [...actual.reservas, reserva],
      }));
      return reserva;
    },
    [ofertas],
  );

  const marcarPrestado = useCallback((reservaId: string, cuenta: string | null) => {
    setExtra((actual) => ({
      ...actual,
      reservas: actual.reservas.map((reserva) =>
        reserva.id === reservaId && reserva.estado === "reservada"
          ? { ...reserva, estado: "prestado", cuentaOperador: cuenta }
          : reserva,
      ),
    }));
  }, []);

  const confirmarServicio = useCallback(
    (reservaId: string, cuenta: string | null) => {
      let confirmada = false;
      setExtra((actual) => {
        const reserva = actual.reservas.find((item) => item.id === reservaId);
        const oferta = reserva
          ? [...OFERTAS_SEMILLA, ...actual.ofertas].find(
              (item) => item.id === reserva.ofertaId,
            )
          : undefined;
        if (!reserva || !oferta || reserva.estado !== "prestado") return actual;

        confirmada = true;
        const linea: LineaHistorial = {
          id: `linea-${crypto.randomUUID()}`,
          ofertaId: oferta.id,
          fecha: reserva.fecha,
          queSeOfrecio: oferta.titulo,
          operador: oferta.operador,
          origen: "sesion",
          cuentaOperador: reserva.cuentaOperador,
          cuentaTurista: cuenta,
        };

        return {
          ...actual,
          lineas: [...actual.lineas, linea],
          reservas: actual.reservas.map((item) =>
            item.id === reservaId
              ? { ...item, estado: "confirmada", cuentaTurista: cuenta }
              : item,
          ),
        };
      });
      return confirmada;
    },
    [],
  );

  const value = useMemo<ZonaContextValue>(
    () => ({
      listo,
      ofertas,
      reservas: extra.reservas,
      lineasDe,
      ofertaPorId,
      publicar,
      reservar,
      marcarPrestado,
      confirmarServicio,
    }),
    [
      listo,
      ofertas,
      extra.reservas,
      lineasDe,
      ofertaPorId,
      publicar,
      reservar,
      marcarPrestado,
      confirmarServicio,
    ],
  );

  return <ZonaContext.Provider value={value}>{children}</ZonaContext.Provider>;
}

export function useZona() {
  const value = useContext(ZonaContext);
  if (!value) {
    throw new Error("useZona debe usarse dentro de ZonaProvider");
  }
  return value;
}
