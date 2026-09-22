/**
 * Soroban helpers — contract client wiring will live here once Rust contracts
 * in `/contracts` are deployed to Testnet.
 */
import { NETWORK_PASSPHRASE, sorobanRpc, stellarConfig } from "@/lib/stellar";

export const soroban = {
  rpc: sorobanRpc,
  networkPassphrase: NETWORK_PASSPHRASE,
  escrowContractId: process.env.NEXT_PUBLIC_SOROBAN_ESCROW_CONTRACT_ID ?? "",
  marketplaceContractId:
    process.env.NEXT_PUBLIC_SOROBAN_MARKETPLACE_CONTRACT_ID ?? "",
  horizonUrl: stellarConfig.horizonUrl,
};

export function hasEscrowContract(): boolean {
  return Boolean(soroban.escrowContractId);
}
