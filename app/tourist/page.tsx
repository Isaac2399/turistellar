import Link from "next/link";

export default function TouristHubPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Módulo del turista</h1>
      <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
        Planifica el corredor rural: explora, conecta puntos en el mapa, agenda horas y
        paga el anticipo.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/explorar"
          className="rounded-2xl border border-emerald-900/10 p-5 hover:bg-emerald-50 dark:border-white/10 dark:hover:bg-emerald-950"
        >
          <h2 className="font-semibold">Explorar</h2>
          <p className="mt-1 text-sm text-zinc-500">Alojamiento, tours y productos.</p>
        </Link>
        <Link
          href="/tourist/mis-reservas"
          className="rounded-2xl border border-emerald-900/10 p-5 hover:bg-emerald-50 dark:border-white/10 dark:hover:bg-emerald-950"
        >
          <h2 className="font-semibold">Mis reservas</h2>
          <p className="mt-1 text-sm text-zinc-500">Pasaporte digital y QR de ingreso.</p>
        </Link>
      </div>
    </section>
  );
}
