"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, CardDescription, CardHeader, CardTitle, Input, Label } from "@/components/ui";
import { useAuth } from "@/components/providers/AuthProvider";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          next: searchParams.get("next"),
        }),
      });
      const data = (await response.json()) as {
        ok: boolean;
        error?: string;
        next?: string;
        user?: { rol: string };
      };

      if (!response.ok || !data.ok) {
        setError(data.error ?? "No se pudo iniciar sesión.");
        return;
      }

      await refresh();
      router.push(data.next ?? (data.user?.rol === "comerciante" ? "/dashboard/merchant" : "/"));
      router.refresh();
    } catch {
      setError("No se pudo iniciar sesión. Inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>
            El panel de comercio solo está disponible para cuentas con rol de comerciante. El resto
            de la web se puede ver sin iniciar sesión.
          </CardDescription>
        </CardHeader>
        <form className="space-y-4" method="post" onSubmit={onSubmit}>
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Entrando…" : "Entrar"}
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
        <section className="mx-auto w-full max-w-md px-4 py-16 text-sm text-zinc-500">
          Cargando…
        </section>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
