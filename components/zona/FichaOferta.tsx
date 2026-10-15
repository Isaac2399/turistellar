"use client";

import Link from "next/link";
import { Historial } from "@/components/zona/Historial";
import { useZona } from "@/components/zona/ZonaProvider";
import { TIPO_LABEL } from "@/lib/zona/tipos";

export function FichaOferta({ id }: { id: string }) {
  const { listo, ofertaPorId, lineasDe } = useZona();
  const oferta = ofertaPorId(id);

  if (!listo) {
    return <p className="text-sm text-stone-600">Cargando la ficha…</p>;
  }

  if (!oferta) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-3xl text-stone-900 dark:text-stone-50">
          Esta ficha no está
        </h1>
        <Link href="/explorar" className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
          Volver al listado
        </Link>
      </div>
    );
  }

  const lineas = lineasDe(oferta.id);

  return (
    <article className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div>
        {oferta.imagen ? (
          <img
            src={oferta.imagen}
            alt=""
            className="h-64 w-full rounded-3xl object-cover sm:h-80"
          />
        ) : (
          <div className="flex h-64 items-end rounded-3xl bg-emerald-800 px-6 py-6 text-amber-50 sm:h-80">
            <p className="font-display text-3xl">{oferta.canton}</p>
          </div>
        )}
        <p className="mt-5 text-xs font-bold tracking-[0.16em] text-emerald-800 uppercase dark:text-emerald-300">
          {TIPO_LABEL[oferta.tipo]} · {oferta.canton}
        </p>
        <h1 className="font-display mt-2 text-3xl tracking-tight text-stone-900 sm:text-4xl dark:text-stone-50">
          {oferta.titulo}
        </h1>
        <p className="mt-2 text-base text-stone-700 dark:text-stone-200">
          {oferta.operador} · {oferta.lugar}
        </p>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-600 dark:text-stone-300">
          {oferta.descripcion}
        </p>
        <p className="mt-4 text-sm font-semibold text-stone-800 dark:text-stone-100">
          {oferta.precio}
        </p>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-500 dark:text-stone-400">
          El lugar, la foto y el precio viven en la aplicación: cambian y no
          son la prueba. La prueba es el historial de al lado.
        </p>
        <Link
          href={`/oferta/${oferta.id}/reservar`}
          className="mt-6 inline-flex rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
        >
          Reservar con {oferta.operador}
        </Link>
      </div>

      <section aria-labelledby="historial">
        <h2
          id="historial"
          className="font-display text-2xl tracking-tight text-stone-900 dark:text-stone-50"
        >
          Servicios confirmados
        </h2>
        <p className="mt-2 mb-4 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
          Cada línea dice qué se ofreció, quién lo dio y que un visitante
          confirmó que ocurrió. No hay forma de editarla ni de borrarla.
        </p>
        <Historial lineas={lineas} />
      </section>
    </article>
  );
}
