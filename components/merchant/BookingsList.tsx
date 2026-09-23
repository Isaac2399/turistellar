"use client";

import { useState } from "react";
import { QrCode } from "lucide-react";
import { Badge, Button, Card, Dialog } from "@/components/ui";
import {
  formatDateTime,
  formatMoney,
  type ReservaComerciante,
} from "@/lib/mock-merchant-data";
import { truncatePublicKey } from "@/lib/utils";
import { ESTADO_RESERVA_LABEL, ESTADO_RESERVA_TONE } from "@/types/estado-reserva";
import { useMerchant } from "./MerchantProvider";

function FakeQr({ seed }: { seed: string }) {
  const cells = Array.from({ length: 81 }, (_, index) => {
    const code = seed.charCodeAt(index % seed.length) + index;
    return code % 3 === 0;
  });
  return (
    <div className="mx-auto grid h-44 w-44 grid-cols-9 gap-0.5 rounded-xl bg-white p-2">
      {cells.map((filled, index) => (
        <span
          key={index}
          className={filled ? "rounded-[2px] bg-zinc-900" : "rounded-[2px] bg-zinc-200"}
        />
      ))}
    </div>
  );
}

export function BookingsList() {
  const { reservas, tours, productos, releaseEscrow } = useMerchant();
  const [selected, setSelected] = useState<ReservaComerciante | null>(null);
  const [released, setReleased] = useState(false);

  function openQr(reserva: ReservaComerciante) {
    setSelected(reserva);
    setReleased(false);
  }

  function confirmRelease() {
    if (!selected) return;
    releaseEscrow(selected.id);
    setReleased(true);
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-800">Liquidación</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Reservas y anticipos</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Anticipo en escrow Stellar y saldo a cobrar al llegar. Liberar fondos solo pasa de{" "}
          {ESTADO_RESERVA_LABEL.servicio_confirmado} a {ESTADO_RESERVA_LABEL.fondos_liberados}.
        </p>
      </header>

      <div className="space-y-4">
        {reservas.map((reserva) => {
          const tour = tours.find((item) => item.id === reserva.tourId);
          const productLines = reserva.productos.map((item) => {
            const producto = productos.find((candidate) => candidate.id === item.productoId);
            return `${item.cantidad}× ${producto?.nombre ?? item.productoId}`;
          });
          return (
            <Card key={reserva.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">{reserva.turistaNombre}</h2>
                    <Badge tone={ESTADO_RESERVA_TONE[reserva.estadoPago]}>
                      {ESTADO_RESERVA_LABEL[reserva.estadoPago]}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {formatDateTime(reserva.fechaHora)}
                  </p>
                  {tour ? (
                    <p className="mt-2 text-sm">
                      <span className="font-medium">Tour:</span> {tour.titulo}
                    </p>
                  ) : null}
                  {productLines.length > 0 ? (
                    <p className="text-sm">
                      <span className="font-medium">Productos:</span> {productLines.join(", ")}
                    </p>
                  ) : null}
                </div>
                <Button
                  onClick={() => openQr(reserva)}
                  disabled={reserva.estadoPago !== "servicio_confirmado"}
                >
                  <QrCode className="h-4 w-4" /> Liberar fondos
                </Button>
              </div>
              <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-zinc-50 px-3 py-2 dark:bg-zinc-900">
                  <dt className="text-xs text-zinc-500">Monto total</dt>
                  <dd className="font-semibold">
                    {formatMoney(reserva.montoTotal, reserva.assetCode)}
                  </dd>
                </div>
                <div className="rounded-xl bg-emerald-50 px-3 py-2 dark:bg-emerald-950">
                  <dt className="text-xs text-zinc-500">Anticipo pagado</dt>
                  <dd className="font-semibold">
                    {formatMoney(reserva.anticipoPagado, reserva.assetCode)}
                  </dd>
                </div>
                <div className="rounded-xl bg-amber-50 px-3 py-2 dark:bg-amber-950">
                  <dt className="text-xs text-zinc-500">Pendiente al llegar</dt>
                  <dd className="font-semibold">
                    {formatMoney(reserva.pendienteCobrar, reserva.assetCode)}
                  </dd>
                </div>
              </dl>
            </Card>
          );
        })}
      </div>

      <Dialog
        open={selected !== null}
        title="Liberación de escrow Stellar"
        description="Simulación del QR que el turista presenta al finalizar el tour."
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <div className="space-y-4">
            <FakeQr seed={selected.escrowContractId} />
            <p className="text-center text-sm">
              Contrato {truncatePublicKey(selected.escrowContractId, 8)}
            </p>
            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              {selected.turistaNombre} · {formatMoney(selected.montoTotal, selected.assetCode)}
            </p>
            {released ? (
              <p className="text-center text-sm font-medium text-emerald-700">
                {ESTADO_RESERVA_LABEL.fondos_liberados}.
              </p>
            ) : (
              <Button
                className="w-full"
                onClick={confirmRelease}
                disabled={selected.estadoPago !== "servicio_confirmado"}
              >
                Liberar fondos
              </Button>
            )}
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}
