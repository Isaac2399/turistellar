/**
 * Stellar classic (Horizon) + Soroban RPC client configuration.
 *
 * Official Testnet endpoints (as of Stellar docs / networks page):
 * - Horizon: https://horizon-testnet.stellar.org
 * - RPC:     https://soroban-testnet.stellar.org
 * - Passphrase: "Test SDF Network ; September 2015" (`Networks.TESTNET`)
 *
 * Mainnet RPC is provider-specific; do not hardcode it.
 * @see https://developers.stellar.org/docs/networks
 */
import * as StellarSdk from "@stellar/stellar-sdk";

export type StellarNetworkName = "testnet" | "mainnet";

export interface StellarNetworkConfig {
  network: StellarNetworkName;
  horizonUrl: string;
  rpcUrl: string;
  networkPassphrase: string;
  friendbotUrl: string | null;
}

function envOr(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value ? value : fallback;
}

const requireEnv = (name: string): string => {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
};

function resolveNetwork(value: string | undefined): StellarNetworkName {
  const network = value?.trim().toLowerCase() ?? "";
  if (network === "" || network === "testnet") return "testnet";
  if (network === "mainnet") return "mainnet";
  throw new Error(`Unknown Stellar network: ${value}`);
}

function getConfig(network: StellarNetworkName): StellarNetworkConfig {
  switch (network) {
    case "testnet":
      return {
        network: "testnet",
        horizonUrl: envOr(
          "NEXT_PUBLIC_STELLAR_HORIZON_URL",
          "https://horizon-testnet.stellar.org",
        ),
        rpcUrl: envOr(
          "NEXT_PUBLIC_STELLAR_RPC_URL",
          "https://soroban-testnet.stellar.org",
        ),
        networkPassphrase: envOr(
          "NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE",
          StellarSdk.Networks.TESTNET,
        ),
        friendbotUrl: envOr(
          "NEXT_PUBLIC_STELLAR_FRIENDBOT_URL",
          "https://friendbot.stellar.org",
        ),
      };
    case "mainnet":
      return {
        network: "mainnet",
        horizonUrl: envOr(
          "NEXT_PUBLIC_STELLAR_HORIZON_URL",
          "https://horizon.stellar.org",
        ),
        rpcUrl: requireEnv("NEXT_PUBLIC_STELLAR_MAINNET_RPC_URL"),
        networkPassphrase: envOr(
          "NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE",
          StellarSdk.Networks.PUBLIC,
        ),
        friendbotUrl: null,
      };
  }
}

export const STELLAR_NETWORK = resolveNetwork(
  process.env.NEXT_PUBLIC_STELLAR_NETWORK,
);

export const stellarConfig = getConfig(STELLAR_NETWORK);

/** Horizon REST client — accounts, balances, classic payments. */
export const horizon = new StellarSdk.Horizon.Server(stellarConfig.horizonUrl);

/** Soroban JSON-RPC client — simulate / send contract invocations. */
export const sorobanRpc = new StellarSdk.rpc.Server(stellarConfig.rpcUrl);

export const NETWORK_PASSPHRASE = stellarConfig.networkPassphrase;

/** Native XLM asset helper. */
export const NATIVE_ASSET = StellarSdk.Asset.native();

/**
 * Circle USDC on Stellar is configured via env so Testnet vs Mainnet issuers
 * are never mixed. Leave empty until the issuer is confirmed for the chosen network.
 */
export function getUsdcAsset(): StellarSdk.Asset | null {
  const issuer = process.env.NEXT_PUBLIC_USDC_ISSUER;
  const code = process.env.NEXT_PUBLIC_USDC_CODE ?? "USDC";
  if (!issuer) return null;
  return new StellarSdk.Asset(code, issuer);
}

export { StellarSdk };
