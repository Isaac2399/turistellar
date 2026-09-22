import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/tourist/CheckoutFlow";
import { TouristSubnav } from "@/components/tourist/TouristSubnav";

export const metadata: Metadata = {
  title: "Checkout · Hub Rural",
  description: "Paga el anticipo del paquete de viaje con tarjeta o USDC/XLM en Stellar.",
};

export default function CheckoutPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <p className="text-sm font-medium uppercase tracking-wide text-emerald-800">
        Reserva y pago
      </p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Checkout del viaje</h1>
      <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
        Anticipo 30% o 50% según cada experiencia. El saldo se liquida al llegar. Pasarela
        híbrida: fiat (simulación) o Freighter (USDC / XLM).
      </p>
      <div className="mt-6">
        <TouristSubnav />
      </div>
      <CheckoutFlow />
    </section>
  );
}
