import { NextResponse } from "next/server";
import { STELLAR_NETWORK, stellarConfig } from "@/lib/stellar";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "hub-turismo-rural",
    stellar: {
      network: STELLAR_NETWORK,
      horizonUrl: stellarConfig.horizonUrl,
      rpcUrl: stellarConfig.rpcUrl,
    },
  });
}
