import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-16">
      <section className="max-w-2xl space-y-4">
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-800">
          Web2.5 · Stellar Testnet
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Hub de Turismo Rural y Comercio Local
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Reserva tours y preordena productos de agricultores y comerciantes
          locales en un solo paquete. Pagos con XLM o USDC, con rampa fiat lista
          para conectar.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/explorar"
            className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
          >
            Explorar y planificar
          </Link>
          <Link
            href="/explorar/mapa"
            className="rounded-full border border-emerald-800/20 px-5 py-2.5 text-sm font-medium hover:bg-emerald-50 dark:hover:bg-emerald-950"
          >
            Ver mapa rural
          </Link>
        </div>
      </section>
    </div>
  );
}
