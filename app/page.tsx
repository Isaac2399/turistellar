import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarClock,
  MapPinned,
  ShieldCheck,
  Ticket,
  WalletCards,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Hub Rural",
  description:
    "Reserva alojamiento, tours y productos de comerciantes locales en un solo viaje. Anticipo protegido hasta que el anfitrión confirma el servicio.",
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
    texto: "Reservas con el anticipo protegido. El saldo restante se paga en destino.",
    icon: WalletCards,
  },
  {
    n: 4,
    titulo: "Recibir el pasaporte",
    texto: "Tras pagar recibes el pasaporte de experiencias con todas tus reservas.",
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
    <div>
      <section className="relative isolate min-h-[calc(100svh-4rem)] overflow-hidden">
        <Image
          src="/hero-valley.jpg"
          alt="Valle verde con bosque y montañas nevadas bajo cielo azul"
          fill
          priority
          sizes="100vw"
          className="home-kenburns object-cover object-[center_40%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,36,20,0.18)_0%,rgba(10,36,20,0.12)_40%,rgba(10,36,20,0.72)_100%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_85%,rgba(5,150,105,0.22),transparent_50%)]"
        />

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-6xl flex-col justify-end px-4 pb-14 pt-20 sm:pb-20">
          <div className="max-w-2xl text-white">
            <p className="home-rise font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
              Hub Rural
            </p>
            <h1 className="home-rise home-rise-delay-1 mt-5 max-w-xl text-2xl font-medium leading-snug text-white/95 sm:text-3xl">
              Un solo viaje: hospedaje, tours y productos del campo.
            </h1>
            <p className="home-rise home-rise-delay-2 mt-4 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
              Arma tu plan con anfitriones locales y reserva con anticipo
              protegido hasta que el servicio se confirme.
            </p>
            <div className="home-rise home-rise-delay-3 mt-8 flex flex-wrap gap-3">
              <Link
                href="/explorar"
                className="inline-flex items-center justify-center rounded-2xl bg-amber-50 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-white"
              >
                Explorar destinos
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-2xl border border-white/45 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        className="relative overflow-hidden px-4 py-20"
        aria-labelledby="como-funciona"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(4,120,87,0.12),transparent_70%)]"
        />
        <div className="relative mx-auto w-full max-w-6xl">
          <div className="max-w-2xl">
            <h2
              id="como-funciona"
              className="font-display text-3xl tracking-tight text-stone-900 sm:text-4xl dark:text-stone-50"
            >
              Cómo funciona
            </h2>
            <p className="mt-3 text-base text-stone-600 sm:text-lg dark:text-stone-400">
              Cuatro pasos, en el mismo orden que verás al planificar tu viaje.
            </p>
          </div>

          <div className="relative mt-12">
            <div
              aria-hidden
              className="home-step-line pointer-events-none absolute top-[1.65rem] right-[8%] left-[8%] hidden h-[2px] bg-[linear-gradient(90deg,transparent,#047857_12%,#047857_88%,transparent)] lg:block"
            />
            <ol className="grid gap-10 lg:grid-cols-4 lg:gap-8">
              {PASOS.map((paso) => {
                const Icon = paso.icon;
                return (
                  <li key={paso.titulo} className="home-step relative">
                    <div className="flex items-start gap-4 lg:flex-col lg:gap-4">
                      <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-amber-50 ring-4 ring-[var(--background)]">
                        <Icon className="h-6 w-6" aria-hidden />
                      </div>
                      <div>
                        <p className="text-xs font-bold tracking-[0.16em] text-emerald-800 uppercase dark:text-emerald-300">
                          Paso {paso.n}
                        </p>
                        <h3 className="font-display mt-1 text-xl tracking-tight text-stone-900 sm:text-2xl dark:text-stone-50">
                          {paso.titulo}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base dark:text-stone-400">
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
            className="font-display text-3xl tracking-tight text-stone-900 dark:text-stone-50"
          >
            Qué ofrecemos
          </h2>
          <p className="mt-3 text-stone-600 dark:text-stone-400">
            Alojamiento, tours y productos locales se ven juntos en el mapa,
            para armar el viaje sin saltar de un listado a otro.
          </p>
        </div>
        <ul className="mt-10 grid gap-8 md:grid-cols-3">
          {OFERTAS.map((oferta) => (
            <li
              key={oferta.titulo}
              className="rounded-3xl border border-stone-900/8 bg-white/60 p-5 shadow-[var(--shadow-soft)] dark:border-white/10 dark:bg-stone-900/40"
            >
              <h3 className="font-display text-xl tracking-tight text-stone-900 dark:text-stone-50">
                {oferta.titulo}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base dark:text-stone-400">
                {oferta.texto}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="border-y border-stone-900/8 bg-emerald-50/60 px-4 py-16 dark:bg-emerald-950/20"
        aria-labelledby="respaldo-pago"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-white">
            <ShieldCheck className="h-6 w-6" aria-hidden />
          </div>
          <div className="max-w-2xl">
            <h2
              id="respaldo-pago"
              className="font-display text-3xl tracking-tight text-stone-900 dark:text-stone-50"
            >
              Anticipo protegido
            </h2>
            <p className="mt-3 text-stone-600 dark:text-stone-400">
              El anticipo queda protegido hasta que el anfitrión confirma que
              prestó el servicio. Si el servicio no se presta, recuperas el
              anticipo. Cada pago genera un recibo verificable.
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
          className="font-display text-3xl tracking-tight text-stone-900 dark:text-stone-50"
        >
          Empieza por el viaje
        </h2>
        <p className="mt-3 max-w-xl text-stone-600 dark:text-stone-400">
          Entra a Explorar, elige lo que quieres vivir y avanza paso a paso hasta
          tu pasaporte de experiencias.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/explorar"
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(4,120,87,0.22)] transition hover:bg-green-800"
          >
            Explorar
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-2xl border border-stone-900/12 bg-white/70 px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-emerald-50 dark:border-white/15 dark:bg-white/5 dark:text-stone-50"
          >
            Iniciar sesión
          </Link>
        </div>
      </section>
    </div>
  );
}
