import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Literata, Manrope } from "next/font/google";
import {
  CalendarClock,
  MapPinned,
  ShieldCheck,
  Ticket,
  WalletCards,
} from "lucide-react";

const display = Literata({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-home-body",
});

export const metadata: Metadata = {
  title: "Hub Rural",
  description:
    "Reserva alojamiento, tours y productos de comerciantes locales en un solo viaje. El anticipo queda retenido hasta que el comerciante confirma el servicio.",
};

const PASOS = [
  {
    n: 1,
    titulo: "Armar el viaje",
    texto:
      "Elige alojamiento, tours y productos locales y únelos en un solo itinerario.",
    icon: MapPinned,
  },
  {
    n: 2,
    titulo: "Fijar horarios",
    texto: "Asigna fecha y hora a cada parada antes de confirmar la reserva.",
    icon: CalendarClock,
  },
  {
    n: 3,
    titulo: "Pagar el anticipo",
    texto: "Reservas con el anticipo. El saldo restante se paga en el destino.",
    icon: WalletCards,
  },
  {
    n: 4,
    titulo: "Recibir el pasaporte",
    texto: "Tras pagar el anticipo recibes el pasaporte con todas tus reservas.",
    icon: Ticket,
  },
] as const;

const OFERTAS = [
  {
    titulo: "Alojamiento",
    texto: "Cabañas, residencias y hospedaje rural para quedarte en el lugar.",
  },
  {
    titulo: "Tours",
    texto: "Experiencias con anfitriones locales, con hora y cupo definidos.",
  },
  {
    titulo: "Productos locales",
    texto: "Lo que venden los comerciantes, listo para recoger durante el viaje.",
  },
] as const;

export default function Home() {
  return (
    <div className={`${display.variable} ${body.className}`}>
      <section className="relative isolate min-h-[calc(100svh-4rem)] overflow-hidden">
        <Image
          src="/hero-rural.jpg"
          alt="Camino rural entre campos verdes hacia una casa de campo"
          fill
          priority
          sizes="100vw"
          className="home-kenburns object-cover object-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,53,28,0.35)_0%,rgba(18,53,28,0.25)_35%,rgba(18,53,28,0.78)_100%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(95,143,78,0.28),transparent_55%)]"
        />

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-6xl flex-col justify-end px-4 pb-14 pt-20 sm:pb-20">
          <div className="max-w-2xl text-white">
            <p
              className={`${display.className} home-rise text-5xl leading-[0.95] tracking-tight sm:text-6xl md:text-7xl`}
            >
              Hub Rural
            </p>
            <h1 className="home-rise home-rise-delay-1 mt-5 max-w-xl text-2xl font-medium leading-snug text-white/95 sm:text-3xl">
              Un solo viaje: hospedaje, tours y productos del campo.
            </h1>
            <p className="home-rise home-rise-delay-2 mt-4 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
              Arma tu plan con comerciantes locales y reserva con anticipo
              respaldado hasta que el servicio se confirme.
            </p>
            <div className="home-rise home-rise-delay-3 mt-8 flex flex-wrap gap-3">
              <Link
                href="/explorar"
                className="inline-flex items-center justify-center rounded-md bg-[#e8efe4] px-5 py-3 text-sm font-semibold text-[#12351c] transition hover:bg-white"
              >
                Explorar destinos
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md border border-white/45 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        className="relative overflow-hidden bg-[linear-gradient(180deg,#eef5ea_0%,#e4efe0_50%,#f6f4ef_100%)] px-4 py-20"
        aria-labelledby="como-funciona"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(61,107,69,0.12),transparent_70%)]"
        />
        <div className="relative mx-auto w-full max-w-6xl">
          <div className="max-w-2xl">
            <h2
              id="como-funciona"
              className={`${display.className} text-3xl tracking-tight text-[#12351c] sm:text-4xl`}
            >
              Cómo funciona
            </h2>
            <p className="mt-3 text-base text-[#3d4a3f] sm:text-lg">
              Cuatro pasos, en el mismo orden que verás al planificar tu viaje.
            </p>
          </div>

          <div className="relative mt-12">
            <div
              aria-hidden
              className="home-step-line pointer-events-none absolute top-[1.65rem] right-[12.5%] left-[12.5%] hidden h-px bg-[#3d6b45]/35 lg:block"
            />
            <ol className="grid gap-10 lg:grid-cols-4 lg:gap-6">
              {PASOS.map((paso) => {
                const Icon = paso.icon;
                return (
                  <li key={paso.titulo} className="home-step relative">
                    <div className="flex items-start gap-4 lg:flex-col lg:gap-5">
                      <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#1f4d2e] text-[#e8efe4]">
                        <span className="sr-only">Paso {paso.n}</span>
                        <Icon className="h-6 w-6" aria-hidden />
                        <span className="absolute -top-1 -right-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#5f8f4e] px-1 text-xs font-bold text-white">
                          {paso.n}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3d6b45] lg:hidden">
                          Paso {paso.n}
                        </p>
                        <h3
                          className={`${display.className} text-xl tracking-tight text-[#12351c]`}
                        >
                          {paso.titulo}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#3d4a3f] sm:text-base">
                          {paso.texto}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      <section
        className="mx-auto w-full max-w-6xl px-4 py-16"
        aria-labelledby="que-ofrecemos"
      >
        <div className="max-w-2xl">
          <h2
            id="que-ofrecemos"
            className={`${display.className} text-3xl tracking-tight text-[#12351c]`}
          >
            Qué ofrecemos
          </h2>
          <p className="mt-3 text-[#3d4a3f]">
            Alojamiento, tours y productos locales se ven juntos en el mapa,
            para armar el viaje sin saltar de un listado a otro.
          </p>
        </div>
        <ul className="mt-10 grid gap-8 md:grid-cols-3">
          {OFERTAS.map((oferta) => (
            <li key={oferta.titulo} className="border-t border-[#1f4d2e]/20 pt-5">
              <h3
                className={`${display.className} text-xl tracking-tight text-[#12351c]`}
              >
                {oferta.titulo}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#3d4a3f] sm:text-base">
                {oferta.texto}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="border-y border-[#1f4d2e]/10 bg-[#e8efe4]/70 px-4 py-16"
        aria-labelledby="respaldo-pago"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#1f4d2e] text-[#e8efe4]">
            <ShieldCheck className="h-6 w-6" aria-hidden />
          </div>
          <div className="max-w-2xl">
            <h2
              id="respaldo-pago"
              className={`${display.className} text-3xl tracking-tight text-[#12351c]`}
            >
              Respaldo del pago
            </h2>
            <p className="mt-3 text-[#3d4a3f]">
              El anticipo queda retenido hasta que el comerciante confirma que
              prestó el servicio. Si el servicio no se presta, recuperas el
              anticipo.
            </p>
          </div>
        </div>
      </section>

      <section
        className="mx-auto w-full max-w-6xl px-4 py-16"
        aria-labelledby="siguiente-paso"
      >
        <h2
          id="siguiente-paso"
          className={`${display.className} text-3xl tracking-tight text-[#12351c]`}
        >
          Empieza por el viaje
        </h2>
        <p className="mt-3 max-w-xl text-[#3d4a3f]">
          Entra a Explorar, elige lo que quieres vivir y avanza paso a paso hasta
          tu pasaporte.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/explorar"
            className="inline-flex items-center justify-center rounded-md bg-[#1f4d2e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#12351c]"
          >
            Explorar
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md border border-[#1f4d2e]/25 px-5 py-3 text-sm font-semibold text-[#12351c] transition hover:bg-[#e8efe4]"
          >
            Iniciar sesión
          </Link>
        </div>
      </section>
    </div>
  );
}
