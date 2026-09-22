"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTourist } from "@/components/tourist/TouristProvider";
import { getOfertaById } from "@/lib/mock-data";
import { CategoriaMarkerIcon } from "@/components/tourist/CategoriaMarkerIcon";
import type { AlertaDisponibilidad, ItineraryItem } from "@/types/tourist";

const HOURS: string[] = Array.from({ length: 32 }, (_, i) => {
  const total = 6 * 60 + i * 30;
  const h = String(Math.floor(total / 60)).padStart(2, "0");
  const m = String(total % 60).padStart(2, "0");
  return `${h}:${m}`;
});

function formatSlot(hora: string): string {
  const [h, m] = hora.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(hour12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function ItineraryTimeline() {
  const { items, scheduleItem, updateItem, removeItem } = useTourist();
  const [fecha, setFecha] = useState("2026-09-24");
  const [alerta, setAlerta] = useState<AlertaDisponibilidad | null>(null);

  const unscheduled = items.filter((row) => !row.fecha || !row.hora);
  const dayItems = items.filter((row) => row.fecha === fecha && row.hora);

  const byHour = useMemo(() => {
    const map = new Map<string, ItineraryItem[]>();
    for (const item of dayItems) {
      if (!item.hora) continue;
      const list = map.get(item.hora) ?? [];
      list.push(item);
      map.set(item.hora, list);
    }
    return map;
  }, [dayItems]);

  const applySchedule = (itemId: string, nextFecha: string, hora: string) => {
    const result = scheduleItem(itemId, nextFecha, hora);
    setAlerta(result);
  };

  const acceptSuggestion = () => {
    if (!alerta?.sugerenciaFecha || !alerta.sugerenciaHora) return;
    const item = items.find((row) => row.ofertaId === alerta.ofertaId);
    if (!item) return;
    const result = scheduleItem(item.id, alerta.sugerenciaFecha, alerta.sugerenciaHora);
    setAlerta(result);
    if (alerta.sugerenciaFecha) setFecha(alerta.sugerenciaFecha);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <Label htmlFor="agenda-fecha">Día del viaje</Label>
          <Input
            id="agenda-fecha"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="mt-1 w-48"
          />
        </div>
        <p className="text-sm text-zinc-500">
          Arrastra una experiencia a una hora exacta, o selecciona el turno en la bandeja.
        </p>
      </div>

      {alerta ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="inline-flex items-start gap-2 font-medium">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            {alerta.mensaje}
          </p>
          {alerta.sugerenciaFecha && alerta.sugerenciaHora ? (
            <p>
              Siguiente turno disponible:{" "}
              <strong>
                {alerta.sugerenciaFecha} · {formatSlot(alerta.sugerenciaHora)}
              </strong>
            </p>
          ) : (
            <p>No hay otro turno libre en los próximos días de catálogo.</p>
          )}
          <div className="flex flex-wrap gap-2">
            {alerta.sugerenciaFecha && alerta.sugerenciaHora ? (
              <Button size="sm" onClick={acceptSuggestion}>
                Usar siguiente turno
              </Button>
            ) : null}
            <Button size="sm" variant="ghost" onClick={() => setAlerta(null)}>
              Cerrar
            </Button>
          </div>
        </div>
      ) : items.every((row) => row.fecha && row.hora) && items.length > 0 ? (
        <p className="inline-flex items-center gap-2 text-sm text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4" />
          Todas las experiencias tienen hora asignada.
        </p>
      ) : null}

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-800">
          Bandeja (sin hora)
        </h2>
        {unscheduled.length === 0 ? (
          <p className="text-sm text-zinc-500">Nada pendiente de agendar.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {unscheduled.map((item) => (
              <TrayCard
                key={item.id}
                item={item}
                fecha={fecha}
                onSchedule={(hora) => applySchedule(item.id, fecha, hora)}
                onNoches={(noches) => setAlerta(updateItem(item.id, { noches }))}
              />
            ))}
          </ul>
        )}
      </section>

      <section className="overflow-hidden rounded-2xl border border-emerald-900/10 dark:border-white/10">
        <div className="border-b border-emerald-900/10 bg-emerald-50 px-4 py-2 text-sm font-medium dark:border-white/10 dark:bg-emerald-950/40">
          Timeline · {fecha}
        </div>
        <ol>
          {HOURS.map((hora) => {
            const slotItems = byHour.get(hora) ?? [];
            return (
              <li
                key={hora}
                className="grid grid-cols-[6.5rem_1fr] border-b border-emerald-900/5 last:border-0 dark:border-white/5"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const itemId = e.dataTransfer.getData("text/item-id");
                  if (itemId) applySchedule(itemId, fecha, hora);
                }}
              >
                <div className="bg-zinc-50 px-3 py-3 text-xs font-medium text-zinc-500 dark:bg-zinc-900">
                  {formatSlot(hora)}
                </div>
                <div className="min-h-[3.25rem] space-y-2 p-2">
                  {slotItems.length === 0 ? (
                    <p className="text-xs text-zinc-400">Soltar aquí</p>
                  ) : (
                    slotItems.map((item) => {
                      const oferta = getOfertaById(item.ofertaId);
                      if (!oferta) return null;
                      return (
                        <div
                          key={item.id}
                          draggable
                          onDragStart={(e) => e.dataTransfer.setData("text/item-id", item.id)}
                          className="flex items-center justify-between gap-2 rounded-xl bg-emerald-700/10 px-3 py-2 text-sm"
                        >
                          <span className="inline-flex items-center gap-2">
                            <CategoriaMarkerIcon categoria={oferta.categoria} className="h-4 w-4" />
                            <span>
                              <span className="font-medium">{oferta.titulo}</span>
                              <span className="block text-xs text-zinc-500">
                                {oferta.empresa}
                                {oferta.duracionMinutos
                                  ? ` · ${oferta.duracionMinutos} min`
                                  : ""}
                              </span>
                            </span>
                          </span>
                          <button
                            type="button"
                            className="text-xs text-zinc-500 hover:text-rose-600"
                            onClick={() => removeItem(item.id)}
                          >
                            Quitar
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/checkout"
          className="inline-flex rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
        >
          Continuar a checkout
        </Link>
        <Link
          href="/explorar/mapa"
          className="inline-flex rounded-full border border-emerald-800/20 px-5 py-2.5 text-sm font-medium hover:bg-emerald-50 dark:hover:bg-emerald-950"
        >
          Ver puntos en el mapa
        </Link>
      </div>
    </div>
  );
}

function TrayCard({
  item,
  fecha,
  onSchedule,
  onNoches,
}: {
  item: ItineraryItem;
  fecha: string;
  onSchedule: (hora: string) => void;
  onNoches: (noches: number) => void;
}) {
  const oferta = getOfertaById(item.ofertaId);
  if (!oferta) return null;
  const turnosDelDia = oferta.turnos.filter((t) => t.fecha === fecha);

  return (
    <li
      draggable
      onDragStart={(e) => e.dataTransfer.setData("text/item-id", item.id)}
      className="w-64 cursor-grab rounded-2xl border border-emerald-900/10 bg-white p-3 text-sm dark:border-white/10 dark:bg-zinc-950"
    >
      <p className="inline-flex items-center gap-1.5 font-medium">
        <CategoriaMarkerIcon categoria={oferta.categoria} className="h-4 w-4" />
        {oferta.titulo}
      </p>
      {oferta.categoria === "alojamiento" ? (
        <label className="mt-2 block text-xs text-zinc-500">
          Noches
          <Input
            type="number"
            min={1}
            max={14}
            value={item.noches}
            onChange={(e) => onNoches(Number(e.target.value) || 1)}
            className="mt-1 h-8"
          />
        </label>
      ) : null}
      <label className="mt-2 block text-xs text-zinc-500">
        Hora sugerida
        <select
          className="mt-1 h-8 w-full rounded-xl border border-emerald-900/15 bg-white px-2 text-sm dark:border-white/10 dark:bg-zinc-900"
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) onSchedule(e.target.value);
          }}
        >
          <option value="">Elegir turno…</option>
          {(turnosDelDia.length > 0
            ? turnosDelDia.map((t) => t.hora)
            : HOURS.filter((h) => h.endsWith(":00") || h.endsWith(":30")).slice(0, 12)
          ).map((hora) => (
            <option key={hora} value={hora}>
              {formatSlot(hora)}
            </option>
          ))}
        </select>
      </label>
    </li>
  );
}
