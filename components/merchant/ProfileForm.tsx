"use client";

import { useState, type FormEvent } from "react";
import { Check, ImagePlus, MapPin, Phone, Wallet } from "lucide-react";
import { Button, Card, Input, Label, Textarea } from "@/components/ui";
import {
  CATEGORIA_LABEL,
  type CategoriaEmpresa,
  type PerfilEmpresa,
} from "@/lib/mock-merchant-data";
import { truncatePublicKey } from "@/lib/utils";
import { useMerchant } from "./MerchantProvider";

const CATEGORIAS: CategoriaEmpresa[] = ["eco-turismo", "gastronomia", "finca"];

export function ProfileForm() {
  const { perfil, savePerfil } = useMerchant();
  const [form, setForm] = useState<PerfilEmpresa>(perfil);
  const [saved, setSaved] = useState(false);

  function toggleCategoria(categoria: CategoriaEmpresa) {
    setSaved(false);
    setForm((prev) => {
      const selected = prev.categorias.includes(categoria)
        ? prev.categorias.filter((item) => item !== categoria)
        : [...prev.categorias, categoria];
      return { ...prev, categorias: selected };
    });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    savePerfil(form);
    setSaved(true);
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-800">Empresa</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Perfil comercial</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Datos visibles para turistas y la billetera Stellar donde llega el escrow.
        </p>
      </header>

      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <Card className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="nombreComercial">Nombre comercial</Label>
            <Input
              id="nombreComercial"
              value={form.nombreComercial}
              onChange={(event) => {
                setSaved(false);
                setForm((prev) => ({ ...prev, nombreComercial: event.target.value }));
              }}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={form.descripcion}
              onChange={(event) => {
                setSaved(false);
                setForm((prev) => ({ ...prev, descripcion: event.target.value }));
              }}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>Categorías</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIAS.map((categoria) => {
                const active = form.categorias.includes(categoria);
                return (
                  <button
                    key={categoria}
                    type="button"
                    onClick={() => toggleCategoria(categoria)}
                    className={
                      active
                        ? "rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white"
                        : "rounded-full border border-emerald-800/20 px-3 py-1.5 text-xs font-medium"
                    }
                  >
                    {CATEGORIA_LABEL[categoria]}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ubicacion">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> Ubicación
              </span>
            </Label>
            <Input
              id="ubicacion"
              value={form.ubicacion}
              onChange={(event) => {
                setSaved(false);
                setForm((prev) => ({ ...prev, ubicacion: event.target.value }));
              }}
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="whatsapp">
                <span className="inline-flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" /> WhatsApp
                </span>
              </Label>
              <Input
                id="whatsapp"
                value={form.whatsapp}
                onChange={(event) => {
                  setSaved(false);
                  setForm((prev) => ({ ...prev, whatsapp: event.target.value }));
                }}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="logoUrl">
                <span className="inline-flex items-center gap-1">
                  <ImagePlus className="h-3.5 w-3.5" /> Foto / logo (URL)
                </span>
              </Label>
              <Input
                id="logoUrl"
                value={form.logoUrl}
                placeholder="https://…"
                onChange={(event) => {
                  setSaved(false);
                  setForm((prev) => ({ ...prev, logoUrl: event.target.value }));
                }}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="stellarWallet">
              <span className="inline-flex items-center gap-1">
                <Wallet className="h-3.5 w-3.5" /> Billetera Stellar (escrow)
              </span>
            </Label>
            <Input
              id="stellarWallet"
              value={form.stellarWallet}
              onChange={(event) => {
                setSaved(false);
                setForm((prev) => ({ ...prev, stellarWallet: event.target.value }));
              }}
              required
            />
            <p className="text-xs text-zinc-500">
              Vista corta: {truncatePublicKey(form.stellarWallet || "G…", 6)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit">Guardar perfil</Button>
            {saved ? (
              <span className="inline-flex items-center gap-1 text-sm text-emerald-700">
                <Check className="h-4 w-4" /> Cambios aplicados en esta sesión
              </span>
            ) : null}
          </div>
        </Card>

        <Card>
          <div className="flex h-28 items-center justify-center rounded-xl bg-emerald-50 text-4xl dark:bg-emerald-950">
            {form.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.logoUrl}
                alt={`Logo de ${form.nombreComercial}`}
                className="h-full w-full rounded-xl object-cover"
              />
            ) : (
              form.nombreComercial.slice(0, 1)
            )}
          </div>
          <h2 className="mt-4 text-lg font-semibold">{form.nombreComercial}</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{form.ubicacion}</p>
          <p className="mt-3 text-sm">{form.descripcion}</p>
        </Card>
      </form>
    </div>
  );
}
