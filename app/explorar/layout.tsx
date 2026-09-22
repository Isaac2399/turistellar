import type { Metadata } from "next";
import { TouristSubnav } from "@/components/tourist/TouristSubnav";

export const metadata: Metadata = {
  title: "Explorar · Hub Rural",
  description:
    "Descubre alojamientos, tours y productos locales. Conecta puntos en el mapa y agenda por horas.",
};

export default function ExplorarLayout({
  children,
}: LayoutProps<"/explorar">) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <p className="text-sm font-medium uppercase tracking-wide text-emerald-800">
        Módulo del turista
      </p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">
        Explorar y planificar el viaje
      </h1>
      <p className="mt-2 max-w-3xl text-zinc-600 dark:text-zinc-400">
        Elige cabaña, tour y producto local. El mapa une los puntos, la agenda fija horas
        exactas y el checkout retiene el anticipo en Stellar o fiat.
      </p>
      <div className="mt-6">
        <TouristSubnav />
      </div>
      {children}
    </section>
  );
}
