import { MerchantDashboard } from "@/components/merchant/MerchantDashboard";
import { requireComerciante } from "@/lib/auth/session";

export default async function MerchantHomePage() {
  await requireComerciante("/dashboard/merchant");
  return <MerchantDashboard />;
}
