import Link from "next/link";

export default function AccesoDenegadoPage() {
  return (
    <section className="mx-auto w-full max-w-xl px-4 py-16">
      <h1 className="text-3xl font-semibold">Vista de comercio restringida</h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        Esta sección solo la pueden ver usuarios logueados con rol de comerciante. El resto de la
        web sigue disponible.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
        >
          Volver al inicio
        </Link>
        <Link
          href="/login"
          className="rounded-full border border-emerald-800/20 px-5 py-2.5 text-sm font-medium hover:bg-emerald-50 dark:hover:bg-emerald-950"
        >
          Iniciar sesión
        </Link>
      </div>
    </section>
  );
}
