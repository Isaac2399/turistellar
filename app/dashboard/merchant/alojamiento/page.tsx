import { LodgingManager } from "@/components/merchant/lodging";
import { requireComerciante } from "@/lib/auth/session";

export default async function MerchantAlojamientoPage() {
  await requireComerciante("/dashboard/merchant/alojamiento");
  return <LodgingManager />;
}
