"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Leaf, Menu, Wallet, X } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useStellarWallet } from "@/hooks/useStellarWallet";
import { cn, truncatePublicKey } from "@/lib/utils";

const PUBLIC_NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/explorar", label: "Explorar" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const navLinks = useMemo(
    () =>
      user?.rol === "comerciante"
        ? [...PUBLIC_NAV_LINKS, { href: "/dashboard/merchant", label: "Comerciante" }]
        : [...PUBLIC_NAV_LINKS],
    [user?.rol],
  );
  const {
    isFreighterInstalled,
    isConnected,
    publicKey,
    isLoading,
    error,
    connect,
    disconnect,
  } = useStellarWallet();

  const walletLabel = isLoading
    ? "Comprobando…"
    : isConnected && publicKey
      ? `Monedero · ${truncatePublicKey(publicKey)}`
      : isFreighterInstalled
        ? "Conectar monedero"
        : "Activar monedero";

  return (
    <header className="sticky top-0 z-50 border-b border-stone-900/8 bg-[color-mix(in_oklab,var(--sand)_82%,transparent)] backdrop-blur-xl dark:border-white/10">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5 tracking-tight">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-[0_8px_18px_rgba(4,120,87,0.28)]">
            <Leaf className="h-5 w-5" aria-hidden />
          </span>
          <span className="leading-tight">
            <span className="font-display text-lg font-semibold text-stone-900 dark:text-stone-50">
              Hub Rural
            </span>
            <span className="block text-xs font-medium text-stone-500">
              Ecoturismo y comercio local
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-stone-600 transition-colors hover:text-emerald-800 dark:text-stone-300 dark:hover:text-emerald-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {loading ? null : user ? (
            <button
              type="button"
              onClick={async () => {
                await logout();
                router.push("/");
                router.refresh();
              }}
              className="hidden rounded-2xl border border-stone-900/10 bg-white/60 px-3.5 py-2 text-sm font-semibold text-stone-800 backdrop-blur-sm hover:bg-emerald-50 md:inline-flex dark:border-white/15 dark:bg-white/5 dark:text-stone-100"
            >
              Salir · {user.nombre}
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-2xl border border-stone-900/10 bg-white/60 px-3.5 py-2 text-sm font-semibold text-stone-800 backdrop-blur-sm hover:bg-emerald-50 md:inline-flex dark:border-white/15 dark:bg-white/5 dark:text-stone-100"
            >
              Iniciar sesión
            </Link>
          )}
          {isConnected && publicKey ? (
            <button
              type="button"
              onClick={disconnect}
              className="hidden items-center gap-2 rounded-2xl border border-teal-700/20 bg-teal-50/80 px-3.5 py-2 text-sm font-semibold text-teal-900 hover:bg-teal-100 md:inline-flex dark:border-teal-400/30 dark:bg-teal-950/40 dark:text-teal-100"
              title={publicKey}
            >
              <Wallet className="h-4 w-4" aria-hidden />
              {walletLabel}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (!isFreighterInstalled) {
                  window.open("https://www.freighter.app", "_blank", "noopener,noreferrer");
                  return;
                }
                void connect();
              }}
              disabled={isLoading}
              className="hidden items-center gap-2 rounded-2xl bg-emerald-700 px-3.5 py-2 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(4,120,87,0.25)] hover:bg-green-800 disabled:opacity-60 md:inline-flex"
            >
              <Wallet className="h-4 w-4" aria-hidden />
              {walletLabel}
            </button>
          )}

          <button
            type="button"
            className="inline-flex rounded-2xl p-2 md:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-stone-900/8 md:hidden dark:border-white/10",
          open ? "block" : "hidden",
        )}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 text-sm font-semibold">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-stone-700 dark:text-stone-200"
            >
              {link.label}
            </Link>
          ))}

          {loading ? null : user ? (
            <button
              type="button"
              onClick={async () => {
                await logout();
                setOpen(false);
                router.push("/");
                router.refresh();
              }}
              className="inline-flex items-center gap-2 rounded-2xl border border-stone-900/10 px-3 py-2 text-left"
            >
              Salir · {user.nombre}
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 rounded-2xl border border-stone-900/10 px-3 py-2"
            >
              Iniciar sesión
            </Link>
          )}

          {isConnected && publicKey ? (
            <button
              type="button"
              onClick={disconnect}
              className="inline-flex items-center gap-2 rounded-2xl border border-teal-700/25 bg-teal-50 px-3 py-2 text-left text-teal-900"
            >
              <Wallet className="h-4 w-4" />
              Desconectar monedero
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (!isFreighterInstalled) {
                  window.open("https://www.freighter.app", "_blank", "noopener,noreferrer");
                  return;
                }
                void connect();
              }}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-3 py-2 text-white disabled:opacity-60"
            >
              <Wallet className="h-4 w-4" />
              {walletLabel}
            </button>
          )}

          {error ? <p className="text-xs text-rose-600">{error}</p> : null}
        </nav>
      </div>
    </header>
  );
}
