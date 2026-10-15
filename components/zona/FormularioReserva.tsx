"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useZona } from "@/components/zona/ZonaProvider";

export function FormularioReserva({ ofertaId }: { ofertaId: string }) {
  const { listo, ofertaPorId, reservar } = useZona();
  const router = useRouter();
  const oferta = ofertaPorId(ofertaId);
  const [fecha, setFecha] = useState("");
  const [nombre, setNombre] = useState("");

  if (!listo) {
    return <p className="text-sm text-stone-600">Cargando…</p>;
  }

  if (!oferta) {
    return (
      <div className="space-y-3">
        <h1 className="font-display text-3xl text-stone-900 dark:text-stone-50">
          No encuentro esa oferta
        </h1>
        <Link href="/explorar" className="text-sm font-semibold text-emerald-800">
          Volver al listado
        </Link>
      </div>
    );
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const reserva = reservar({
      ofertaId,
      fecha,
      nombreTurista: nombre,
    });
    if (!reserva) return;
    router.push("/mis-reservas");
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-5">
      <div>
        <p className="text-xs font-bold tracking-[0.16em] text-emerald-800 uppercase dark:text-emerald-300">
          Reserva
        </p>
        <h1 className="font-display mt-2 text-3xl tracking-tight text-stone-900 dark:text-stone-50">
          Reservar con {oferta.operador}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
          La reserva queda asociada a la ficha de {oferta.titulo}, en{" "}
          {oferta.lugar}. Reservar no toca la red: la firma entra cuando el
          servicio ya ocurrió.
        </p>
      </div>

      <label htmlFor="nombre" className="block space-y-1">
        <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">
          Tu nombre
        </span>
        <input
          id="nombre"
          required
          value={nombre}
          onChange={(event) => setNombre(event.target.value)}
          className="w-full rounded-2xl border border-stone-900/10 bg-white/80 px-3 py-2 text-sm dark:border-white/15 dark:bg-stone-900"
        />
      </label>

      <label htmlFor="fecha" className="block space-y-1">
        <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">
          Fecha del servicio
        </span>
        <input
          id="fecha"
          type="date"
          required
          value={fecha}
          onChange={(event) => setFecha(event.target.value)}
          className="w-full rounded-2xl border border-stone-900/10 bg-white/80 px-3 py-2 text-sm dark:border-white/15 dark:bg-stone-900"
        />
      </label>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
        >
          Dejar la reserva
        </button>
        <Link
          href={`/oferta/${oferta.id}`}
          className="rounded-2xl border border-stone-900/10 px-5 py-3 text-sm font-semibold text-stone-800 dark:border-white/15 dark:text-stone-100"
        >
          Volver a la ficha
        </Link>
      </div>
    </form>
  );
}
