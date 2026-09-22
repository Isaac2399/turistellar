"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  Coins,
  Wallet,
} from "lucide-react";
import { Badge, Card, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { formatMoney } from "@/lib/mock-merchant-data";
import { useMerchant } from "./MerchantProvider";

export function MerchantDashboard() {
  const {
    perfil,
    upcomingToursCount,
    totalAnticipos,
    totalPendiente,
    alertasPendientes,
    reservas,
    turnos,
    tours,
    notificaciones,
  } = useMerchant();

  const proximos = turnos
    .filter((turno) => turno.estado === "reservado_parcial" || turno.estado === "lleno")
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-800">
          Resumen ejecutivo
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Dashboard general</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          {perfil.nombreComercial} · anticipos en escrow Stellar (USDC) y cobro del saldo al
          llegar.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-zinc-500">Próximos tours</p>
              <p className="mt-2 text-3xl font-semibold">{upcomingToursCount}</p>
              <p className="mt-1 text-xs text-zinc-500">Turnos parciales o llenos</p>
            </div>
            <span className="rounded-full bg-emerald-100 p-2 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
              <CalendarClock className="h-5 w-5" />
            </span>
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-zinc-500">Anticipos acumulados</p>
              <p className="mt-2 text-3xl font-semibold">{formatMoney(totalAnticipos)}</p>
              <p className="mt-1 text-xs text-zinc-500">
                Fiat equivalente · pendiente {formatMoney(totalPendiente)}
              </p>
            </div>
            <span className="rounded-full bg-amber-100 p-2 text-amber-800 dark:bg-amber-950 dark:text-amber-200">
              <Coins className="h-5 w-5" />
            </span>
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-zinc-500">Alertas pendientes</p>
              <p className="mt-2 text-3xl font-semibold">{alertasPendientes}</p>
              <p className="mt-1 text-xs text-zinc-500">Operación, stock y cobros</p>
            </div>
            <span className="rounded-full bg-rose-100 p-2 text-rose-800 dark:bg-rose-950 dark:text-rose-200">
              <AlertTriangle className="h-5 w-5" />
            </span>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Turnos con ocupación</CardTitle>
              <CardDescription>Calendario de los próximos grupos confirmados.</CardDescription>
            </div>
            <Link
              href="/dashboard/merchant/calendario"
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              Ver calendario <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <ul className="space-y-3">
            {proximos.map((turno) => {
              const tour = tours.find((item) => item.id === turno.tourId);
              return (
                <li
                  key={turno.id}
                  className="flex items-center justify-between rounded-xl border border-emerald-900/10 px-3 py-2 dark:border-white/10"
                >
                  <div>
                    <p className="font-medium">{tour?.titulo ?? turno.tourId}</p>
                    <p className="text-xs text-zinc-500">
                      {turno.fecha} · {turno.hora} · {turno.cuposOcupados}/{tour?.cupoMaximo ?? "—"}
                    </p>
                  </div>
                  <Badge tone={turno.estado === "lleno" ? "rose" : "amber"}>
                    {turno.estado === "lleno" ? "Lleno" : "Parcial"}
                  </Badge>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Anticipos recientes</CardTitle>
              <CardDescription>Reservas con escrow Stellar pendiente de liberación.</CardDescription>
            </div>
            <Link
              href="/dashboard/merchant/reservas"
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              Ver reservas <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <ul className="space-y-3">
            {reservas.slice(0, 3).map((reserva) => (
              <li
                key={reserva.id}
                className="flex items-center justify-between rounded-xl border border-emerald-900/10 px-3 py-2 dark:border-white/10"
              >
                <div>
                  <p className="font-medium">{reserva.turistaNombre}</p>
                  <p className="text-xs text-zinc-500">
                    Anticipo {formatMoney(reserva.anticipoPagado, reserva.assetCode)}
                  </p>
                </div>
                <Wallet className="h-4 w-4 text-emerald-700" />
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Últimas alertas</CardTitle>
            <CardDescription>Recordatorios operativos del día.</CardDescription>
          </div>
          <Link
            href="/dashboard/merchant/notificaciones"
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Ver todas <ArrowRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <ul className="space-y-2">
          {notificaciones.slice(0, 3).map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3 text-sm">
              <span className={item.leida ? "text-zinc-500" : "font-medium"}>{item.titulo}</span>
              {!item.leida ? <Badge tone="rose">Nueva</Badge> : <Badge>Leída</Badge>}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
