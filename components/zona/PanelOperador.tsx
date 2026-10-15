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

export function PanelOperador() {
  const { listo, reservas, ofertaPorId, marcarPrestado } = useZona();
  if (!listo) {
    return <p className="text-sm text-stone-600">Cargando…</p>;
  }
  const pendientes = reservas.filter((reserva) => reserva.estado === "reservada");
  const marcadas = reservas.filter((reserva) => reserva.estado !== "reservada");

  return (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <p className="text-xs font-bold tracking-[0.16em] text-emerald-800 uppercase dark:text-emerald-300">
          Operador local
        </p>
        <h1 className="font-display mt-2 text-3xl tracking-tight text-stone-900 dark:text-stone-50">
          Marcar que el servicio se prestó
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
          El día de la visita, quien dio la cama, el recorrido o la comida marca
          que ya ocurrió y asocia su cuenta. Falta que el visitante confirme
          para que la línea quede en la ficha.
        </p>
      </div>

      {pendientes.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-stone-900/15 px-4 py-6 text-sm text-stone-600 dark:border-white/15 dark:text-stone-300">
          No hay reservas esperando tu marca. Cuando alguien reserve desde una
          ficha, aparece aquí.
        </p>
      ) : (
        <ul className="space-y-4">
          {pendientes.map((reserva) => {
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
                    {oferta.operador} · {fechaLegible(reserva.fecha)} · reserva de{" "}
                    {reserva.nombreTurista}
                  </p>
                </div>
                <AccionFirma
                  etiqueta="Firmé que lo presté"
                  onConfirmar={(cuenta) => marcarPrestado(reserva.id, cuenta)}
                />
              </li>
            );
          })}
        </ul>
      )}

      {marcadas.length > 0 ? (
        <section className="space-y-3">
          <h2 className="font-display text-2xl text-stone-900 dark:text-stone-50">
            Ya marcadas
          </h2>
          <ul className="space-y-2 text-sm text-stone-700 dark:text-stone-200">
            {marcadas.map((reserva) => {
              const oferta = ofertaPorId(reserva.ofertaId);
              if (!oferta) return null;
              return (
                <li key={reserva.id}>
                  {oferta.titulo} · {fechaLegible(reserva.fecha)} ·{" "}
                  {reserva.estado === "prestado"
                    ? "falta la confirmación del visitante"
                    : "quedó en la ficha"}
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
