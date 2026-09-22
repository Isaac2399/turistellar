/** Decimal helpers for USD/USDC amounts stored as strings. */

export function parseAmount(value: string): number {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

export function formatAmount(value: number): string {
  return value.toFixed(2);
}

export function formatUsd(value: string | number): string {
  const n = typeof value === "number" ? value : parseAmount(value);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(n);
}

export function multiplyAmount(unit: string, qty: number): string {
  return formatAmount(parseAmount(unit) * qty);
}

export function percentOf(amount: string, pct: number): string {
  return formatAmount((parseAmount(amount) * pct) / 100);
}

export function addAmounts(values: readonly string[]): string {
  return formatAmount(values.reduce((sum, row) => sum + parseAmount(row), 0));
}

export function subtractAmount(left: string, right: string): string {
  return formatAmount(parseAmount(left) - parseAmount(right));
}
