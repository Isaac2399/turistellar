"use client";

import { LogIn, LogOut } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import {
  CANAL_PAGO_LABEL,
  ESTADO_PAGO_LABEL,
  formatIsoDate,
  formatMoney,
  type AlojamientoUnidad,
  type ReservaAlojamiento,
} from "@/lib/mock-merchant-data";

const TODAY = "2026-09-22";

type LodgingStaysProps = {
  unidades: AlojamientoUnidad[];
  reservas: ReservaAlojamiento[];
};

function StayCard({
  reserva,
  unidadNombre,
  kind,
}: {
  reserva: ReservaAlojamiento;
  unidadNombre: string;
  kind: "in" | "out";
}) {
  return (
    <li className="rounded-xl border border-emerald-900/10 p-4 dark:border-white/10">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-semibold">{reserva.huespedNombre}</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{unidadNombre}</p>
        </div>
        <Badge tone={kind === "in" ? "emerald" : "amber"}>
          {kind === "in" ? "Check-in" : "Check-out"}
        </Badge>
      </div>
      <p className="mt-2 text-sm">
        {formatIsoDate(reserva.checkIn)} → {formatIsoDate(reserva.checkOut)} · {reserva.noches}{" "}
        {reserva.noches === 1 ? "noche" : "noches"} · {reserva.personas} personas
      </p>
      <dl className="mt-3 grid gap-2 sm:grid-cols-3">
        <div className="rounded-xl bg-emerald-50 px-3 py-2 dark:bg-emerald-950">
          <dt className="text-xs text-zinc-500">Anticipo</dt>
          <dd className="text-sm font-semibold">
            {formatMoney(reserva.anticipoPagado, reserva.assetCode)}
          </dd>
          <dd className="text-xs text-zinc-500">{CANAL_PAGO_LABEL[reserva.canalPagoAnticipo]}</dd>
        </div>
        <div className="rounded-xl bg-amber-50 px-3 py-2 dark:bg-amber-950">
          <dt className="text-xs text-zinc-500">Saldo a la llegada</dt>
          <dd className="text-sm font-semibold">
            {formatMoney(reserva.saldoPendiente, reserva.assetCode)}
          </dd>
        </div>
        <div className="rounded-xl bg-zinc-50 px-3 py-2 dark:bg-zinc-900">
          <dt className="text-xs text-zinc-500">Estado</dt>
          <dd className="text-sm font-semibold">{ESTADO_PAGO_LABEL[reserva.estadoPago]}</dd>
        </div>
      </dl>
    </li>
  );
}

export function LodgingStays({ unidades, reservas }: LodgingStaysProps) {
  const checkIns = reservas
    .filter((item) => item.checkIn >= TODAY)
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn));
  const checkOuts = reservas
    .filter((item) => item.checkOut >= TODAY)
    .sort((a, b) => a.checkOut.localeCompare(b.checkOut));

  function nombreUnidad(id: string): string {
    return unidades.find((item) => item.id === id)?.nombre ?? id;
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Reservas de hospedaje en curso</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Próximos check-ins y check-outs con anticipo Stellar o fiat y saldo pendiente.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-emerald-100 p-2 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
              <LogIn className="h-4 w-4" />
            </span>
            <h3 className="font-semibold">Próximos check-ins</h3>
          </div>
          <ul className="space-y-3">
            {checkIns.map((reserva) => (
              <StayCard
                key={reserva.id}
                reserva={reserva}
                unidadNombre={nombreUnidad(reserva.unidadId)}
                kind="in"
              />
            ))}
          </ul>
        </Card>
        <Card>
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-amber-100 p-2 text-amber-800 dark:bg-amber-950 dark:text-amber-200">
              <LogOut className="h-4 w-4" />
            </span>
            <h3 className="font-semibold">Próximos check-outs</h3>
          </div>
          <ul className="space-y-3">
            {checkOuts.map((reserva) => (
              <StayCard
                key={reserva.id}
                reserva={reserva}
                unidadNombre={nombreUnidad(reserva.unidadId)}
                kind="out"
              />
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}
