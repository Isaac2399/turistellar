"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, CardDescription, CardHeader, CardTitle, Input, Label } from "@/components/ui";
import { useAuth } from "@/components/providers/AuthProvider";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "register";
type RegisterRole = "turista" | "comerciante";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState<RegisterRole>("turista");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const registering = mode === "register";

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError(null);
    setPassword("");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch(registering ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          registering
            ? { nombre, email, password, rol }
            : { email, password, next: searchParams.get("next") },
        ),
      });
      const data = (await response.json()) as {
        ok: boolean;
        error?: string;
        next?: string;
        user?: { rol: string };
      };

      if (!response.ok || !data.ok) {
        setError(data.error ?? (registering ? "No se pudo crear la cuenta." : "No se pudo iniciar sesión."));
        return;
      }

      await refresh();
      const fallback = data.user?.rol === "comerciante" ? "/dashboard/merchant" : "/";
      router.push(data.next ?? fallback);
      router.refresh();
    } catch {
      setError(
        registering
          ? "No se pudo crear la cuenta. Inténtalo de nuevo."
          : "No se pudo iniciar sesión. Inténtalo de nuevo.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16">
      <Card className="glass-panel border-stone-900/8">
        <div className="mb-4 grid grid-cols-2 gap-1 rounded-2xl bg-stone-100/80 p-1 text-sm dark:bg-stone-900">
          <button
            type="button"
            aria-pressed={!registering}
            onClick={() => switchMode("login")}
            className={cn(
              "rounded-xl px-3 py-2 font-semibold transition",
              !registering
                ? "bg-white text-emerald-900 shadow-sm dark:bg-stone-950 dark:text-emerald-200"
                : "text-stone-600 dark:text-stone-400",
            )}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            aria-pressed={registering}
            onClick={() => switchMode("register")}
            className={cn(
              "rounded-xl px-3 py-2 font-semibold transition",
              registering
                ? "bg-white text-emerald-900 shadow-sm dark:bg-stone-950 dark:text-emerald-200"
                : "text-stone-600 dark:text-stone-400",
            )}
          >
            Crear cuenta
          </button>
        </div>
        <CardHeader>
          <CardTitle>{registering ? "Crear cuenta" : "Iniciar sesión"}</CardTitle>
          <CardDescription>
            {registering
              ? "Elige si entras como viajero o como anfitrión. Al crear la cuenta quedas dentro del sitio."
              : "El panel de anfitrión solo está disponible para cuentas de comerciante. El resto de la web se puede ver sin iniciar sesión."}
          </CardDescription>
        </CardHeader>
        <form className="space-y-4" method="post" onSubmit={onSubmit}>
          {registering ? (
            <div className="space-y-1.5">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                type="text"
                autoComplete="name"
                required
                minLength={2}
                maxLength={80}
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
              />
            </div>
          ) : null}
          <div className="space-y-1.5">
            <Label htmlFor="email">Correo</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              autoComplete={registering ? "new-password" : "current-password"}
              required
              minLength={registering ? 8 : undefined}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {registering ? (
              <p className="text-xs text-stone-500">Mínimo 8 caracteres.</p>
            ) : null}
          </div>
          {registering ? (
            <fieldset className="space-y-2">
              <legend className="text-sm font-semibold text-stone-700 dark:text-stone-200">Rol</legend>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    ["turista", "Viajero"],
                    ["comerciante", "Anfitrión"],
                  ] as const
                ).map(([value, label]) => (
                  <label
                    key={value}
                    className={cn(
                      "flex cursor-pointer items-center justify-center rounded-2xl border px-3 py-2.5 text-sm font-semibold",
                      rol === value
                        ? "border-emerald-700 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
                        : "border-stone-900/10 text-stone-700 dark:border-white/10 dark:text-stone-200",
                    )}
                  >
                    <input
                      type="radio"
                      name="rol"
                      value={value}
                      checked={rol === value}
                      onChange={() => setRol(value)}
                      className="sr-only"
                      required
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (registering ? "Creando cuenta…" : "Entrando…") : registering ? "Crear cuenta" : "Entrar"}
          </Button>
        </form>
      </Card>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <section className="mx-auto w-full max-w-md px-4 py-16 text-sm text-stone-500">
          Cargando…
        </section>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
