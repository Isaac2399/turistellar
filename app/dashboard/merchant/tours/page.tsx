import { ToursManager } from "@/components/merchant/ToursManager";
import { requireComerciante } from "@/lib/auth/session";

export default async function MerchantToursPage() {
  await requireComerciante("/dashboard/merchant/tours");
  return <ToursManager />;
}
