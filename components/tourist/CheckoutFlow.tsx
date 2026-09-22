"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStellarWallet } from "@/hooks/useStellarWallet";
import { useTourist } from "@/components/tourist/TouristProvider";
import { getOfertaById } from "@/lib/mock-data";
import { buildDesglose } from "@/lib/itinerary";
import { formatUsd } from "@/lib/money";
import { truncatePublicKey } from "@/lib/utils";
import { CATEGORIA_OFERTA_LABEL } from "@/lib/mock-data";
import { verificarDisponibilidad } from "@/lib/availability";
import type { CanalPagoCheckout } from "@/types/tourist";

export function CheckoutFlow() {
  const router = useRouter();
  const { items, confirmarReserva } = useTourist();
  const wallet = useStellarWallet();
  const desglose = buildDesglose(items);
  const [canal, setCanal] = useState<CanalPagoCheckout>("stellar");
  const [asset, setAsset] = useState<"USDC" | "XLM">("USDC");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardName, setCardName] = useState("");
  const [cardLast4, setCardLast4] = useState("");

  const alerts = items
    .map((item) => verificarDisponibilidad(item))
    .filter((row): row is NonNullable<typeof row> => row !== null);

  const pay = async () => {
    setError(null);
    if (items.length === 0) {
      setError("Tu itinerario está vacío.");
      return;
    }
    if (alerts.length > 0) {
      setError("Hay conflictos de disponibilidad. Revisa la agenda antes de pagar.");
      return;
    }

    setBusy(true);
    try {
      if (canal === "stellar") {
        let key = wallet.publicKey;
        if (!wallet.isFreighterInstalled) {
          window.open("https://www.freighter.app", "_blank", "noopener,noreferrer");
          setError("Instala Freighter para firmar el anticipo en Stellar.");
          return;
        }
        if (!key) {
          key = await wallet.connect();
        }
        if (!key) {
          setError(wallet.error ?? "No se pudo conectar Freighter.");
          return;
        }
        await new Promise((r) => setTimeout(r, 700));
        const hash = `stellar-testnet-${Date.now().toString(16)}`;
        const reserva = confirmarReserva({
          canalPago: "stellar",
          assetCode: asset,
          stellarPublicKey: key,
          stellarTxHash: hash,
        });
        if (reserva) router.push(`/tourist/mis-reservas?pass=${reserva.id}`);
        return;
      }

      if (cardName.trim().length < 3 || cardLast4.replace(/\D/g, "").length < 4) {
        setError("Completa el nombre y los 4 últimos dígitos para la simulación fiat.");
        return;
      }
      await new Promise((r) => setTimeout(r, 900));
      const reserva = confirmarReserva({
        canalPago: "fiat",
        assetCode: "USD",
      });
      if (reserva) router.push(`/tourist/mis-reservas?pass=${reserva.id}`);
    } finally {
      setBusy(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-900/10 p-8 text-center dark:border-white/10">
        <p className="text-lg font-medium">No hay un paquete de viaje aún.</p>
        <p className="mt-2 text-sm text-zinc-500">
          Arma tu itinerario en Explorar y vuelve para pagar el anticipo.
        </p>
        <Link
          href="/explorar"
          className="mt-6 inline-flex rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white"
        >
          Ir a explorar
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Resumen del paquete</h2>
          <ul className="mt-4 space-y-3">
            {desglose.lineas.map((linea) => {
              const oferta = getOfertaById(linea.ofertaId);
              const item = items.find((row) => row.id === linea.itemId);
              return (
                <li
                  key={linea.itemId}
                  className="rounded-2xl border border-emerald-900/10 p-4 dark:border-white/10"
                >
                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    {CATEGORIA_OFERTA_LABEL[linea.categoria]}
                  </p>
                  <p className="font-medium">{linea.titulo}</p>
                  <p className="text-sm text-zinc-500">
                    {oferta?.empresa}
                    {item?.fecha ? ` · ${item.fecha}` : ""}
                    {item?.hora ? ` ${item.hora}` : ""}
                  </p>
                  <p className="mt-2 text-sm">
                    {linea.categoria === "alojamiento"
                      ? `${linea.noches} noche(s)`
                      : linea.categoria === "tour"
                        ? `${linea.cantidad} cupo(s)`
                        : `${linea.cantidad} producto(s)`}{" "}
                    · {formatUsd(linea.subtotal)} · anticipo {linea.porcentajeAnticipo}%
                  </p>
                </li>
              );
            })}
          </ul>
        </div>

        {alerts.length > 0 ? (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm dark:border-amber-700 dark:bg-amber-950/40">
            <p className="font-medium">Conflictos de cupo</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {alerts.map((a) => (
                <li key={`${a.ofertaId}-${a.mensaje}`}>{a.mensaje}</li>
              ))}
            </ul>
            <Link href="/explorar/agenda" className="mt-3 inline-block text-emerald-800 underline">
              Ajustar agenda
            </Link>
          </div>
        ) : null}
      </section>

      <aside className="space-y-5 rounded-2xl border border-emerald-900/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold">Desglose financiero</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Total del viaje</dt>
            <dd className="font-semibold">{formatUsd(desglose.total)}</dd>
          </div>
          <div className="flex justify-between text-emerald-800 dark:text-emerald-300">
            <dt>Anticipo a pagar hoy</dt>
            <dd className="font-semibold">{formatUsd(desglose.anticipo)}</dd>
          </div>
          <div className="flex justify-between text-zinc-500">
            <dt>Saldo al llegar</dt>
            <dd>{formatUsd(desglose.saldo)}</dd>
          </div>
        </dl>
        <p className="text-xs text-zinc-500">
          El anticipo queda en escrow (Soroban). El comerciante lo libera al escanear el QR
          del pasaporte digital en destino.
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setCanal("fiat")}
            className={`rounded-2xl border px-3 py-3 text-left text-sm ${
              canal === "fiat"
                ? "border-emerald-700 bg-emerald-50 dark:bg-emerald-950"
                : "border-emerald-900/10 dark:border-white/10"
            }`}
          >
            <CreditCard className="mb-1 h-4 w-4" />
            Tarjeta / Fiat
            <span className="mt-1 block text-xs text-zinc-500">On-ramp · Stripe mock</span>
          </button>
          <button
            type="button"
            onClick={() => setCanal("stellar")}
            className={`rounded-2xl border px-3 py-3 text-left text-sm ${
              canal === "stellar"
                ? "border-emerald-700 bg-emerald-50 dark:bg-emerald-950"
                : "border-emerald-900/10 dark:border-white/10"
            }`}
          >
            <Wallet className="mb-1 h-4 w-4" />
            Cripto Stellar
            <span className="mt-1 block text-xs text-zinc-500">USDC / XLM · Freighter</span>
          </button>
        </div>

        {canal === "stellar" ? (
          <div className="space-y-3">
            <div className="flex gap-2">
              {(["USDC", "XLM"] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setAsset(code)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                    asset === code
                      ? "bg-emerald-700 text-white"
                      : "border border-emerald-800/20"
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
            <p className="text-xs text-zinc-500">
              {wallet.isConnected && wallet.publicKey
                ? `Wallet ${truncatePublicKey(wallet.publicKey)} · ${wallet.network ?? "red desconocida"}`
                : "Conecta Freighter para firmar el hold del anticipo."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <Label htmlFor="card-name">Nombre en la tarjeta</Label>
              <Input
                id="card-name"
                className="mt-1"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Ana Viajera"
              />
            </div>
            <div>
              <Label htmlFor="card-last4">Últimos 4 dígitos (simulación)</Label>
              <Input
                id="card-last4"
                className="mt-1"
                maxLength={4}
                inputMode="numeric"
                value={cardLast4}
                onChange={(e) => setCardLast4(e.target.value)}
                placeholder="4242"
              />
            </div>
          </div>
        )}

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

        <Button className="w-full" onClick={() => void pay()} disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Pagar anticipo {formatUsd(desglose.anticipo)}
        </Button>
      </aside>
    </div>
  );
}
