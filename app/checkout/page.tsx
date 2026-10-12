import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/tourist/CheckoutFlow";
import { TripSteps } from "@/components/tourist/TripSteps";

export const metadata: Metadata = {
  title: "Checkout · Hub Rural",
  description:
    "Paga el anticipo protegido de tu viaje con tarjeta o monedero digital.",
};

export default function CheckoutPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <TripSteps />
      <p className="text-xs font-bold tracking-[0.16em] text-emerald-800 uppercase dark:text-emerald-300">
        Paso 3 · Reserva y pago
      </p>
      <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-50">
        Pagar el anticipo
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-stone-600 dark:text-stone-400">
        Anticipo 30% o 50% según cada experiencia. El saldo se liquida al llegar.
        Puedes pagar con tarjeta o con monedero digital; el recibo es verificable
        y el anticipo queda protegido hasta confirmar el servicio.
      </p>
      <div className="mt-8">
        <CheckoutFlow />
      </div>
    </section>
  );
}
