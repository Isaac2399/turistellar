"use client";

import { Bath, BedDouble, Pencil, Plus, Shield, Trash2, Users } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import {
  AMENIDAD_ALOJAMIENTO_LABEL,
  formatMoney,
  summarizeCamas,
  TIPO_ALOJAMIENTO_LABEL,
  TIPO_BANO_LABEL,
  type AlojamientoUnidad,
} from "@/lib/mock-merchant-data";

type LodgingCatalogProps = {
  unidades: AlojamientoUnidad[];
  onCreate: () => void;
  onEdit: (unidad: AlojamientoUnidad) => void;
  onDelete: (id: string) => void;
};

export function LodgingCatalog({ unidades, onCreate, onEdit, onDelete }: LodgingCatalogProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Catálogo de habitaciones</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Publica cabañas, glamping y residencias completas con anticipo en USDC.
          </p>
        </div>
        <Button onClick={onCreate}>
          <Plus className="h-4 w-4" /> Agregar nueva habitación / residencia
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {unidades.map((unidad) => {
          const cover = unidad.galeriaUrls[0];
          return (
            <Card key={unidad.id} className="flex flex-col overflow-hidden p-0">
              <div className="relative h-40 bg-emerald-50 dark:bg-emerald-950">
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cover} alt={unidad.nombre} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-emerald-800">
                    <BedDouble className="h-10 w-10" />
                  </div>
                )}
                <div className="absolute left-3 top-3 flex gap-2">
                  <Badge tone="emerald">{TIPO_ALOJAMIENTO_LABEL[unidad.tipo]}</Badge>
                  {unidad.escrowGarantiaActivo ? (
                    <Badge tone="sky">
                      <Shield className="mr-1 h-3 w-3" /> Escrow
                    </Badge>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-1 flex-col space-y-3 p-5">
                <div>
                  <h3 className="font-semibold">{unidad.nombre}</h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{unidad.descripcion}</p>
                </div>
                <p className="flex flex-wrap gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> {unidad.capacidadHuespedes} huéspedes
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <BedDouble className="h-3.5 w-3.5" /> {summarizeCamas(unidad.camas)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Bath className="h-3.5 w-3.5" /> {unidad.numeroBanos}{" "}
                    {TIPO_BANO_LABEL[unidad.tipoBano].toLowerCase()}
                  </span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {unidad.amenidades.map((amenidad) => (
                    <Badge key={amenidad}>{AMENIDAD_ALOJAMIENTO_LABEL[amenidad]}</Badge>
                  ))}
                </div>
                <p className="text-sm">
                  <span className="text-lg font-semibold">{formatMoney(unidad.precioPorNoche)}</span>
                  <span className="text-zinc-500"> / noche</span>
                  <span className="ml-2 text-zinc-500">anticipo {unidad.porcentajeAnticipo}%</span>
                </p>
                {unidad.galeriaUrls.length > 1 ? (
                  <div className="flex gap-2 overflow-x-auto">
                    {unidad.galeriaUrls.slice(1).map((url) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={url}
                        src={url}
                        alt=""
                        className="h-14 w-20 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                ) : null}
                <div className="mt-auto flex gap-2 pt-1">
                  <Button variant="outline" size="sm" onClick={() => onEdit(unidad)}>
                    <Pencil className="h-3.5 w-3.5" /> Editar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(unidad.id)}>
                    <Trash2 className="h-3.5 w-3.5" /> Quitar
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
