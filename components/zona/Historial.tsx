import type { LineaHistorial } from "@/lib/zona/tipos";
import { truncatePublicKey } from "@/lib/utils";

function fechaLegible(fecha: string) {
  const [year, month, day] = fecha.split("-").map(Number);
  if (!year || !month || !day) return fecha;
  return new Intl.DateTimeFormat("es-CR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function cuentaLegible(cuenta: string | null) {
  if (!cuenta) return "sin cuenta en esta demostración";
  return truncatePublicKey(cuenta);
}

export function Historial({ lineas }: { lineas: LineaHistorial[] }) {
  if (lineas.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-stone-900/15 px-4 py-6 text-sm leading-relaxed text-stone-600 dark:border-white/15 dark:text-stone-300">
        Esta ficha todavía no tiene servicios confirmados. Cuando el operador
        marque que lo prestó y el visitante confirme, la línea aparece aquí y
        no se puede corregir.
      </p>
    );
  }

  return (
    <ol className="space-y-3">
      {lineas.map((linea) => (
        <li
          key={linea.id}
          className="rounded-2xl border border-stone-900/8 bg-white/70 px-4 py-4 dark:border-white/10 dark:bg-stone-900/40"
        >
          <p className="text-xs font-bold tracking-[0.14em] text-emerald-800 uppercase dark:text-emerald-300">
            {fechaLegible(linea.fecha)}
          </p>
          <p className="mt-1 font-medium text-stone-900 dark:text-stone-50">
            {linea.queSeOfrecio}
          </p>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
            Lo dio {linea.operador}. Un visitante confirmó que ocurrió.
          </p>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
            {linea.origen === "ejemplo"
              ? "Línea de ejemplo para leer la ficha. No se edita."
              : `Anotada en esta sesión. Operador: ${cuentaLegible(linea.cuentaOperador)}. Visitante: ${cuentaLegible(linea.cuentaTurista)}.`}
          </p>
        </li>
      ))}
    </ol>
  );
}
