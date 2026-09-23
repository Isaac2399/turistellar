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
      ? truncatePublicKey(publicKey)
      : isFreighterInstalled
        ? "Conectar Freighter"
        : "Instalar Freighter";

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-900/10 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-white">
            <Leaf className="h-5 w-5" aria-hidden />
          </span>
          <span className="leading-tight">
            Hub Rural
            <span className="block text-xs font-normal text-zinc-500">
              Turismo y comercio local
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-zinc-600 transition-colors hover:text-emerald-800 dark:text-zinc-300 dark:hover:text-emerald-400"
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
              className="hidden rounded-full border border-emerald-800/20 px-3 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-50 md:inline-flex dark:border-emerald-400/30 dark:text-emerald-200 dark:hover:bg-emerald-950"
            >
              Salir · {user.nombre}
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-full border border-emerald-800/20 px-3 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-50 md:inline-flex dark:border-emerald-400/30 dark:text-emerald-200 dark:hover:bg-emerald-950"
            >
              Iniciar sesión
            </Link>
          )}
          {isConnected && publicKey ? (
            <button
              type="button"
              onClick={disconnect}
              className="hidden items-center gap-2 rounded-full border border-emerald-800/20 px-3 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-50 md:inline-flex dark:border-emerald-400/30 dark:text-emerald-200 dark:hover:bg-emerald-950"
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
              className="hidden items-center gap-2 rounded-full bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-60 md:inline-flex"
            >
              <Wallet className="h-4 w-4" aria-hidden />
              {walletLabel}
            </button>
          )}

          <button
            type="button"
            className="inline-flex rounded-md p-2 md:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-emerald-900/10 md:hidden dark:border-white/10",
          open ? "block" : "hidden",
        )}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-zinc-700 dark:text-zinc-200"
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
              className="inline-flex items-center gap-2 rounded-full border border-emerald-800/20 px-3 py-2 text-left"
            >
              Salir · {user.nombre}
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-800/20 px-3 py-2"
            >
              Iniciar sesión
            </Link>
          )}

          {isConnected && publicKey ? (
            <button
              type="button"
              onClick={disconnect}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-800/20 px-3 py-2 text-left"
            >
              <Wallet className="h-4 w-4" />
              Desconectar {truncatePublicKey(publicKey)}
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
              className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-3 py-2 text-white disabled:opacity-60"
            >
              <Wallet className="h-4 w-4" />
              {walletLabel}
            </button>
          )}

          {error ? <p className="text-xs text-red-600">{error}</p> : null}
        </nav>
      </div>
    </header>
  );
}
