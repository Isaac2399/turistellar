"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useZona } from "@/components/zona/ZonaProvider";
import { CANTONES, TIPO_LABEL, type Canton, type TipoServicio } from "@/lib/zona/tipos";

const FILTROS_TIPO: Array<{ id: "todos" | TipoServicio; label: string }> = [
  { id: "todos", label: "Todas" },
  { id: "cama", label: "Cama" },
  { id: "guia", label: "Guía" },
  { id: "comida", label: "Comida" },
];

export function ExplorarZona() {
  const { ofertas, lineasDe } = useZona();
  const [canton, setCanton] = useState<Canton | "">("");
  const [tipo, setTipo] = useState<"todos" | TipoServicio>("todos");

  const visibles = useMemo(() => {
    return ofertas
      .filter((oferta) => (canton ? oferta.canton === canton : true))
      .filter((oferta) => (tipo === "todos" ? true : oferta.tipo === tipo))
      .slice()
      .sort((a, b) => lineasDe(b.id).length - lineasDe(a.id).length);
  }, [ofertas, canton, tipo, lineasDe]);

  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold tracking-[0.16em] text-emerald-800 uppercase dark:text-emerald-300">
          Zona Sur
        </p>
        <h1 className="font-display mt-2 text-3xl tracking-tight text-stone-900 sm:text-4xl dark:text-stone-50">
          Fincas, guías y comedores
        </h1>
        <p className="mt-3 text-base leading-relaxed text-stone-600 dark:text-stone-400">
          La oferta de los seis cantones está en el mismo listado. Abre una
          ficha para leer qué servicios ya se confirmaron, antes de reservar.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <label
            htmlFor="canton"
            className="text-sm font-semibold text-stone-700 dark:text-stone-200"
          >
            Cantón
          </label>
          <select
            id="canton"
            value={canton}
            onChange={(event) => setCanton(event.target.value as Canton | "")}
            className="mt-1 block rounded-2xl border border-stone-900/10 bg-white/80 px-3 py-2 text-sm text-stone-900 dark:border-white/15 dark:bg-stone-900 dark:text-stone-50"
          >
            <option value="">Los seis</option>
            {CANTONES.map((nombre) => (
              <option key={nombre} value={nombre}>
                {nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Tipo de servicio">
          {FILTROS_TIPO.map((filtro) => {
            const activo = tipo === filtro.id;
            return (
              <button
                key={filtro.id}
                type="button"
                aria-pressed={activo}
                onClick={() => setTipo(filtro.id)}
                className={
                  activo
                    ? "rounded-2xl bg-emerald-700 px-3 py-2 text-sm font-semibold text-white"
                    : "rounded-2xl border border-stone-900/10 bg-white/70 px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-emerald-50 dark:border-white/15 dark:bg-white/5 dark:text-stone-100"
                }
              >
                {filtro.label}
              </button>
            );
          })}
        </div>
      </div>

      {visibles.length === 0 ? (
        <p className="text-sm text-stone-600 dark:text-stone-300">
          No hay ofertas con ese filtro. Prueba otro cantón o publica la tuya.
        </p>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2">
          {visibles.map((oferta) => {
            const confirmados = lineasDe(oferta.id).length;
            return (
              <li key={oferta.id}>
                <Link
                  href={`/oferta/${oferta.id}`}
                  className="flex h-full flex-col overflow-hidden rounded-3xl border border-stone-900/8 bg-white/70 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-emerald-700/30 dark:border-white/10 dark:bg-stone-900/40"
                >
                  {oferta.imagen ? (
                    <img
                      src={oferta.imagen}
                      alt=""
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-40 items-end bg-emerald-800/90 px-4 py-4 text-sm font-semibold text-amber-50">
                      {oferta.canton}
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-xs font-bold tracking-[0.14em] text-emerald-800 uppercase dark:text-emerald-300">
                      {TIPO_LABEL[oferta.tipo]} · {oferta.canton}
                    </p>
                    <h2 className="font-display mt-1 text-xl tracking-tight text-stone-900 dark:text-stone-50">
                      {oferta.titulo}
                    </h2>
                    <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
                      {oferta.operador} · {oferta.lugar}
                    </p>
                    <p className="mt-3 text-sm font-semibold text-stone-800 dark:text-stone-100">
                      {confirmados === 0
                        ? "Sin servicios confirmados"
                        : confirmados === 1
                          ? "1 servicio confirmado"
                          : `${confirmados} servicios confirmados`}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
