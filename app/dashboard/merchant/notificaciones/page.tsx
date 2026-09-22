import { NotificationsList } from "@/components/merchant/NotificationsList";
import { requireComerciante } from "@/lib/auth/session";

export default async function MerchantNotificacionesPage() {
  await requireComerciante("/dashboard/merchant/notificaciones");
  return <NotificationsList />;
}
