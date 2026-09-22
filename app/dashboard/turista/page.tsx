import Link from "next/link";

export default function DashboardTuristaPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Dashboard turista</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Planifica el viaje, paga el anticipo y lleva el pasaporte QR al destino.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/explorar"
          className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
        >
          Abrir explorador
        </Link>
        <Link
          href="/tourist/mis-reservas"
          className="rounded-full border border-emerald-800/20 px-5 py-2.5 text-sm font-medium hover:bg-emerald-50 dark:hover:bg-emerald-950"
        >
          Ver pasaportes
        </Link>
      </div>
    </section>
  );
}
