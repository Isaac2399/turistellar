"use client";

import { useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Badge, Button, Card, Dialog, Input, Label, Textarea } from "@/components/ui";
import {
  formatDuration,
  formatMoney,
  newEntityId,
  type PorcentajeAnticipo,
  type TourComerciante,
} from "@/lib/mock-merchant-data";
import { useMerchant } from "./MerchantProvider";

const ANTICIPOS: PorcentajeAnticipo[] = [30, 50, 100];

const EMPTY_TOUR: TourComerciante = {
  id: "",
  titulo: "",
  descripcion: "",
  duracionMinutos: 120,
  precioPorPersona: "0.00",
  cupoMaximo: 6,
  porcentajeAnticipo: 30,
  activo: true,
};

export function ToursManager() {
  const { tours, upsertTour, deleteTour } = useMerchant();
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [draft, setDraft] = useState<TourComerciante>(EMPTY_TOUR);

  function openCreate() {
    setDraft({ ...EMPTY_TOUR, id: newEntityId("tour") });
    setIsCreating(true);
    setOpen(true);
  }

  function openEdit(tour: TourComerciante) {
    setDraft(tour);
    setIsCreating(false);
    setOpen(true);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    upsertTour({
      ...draft,
      precioPorPersona: Number(draft.precioPorPersona).toFixed(2),
    });
    setOpen(false);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-800">Catálogo</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Tours y experiencias</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Precio por persona, cupo por turno y porcentaje de anticipo en escrow.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Crear nuevo tour
        </Button>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-emerald-900/10 dark:border-white/10">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-emerald-50 text-xs uppercase tracking-wide text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
            <tr>
              <th className="px-4 py-3">Tour</th>
              <th className="px-4 py-3">Duración</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Cupo</th>
              <th className="px-4 py-3">Anticipo</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr key={tour.id} className="border-t border-emerald-900/10 dark:border-white/10">
                <td className="px-4 py-3">
                  <p className="font-medium">{tour.titulo}</p>
                  <p className="max-w-sm text-xs text-zinc-500">{tour.descripcion}</p>
                </td>
                <td className="px-4 py-3">{formatDuration(tour.duracionMinutos)}</td>
                <td className="px-4 py-3">{formatMoney(tour.precioPorPersona)}</td>
                <td className="px-4 py-3">{tour.cupoMaximo}</td>
                <td className="px-4 py-3">
                  <Badge tone="amber">{tour.porcentajeAnticipo}%</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Editar ${tour.titulo}`}
                      onClick={() => openEdit(tour)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Eliminar ${tour.titulo}`}
                      onClick={() => deleteTour(tour.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tours.map((tour) => (
          <Card key={`card-${tour.id}`} className="space-y-3">
            <h2 className="font-semibold">{tour.titulo}</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{tour.descripcion}</p>
            <p className="text-sm">
              {formatDuration(tour.duracionMinutos)} · {formatMoney(tour.precioPorPersona)} · cupo{" "}
              {tour.cupoMaximo}
            </p>
            <Button variant="outline" size="sm" onClick={() => openEdit(tour)}>
              Editar
            </Button>
          </Card>
        ))}
      </div>

      <Dialog
        open={open}
        title={isCreating ? "Crear nuevo tour" : "Editar tour"}
        description="Los cambios se reflejan de inmediato en el dashboard de esta sesión."
        onClose={() => setOpen(false)}
      >
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="tour-titulo">Título</Label>
            <Input
              id="tour-titulo"
              value={draft.titulo}
              onChange={(event) => setDraft((prev) => ({ ...prev, titulo: event.target.value }))}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tour-desc">Descripción</Label>
            <Textarea
              id="tour-desc"
              value={draft.descripcion}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, descripcion: event.target.value }))
              }
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="tour-duracion">Duración (min)</Label>
              <Input
                id="tour-duracion"
                type="number"
                min={30}
                value={draft.duracionMinutos}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, duracionMinutos: Number(event.target.value) }))
                }
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tour-precio">Precio por persona (USDC)</Label>
              <Input
                id="tour-precio"
                type="number"
                min={0}
                step="0.01"
                value={draft.precioPorPersona}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, precioPorPersona: event.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tour-cupo">Cupo máximo</Label>
              <Input
                id="tour-cupo"
                type="number"
                min={1}
                value={draft.cupoMaximo}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, cupoMaximo: Number(event.target.value) }))
                }
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tour-anticipo">% anticipo</Label>
              <select
                id="tour-anticipo"
                className="h-10 w-full rounded-xl border border-emerald-900/15 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-900"
                value={draft.porcentajeAnticipo}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    porcentajeAnticipo: Number(event.target.value) as PorcentajeAnticipo,
                  }))
                }
              >
                {ANTICIPOS.map((value) => (
                  <option key={value} value={value}>
                    {value}%
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar tour</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
