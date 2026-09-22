"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  addMoney,
  cloneMerchantSnapshot,
  nextEstadoNoche,
  nextEstadoTurno,
  type AlojamientoUnidad,
  type EstadoNocheAlojamiento,
  type EstadoTurno,
  type MerchantSnapshot,
  type NotificacionComerciante,
  type PerfilEmpresa,
  type ProductoArtesanal,
  type TourComerciante,
} from "@/lib/mock-merchant-data";

type MerchantContextValue = MerchantSnapshot & {
  savePerfil: (perfil: PerfilEmpresa) => void;
  upsertTour: (tour: TourComerciante) => void;
  deleteTour: (id: string) => void;
  upsertProducto: (producto: ProductoArtesanal) => void;
  deleteProducto: (id: string) => void;
  cycleTurno: (id: string) => void;
  setTurnoEstado: (id: string, estado: EstadoTurno) => void;
  upsertAlojamiento: (unidad: AlojamientoUnidad) => void;
  deleteAlojamiento: (id: string) => void;
  cycleNocheAlojamiento: (unidadId: string, fecha: string) => void;
  setNocheAlojamiento: (
    unidadId: string,
    fecha: string,
    estado: EstadoNocheAlojamiento,
  ) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  releaseEscrow: (reservaId: string) => void;
  upcomingToursCount: number;
  totalAnticipos: string;
  totalPendiente: string;
  alertasPendientes: number;
};

const MerchantContext = createContext<MerchantContextValue | null>(null);

export function MerchantProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MerchantSnapshot>(() => cloneMerchantSnapshot());

  const savePerfil = useCallback((perfil: PerfilEmpresa) => {
    setState((prev) => ({ ...prev, perfil }));
  }, []);

  const upsertTour = useCallback((tour: TourComerciante) => {
    setState((prev) => {
      const exists = prev.tours.some((item) => item.id === tour.id);
      return {
        ...prev,
        tours: exists
          ? prev.tours.map((item) => (item.id === tour.id ? tour : item))
          : [tour, ...prev.tours],
      };
    });
  }, []);

  const deleteTour = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      tours: prev.tours.filter((item) => item.id !== id),
    }));
  }, []);

  const upsertProducto = useCallback((producto: ProductoArtesanal) => {
    setState((prev) => {
      const exists = prev.productos.some((item) => item.id === producto.id);
      return {
        ...prev,
        productos: exists
          ? prev.productos.map((item) => (item.id === producto.id ? producto : item))
          : [producto, ...prev.productos],
      };
    });
  }, []);

  const deleteProducto = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      productos: prev.productos.filter((item) => item.id !== id),
    }));
  }, []);

  const cycleTurno = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      turnos: prev.turnos.map((turno) =>
        turno.id === id ? { ...turno, estado: nextEstadoTurno(turno.estado) } : turno,
      ),
    }));
  }, []);

  const setTurnoEstado = useCallback((id: string, estado: EstadoTurno) => {
    setState((prev) => ({
      ...prev,
      turnos: prev.turnos.map((turno) => (turno.id === id ? { ...turno, estado } : turno)),
    }));
  }, []);

  const upsertAlojamiento = useCallback((unidad: AlojamientoUnidad) => {
    setState((prev) => {
      const exists = prev.alojamientos.some((item) => item.id === unidad.id);
      return {
        ...prev,
        alojamientos: exists
          ? prev.alojamientos.map((item) => (item.id === unidad.id ? unidad : item))
          : [unidad, ...prev.alojamientos],
      };
    });
  }, []);

  const deleteAlojamiento = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      alojamientos: prev.alojamientos.filter((item) => item.id !== id),
      nochesAlojamiento: prev.nochesAlojamiento.filter((item) => item.unidadId !== id),
    }));
  }, []);

  const cycleNocheAlojamiento = useCallback((unidadId: string, fecha: string) => {
    setState((prev) => {
      const existing = prev.nochesAlojamiento.find(
        (item) => item.unidadId === unidadId && item.fecha === fecha,
      );
      if (!existing) {
        return {
          ...prev,
          nochesAlojamiento: [
            ...prev.nochesAlojamiento,
            {
              id: `noche-${unidadId}-${fecha}`,
              unidadId,
              fecha,
              estado: nextEstadoNoche("disponible"),
            },
          ],
        };
      }
      return {
        ...prev,
        nochesAlojamiento: prev.nochesAlojamiento.map((item) =>
          item.id === existing.id ? { ...item, estado: nextEstadoNoche(item.estado) } : item,
        ),
      };
    });
  }, []);

  const setNocheAlojamiento = useCallback(
    (unidadId: string, fecha: string, estado: EstadoNocheAlojamiento) => {
      setState((prev) => {
        const exists = prev.nochesAlojamiento.some(
          (item) => item.unidadId === unidadId && item.fecha === fecha,
        );
        if (!exists) {
          return {
            ...prev,
            nochesAlojamiento: [
              ...prev.nochesAlojamiento,
              { id: `noche-${unidadId}-${fecha}`, unidadId, fecha, estado },
            ],
          };
        }
        return {
          ...prev,
          nochesAlojamiento: prev.nochesAlojamiento.map((item) =>
            item.unidadId === unidadId && item.fecha === fecha ? { ...item, estado } : item,
          ),
        };
      });
    },
    [],
  );

  const markNotificationRead = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notificaciones: prev.notificaciones.map((item) =>
        item.id === id ? { ...item, leida: true } : item,
      ),
    }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notificaciones: prev.notificaciones.map((item) => ({ ...item, leida: true })),
    }));
  }, []);

  const releaseEscrow = useCallback((reservaId: string) => {
    setState((prev) => {
      const reservas = prev.reservas.map((reserva) =>
        reserva.id === reservaId
          ? {
              ...reserva,
              estadoPago: "pagado_completo" as const,
              pendienteCobrar: "0.00",
              anticipoPagado: reserva.montoTotal,
            }
          : reserva,
      );

      const reserva = prev.reservas.find((item) => item.id === reservaId);
      const notificacion: NotificacionComerciante | null = reserva
        ? {
            id: `ntf-release-${reservaId}`,
            tipo: "saldo_pendiente",
            titulo: `Escrow liberado: ${reserva.turistaNombre}`,
            mensaje: `Se confirmó la liberación on-chain del contrato ${reserva.escrowContractId.slice(0, 12)}…`,
            leida: false,
            createdAt: new Date().toISOString(),
          }
        : null;

      return {
        ...prev,
        reservas,
        notificaciones: notificacion
          ? [notificacion, ...prev.notificaciones]
          : prev.notificaciones,
      };
    });
  }, []);

  const upcomingToursCount = useMemo(
    () =>
      state.turnos.filter(
        (turno) => turno.estado === "reservado_parcial" || turno.estado === "lleno",
      ).length,
    [state.turnos],
  );

  const totalAnticipos = useMemo(
    () => state.reservas.reduce((sum, reserva) => addMoney(sum, reserva.anticipoPagado), "0.00"),
    [state.reservas],
  );

  const totalPendiente = useMemo(
    () => state.reservas.reduce((sum, reserva) => addMoney(sum, reserva.pendienteCobrar), "0.00"),
    [state.reservas],
  );

  const alertasPendientes = useMemo(
    () => state.notificaciones.filter((item) => !item.leida).length,
    [state.notificaciones],
  );

  const value = useMemo<MerchantContextValue>(
    () => ({
      ...state,
      savePerfil,
      upsertTour,
      deleteTour,
      upsertProducto,
      deleteProducto,
      cycleTurno,
      setTurnoEstado,
      upsertAlojamiento,
      deleteAlojamiento,
      cycleNocheAlojamiento,
      setNocheAlojamiento,
      markNotificationRead,
      markAllNotificationsRead,
      releaseEscrow,
      upcomingToursCount,
      totalAnticipos,
      totalPendiente,
      alertasPendientes,
    }),
    [
      state,
      savePerfil,
      upsertTour,
      deleteTour,
      upsertProducto,
      deleteProducto,
      cycleTurno,
      setTurnoEstado,
      upsertAlojamiento,
      deleteAlojamiento,
      cycleNocheAlojamiento,
      setNocheAlojamiento,
      markNotificationRead,
      markAllNotificationsRead,
      releaseEscrow,
      upcomingToursCount,
      totalAnticipos,
      totalPendiente,
      alertasPendientes,
    ],
  );

  return <MerchantContext.Provider value={value}>{children}</MerchantContext.Provider>;
}

export function useMerchant(): MerchantContextValue {
  const context = useContext(MerchantContext);
  if (!context) {
    throw new Error("useMerchant debe usarse dentro de MerchantProvider");
  }
  return context;
}
