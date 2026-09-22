"use client";

import { useState } from "react";
import { newEntityId, type AlojamientoUnidad } from "@/lib/mock-merchant-data";
import { useMerchant } from "../MerchantProvider";
import { LodgingCatalog } from "./LodgingCatalog";
import { LodgingFormDialog } from "./LodgingFormDialog";
import { LodgingOccupancyCalendar } from "./LodgingOccupancyCalendar";
import { LodgingStays } from "./LodgingStays";

const EMPTY_UNIDAD: AlojamientoUnidad = {
  id: "",
  nombre: "",
  descripcion: "",
  tipo: "habitacion_privada",
  capacidadHuespedes: 2,
  camas: [{ tipo: "matrimonial", cantidad: 1 }],
  numeroBanos: 1,
  tipoBano: "privado",
  amenidades: ["wifi", "agua_caliente"],
  galeriaUrls: [],
  precioPorNoche: "0.00",
  porcentajeAnticipo: 30,
  depositoGarantia: "0.00",
  escrowGarantiaActivo: false,
  activo: true,
};

export function LodgingManager() {
  const {
    alojamientos,
    nochesAlojamiento,
    reservasAlojamiento,
    upsertAlojamiento,
    deleteAlojamiento,
    cycleNocheAlojamiento,
    setNocheAlojamiento,
  } = useMerchant();
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [draft, setDraft] = useState<AlojamientoUnidad>(EMPTY_UNIDAD);
  const [formKey, setFormKey] = useState(0);

  function openCreate() {
    setDraft({ ...EMPTY_UNIDAD, id: newEntityId("alo") });
    setIsCreating(true);
    setFormKey((value) => value + 1);
    setOpen(true);
  }

  function openEdit(unidad: AlojamientoUnidad) {
    setDraft(unidad);
    setIsCreating(false);
    setFormKey((value) => value + 1);
    setOpen(true);
  }

  return (
    <div className="space-y-10">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-800">Hospedaje rural</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Alojamiento / Hospedaje</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Publica habitaciones y residencias, controla noches de ocupación y cobra el anticipo en
          Stellar o fiat.
        </p>
      </header>

      <LodgingCatalog
        unidades={alojamientos}
        onCreate={openCreate}
        onEdit={openEdit}
        onDelete={deleteAlojamiento}
      />

      <LodgingOccupancyCalendar
        unidades={alojamientos}
        noches={nochesAlojamiento}
        onCycle={cycleNocheAlojamiento}
        onSetEstado={setNocheAlojamiento}
      />

      <LodgingStays unidades={alojamientos} reservas={reservasAlojamiento} />

      <LodgingFormDialog
        key={formKey}
        open={open}
        isCreating={isCreating}
        draft={draft}
        onChange={setDraft}
        onClose={() => setOpen(false)}
        onSave={(unidad) => {
          upsertAlojamiento(unidad);
          setOpen(false);
        }}
      />
    </div>
  );
}
