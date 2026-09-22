"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge, Button, Card, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import {
  CICLO_ESTADO_TURNO,
  ESTADO_TURNO_LABEL,
  formatMonthYear,
  type EstadoTurno,
  type TurnoCalendario,
} from "@/lib/mock-merchant-data";
import { cn } from "@/lib/utils";
import { useMerchant } from "./MerchantProvider";

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"] as const;

const TONE: Record<EstadoTurno, "emerald" | "amber" | "rose" | "zinc"> = {
  disponible: "emerald",
  reservado_parcial: "amber",
  lleno: "rose",
  bloqueado: "zinc",
};

const DAY_BG: Record<EstadoTurno, string> = {
  disponible: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100",
  reservado_parcial: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100",
  lleno: "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-100",
  bloqueado: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
};

function toIsoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function monthMatrix(year: number, month: number): (number | null)[][] {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array.from({ length: startOffset }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day);
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }
  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }
  return rows;
}

function dominantEstado(turnos: TurnoCalendario[]): EstadoTurno | null {
  if (turnos.length === 0) return null;
  if (turnos.some((item) => item.estado === "lleno")) return "lleno";
  if (turnos.some((item) => item.estado === "reservado_parcial")) return "reservado_parcial";
  if (turnos.every((item) => item.estado === "bloqueado")) return "bloqueado";
  return "disponible";
}

export function AvailabilityCalendar() {
  const { turnos, tours, cycleTurno, setTurnoEstado } = useMerchant();
  const [cursor, setCursor] = useState(() => new Date(2026, 8, 1));
  const [selectedDate, setSelectedDate] = useState("2026-09-22");

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const rows = useMemo(() => monthMatrix(year, month), [year, month]);

  const byDate = useMemo(() => {
    const map = new Map<string, TurnoCalendario[]>();
    for (const turno of turnos) {
      const list = map.get(turno.fecha) ?? [];
      list.push(turno);
      map.set(turno.fecha, list);
    }
    return map;
  }, [turnos]);

  const selectedTurnos = byDate.get(selectedDate) ?? [];
  const monthLabel = formatMonthYear(year, month);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-800">Operación</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Calendario y disponibilidad</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Elige un día y pulsa un turno para ciclar: Disponible → Parcial → Lleno → Bloqueado.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {CICLO_ESTADO_TURNO.map((estado) => (
          <Badge key={estado} tone={TONE[estado]}>
            {ESTADO_TURNO_LABEL[estado]}
          </Badge>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCursor(new Date(year, month - 1, 1))}
              aria-label="Mes anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h2 className="capitalize text-lg font-semibold">{monthLabel}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCursor(new Date(year, month + 1, 1))}
              aria-label="Mes siguiente"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-zinc-500">
            {WEEKDAYS.map((day) => (
              <div key={day} className="py-1">
                {day}
              </div>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {rows.flat().map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="h-16 rounded-xl" />;
              }
              const iso = toIsoDate(year, month, day);
              const dayTurnos = byDate.get(iso) ?? [];
              const estado = dominantEstado(dayTurnos);
              const selected = iso === selectedDate;
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => setSelectedDate(iso)}
                  className={cn(
                    "flex h-16 flex-col items-center justify-center rounded-xl border text-sm transition-colors",
                    selected
                      ? "border-emerald-700 ring-2 ring-emerald-700/30"
                      : "border-transparent",
                    estado ? DAY_BG[estado] : "bg-zinc-50 dark:bg-zinc-900",
                  )}
                >
                  <span className="font-semibold">{day}</span>
                  {dayTurnos.length > 0 ? (
                    <span className="text-[10px]">
                      {dayTurnos.length} {dayTurnos.length === 1 ? "turno" : "turnos"}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Eventos del {selectedDate}</CardTitle>
            <CardDescription>
              {selectedTurnos.length === 0
                ? "No hay turnos cargados este día."
                : "Clic en un turno para cambiar su estado."}
            </CardDescription>
          </CardHeader>
          <ul className="space-y-3">
            {selectedTurnos.map((turno) => {
              const tour = tours.find((item) => item.id === turno.tourId);
              return (
                <li key={turno.id} className="rounded-xl border border-emerald-900/10 p-3 dark:border-white/10">
                  <button type="button" className="w-full text-left" onClick={() => cycleTurno(turno.id)}>
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium">{turno.hora}</p>
                      <Badge tone={TONE[turno.estado]}>{ESTADO_TURNO_LABEL[turno.estado]}</Badge>
                    </div>
                    <p className="mt-1 text-sm">{tour?.titulo ?? turno.tourId}</p>
                    <p className="text-xs text-zinc-500">
                      {turno.cuposOcupados}/{tour?.cupoMaximo ?? "—"} cupos
                    </p>
                  </button>
                  <div className="mt-2 grid grid-cols-2 gap-1">
                    {CICLO_ESTADO_TURNO.map((estado) => (
                      <Button
                        key={estado}
                        size="sm"
                        variant={turno.estado === estado ? "primary" : "outline"}
                        onClick={() => setTurnoEstado(turno.id, estado)}
                      >
                        {ESTADO_TURNO_LABEL[estado]}
                      </Button>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </div>
  );
}
