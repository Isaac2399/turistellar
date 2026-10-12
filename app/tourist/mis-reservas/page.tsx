import { Suspense } from "react";
import type { Metadata } from "next";
import { DigitalPassportList } from "@/components/tourist/DigitalPassportList";
import { TripSteps } from "@/components/tourist/TripSteps";

export const metadata: Metadata = {
  title: "Mis reservas · Hub Rural",
  description:
    "Pasaporte de experiencias con QR para validar ingreso y liberar el anticipo protegido.",
};

export default function MisReservasPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <TripSteps />
      <p className="text-xs font-bold tracking-[0.16em] text-teal-800 uppercase dark:text-teal-300">
        Paso 4 · Tiquete digital
      </p>
      <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-50">
        Pasaporte de experiencias
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-stone-600 dark:text-stone-400">
        Muestra este QR al anfitrión. El escaneo confirma el servicio. Liberar el
        anticipo solo está disponible después, y la devolución simulada solo
        mientras el anticipo sigue protegido.
      </p>
      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-stone-500">Cargando pasaportes…</p>}>
          <DigitalPassportList />
        </Suspense>
      </div>
    </section>
  );
}
