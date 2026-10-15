import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpenCheck, MapPinned, PenLine, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Turistellar",
  description:
    "Fincas, guías y comedores de la Zona Sur de Costa Rica, con el historial de los servicios que el visitante ya confirmó.",
};

const PASOS = [
  {
    n: 1,
    titulo: "Publicar",
    texto: "La familia, el guía o el comedor carga el lugar y el tipo de servicio.",
    icon: PenLine,
  },
  {
    n: 2,
    titulo: "Leer la ficha",
    texto: "El visitante ve la oferta de la zona y los servicios que ya quedaron confirmados.",
    icon: BookOpenCheck,
  },
  {
    n: 3,
    titulo: "Reservar",
    texto: "La reserva queda en esa ficha, a nombre de quien ofrece el servicio.",
    icon: MapPinned,
  },
  {
    n: 4,
    titulo: "Confirmar",
    texto: "Los dos marcan que ocurrió. La línea se suma al historial y no se reescribe.",
    icon: ShieldCheck,
  },
] as const;

const OFERTAS = [
  {
    titulo: "Cama",
    texto: "Cuartos y fincas de Pérez Zeledón, Osa, Coto Brus y el resto de la región.",
  },
  {
    titulo: "Guía",
    texto: "Recorridos con quien vive en el lugar, no solo con quien arma el paquete.",
  },
  {
    titulo: "Comida",
    texto: "Comedores que hoy quedan de paso y pueden mostrar que ya recibieron grupos.",
  },
] as const;

export default function Home() {
  return (
    <div>
      <section className="relative isolate min-h-[calc(100svh-4rem)] overflow-hidden">
        <Image
          src="/hero-zona.jpg"
          alt="Bosque denso, como el de la Zona Sur"
          fill
          priority
          sizes="100vw"
          className="home-kenburns object-cover object-[center_40%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,36,20,0.18)_0%,rgba(10,36,20,0.12)_40%,rgba(10,36,20,0.72)_100%)]"
        />
        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-6xl flex-col justify-end px-4 pb-14 pt-20 sm:pb-20">
          <div className="max-w-2xl text-white">
            <p className="home-rise font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
              Turistellar
            </p>
            <h1 className="home-rise home-rise-delay-1 mt-5 max-w-xl text-2xl font-medium leading-snug text-white/95 sm:text-3xl">
              La Zona Sur, con el historial de quien ya cumplió.
            </h1>
            <p className="home-rise home-rise-delay-2 mt-4 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
              Encuentra fincas, guías y comedores de la Región Brunca y lee,
              antes de escribir, los servicios que un visitante ya confirmó.
            </p>
            <div className="home-rise home-rise-delay-3 mt-8 flex flex-wrap gap-3">
              <Link
                href="/explorar"
                className="inline-flex items-center justify-center rounded-2xl bg-amber-50 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-white"
              >
                Ver la oferta
              </Link>
              <Link
                href="/publicar"
                className="inline-flex items-center justify-center rounded-2xl border border-white/45 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Publicar lo que ofrezco
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-20" aria-labelledby="como-funciona">
        <div className="relative mx-auto w-full max-w-6xl">
          <div className="max-w-2xl">
            <h2
              id="como-funciona"
              className="font-display text-3xl tracking-tight text-stone-900 sm:text-4xl dark:text-stone-50"
            >
              Cómo se recorre
            </h2>
            <p className="mt-3 text-base text-stone-600 sm:text-lg dark:text-stone-400">
              El mismo orden del Product Blueprint: publicar, leer, reservar y
              confirmar.
            </p>
          </div>
          <ol className="mt-12 grid gap-10 lg:grid-cols-4 lg:gap-8">
            {PASOS.map((paso) => {
              const Icon = paso.icon;
              return (
                <li key={paso.titulo} className="flex items-start gap-4 lg:flex-col">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-amber-50">
                    <Icon className="h-6 w-6" aria-hidden />
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-[0.16em] text-emerald-800 uppercase dark:text-emerald-300">
                      Paso {paso.n}
                    </p>
                    <h3 className="font-display mt-1 text-xl tracking-tight text-stone-900 dark:text-stone-50">
                      {paso.titulo}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base dark:text-stone-400">
                      {paso.texto}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16" aria-labelledby="que-hay">
        <h2
          id="que-hay"
          className="font-display text-3xl tracking-tight text-stone-900 dark:text-stone-50"
        >
          Qué se encuentra
        </h2>
        <ul className="mt-10 grid gap-8 md:grid-cols-3">
          {OFERTAS.map((oferta) => (
            <li
              key={oferta.titulo}
              className="rounded-3xl border border-stone-900/8 bg-white/60 p-5 dark:border-white/10 dark:bg-stone-900/40"
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
    </div>
  );
}
