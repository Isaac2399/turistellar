"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge, Button, Card, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import {
  CICLO_ESTADO_NOCHE,
  ESTADO_NOCHE_LABEL,
  formatMonthYear,
  type AlojamientoUnidad,
  type EstadoNocheAlojamiento,
  type NocheOcupacion,
} from "@/lib/mock-merchant-data";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"] as const;

const TONE: Record<EstadoNocheAlojamiento, "emerald" | "amber" | "zinc"> = {
  disponible: "emerald",
  reservada_anticipo: "amber",
  bloqueada: "zinc",
};

const DAY_BG: Record<EstadoNocheAlojamiento, string> = {
  disponible: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100",
  reservada_anticipo: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100",
  bloqueada: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
};

type LodgingOccupancyCalendarProps = {
  unidades: AlojamientoUnidad[];
  noches: NocheOcupacion[];
  onCycle: (unidadId: string, fecha: string) => void;
  onSetEstado: (unidadId: string, fecha: string, estado: EstadoNocheAlojamiento) => void;
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

export function LodgingOccupancyCalendar({
  unidades,
  noches,
  onCycle,
  onSetEstado,
}: LodgingOccupancyCalendarProps) {
  const [cursor, setCursor] = useState(() => new Date(2026, 8, 1));
  const [selectedDate, setSelectedDate] = useState("2026-09-22");
  const [unidadId, setUnidadId] = useState(unidades[0]?.id ?? "");

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const rows = useMemo(() => monthMatrix(year, month), [year, month]);
  const selectedUnidad = unidades.find((item) => item.id === unidadId) ?? unidades[0];

  const estadoByDate = useMemo(() => {
    const map = new Map<string, EstadoNocheAlojamiento>();
    for (const noche of noches) {
      if (noche.unidadId === selectedUnidad?.id) {
        map.set(noche.fecha, noche.estado);
      }
    }
    return map;
  }, [noches, selectedUnidad?.id]);

  const selectedEstado = estadoByDate.get(selectedDate) ?? "disponible";
  const monthLabel = formatMonthYear(year, month);

  if (!selectedUnidad) {
    return (
      <Card>
        <p className="text-sm text-zinc-500">Registra una habitación para ver el calendario.</p>
      </Card>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Calendario de ocupación</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Bloque check-in / check-out por unidad. Pulsa una noche para ciclar su estado.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {unidades.map((unidad) => (
          <Button
            key={unidad.id}
            size="sm"
            variant={unidad.id === selectedUnidad.id ? "primary" : "outline"}
            onClick={() => setUnidadId(unidad.id)}
          >
            {unidad.nombre}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {CICLO_ESTADO_NOCHE.map((estado) => (
          <Badge key={estado} tone={TONE[estado]}>
            {ESTADO_NOCHE_LABEL[estado]}
          </Badge>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
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
            <h3 className="capitalize text-lg font-semibold">{monthLabel}</h3>
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
              const estado = estadoByDate.get(iso) ?? "disponible";
              const selected = iso === selectedDate;
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => {
                    if (iso === selectedDate) {
                      onCycle(selectedUnidad.id, iso);
                    } else {
                      setSelectedDate(iso);
                    }
                  }}
                  className={cn(
                    "flex h-16 flex-col items-center justify-center rounded-xl border text-sm transition-colors",
                    selected ? "border-emerald-700 ring-2 ring-emerald-700/30" : "border-transparent",
                    DAY_BG[estado],
                  )}
                >
                  <span className="font-semibold">{day}</span>
                  <span className="px-1 text-[10px] leading-tight">
                    {estado === "reservada_anticipo"
                      ? "Reservada"
                      : estado === "bloqueada"
                        ? "Bloqueada"
                        : "Libre"}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {selectedUnidad.nombre} · {selectedDate}
            </CardTitle>
            <CardDescription>
              Check-in desde las 15:00 · Check-out hasta las 11:00. Marca el estado de esta noche.
            </CardDescription>
          </CardHeader>
          <Badge tone={TONE[selectedEstado]}>{ESTADO_NOCHE_LABEL[selectedEstado]}</Badge>
          <div className="mt-3 grid gap-1">
            {CICLO_ESTADO_NOCHE.map((estado) => (
              <Button
                key={estado}
                size="sm"
                variant={selectedEstado === estado ? "primary" : "outline"}
                onClick={() => onSetEstado(selectedUnidad.id, selectedDate, estado)}
              >
                {ESTADO_NOCHE_LABEL[estado]}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
