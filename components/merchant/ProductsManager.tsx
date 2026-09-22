"use client";

import { useState, type FormEvent } from "react";
import { Clock, Pencil, Plus, Trash2 } from "lucide-react";
import { Badge, Button, Card, Dialog, Input, Label, Textarea } from "@/components/ui";
import { formatMoney, newEntityId, type ProductoArtesanal } from "@/lib/mock-merchant-data";
import { useMerchant } from "./MerchantProvider";

const EMPTY_PRODUCTO: ProductoArtesanal = {
  id: "",
  nombre: "",
  descripcion: "",
  precio: "0.00",
  stock: 0,
  imagenUrl: "",
  diasPreorden: 0,
  activo: true,
};

export function ProductsManager() {
  const { productos, upsertProducto, deleteProducto } = useMerchant();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ProductoArtesanal>(EMPTY_PRODUCTO);

  function openCreate() {
    setDraft({ ...EMPTY_PRODUCTO, id: newEntityId("prod") });
    setOpen(true);
  }

  function openEdit(producto: ProductoArtesanal) {
    setDraft(producto);
    setOpen(true);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    upsertProducto({
      ...draft,
      precio: Number(draft.precio).toFixed(2),
    });
    setOpen(false);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-800">Catálogo</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Productos artesanales</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            El turista puede añadirlos a la reserva. Controla stock y días de preorden.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Crear producto
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {productos.map((producto) => (
          <Card key={producto.id} className="flex flex-col">
            <div className="mb-4 flex h-28 items-center justify-center rounded-xl bg-amber-50 text-3xl dark:bg-amber-950">
              {producto.imagenUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={producto.imagenUrl}
                  alt={producto.nombre}
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                producto.nombre.slice(0, 1)
              )}
            </div>
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-semibold">{producto.nombre}</h2>
              {producto.stock <= 5 ? <Badge tone="rose">Stock bajo</Badge> : <Badge tone="emerald">En stock</Badge>}
            </div>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{producto.descripcion}</p>
            <p className="mt-3 text-lg font-semibold">{formatMoney(producto.precio)}</p>
            <p className="text-sm text-zinc-500">
              {producto.stock} uds.
              {producto.diasPreorden > 0 ? (
                <span className="ml-2 inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {producto.diasPreorden} días de preorden
                </span>
              ) : (
                <span className="ml-2">Listo para llevar</span>
              )}
            </p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => openEdit(producto)}>
                <Pencil className="h-3.5 w-3.5" /> Editar
              </Button>
              <Button variant="ghost" size="sm" onClick={() => deleteProducto(producto.id)}>
                <Trash2 className="h-3.5 w-3.5" /> Quitar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog
        open={open}
        title={draft.nombre ? "Editar producto" : "Nuevo producto"}
        onClose={() => setOpen(false)}
      >
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="prod-nombre">Nombre</Label>
            <Input
              id="prod-nombre"
              value={draft.nombre}
              onChange={(event) => setDraft((prev) => ({ ...prev, nombre: event.target.value }))}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="prod-desc">Descripción</Label>
            <Textarea
              id="prod-desc"
              value={draft.descripcion}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, descripcion: event.target.value }))
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="prod-precio">Precio (USDC)</Label>
              <Input
                id="prod-precio"
                type="number"
                min={0}
                step="0.01"
                value={draft.precio}
                onChange={(event) => setDraft((prev) => ({ ...prev, precio: event.target.value }))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prod-stock">Stock disponible</Label>
              <Input
                id="prod-stock"
                type="number"
                min={0}
                value={draft.stock}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, stock: Number(event.target.value) }))
                }
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prod-img">Imagen (URL)</Label>
              <Input
                id="prod-img"
                value={draft.imagenUrl}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, imagenUrl: event.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prod-preorden">Días de preorden</Label>
              <Input
                id="prod-preorden"
                type="number"
                min={0}
                value={draft.diasPreorden}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, diasPreorden: Number(event.target.value) }))
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar producto</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
