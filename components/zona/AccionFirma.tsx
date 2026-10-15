"use client";

import { useState } from "react";
import { getNetwork } from "@stellar/freighter-api";
import { useStellarWallet } from "@/hooks/useStellarWallet";

interface AccionFirmaProps {
  etiqueta: string;
  onConfirmar: (cuenta: string | null) => void;
}

export function AccionFirma({ etiqueta, onConfirmar }: AccionFirmaProps) {
  const wallet = useStellarWallet();
  const [aviso, setAviso] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);

  async function firmarConCuenta() {
    setAviso(null);
    setOcupado(true);
    try {
      const cuenta = wallet.isConnected
        ? wallet.publicKey
        : await wallet.connect();
      if (!cuenta) {
        setAviso("No se pudo usar Freighter. Puedes seguir la demostración sin cuenta.");
        return;
      }

      const { network, error } = await getNetwork();
      if (error) {
        setAviso(error.message);
        return;
      }
      if (network !== "TESTNET") {
        setAviso("Cambia Freighter a Testnet. Esta confirmación no se asocia a otra red.");
        return;
      }

      onConfirmar(cuenta);
    } finally {
      setOcupado(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void firmarConCuenta()}
          disabled={ocupado || wallet.isLoading}
          className="rounded-2xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60"
        >
          {etiqueta}
        </button>
        <button
          type="button"
          onClick={() => onConfirmar(null)}
          className="rounded-2xl border border-stone-900/10 bg-white/70 px-4 py-2 text-sm font-semibold text-stone-800 hover:bg-emerald-50 dark:border-white/15 dark:bg-white/5 dark:text-stone-100"
        >
          Seguir sin billetera
        </button>
      </div>
      {aviso ? <p className="text-sm text-rose-700 dark:text-rose-300">{aviso}</p> : null}
      <p className="text-xs leading-relaxed text-stone-500 dark:text-stone-400">
        La cuenta identifica a quien confirma. El contrato que guarda la línea
        se escribe la próxima semana, así que hoy la ficha la muestra en este
        navegador.
      </p>
    </div>
  );
}
