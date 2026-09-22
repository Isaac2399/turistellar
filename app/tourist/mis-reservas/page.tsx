import { Suspense } from "react";
import type { Metadata } from "next";
import { DigitalPassportList } from "@/components/tourist/DigitalPassportList";
import { TouristSubnav } from "@/components/tourist/TouristSubnav";

export const metadata: Metadata = {
  title: "Mis reservas · Hub Rural",
  description: "Pasaporte de experiencia con QR único para validar ingreso y liberar escrow.",
};

export default function MisReservasPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <p className="text-sm font-medium uppercase tracking-wide text-emerald-800">
        Tiquete digital
      </p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">
        Pasaporte de experiencia
      </h1>
      <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
        Muestra este QR al comerciante. Al escanearlo se valida el ingreso y se liberan
        los fondos retenidos en escrow de Stellar.
      </p>
      <div className="mt-6">
        <TouristSubnav />
      </div>
      <Suspense fallback={<p className="text-sm text-zinc-500">Cargando pasaportes…</p>}>
        <DigitalPassportList />
      </Suspense>
    </section>
  );
}
