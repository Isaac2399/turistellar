"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { QrCode, ScanLine, ShieldCheck, Undo2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTourist } from "@/components/tourist/TouristProvider";
import { formatUsd } from "@/lib/money";
import { getOfertaById } from "@/lib/mock-data";
import { truncatePublicKey } from "@/lib/utils";
import { ESTADO_RESERVA_LABEL, ESTADO_RESERVA_TONE } from "@/types/estado-reserva";

export function DigitalPassportList() {
  const params = useSearchParams();
  const focus = params.get("pass");
  const { reservas, confirmarServicio, liberarFondos, reembolsarAnticipo, hydrated } = useTourist();

  const ordered = useMemo(() => {
    if (!focus) return reservas;
    return [...reservas].sort((a, b) => Number(b.id === focus) - Number(a.id === focus));
  }, [focus, reservas]);

  if (!hydrated) {
    return <p className="text-sm text-stone-500">Cargando pasaportes…</p>;
  }

  if (ordered.length === 0) {
    return (
      <p className="rounded-3xl border border-stone-900/8 bg-white/70 p-10 text-center text-sm text-stone-500 shadow-[var(--shadow-soft)] dark:border-white/10">
        Aún no tienes reservas. Paga un anticipo en checkout para emitir tu pasaporte de
        experiencias.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {ordered.map((reserva) => (
        <article
          key={reserva.id}
          className="lift-hover grid gap-6 rounded-3xl border border-stone-900/8 bg-[color-mix(in_oklab,var(--sand)_92%,white)] p-5 shadow-[var(--shadow-soft)] md:grid-cols-[220px_1fr] dark:border-white/10 dark:bg-stone-900/50"
        >
          <div className="flex flex-col items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(reserva.codigoQr)}`}
              alt={`Código QR ${reserva.codigoQr}`}
              width={200}
              height={200}
              className="rounded-2xl border border-stone-900/10 bg-white p-2"
            />
            <p className="font-mono text-sm font-semibold tracking-wide">{reserva.codigoQr}</p>
            <Badge tone={ESTADO_RESERVA_TONE[reserva.estado]}>
              {ESTADO_RESERVA_LABEL[reserva.estado]}
            </Badge>
          </div>

          <div className="space-y-4">
            <header>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-teal-800 dark:text-teal-300">
                <QrCode className="h-4 w-4" />
                Pasaporte de experiencias
              </p>
              <h2 className="font-display mt-1 text-2xl font-semibold text-stone-900 dark:text-stone-50">
                Reserva {reserva.id}
              </h2>
              <p className="text-sm text-stone-500">
                Emitido {new Date(reserva.createdAt).toLocaleString("es-CO")} ·{" "}
                {reserva.canalPago === "stellar" ? "Monedero digital" : "Tarjeta"} ·{" "}
                {reserva.assetCode}
              </p>
            </header>

            <ul className="space-y-1 text-sm text-stone-700 dark:text-stone-300">
              {reserva.items.map((item) => {
                const oferta = getOfertaById(item.ofertaId);
                return (
                  <li key={item.id}>
                    {oferta?.titulo ?? item.ofertaId}
                    {item.fecha ? ` · ${item.fecha}` : ""}
                    {item.hora ? ` ${item.hora}` : ""}
                  </li>
                );
              })}
            </ul>

            <dl className="grid gap-1 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-stone-500">Total</dt>
                <dd className="font-semibold">{formatUsd(reserva.desglose.total)}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Anticipo protegido</dt>
                <dd className="font-semibold">{formatUsd(reserva.desglose.anticipo)}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Saldo en destino</dt>
                <dd className="font-semibold">{formatUsd(reserva.desglose.saldo)}</dd>
              </div>
            </dl>

            <p className="inline-flex flex-wrap items-center gap-2 rounded-2xl bg-teal-50/80 px-3 py-2 text-xs text-teal-950 dark:bg-teal-950/40 dark:text-teal-100">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              Recibo verificable
              {reserva.stellarPublicKey
                ? ` · monedero ${truncatePublicKey(reserva.stellarPublicKey)}`
                : ""}
              {reserva.stellarTxHash
                ? ` · ref. ${reserva.stellarTxHash.slice(0, 14)}…`
                : ""}
            </p>

            {reserva.estado === "anticipo_retenido" ? (
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => confirmarServicio(reserva.id)}>
                  <ScanLine className="h-4 w-4" />
                  Simular escaneo del anfitrión
                </Button>
                <Button variant="outline" onClick={() => reembolsarAnticipo(reserva.id)}>
                  <Undo2 className="h-4 w-4" />
                  Simular devolución del anticipo
                </Button>
              </div>
            ) : null}

            {reserva.estado === "servicio_confirmado" ? (
              <Button variant="secondary" onClick={() => liberarFondos(reserva.id)}>
                <ShieldCheck className="h-4 w-4" />
                Liberar anticipo al anfitrión
              </Button>
            ) : null}

            {reserva.estado === "fondos_liberados" ? (
              <p className="inline-flex items-center gap-2 text-sm font-medium text-emerald-800">
                <ShieldCheck className="h-4 w-4" />
                El anticipo ya se liberó al anfitrión.
              </p>
            ) : null}

            {reserva.estado === "reembolsado" ? (
              <p className="inline-flex items-center gap-2 text-sm font-medium text-rose-700">
                <Undo2 className="h-4 w-4" />
                El anticipo volvió al viajero.
              </p>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
