"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { useZona } from "@/components/zona/ZonaProvider";
import { CANTONES, type Canton, type TipoServicio } from "@/lib/zona/tipos";

const INICIAL = {
  tipo: "cama" as TipoServicio,
  titulo: "",
  operador: "",
  lugar: "",
  canton: "Pérez Zeledón" as Canton,
  descripcion: "",
  precio: "",
};

export function FormularioPublicar() {
  const { listo, publicar } = useZona();
  const router = useRouter();
  const [form, setForm] = useState(INICIAL);

  if (!listo) {
    return <p className="text-sm text-stone-600">Cargando…</p>;
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const oferta = publicar(form);
    router.push(`/oferta/${oferta.id}`);
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-5">
      <div>
        <p className="text-xs font-bold tracking-[0.16em] text-emerald-800 uppercase dark:text-emerald-300">
          Operador local
        </p>
        <h1 className="font-display mt-2 text-3xl tracking-tight text-stone-900 dark:text-stone-50">
          Publicar lo que ofreces
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
          Lugar y tipo de servicio: cama, guía o comida. Esto llena el listado
          de la Zona Sur. Publicar no toca la red.
        </p>
      </div>

      <Campo label="Tipo" htmlFor="tipo">
        <select
          id="tipo"
          required
          value={form.tipo}
          onChange={(event) =>
            setForm((actual) => ({
              ...actual,
              tipo: event.target.value as TipoServicio,
            }))
          }
          className={campoClase}
        >
          <option value="cama">Cama</option>
          <option value="guia">Guía</option>
          <option value="comida">Comida</option>
        </select>
      </Campo>

      <Campo label="Qué ofreces" htmlFor="titulo">
        <input
          id="titulo"
          required
          value={form.titulo}
          onChange={(event) =>
            setForm((actual) => ({ ...actual, titulo: event.target.value }))
          }
          className={campoClase}
          placeholder="Cuartos en la finca"
        />
      </Campo>

      <Campo label="Tu nombre o el de la familia" htmlFor="operador">
        <input
          id="operador"
          required
          value={form.operador}
          onChange={(event) =>
            setForm((actual) => ({ ...actual, operador: event.target.value }))
          }
          className={campoClase}
        />
      </Campo>

      <Campo label="Lugar" htmlFor="lugar">
        <input
          id="lugar"
          required
          value={form.lugar}
          onChange={(event) =>
            setForm((actual) => ({ ...actual, lugar: event.target.value }))
          }
          className={campoClase}
          placeholder="San Isidro, Dos Brazos, Golfito…"
        />
      </Campo>

      <Campo label="Cantón" htmlFor="canton-publicar">
        <select
          id="canton-publicar"
          required
          value={form.canton}
          onChange={(event) =>
            setForm((actual) => ({
              ...actual,
              canton: event.target.value as Canton,
            }))
          }
          className={campoClase}
        >
          {CANTONES.map((canton) => (
            <option key={canton} value={canton}>
              {canton}
            </option>
          ))}
        </select>
      </Campo>

      <Campo label="Descripción" htmlFor="descripcion">
        <textarea
          id="descripcion"
          required
          rows={4}
          value={form.descripcion}
          onChange={(event) =>
            setForm((actual) => ({ ...actual, descripcion: event.target.value }))
          }
          className={campoClase}
        />
      </Campo>

      <Campo label="Precio de referencia" htmlFor="precio">
        <input
          id="precio"
          required
          value={form.precio}
          onChange={(event) =>
            setForm((actual) => ({ ...actual, precio: event.target.value }))
          }
          className={campoClase}
          placeholder="₡20 000 por noche"
        />
      </Campo>

      <button
        type="submit"
        className="rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
      >
        Publicar en el listado
      </button>
    </form>
  );
}

function Campo({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block space-y-1">
      <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">
        {label}
      </span>
      {children}
    </label>
  );
}

const campoClase =
  "w-full rounded-2xl border border-stone-900/10 bg-white/80 px-3 py-2 text-sm text-stone-900 dark:border-white/15 dark:bg-stone-900 dark:text-stone-50";
