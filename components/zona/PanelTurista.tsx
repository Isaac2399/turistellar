"use client";

import Link from "next/link";
import { AccionFirma } from "@/components/zona/AccionFirma";
import { useZona } from "@/components/zona/ZonaProvider";

function fechaLegible(fecha: string) {
  const [year, month, day] = fecha.split("-").map(Number);
  if (!year || !month || !day) return fecha;
  return new Intl.DateTimeFormat("es-CR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

export function PanelTurista() {
  const { listo, reservas, ofertaPorId, confirmarServicio } = useZona();
  if (!listo) {
    return <p className="text-sm text-stone-600">Cargando…</p>;
  }
  const porConfirmar = reservas.filter((reserva) => reserva.estado === "prestado");
  const resto = reservas.filter((reserva) => reserva.estado !== "prestado");

  return (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <p className="text-xs font-bold tracking-[0.16em] text-emerald-800 uppercase dark:text-emerald-300">
          Visitante
        </p>
        <h1 className="font-display mt-2 text-3xl tracking-tight text-stone-900 dark:text-stone-50">
          Tus reservas
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
          Cuando el operador ya marcó el servicio, confírmalo con tu cuenta.
          Desde ese momento la ficha muestra la línea y esta pantalla no ofrece
          corregirla.
        </p>
      </div>

      {reservas.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-stone-900/15 px-4 py-6 text-sm text-stone-600 dark:border-white/15 dark:text-stone-300">
          Todavía no hay reservas. Elige una ficha en{" "}
          <Link href="/explorar" className="font-semibold text-emerald-800 dark:text-emerald-300">
            Explorar
          </Link>
          .
        </p>
      ) : null}

      {porConfirmar.length > 0 ? (
        <ul className="space-y-4">
          {porConfirmar.map((reserva) => {
            const oferta = ofertaPorId(reserva.ofertaId);
            if (!oferta) return null;
            return (
              <li
                key={reserva.id}
                className="space-y-3 rounded-3xl border border-stone-900/8 bg-white/70 p-4 dark:border-white/10 dark:bg-stone-900/40"
              >
                <div>
                  <p className="font-medium text-stone-900 dark:text-stone-50">
                    {oferta.titulo}
                  </p>
                  <p className="text-sm text-stone-600 dark:text-stone-300">
                    {oferta.operador} ya marcó el servicio del{" "}
                    {fechaLegible(reserva.fecha)}.
                  </p>
                </div>
                <AccionFirma
                  etiqueta="Confirmo que ocurrió"
                  onConfirmar={(cuenta) => confirmarServicio(reserva.id, cuenta)}
                />
              </li>
            );
          })}
        </ul>
      ) : null}

      {resto.length > 0 ? (
        <section>
          <h2 className="font-display text-2xl text-stone-900 dark:text-stone-50">
            El resto
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-stone-700 dark:text-stone-200">
            {resto.map((reserva) => {
              const oferta = ofertaPorId(reserva.ofertaId);
              if (!oferta) return null;
              return (
                <li key={reserva.id}>
                  {oferta.titulo} · {reserva.nombreTurista} ·{" "}
                  {fechaLegible(reserva.fecha)} ·{" "}
                  {reserva.estado === "reservada"
                    ? "falta que el operador marque que lo prestó"
                    : "confirmada, ya está en la ficha"}
                  {" · "}
                  <Link
                    href={`/oferta/${oferta.id}`}
                    className="font-semibold text-emerald-800 dark:text-emerald-300"
                  >
                    ver ficha
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
