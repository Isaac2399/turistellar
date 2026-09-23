import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hub Rural",
  description:
    "Reserva alojamiento, tours y productos de comerciantes locales en un solo viaje. El anticipo queda retenido hasta que el comerciante confirma el servicio.",
};

const PASOS = [
  {
    titulo: "Armar el viaje",
    texto:
      "Elige alojamiento, tours y productos locales y júntalos en un mismo viaje.",
  },
  {
    titulo: "Fijar horarios",
    texto: "Asigna la fecha y la hora de cada parada antes de reservar.",
  },
  {
    titulo: "Pagar el anticipo",
    texto: "Reservas pagando el anticipo. El saldo queda para el destino.",
  },
  {
    titulo: "Recibir el pasaporte",
    texto: "Al pagar el anticipo recibes el pasaporte del viaje.",
  },
] as const;

const OFERTAS = [
  {
    titulo: "Alojamiento",
    texto: "Dónde te quedas: cabañas, residencias y hospedaje rural.",
  },
  {
    titulo: "Tours",
    texto: "Experiencias con los anfitriones del lugar, con hora y cupo.",
  },
  {
    titulo: "Productos locales",
    texto: "Lo que venden los comerciantes, para recoger durante el viaje.",
  },
] as const;

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-4 py-16">
      <section className="max-w-2xl space-y-4">
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-800">
          Hub Rural
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">Qué es Hub Rural</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Reserva alojamiento, tours y productos de comerciantes locales en un solo
          viaje. Todo queda en el mismo plan, para que no armes el hospedaje, la
          salida y la compra en sitios distintos.
        </p>
      </section>

      <section className="space-y-6" aria-labelledby="como-funciona">
        <div className="max-w-2xl space-y-2">
          <h2 id="como-funciona" className="text-2xl font-semibold tracking-tight">
            Cómo funciona
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Cuatro pasos, en el mismo orden que verás al planificar.
          </p>
        </div>
        <ol className="grid gap-4 sm:grid-cols-2">
          {PASOS.map((paso, index) => (
            <li
              key={paso.titulo}
              className="rounded-2xl border border-emerald-900/10 p-5 dark:border-white/10"
            >
              <p className="text-sm font-medium text-emerald-800">Paso {index + 1}</p>
              <h3 className="mt-1 text-lg font-semibold">{paso.titulo}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{paso.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-6" aria-labelledby="que-ofrecemos">
        <div className="max-w-2xl space-y-2">
          <h2 id="que-ofrecemos" className="text-2xl font-semibold tracking-tight">
            Qué ofrecemos
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Alojamiento, tours y productos locales se ven juntos en el mapa, para
            armar el viaje sin saltar de un listado a otro.
          </p>
        </div>
        <ul className="grid gap-4 md:grid-cols-3">
          {OFERTAS.map((oferta) => (
            <li
              key={oferta.titulo}
              className="rounded-2xl border border-emerald-900/10 p-5 dark:border-white/10"
            >
              <h3 className="text-lg font-semibold">{oferta.titulo}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{oferta.texto}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="max-w-2xl space-y-3" aria-labelledby="respaldo-pago">
        <h2 id="respaldo-pago" className="text-2xl font-semibold tracking-tight">
          Respaldo del pago
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          El anticipo queda retenido hasta que el comerciante confirma que prestó el
          servicio. Si el servicio no se presta, recuperas el anticipo.
        </p>
      </section>

      <section className="space-y-4" aria-labelledby="siguiente-paso">
        <h2 id="siguiente-paso" className="text-2xl font-semibold tracking-tight">
          Empieza por el viaje
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/explorar"
            className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
          >
            Explorar
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-emerald-800/20 px-5 py-2.5 text-sm font-medium hover:bg-emerald-50 dark:hover:bg-emerald-950"
          >
            Iniciar sesión
          </Link>
        </div>
      </section>
    </div>
  );
}
