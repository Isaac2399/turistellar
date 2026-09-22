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
import { verificarDisponibilidad } from "@/lib/availability";
import { createItineraryItem } from "@/lib/itinerary";
import type {
  AlertaDisponibilidad,
  CanalPagoCheckout,
  ItineraryItem,
  PasaporteReserva,
} from "@/types/tourist";
import { buildDesglose } from "@/lib/itinerary";

const ITINERARY_KEY = "turistellar.itinerary";
const RESERVAS_KEY = "turistellar.reservas";

interface TouristContextValue {
  items: ItineraryItem[];
  reservas: PasaporteReserva[];
  hydrated: boolean;
  addOferta: (ofertaId: string) => boolean;
  removeItem: (itemId: string) => void;
  updateItem: (itemId: string, patch: Partial<ItineraryItem>) => AlertaDisponibilidad | null;
  scheduleItem: (
    itemId: string,
    fecha: string,
    hora: string,
  ) => AlertaDisponibilidad | null;
  clearItinerary: () => void;
  confirmarReserva: (input: {
    canalPago: CanalPagoCheckout;
    assetCode: PasaporteReserva["assetCode"];
    stellarPublicKey?: string;
    stellarTxHash?: string;
  }) => PasaporteReserva | null;
  marcarEscaneado: (reservaId: string) => void;
}

const TouristContext = createContext<TouristContextValue | null>(null);

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function TouristProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [reservas, setReservas] = useState<PasaporteReserva[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readJson<ItineraryItem[]>(ITINERARY_KEY, []));
    setReservas(readJson<PasaporteReserva[]>(RESERVAS_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(ITINERARY_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota / private mode */
    }
  }, [hydrated, items]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(RESERVAS_KEY, JSON.stringify(reservas));
    } catch {
      /* ignore quota / private mode */
    }
  }, [hydrated, reservas]);

  const addOferta = useCallback((ofertaId: string) => {
    let added = false;
    setItems((current) => {
      if (current.some((row) => row.ofertaId === ofertaId)) return current;
      added = true;
      return [...current, createItineraryItem(ofertaId)];
    });
    return added;
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((current) => current.filter((row) => row.id !== itemId));
  }, []);

  const updateItem = useCallback(
    (itemId: string, patch: Partial<ItineraryItem>): AlertaDisponibilidad | null => {
      let alerta: AlertaDisponibilidad | null = null;
      setItems((current) =>
        current.map((row) => {
          if (row.id !== itemId) return row;
          const next = { ...row, ...patch, id: row.id, ofertaId: row.ofertaId };
          alerta = verificarDisponibilidad(next);
          return next;
        }),
      );
      return alerta;
    },
    [],
  );

  const scheduleItem = useCallback(
    (itemId: string, fecha: string, hora: string) =>
      updateItem(itemId, { fecha, hora }),
    [updateItem],
  );

  const clearItinerary = useCallback(() => setItems([]), []);

  const confirmarReserva = useCallback(
    (input: {
      canalPago: CanalPagoCheckout;
      assetCode: PasaporteReserva["assetCode"];
      stellarPublicKey?: string;
      stellarTxHash?: string;
    }): PasaporteReserva | null => {
      if (items.length === 0) return null;
      const id = `pass-${Date.now().toString(36)}`;
      const codigoQr = `TURI-${id.slice(-8).toUpperCase()}-${Math.random()
        .toString(36)
        .slice(2, 6)
        .toUpperCase()}`;
      const reserva: PasaporteReserva = {
        id,
        codigoQr,
        createdAt: new Date().toISOString(),
        canalPago: input.canalPago,
        assetCode: input.assetCode,
        estado: "anticipo_pagado",
        desglose: buildDesglose(items),
        items,
        stellarPublicKey: input.stellarPublicKey,
        stellarTxHash: input.stellarTxHash,
        escrowContractId: `CD${codigoQr.replace(/-/g, "").slice(0, 24).padEnd(24, "X")}ESCROW`,
      };
      setReservas((current) => [reserva, ...current]);
      setItems([]);
      return reserva;
    },
    [items],
  );

  const marcarEscaneado = useCallback((reservaId: string) => {
    setReservas((current) =>
      current.map((row) =>
        row.id === reservaId
          ? {
              ...row,
              estado:
                row.estado === "anticipo_pagado"
                  ? "escaneado_destino"
                  : row.estado === "escaneado_destino"
                    ? "fondos_liberados"
                    : row.estado,
            }
          : row,
      ),
    );
  }, []);

  const value = useMemo(
    () => ({
      items,
      reservas,
      hydrated,
      addOferta,
      removeItem,
      updateItem,
      scheduleItem,
      clearItinerary,
      confirmarReserva,
      marcarEscaneado,
    }),
    [
      items,
      reservas,
      hydrated,
      addOferta,
      removeItem,
      updateItem,
      scheduleItem,
      clearItinerary,
      confirmarReserva,
      marcarEscaneado,
    ],
  );

  return <TouristContext.Provider value={value}>{children}</TouristContext.Provider>;
}

export function useTourist(): TouristContextValue {
  const ctx = useContext(TouristContext);
  if (!ctx) {
    throw new Error("useTourist must be used within TouristProvider");
  }
  return ctx;
}
