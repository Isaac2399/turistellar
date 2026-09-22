"use client";

/**
 * Freighter browser-extension wallet hook.
 *
 * Freighter only exists in the browser. `isConnected()` reports whether the
 * extension is installed; a non-empty `getAddress()` means this origin already
 * has access. `requestAccess()` prompts the user for the public key.
 *
 * @see https://docs.freighter.app
 */
import { useCallback, useEffect, useState } from "react";
import {
  getAddress,
  getNetwork,
  isConnected,
  requestAccess,
  signTransaction,
} from "@stellar/freighter-api";

export interface StellarWalletState {
  isFreighterInstalled: boolean;
  isConnected: boolean;
  publicKey: string | null;
  network: string | null;
  isLoading: boolean;
  error: string | null;
  connect: () => Promise<string | null>;
  disconnect: () => void;
  signXdr: (xdr: string, networkPassphrase: string) => Promise<string>;
}

export function useStellarWallet(): StellarWalletState {
  const [isFreighterInstalled, setIsFreighterInstalled] = useState(false);
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { isConnected: installed, error: installedError } =
        await isConnected();

      if (installedError || !installed) {
        setIsFreighterInstalled(false);
        setConnected(false);
        setPublicKey(null);
        setNetwork(null);
        return;
      }

      setIsFreighterInstalled(true);

      const { address, error: addressError } = await getAddress();
      if (addressError || !address) {
        setConnected(false);
        setPublicKey(null);
        return;
      }

      const { network: net, error: networkError } = await getNetwork();
      if (networkError) {
        setError(networkError.message);
        return;
      }

      setConnected(true);
      setPublicKey(address);
      setNetwork(net ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wallet check failed");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const connect = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const { isConnected: installed, error: installedError } =
        await isConnected();

      if (installedError || !installed) {
        setIsFreighterInstalled(false);
        throw new Error(
          "Freighter is not installed. Install the extension and retry.",
        );
      }

      setIsFreighterInstalled(true);

      const { address, error: accessError } = await requestAccess();
      if (accessError || !address) {
        throw new Error(accessError?.message ?? "Freighter access was denied");
      }

      const { network: net, error: networkError } = await getNetwork();
      if (networkError) {
        throw new Error(networkError.message);
      }

      setConnected(true);
      setPublicKey(address);
      setNetwork(net ?? null);
      return address;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to connect Freighter";
      setError(message);
      setConnected(false);
      setPublicKey(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setConnected(false);
    setPublicKey(null);
    setNetwork(null);
    setError(null);
  }, []);

  const signXdr = useCallback(
    async (xdr: string, networkPassphrase: string) => {
      if (!connected || !publicKey) {
        throw new Error("Wallet is not connected");
      }

      const { signedTxXdr, error: signError } = await signTransaction(xdr, {
        networkPassphrase,
        address: publicKey,
      });

      if (signError || !signedTxXdr) {
        throw new Error(signError?.message ?? "Transaction signing failed");
      }

      return signedTxXdr;
    },
    [connected, publicKey],
  );

  return {
    isFreighterInstalled,
    isConnected: connected,
    publicKey,
    network,
    isLoading,
    error,
    connect,
    disconnect,
    signXdr,
  };
}
