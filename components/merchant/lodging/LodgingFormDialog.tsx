"use client";

import { useState, type FormEvent } from "react";
import { Button, Dialog, Input, Label, Textarea } from "@/components/ui";
import {
  AMENIDADES_ALOJAMIENTO,
  AMENIDAD_ALOJAMIENTO_LABEL,
  TIPO_ALOJAMIENTO_LABEL,
  TIPO_BANO_LABEL,
  TIPO_CAMA_LABEL,
  type AlojamientoUnidad,
  type AmenidadAlojamiento,
  type PorcentajeAnticipo,
  type TipoAlojamiento,
  type TipoBano,
  type TipoCama,
} from "@/lib/mock-merchant-data";

const ANTICIPOS: PorcentajeAnticipo[] = [30, 50, 100];
const TIPOS = Object.keys(TIPO_ALOJAMIENTO_LABEL) as TipoAlojamiento[];
const CAMAS = Object.keys(TIPO_CAMA_LABEL) as TipoCama[];
const BANOS = Object.keys(TIPO_BANO_LABEL) as TipoBano[];

type LodgingFormDialogProps = {
  open: boolean;
  isCreating: boolean;
  draft: AlojamientoUnidad;
  onChange: (next: AlojamientoUnidad) => void;
  onClose: () => void;
  onSave: (unidad: AlojamientoUnidad) => void;
};

function galleryFromText(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export function LodgingFormDialog({
  open,
  isCreating,
  draft,
  onChange,
  onClose,
  onSave,
}: LodgingFormDialogProps) {
  const [galleryText, setGalleryText] = useState(draft.galeriaUrls.join("\n"));

  function toggleAmenidad(amenidad: AmenidadAlojamiento) {
    const included = draft.amenidades.includes(amenidad);
    onChange({
      ...draft,
      amenidades: included
        ? draft.amenidades.filter((item) => item !== amenidad)
        : [...draft.amenidades, amenidad],
    });
  }

  function setCama(tipo: TipoCama, cantidad: number) {
    const others = draft.camas.filter((item) => item.tipo !== tipo);
    onChange({
      ...draft,
      camas: cantidad > 0 ? [...others, { tipo, cantidad }] : others,
    });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({
      ...draft,
      precioPorNoche: Number(draft.precioPorNoche).toFixed(2),
      depositoGarantia: Number(draft.depositoGarantia).toFixed(2),
      galeriaUrls: galleryFromText(galleryText),
    });
  }

  return (
    <Dialog
      open={open}
      title={isCreating ? "Agregar habitación / residencia" : "Editar alojamiento"}
      description="Publica capacidad, amenidades y estructura de anticipo en USDC."
      onClose={onClose}
      className="max-h-[85vh] max-w-2xl overflow-y-auto"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="alo-nombre">Nombre de la propiedad / habitación</Label>
          <Input
            id="alo-nombre"
            value={draft.nombre}
            onChange={(event) => onChange({ ...draft, nombre: event.target.value })}
            placeholder="Cabaña del Trapiche"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="alo-desc">Descripción</Label>
          <Textarea
            id="alo-desc"
            value={draft.descripcion}
            onChange={(event) => onChange({ ...draft, descripcion: event.target.value })}
            required
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="alo-tipo">Tipo de alojamiento</Label>
            <select
              id="alo-tipo"
              className="h-10 w-full rounded-xl border border-emerald-900/15 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-900"
              value={draft.tipo}
              onChange={(event) =>
                onChange({ ...draft, tipo: event.target.value as TipoAlojamiento })
              }
            >
              {TIPOS.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {TIPO_ALOJAMIENTO_LABEL[tipo]}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="alo-capacidad">Capacidad máxima (huéspedes)</Label>
            <Input
              id="alo-capacidad"
              type="number"
              min={1}
              value={draft.capacidadHuespedes}
              onChange={(event) =>
                onChange({ ...draft, capacidadHuespedes: Number(event.target.value) })
              }
              required
            />
          </div>
        </div>

        <fieldset className="space-y-2 rounded-xl border border-emerald-900/10 p-3 dark:border-white/10">
          <legend className="px-1 text-sm font-medium">Camas</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {CAMAS.map((tipo) => (
              <div key={tipo} className="space-y-1.5">
                <Label htmlFor={`alo-cama-${tipo}`}>{TIPO_CAMA_LABEL[tipo]}</Label>
                <Input
                  id={`alo-cama-${tipo}`}
                  type="number"
                  min={0}
                  value={draft.camas.find((item) => item.tipo === tipo)?.cantidad ?? 0}
                  onChange={(event) => setCama(tipo, Number(event.target.value))}
                />
              </div>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="alo-banos">Número de baños</Label>
            <Input
              id="alo-banos"
              type="number"
              min={0}
              value={draft.numeroBanos}
              onChange={(event) => onChange({ ...draft, numeroBanos: Number(event.target.value) })}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="alo-tipo-bano">Tipo de baño</Label>
            <select
              id="alo-tipo-bano"
              className="h-10 w-full rounded-xl border border-emerald-900/15 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-900"
              value={draft.tipoBano}
              onChange={(event) => onChange({ ...draft, tipoBano: event.target.value as TipoBano })}
            >
              {BANOS.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {TIPO_BANO_LABEL[tipo]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <fieldset className="space-y-2 rounded-xl border border-emerald-900/10 p-3 dark:border-white/10">
          <legend className="px-1 text-sm font-medium">Amenidades incluidas</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {AMENIDADES_ALOJAMIENTO.map((amenidad) => (
              <label key={amenidad} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={draft.amenidades.includes(amenidad)}
                  onChange={() => toggleAmenidad(amenidad)}
                  className="h-4 w-4 rounded border-emerald-900/30 text-emerald-700"
                />
                {AMENIDAD_ALOJAMIENTO_LABEL[amenidad]}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="space-y-1.5">
          <Label htmlFor="alo-galeria">Galería de fotos (una URL por línea)</Label>
          <Textarea
            id="alo-galeria"
            value={galleryText}
            onChange={(event) => setGalleryText(event.target.value)}
            placeholder="https://…"
          />
          {galleryFromText(galleryText).length > 0 ? (
            <div className="flex gap-2 overflow-x-auto pt-1">
              {galleryFromText(galleryText).map((url) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={url}
                  src={url}
                  alt=""
                  className="h-16 w-24 rounded-lg object-cover"
                />
              ))}
            </div>
          ) : null}
        </div>

        <fieldset className="grid gap-3 rounded-xl border border-emerald-900/10 p-3 sm:grid-cols-2 dark:border-white/10">
          <legend className="px-1 text-sm font-medium">Precios y anticipo</legend>
          <div className="space-y-1.5">
            <Label htmlFor="alo-precio">Precio por noche (USD / USDC)</Label>
            <Input
              id="alo-precio"
              type="number"
              min={0}
              step="0.01"
              value={draft.precioPorNoche}
              onChange={(event) => onChange({ ...draft, precioPorNoche: event.target.value })}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="alo-anticipo">% anticipo para reservar</Label>
            <select
              id="alo-anticipo"
              className="h-10 w-full rounded-xl border border-emerald-900/15 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-900"
              value={draft.porcentajeAnticipo}
              onChange={(event) =>
                onChange({
                  ...draft,
                  porcentajeAnticipo: Number(event.target.value) as PorcentajeAnticipo,
                })
              }
            >
              {ANTICIPOS.map((value) => (
                <option key={value} value={value}>
                  {value}%
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="alo-deposito">Depósito de garantía (escrow)</Label>
            <Input
              id="alo-deposito"
              type="number"
              min={0}
              step="0.01"
              value={draft.depositoGarantia}
              onChange={(event) => onChange({ ...draft, depositoGarantia: event.target.value })}
            />
          </div>
          <label className="flex items-center gap-2 self-end pb-2 text-sm">
            <input
              type="checkbox"
              checked={draft.escrowGarantiaActivo}
              onChange={(event) =>
                onChange({ ...draft, escrowGarantiaActivo: event.target.checked })
              }
              className="h-4 w-4 rounded border-emerald-900/30 text-emerald-700"
            />
            Custodia opcional en escrow Stellar
          </label>
        </fieldset>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Guardar alojamiento</Button>
        </div>
      </form>
    </Dialog>
  );
}
