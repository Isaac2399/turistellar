"use client";

import { AlertTriangle, Bell, CalendarClock, Package } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import {
  formatDateTime,
  TIPO_NOTIFICACION_LABEL,
  type TipoNotificacion,
} from "@/lib/mock-merchant-data";
import { cn } from "@/lib/utils";
import { useMerchant } from "./MerchantProvider";

const ICONS: Record<TipoNotificacion, typeof Bell> = {
  tour_proximo: CalendarClock,
  saldo_pendiente: AlertTriangle,
  stock_bajo: Package,
};

const TONE: Record<TipoNotificacion, "amber" | "rose" | "sky"> = {
  tour_proximo: "sky",
  saldo_pendiente: "amber",
  stock_bajo: "rose",
};

export function NotificationsList() {
  const {
    notificaciones,
    markNotificationRead,
    markAllNotificationsRead,
    alertasPendientes,
  } = useMerchant();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-800">Alertas</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Notificaciones</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            {alertasPendientes} alerta{alertasPendientes === 1 ? "" : "s"} sin leer: tours próximos,
            cobros y stock de productos artesanales.
          </p>
        </div>
        <Button variant="outline" onClick={markAllNotificationsRead} disabled={alertasPendientes === 0}>
          Marcar todas como leídas
        </Button>
      </header>

      <ul className="space-y-3">
        {notificaciones.map((item) => {
          const Icon = ICONS[item.tipo];
          return (
            <li key={item.id}>
              <Card className={cn(!item.leida && "border-emerald-700/40")}>
                <div className="flex gap-3">
                  <span className="mt-0.5 rounded-full bg-emerald-50 p-2 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{item.titulo}</h2>
                      <Badge tone={TONE[item.tipo]}>{TIPO_NOTIFICACION_LABEL[item.tipo]}</Badge>
                      {item.leida ? <Badge>Leída</Badge> : <Badge tone="rose">Nueva</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{item.mensaje}</p>
                    <p className="mt-2 text-xs text-zinc-500">{formatDateTime(item.createdAt)}</p>
                    {!item.leida ? (
                      <Button
                        className="mt-3"
                        size="sm"
                        variant="outline"
                        onClick={() => markNotificationRead(item.id)}
                      >
                        Marcar como leída
                      </Button>
                    ) : null}
                  </div>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
