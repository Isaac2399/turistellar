"use client";

import { Wallet } from "lucide-react";
import { useStellarWallet } from "@/hooks/useStellarWallet";
import { truncatePublicKey } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ConnectWalletButton() {
  const {
    isFreighterInstalled,
    isConnected,
    publicKey,
    isLoading,
    connect,
    disconnect,
  } = useStellarWallet();

  if (isConnected && publicKey) {
    return (
      <Button variant="outline" onClick={disconnect} title={publicKey}>
        <Wallet className="mr-2 h-4 w-4" />
        {truncatePublicKey(publicKey)}
      </Button>
    );
  }

  return (
    <Button
      onClick={() => {
        if (!isFreighterInstalled) {
          window.open("https://www.freighter.app", "_blank", "noopener,noreferrer");
          return;
        }
        void connect();
      }}
      disabled={isLoading}
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isFreighterInstalled ? "Conectar Freighter" : "Instalar Freighter"}
    </Button>
  );
}
